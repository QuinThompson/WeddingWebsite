/**
 * Unified Google Apps Script for Shenice & Quinton wedding invite data.
 *
 * ONE spreadsheet + ONE Drive folder + ONE web app deployment.
 *
 * Spreadsheet tabs (auto-created):
 *   - Guests   (Code, Household, Allowed Adults, Allowed Children, Plus One)
 *   - RSVPs
 *   - Registry
 *   - Memories
 *
 * Drive:
 *   - Create a folder "Wedding Guest Memories"
 *   - Paste its folder ID into MEMORIES_FOLDER_ID below
 *
 * Deploy:
 *   1. Extensions → Apps Script → paste this file → Save
 *   2. Set MEMORIES_FOLDER_ID
 *   3. Deploy → New deployment → Web app
 *      Execute as: Me | Who has access: Anyone
 *   4. Copy the /exec URL into GOOGLE_APPS_SCRIPT_URL (.env.local + host)
 *
 * After editing this script, Deploy → Manage deployments → Edit (pencil) → New version.
 */

/** Paste the Drive folder ID (the long id in the folder URL). */
var MEMORIES_FOLDER_ID = "1f_sTJnG7dxWW_GxSBzSjhFYN-D_dwp78";

var GUESTS_SHEET = "Guests";
var RSVP_SHEET = "RSVPs";
var REGISTRY_SHEET = "Registry";
var MEMORIES_SHEET = "Memories";

var RSVP_HEADERS = [
  "Submitted At",
  "ID",
  "Full Name",
  "Email",
  "Mobile",
  "Attending",
  "Guest Count",
  "Guest Names",
  "Hotel Status",
  "Message",
  "Adult Count",
  "Child Count",
  "Adults Detail",
  "Children Detail",
  "Invitation Code",
  "Household",
  "Allowed Adults",
  "Allowed Children",
  "Plus One Adults",
  "Plus One Children",
  "Paid Plus One Adults",
  "Paid Plus One Children",
];

var GUEST_HEADERS = [
  "Code",
  "Household",
  "Allowed Adults",
  "Allowed Children",
  "Plus One",
];

var REGISTRY_HEADERS = [
  "ID",
  "Title",
  "Description",
  "Store Label",
  "Store URL",
  "Price Label",
  "Claimed By",
  "Claimed At",
  "Created At",
];

var MEMORIES_HEADERS = [
  "ID",
  "File ID",
  "File Name",
  "Alt",
  "View URL",
  "Created At",
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var type = String(data.type || "");

    if (type === "guest-lookup") return handleGuestLookup_(data);
    if (type === "rsvp") return handleRsvp_(data);
    if (type === "registry-list") return handleRegistryList_();
    if (type === "registry-seed") return handleRegistrySeed_(data);
    if (type === "registry-claim") return handleRegistryClaim_(data);
    if (type === "registry-add") return handleRegistryAdd_(data);
    if (type === "memories-list") return handleMemoriesList_();
    if (type === "memories-upload") return handleMemoriesUpload_(data);
    if (type === "memories-file") return handleMemoriesFile_(data);

    return json_({ ok: false, error: "Unknown type: " + type });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    var type = (e && e.parameter && e.parameter.type) || "ping";
    if (type === "registry" || type === "registry-list") return handleRegistryList_();
    if (type === "memories" || type === "memories-list") return handleMemoriesList_();
    if (type === "memories-file") return handleMemoriesFile_({ fileId: e.parameter.fileId });
    return json_({ ok: true, service: "wedding-google", types: [
      "guest-lookup",
      "rsvp",
      "registry-list",
      "registry-seed",
      "registry-claim",
      "registry-add",
      "memories-list",
      "memories-upload",
      "memories-file",
    ]});
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------- RSVP ---------- */

var ALREADY_RESPONDED_ERROR = "This invitation has already been used to RSVP.";

function handleGuestLookup_(data) {
  var found = findGuestByCode_(data.code);
  if (found.error) return json_({ ok: false, error: found.error });
  if (!found.guest) return json_({ ok: false, error: "That invitation code was not found." });
  return json_({
    ok: true,
    guest: found.guest,
    alreadyResponded: hasRsvpForCode_(found.guest.code),
  });
}

function handleRsvp_(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: "RSVPs are busy right now. Please try again in a moment." });
  }

  try {
    var found = findGuestByCode_(data.invitationCode);
    if (found.error) return json_({ ok: false, error: found.error });
    var guest = found.guest;
    if (!guest) return json_({ ok: false, error: "That invitation code was not found." });
    if (hasRsvpForCode_(guest.code)) {
      return json_({ ok: false, error: ALREADY_RESPONDED_ERROR });
    }

    var attending = String(data.attending || "");
    var adultCount = attending === "yes" ? Number(data.adultCount || 0) : 0;
    var childCount = attending === "yes" ? Number(data.childCount || 0) : 0;
    var plusOneAdults = attending === "yes" ? Math.max(0, adultCount - guest.allowedAdults) : 0;
    var plusOneChildren = attending === "yes" ? Math.max(0, childCount - guest.allowedChildren) : 0;
    var freeSlots = attending === "yes" && guest.plusOneAllowed ? 1 : 0;
    var complimentaryAdults = Math.min(plusOneAdults, freeSlots);
    var paidPlusOneAdults = plusOneAdults - complimentaryAdults;
    var paidPlusOneChildren = plusOneChildren - Math.min(plusOneChildren, freeSlots - complimentaryAdults);

    var sheet = getOrCreateSheet_(RSVP_SHEET, RSVP_HEADERS);
    alignRsvpColumns_(sheet);
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.id || "",
      data.fullName || "",
      data.email || "",
      data.mobile || "",
      attending,
      data.guestCount || "",
      data.guestNames || "",
      data.hotelStatus || "",
      data.message || "",
      data.adultCount || "",
      data.childCount || "",
      data.adultsDetail || "",
      data.childrenDetail || "",
      guest.code,
      guest.household,
      guest.allowedAdults,
      guest.allowedChildren,
      plusOneAdults,
      plusOneChildren,
      paidPlusOneAdults,
      paidPlusOneChildren,
    ]);
    SpreadsheetApp.flush();
    return json_({ ok: true, stored: "rsvp" });
  } finally {
    lock.releaseLock();
  }
}

/** True when the RSVPs tab already has a row for this invitation code. */
function hasRsvpForCode_(code) {
  var wanted = normalizeCode_(code);
  if (!wanted) return false;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return false;
  var sheet = ss.getSheetByName(RSVP_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return false;

  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var values = sheet.getRange(1, 1, sheet.getLastRow(), lastCol).getValues();
  var codeCol = headerIndex_(values[0], "Invitation Code");
  if (codeCol < 0) return false;

  for (var i = 1; i < values.length; i++) {
    if (normalizeCode_(values[i][codeCol]) === wanted) return true;
  }
  return false;
}

function normalizeCode_(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function isYes_(value) {
  var text = String(value || "").trim().toLowerCase();
  return text === "yes" || text === "y" || text === "true" || text === "1";
}

function findGuestByCode_(code) {
  var wanted = normalizeCode_(code);
  if (!wanted) return { guest: null, error: "Enter your invitation code." };

  var sheet = findGuestSheet_();
  if (!sheet) {
    return {
      guest: null,
      error:
        "No guest list was found. On any tab, set row 1 to Code, Household, Allowed Adults, Allowed Children, Plus One, then add each invitation underneath.",
    };
  }

  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var values = sheet.getRange(1, 1, sheet.getLastRow(), lastCol).getValues();
  var header = values[0];
  var codeCol = headerIndex_(header, "Code");
  var householdCol = headerIndex_(header, "Household");
  var adultsCol = headerIndex_(header, "Allowed Adults");
  var childrenCol = headerIndex_(header, "Allowed Children");
  var plusCol = headerIndex_(header, "Plus One");
  if (codeCol < 0 || adultsCol < 0 || childrenCol < 0) {
    return {
      guest: null,
      error:
        "The guest list needs columns named Code, Household, Allowed Adults, Allowed Children, and Plus One.",
    };
  }

  for (var i = 1; i < values.length; i++) {
    if (normalizeCode_(values[i][codeCol]) !== wanted) continue;
    return {
      guest: {
        code: String(values[i][codeCol]).trim(),
        household:
          householdCol >= 0 && String(values[i][householdCol] || "").trim()
            ? String(values[i][householdCol]).trim()
            : "Your invitation",
        allowedAdults: Math.max(0, Number(values[i][adultsCol]) || 0),
        allowedChildren: Math.max(0, Number(values[i][childrenCol]) || 0),
        plusOneAllowed: plusCol >= 0 ? isYes_(values[i][plusCol]) : false,
      },
    };
  }

  return { guest: null };
}

/** The guest list can live on any tab. Match it by the column titles, not the tab name. */
function findGuestSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return null;

  var named = ss.getSheetByName(GUESTS_SHEET);
  if (named && sheetLooksLikeGuestList_(named)) return named;

  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheetLooksLikeGuestList_(sheets[i])) return sheets[i];
  }
  return null;
}

function sheetLooksLikeGuestList_(sheet) {
  if (!sheet || sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) return false;
  var width = Math.min(sheet.getLastColumn(), 12);
  var header = sheet.getRange(1, 1, 1, width).getValues()[0];
  return (
    headerIndex_(header, "Code") >= 0 &&
    headerIndex_(header, "Allowed Adults") >= 0 &&
    headerIndex_(header, "Allowed Children") >= 0
  );
}

function headerIndex_(headerRow, name) {
  var wanted = String(name || "").trim().toLowerCase();
  for (var i = 0; i < headerRow.length; i++) {
    if (String(headerRow[i] || "").trim().toLowerCase() === wanted) return i;
  }
  return -1;
}

/* ---------- Registry ---------- */

function handleRegistryList_() {
  var sheet = getOrCreateSheet_(REGISTRY_SHEET, REGISTRY_HEADERS);
  return json_({ ok: true, items: readRegistryItems_(sheet) });
}

function handleRegistrySeed_(data) {
  var sheet = getOrCreateSheet_(REGISTRY_SHEET, REGISTRY_HEADERS);
  var existing = readRegistryItems_(sheet);
  if (existing.length > 0) {
    return json_({ ok: true, items: existing, seeded: false });
  }
  var items = data.items || [];
  for (var i = 0; i < items.length; i++) {
    appendRegistryRow_(sheet, items[i]);
  }
  return json_({ ok: true, items: readRegistryItems_(sheet), seeded: true });
}

function handleRegistryClaim_(data) {
  var id = String(data.id || "");
  var guestName = String(data.guestName || "").trim();
  if (!id || !guestName) {
    return json_({ ok: false, error: "id and guestName are required" });
  }

  var sheet = getOrCreateSheet_(REGISTRY_SHEET, REGISTRY_HEADERS);
  var row = findRegistryRow_(sheet, id);
  if (!row) return json_({ ok: false, error: "Gift not found" });

  var claimedBy = String(sheet.getRange(row, 7).getValue() || "").trim();
  if (claimedBy) {
    return json_({
      ok: false,
      error: "Already claimed",
      items: readRegistryItems_(sheet),
    });
  }

  sheet.getRange(row, 7).setValue(guestName);
  sheet.getRange(row, 8).setValue(data.claimedAt || new Date().toISOString());
  return json_({ ok: true, items: readRegistryItems_(sheet) });
}

function handleRegistryAdd_(data) {
  var sheet = getOrCreateSheet_(REGISTRY_SHEET, REGISTRY_HEADERS);
  var item = {
    id: data.id || "gift-" + Date.now(),
    title: data.title || "",
    description: data.description || "",
    storeLabel: data.storeLabel || "Store",
    storeUrl: data.storeUrl || "",
    priceLabel: data.priceLabel || "",
    claimedBy: "",
    claimedAt: "",
    createdAt: data.createdAt || new Date().toISOString(),
  };
  if (!item.title || !item.storeUrl) {
    return json_({ ok: false, error: "title and storeUrl are required" });
  }
  appendRegistryRow_(sheet, item);
  return json_({ ok: true, items: readRegistryItems_(sheet) });
}

function appendRegistryRow_(sheet, item) {
  sheet.appendRow([
    item.id || "",
    item.title || "",
    item.description || "",
    item.storeLabel || "",
    item.storeUrl || "",
    item.priceLabel || "",
    item.claimedBy || "",
    item.claimedAt || "",
    item.createdAt || new Date().toISOString(),
  ]);
}

function readRegistryItems_(sheet) {
  var values = sheet.getDataRange().getValues();
  var items = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!row[0]) continue;
    items.push({
      id: String(row[0]),
      title: String(row[1] || ""),
      description: String(row[2] || ""),
      storeLabel: String(row[3] || ""),
      storeUrl: String(row[4] || ""),
      priceLabel: String(row[5] || ""),
      claimedBy: String(row[6] || "").trim() || null,
      claimedAt: String(row[7] || "").trim() || null,
      createdAt: String(row[8] || ""),
    });
  }
  return items;
}

function findRegistryRow_(sheet, id) {
  var values = sheet.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][0]) === id) return r + 1; // 1-indexed
  }
  return null;
}

/* ---------- Memories (Drive + sheet index) ---------- */

function handleMemoriesList_() {
  var sheet = getOrCreateSheet_(MEMORIES_SHEET, MEMORIES_HEADERS);
  return json_({ ok: true, memories: readMemories_(sheet) });
}

function handleMemoriesUpload_(data) {
  if (!MEMORIES_FOLDER_ID || MEMORIES_FOLDER_ID.indexOf("PASTE_") === 0) {
    return json_({
      ok: false,
      error: "Set MEMORIES_FOLDER_ID in the Apps Script before uploading.",
    });
  }

  var base64 = String(data.base64 || "");
  var mimeType = String(data.mimeType || "image/jpeg");
  var fileName = String(data.fileName || "memory.jpg");
  var alt = String(data.alt || fileName);
  var id = String(data.id || "mem-" + Date.now());

  if (!base64) return json_({ ok: false, error: "base64 image data is required" });

  var comma = base64.indexOf(",");
  if (base64.indexOf("data:") === 0 && comma > -1) {
    base64 = base64.substring(comma + 1);
  }

  var folder;
  try {
    folder = DriveApp.getFolderById(MEMORIES_FOLDER_ID);
  } catch (err) {
    return json_({
      ok: false,
      error:
        "Drive access denied opening the Memories folder. Share that folder with the Google account that owns this script, run testMemoriesAccess once, approve Drive, then redeploy.",
    });
  }

  var file;
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, fileName);
    file = folder.createFile(blob);
  } catch (err) {
    return json_({
      ok: false,
      error: "Drive access denied while saving the photo. The script owner needs Editor access to the Memories folder.",
    });
  }

  // Link sharing is optional. Some Google accounts block it; the site can still
  // read the file through memories-file.
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    // Keep the upload. The photo is already in the folder.
  }

  var fileId = file.getId();
  var viewUrl = "https://lh3.googleusercontent.com/d/" + fileId + "=s2000";
  var createdAt = data.createdAt || new Date().toISOString();

  var sheet = getOrCreateSheet_(MEMORIES_SHEET, MEMORIES_HEADERS);
  sheet.appendRow([id, fileId, fileName, alt, viewUrl, createdAt]);

  return json_({
    ok: true,
    memory: {
      id: id,
      src: viewUrl,
      alt: alt,
      createdAt: createdAt,
      fileId: fileId,
    },
    memories: readMemories_(sheet),
  });
}

/** Run this once from the Apps Script editor to grant Drive permission. */
function testMemoriesAccess() {
  var folder = DriveApp.getFolderById(MEMORIES_FOLDER_ID);
  Logger.log("Memories folder: " + folder.getName());
}

/** Returns one Memories-folder photo so the website can show it without a public link. */
function handleMemoriesFile_(data) {
  var fileId = String((data && data.fileId) || "");
  if (!fileId) return json_({ ok: false, error: "fileId is required" });

  var sheet = getOrCreateSheet_(MEMORIES_SHEET, MEMORIES_HEADERS);
  var values = sheet.getDataRange().getValues();
  var allowed = false;
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][1]) === fileId) {
      allowed = true;
      break;
    }
  }
  if (!allowed) return json_({ ok: false, error: "Unknown memory file." });

  try {
    var blob = DriveApp.getFileById(fileId).getBlob();
    return json_({
      ok: true,
      mimeType: blob.getContentType() || "image/jpeg",
      base64: Utilities.base64Encode(blob.getBytes()),
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function readMemories_(sheet) {
  var values = sheet.getDataRange().getValues();
  var memories = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!row[0]) continue;
    memories.push({
      id: String(row[0]),
      fileId: String(row[1] || ""),
      fileName: String(row[2] || ""),
      alt: String(row[3] || "Guest wedding memory"),
      src: String(row[4] || ""),
      createdAt: String(row[5] || ""),
    });
  }
  // newest first
  memories.sort(function (a, b) {
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
  return memories;
}

/* ---------- helpers ---------- */

function getOrCreateSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

/**
 * Older RSVP sheets are missing the Mobile header, so the phone number sits
 * under Attending and every column after Email is shifted right by one.
 * This restores that label, then drops the meal, diet, flight, and song columns.
 */
var RSVP_HEADERS_MISSING_MOBILE = [
  "Submitted At",
  "ID",
  "Full Name",
  "Email",
  "Attending",
  "Guest Count",
  "Guest Names",
  "Meal Preference",
  "Dietary Restrictions",
  "Hotel Status",
  "Flight Info",
  "Song Request",
  "Message",
  "Adult Count",
  "Child Count",
  "Adults Detail",
  "Children Detail",
];

var RSVP_HEADERS_WITH_EXTRAS = [
  "Submitted At",
  "ID",
  "Full Name",
  "Email",
  "Mobile",
  "Attending",
  "Guest Count",
  "Guest Names",
  "Meal Preference",
  "Dietary Restrictions",
  "Hotel Status",
  "Flight Info",
  "Song Request",
  "Message",
  "Adult Count",
  "Child Count",
  "Adults Detail",
  "Children Detail",
];

function headersMatch_(current, expected) {
  if (current.length < expected.length) return false;
  for (var i = 0; i < expected.length; i++) {
    if (String(current[i] || "") !== expected[i]) return false;
  }
  return true;
}

function alignRsvpColumns_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  if (headersMatch_(current, RSVP_HEADERS)) {
    ensureHeaders_(sheet, RSVP_HEADERS);
    return;
  }

  if (headersMatch_(current, RSVP_HEADERS_MISSING_MOBILE)) {
    sheet.getRange(1, 1, 1, RSVP_HEADERS_WITH_EXTRAS.length).setValues([RSVP_HEADERS_WITH_EXTRAS]);
    current = RSVP_HEADERS_WITH_EXTRAS.slice();
  }

  if (headersMatch_(current, RSVP_HEADERS_WITH_EXTRAS)) {
    // Delete from the right so the remaining indexes stay put.
    sheet.deleteColumn(13); // Song Request
    sheet.deleteColumn(12); // Flight Info
    sheet.deleteColumn(10); // Dietary Restrictions
    sheet.deleteColumn(9); // Meal Preference
  }

  ensureHeaders_(sheet, RSVP_HEADERS);
}

/** Extends row 1 when new columns are added (does not rewrite existing data). */
function ensureHeaders_(sheet, headers) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var needsUpdate = false;
  for (var i = 0; i < headers.length; i++) {
    if (String(current[i] || "") !== headers[i]) {
      needsUpdate = true;
      break;
    }
  }
  if (!needsUpdate && lastCol >= headers.length) return;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

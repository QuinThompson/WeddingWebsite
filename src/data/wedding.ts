export type AttireColor = {
  name: string;
  hex: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  icon: "arrival" | "welcome" | "ceremony" | "cocktail" | "reception" | "brunch";
};

export type PartyMember = {
  name: string;
  role?: string;
};

export type PartyGroup = {
  id: string;
  title: string;
  members: PartyMember[];
};

export type StoryChapter = {
  id: string;
  title: string;
  handwrittenLabel: string;
  body: string;
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
};

export type Reminder = {
  id: string;
  title: string;
  body: string;
  /** Optional link shown as the CTA (e.g. Gift here → registry). */
  href?: string;
  linkLabel?: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  orientation: "portrait" | "landscape";
};

export type FaqItem = {
  question: string;
  answer: string;
  href?: string;
  linkLabel?: string;
};

export const wedding = {
  couple: {
    person1: "Shenice",
    person2: "Quinton",
    fullNames: "Shenice & Quinton",
    initials: "SC & QT",
    monogram: "S ✦ Q",
  },

  date: {
    display: "May 12th, 2027",
    shortDisplay: "05.12.27",
    timeDisplay: "4:00 PM",
    iso: "2027-05-12T16:00:00",
    timezone: "America/St_Lucia",
    timezoneLabel: "Atlantic Standard Time",
  },

  destination: {
    city: "Vieux Fort",
    country: "St Lucia",
    display: "St Lucia",
  },

  ceremony: {
    name: "Eternity Beach",
    address: "Eternity Beach, near Coconut Bay, Vieux Fort, St Lucia",
    description:
      "Ceremony and reception both take place on Eternity Beach. Vows will be exchanged beside the Caribbean shoreline, then celebration continues in the same setting with cocktails, dinner, dancing, and a night to create memories.",
    image: "/images/eternity_beach.jpg",
    imageAlt: "Eternity Beach shoreline for the ceremony and reception",
    mapUrl: "https://maps.google.com/?q=Coconut+Bay+Beach+Resort+St+Lucia",
    arrivalGuidance:
      "Please arrive by 3:30 PM so you can find your seat and enjoy a quiet moment before the ceremony begins at 4:00 PM.",
    transportationNotes:
      "Resort shuttles and hotel transfers will be available from the Coconut Bay lobby. Walking paths to Eternity Beach are short and well marked.",
  },

  reception: {
    name: "Eternity Beach",
    address: "Eternity Beach, near Coconut Bay, Vieux Fort, St Lucia",
    description:
      "Ceremony and reception are held together on Eternity Beach, with no venue change after the vows.",
    image: "/images/eternity_beach.jpg",
    imageAlt: "Eternity Beach shoreline for the ceremony and reception",
    mapUrl: "https://maps.google.com/?q=Coconut+Bay+Beach+Resort+St+Lucia",
    arrivalGuidance:
      "Please arrive by 3:30 PM for the 4:00 PM ceremony. The reception follows on the same beach.",
    transportationNotes:
      "Resort shuttles and hotel transfers run from the Coconut Bay lobby. Return transfers to guest rooms continue through the evening.",
  },

  hotel: {
    name: "Coconut Bay Resort",
    address: "Coconut Bay Beach Resort & Spa, Vieux Fort, St Lucia",
    bookingDeadlineDisplay: "January 31, 2027",
    bookingDeadlineIso: "2027-01-31",
    bookingUrl: "https://www.cbayresort.com/",
    bookingInstructions:
      "Book Coconut Bay Beach Resort & Spa directly and mention Shenice & Quinton’s wedding (May 12, 2027). Email reservations@cbayresort.com, call 877-252-0304, or visit www.cbayresort.com. Families usually stay in Splash; adults-only travelers can choose Harmony; couples looking for a private plunge-pool suite can choose Serenity at Coconut Bay, on the same property. Please reserve by January 31, 2027.",
    notes:
      "The resort is our recommended home base for the weekend, steps from ceremony and reception spaces, with beach access and guest services on site.",
  },

  airport: {
    primary: "UVF",
    secondary: "SLU",
    display: "SLU or UVF",
    recommended: "Hewanorra International Airport (UVF)",
    notes:
      "UVF is the closest major airport to Coconut Bay. George F. L. Charles Airport (SLU) is an alternate option with a longer transfer south.",
    transferNotes:
      "Private airport transfers can be arranged through the resort or local drivers. Allow extra time for afternoon traffic and luggage.",
  },

  travel: {
    originLabel: "Your City",
    destinationCode: "UVF",
    destinationCity: "St Lucia",
    recommendedArrivalDisplay: "May 12, 2027",
    recommendedArrivalIso: "2027-05-12",
    flightBookingUrl: "https://www.google.com/travel/flights",
  },

  deadlines: {
    rsvpDisplay: "December 31, 2026",
    rsvpIso: "2026-12-31",
    guestPaymentDisplay: "January 31, 2027",
    guestPaymentIso: "2027-01-31",
    hotelBookingDisplay: "January 31, 2027",
    hotelBookingIso: "2027-01-31",
  },

  contact: {
    name: "Sarai Cairo",
    role: "Reservations & Wedding Wizard",
    email: "weddings@cbayna.com",
    phone: "877-252-0304",
    emergency: "+1 (758) 555-0199",
  },

  social: {
    hashtag: "#SheniceAndQuinton",
  },

  /** Used to add registry gifts and download RSVP/registry CSVs. Change before sharing widely. */
  coupleAccessCode: "SQ2027",

  registry: {
    title: "Gift Registry",
    intro:
      "Here are a few items we would love for our home. Claim an item so we know it’s covered, or if you prefer, a monetary gift is just as welcome.",
    noteHeading: "A little note",
    note: "We’ve carefully chosen each item to match our home and personal style, so we kindly ask that gifts purchased be the exact items listed. Thank you for helping us make our house a home! ❤️",
    donation: {
      heading: "Prefer to give money?",
      note: "A transfer to the account below is just as welcome.",
      alternateBankNote:
        "If you use a different bank, or you are sending USD, message us and we’ll share the account information.",
      details: [
        { label: "Bank", value: "Republic Bank" },
        { label: "Account name", value: "Shenice Clarke" },
        { label: "Account number", value: "320049005701" },
        { label: "Account type", value: "Chequing" },
      ],
    },
    claimCta: "I am buying this",
    claimedLabel: "Claimed",
    availableHeading: "Still available",
    claimedHeading: "Already claimed",
    addHeading: "Add a registry item",
    items: [
      {
        id: "gift-kitchenaid-artisan",
        title: "KitchenAid Artisan Stand Mixer",
        description:
          "KitchenAid Artisan Series stand mixer with pouring shield, a classic for our kitchen.",
        storeLabel: "Amazon",
        storeUrl:
          "https://www.amazon.com/KitchenAid-KSM150PSAC-Artisan-Pouring-Shield/dp/B004GUVD6K",
        priceLabel: "See Amazon",
      },
    ],
  },

  dashboard: {
    invitationEyebrow: "You are invited to the wedding of",
    detailsLink: "Wedding details",
    detailsHeading: "Details of the wedding",
    partyTabTitle: "Entourage",
    partyTabSubtitle: "Click here",
    storyCaption: "Our Love Story",
    photosCaption: "Prenup Photos",
    memoriesCaption: "Memories",
    memoriesLockedLabel: "Opens on the wedding day",
    remindersEyebrow: "Guest",
    remindersTitle: "Frequently Asked Questions",
    remindersCta: "Click here",
    registryTitle: "Gift Registry",
    registryCta: "View gifts",
    registryTagEyebrow: "Wedding",
    registryTagTitle: "Gifts",
    registryTagCta: "Gift here",
    countdownHeading: "Boarding Soon.....",
    countdownComplete: "Today is the day!",
    flightHeading: "Flight to Forever",
    rsvpTitle: "Confirm your attendance",
    rsvpCta: "RSVP",
    rsvpLink: "Click here",
    rsvpHeadline: "Ready for Takeoff?",
    rsvpLead: "We can’t wait to celebrate with you!",
    rsvpPrompt: "Kindly confirm your attendance by",
    rsvpButton: "RSVP now",
    tapToOpen: "Click the passport to open",
    passportTitle: "Wedding Passport",
    toTheMarriageOf: "To the wedding of",
  },

  attire: {
    title: "Dress Your Best",
    explanation:
      "Please come dressed your best for our wedding by the sea. We would love to see you in something polished and comfortable, in the light browns below.",
    encouragedColors: [
      { name: "Mocha", hex: "#C4A484" },
      { name: "Beige", hex: "#E8DCC8" },
      { name: "Caramel", hex: "#D4A574" },
      { name: "Camel", hex: "#C8A878" },
      { name: "Tan", hex: "#D2B48C" },
      { name: "Sand", hex: "#E4D3B5" },
    ] as AttireColor[],
    avoidColors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Cream", hex: "#FFF8E7" },
      { name: "Off-White", hex: "#F7F4EF" },
      { name: "Pearl", hex: "#F4F1EA" },
      { name: "Lilac", hex: "#B7A8CF" },
      { name: "Lavender", hex: "#C4B5D8" },
      { name: "Deep Lilac", hex: "#78658F" },
    ] as AttireColor[],
  },

  timeline: [
    {
      id: "arrival",
      title: "Guest Arrival",
      date: "May 12, 2027",
      time: "3:30 PM",
      venue: "Eternity Beach",
      description: "Arrive, find your seat, and take in the shoreline before the ceremony begins.",
      icon: "arrival",
    },
    {
      id: "welcome",
      title: "Welcome Gathering",
      date: "May 12, 2027",
      time: "3:45 PM",
      venue: "Eternity Beach",
      description: "A soft welcome as family and friends settle into place.",
      icon: "welcome",
    },
    {
      id: "ceremony",
      title: "Ceremony",
      date: "May 12, 2027",
      time: "4:00 PM",
      venue: "Eternity Beach",
      description: "The exchange of vows beside the Caribbean Sea.",
      icon: "ceremony",
    },
    {
      id: "cocktail",
      title: "Cocktail Hour",
      date: "May 12, 2027",
      time: "4:30 PM",
      venue: "Eternity Beach",
      description: "Sunset drinks, light bites, and the first notes of the evening.",
      icon: "cocktail",
    },
    {
      id: "reception",
      title: "Reception",
      date: "May 12, 2027",
      time: "6:00 PM",
      venue: "Eternity Beach",
      description: "Dinner, toasts, and dancing under warm island light.",
      icon: "reception",
    },
    {
      id: "brunch",
      title: "Farewell Brunch",
      date: "May 13, 2027",
      time: "TBD",
      venue: "Coconut Bay Resort",
      description:
        "A relaxed morning together before journeys home begin. The resort has not confirmed this yet.",
      icon: "brunch",
    },
  ] as TimelineEvent[],

  party: [
    {
      id: "parents",
      title: "Parents of the Couple",
      members: [
        { name: "Rebekah Clarke", role: "Mother of the Bride" },
        { name: "Isaac Clarke", role: "Uncle of the Bride" },
        { name: "Anna Millet", role: "Mother of the Groom" },
        { name: "Eldon Thompson", role: "Father of the Groom" },
      ],
    },
    {
      id: "maid-of-honor",
      title: "Maid of Honor",
      members: [{ name: "Sontee Mitchell" }],
    },
    {
      id: "best-man",
      title: "Best Man",
      members: [{ name: "Daniel Rose" }],
    },
    {
      id: "bridesmaids",
      title: "Bridesmaids",
      members: [{ name: "Cherisse Showers" }, { name: "Laurel Jackson" }],
    },
    {
      id: "groomsmen",
      title: "Groomsmen",
      members: [{ name: "Brandon Thompson" }, { name: "Serigo Prentice" }],
    },
    {
      id: "principal-sponsors",
      title: "Sponsors",
      members: [{ name: "Rebekah Clarke" }],
    },
    {
      id: "flower-children",
      title: "Flower Girls",
      members: [
        { name: "Jupiter Thompson", role: "Flower Girl / Mini Bride" },
        { name: "Samiyah Clarke", role: "Flower Girl" },
      ],
    },
  ] as PartyGroup[],

  story: [
    {
      id: "met",
      title: "How We Met",
      handwrittenLabel: "chapter one",
      body: "It started on Facebook, with messages that turned into conversations, then into something we both wanted to keep going. We met in person at Shenice’s school on one of her sports days, and that was where friendship settled into something more. From there, we grew into a relationship that felt natural, steady, and ours.",
      image: "/images/how_we_met.png",
      imageAlt: "Phones on a bench at a sports day, where Shenice and Quinton first met",
      imageSide: "left",
    },
    {
      id: "trip",
      title: "Our First Trip",
      handwrittenLabel: "passport stamps",
      body: "Tobago was our first trip together, with sunny days, shared laughs, and a few hard moments along the way. Looking back, we hold both the good and the bad with open hands. We wouldn’t trade it. No regrets, only the beginning of learning how to travel through life side by side.",
      image: "/images/IMG_5611.jpg",
      imageAlt: "Shadows of Shenice and Quinton on the sand during their trip to Tobago",
      imageSide: "right",
    },
    {
      id: "jupiter",
      title: "Jupiter",
      handwrittenLabel: "our daughter",
      body: "Jupiter is our daughter. She belongs in this story beside the two of us, the reason home feels full, and the reason this wedding is a family celebration, not only a couple’s.",
      image: "/images/ultrasound.png",
      imageAlt: "Ultrasound of Jupiter before she was born",
      imageSide: "left",
    },
    {
      id: "proposal",
      title: "The Proposal",
      handwrittenLabel: "the yes",
      body: "The proposal was simple and sweet, kept quiet until the moment arrived, though Jupiter nearly gave the secret away. It happened in our new home, close to our yearly anniversary. Shenice was happily surprised; she never saw it coming. A quiet yes, in a place that already felt like forever.",
      image: "/images/couple-story-03.jpg",
      imageAlt: "Romantic portrait suggesting the proposal at home",
      imageSide: "right",
    },
    {
      id: "destination",
      title: "Choosing the Destination",
      handwrittenLabel: "why St Lucia",
      body: "We chose St Lucia because we wanted more than a ceremony. We wanted a getaway wedding where everyone we love could relax, celebrate, and make memories together. Beautiful scenery, warm air, and room to unwind: St Lucia felt like the right place to gather and begin this next chapter.",
      image: "/images/Triangle-altar.jpg",
      imageAlt: "Beach ceremony with a triangular wooden altar facing the sea",
      imageSide: "left",
    },
  ] as StoryChapter[],

  reminders: [
    {
      id: "rsvp",
      title: "Wedding RSVP Deadline",
      body: "Please confirm your attendance by December 31, 2026 so we can finalize seating, meals, and transportation. RSVP only for guests named on your invitation.",
    },
    {
      id: "plus-one",
      title: "Plus-ones",
      body: "Your invitation includes a set number of adults and children. If a plus-one is included, that guest is at no charge. If a plus-one is not included, you may still add one if you are willing to cover the guest fee: about US$128 for an adult and about US$50 for a child ages 4–12 (resort service charge, VAT, and tax included). Price is subject to change. Any guest payment is due by January 31, 2027. If payment is not received by that date, their spot will be canceled.",
    },
    {
      id: "dress-code",
      title: "Dress Code",
      body: "Please come dressed your best for our wedding by the sea. The attire page has the colors we love and the ones to skip.",
      href: "/invite/attire",
      linkLabel: "View attire",
    },
    {
      id: "currency",
      title: "Local Currency",
      body: "The Eastern Caribbean dollar (XCD) is local currency; USD is widely accepted. Cards are common at resorts; keep some cash for smaller vendors.",
    },
    {
      id: "arrival-time",
      title: "Ceremony Arrival Time",
      body: "Please arrive by 3:30 PM. Be seated by 3:45 PM. The ceremony begins promptly at 4:00 PM.",
    },
    {
      id: "photos",
      title: "Photos",
      body: "Photos are welcome during the ceremony. You can also share your pictures in our Memories gallery.",
      href: "/invite/memories",
      linkLabel: "Share photos",
    },
    {
      id: "gifts",
      title: "Gifts",
      body: "Here are a few items we would love for our home. Claim an item so we know it’s covered, or if you prefer, a monetary gift is just as welcome.",
      href: "/invite/registry",
      linkLabel: "Gift here",
    },
    {
      id: "passport",
      title: "Travel Docs",
      body: "Please ensure your passport, and any other travel documents, are valid for at least six months beyond your travel dates.",
    },
    {
      id: "contact",
      title: "Contact Person",
      body: "For wedding questions, email Sarai Cairo, Reservations & Wedding Wizard, at weddings@cbayna.com. Please mention Shenice & Quinton’s wedding (May 12, 2027) so she knows which celebration you’re writing about.",
    },
    {
      id: "nursing-station",
      title: "Nursing Station",
      body: "If you are staying at Coconut Bay and a medical emergency happens, the resort has a nursing station on site.",
    },
  ] as Reminder[],

  gallery: [
    {
      src: "/images/gallery/photo-01.jpg",
      alt: "Engagement portrait of Shenice and Quinton in soft evening light",
      orientation: "portrait",
    },
    {
      src: "/images/gallery/photo-02.jpg",
      alt: "Quiet moment between Shenice and Quinton outdoors",
      orientation: "portrait",
    },
    {
      src: "/images/gallery/photo-03.jpg",
      alt: "Wide landscape prenup photograph with open sky",
      orientation: "landscape",
    },
    {
      src: "/images/gallery/photo-04.jpg",
      alt: "Close portrait with lilac and sage tonal palette",
      orientation: "portrait",
    },
    {
      src: "/images/gallery/photo-05.jpg",
      alt: "Walking portrait along a coastal path",
      orientation: "portrait",
    },
    {
      src: "/images/gallery/photo-06.jpg",
      alt: "Landscape photograph suggesting travel and shoreline",
      orientation: "landscape",
    },
    {
      src: "/images/gallery/photo-07.jpg",
      alt: "Editorial couple portrait with soft shadows",
      orientation: "portrait",
    },
    {
      src: "/images/gallery/photo-08.jpg",
      alt: "Candid laughter during prenup photographs",
      orientation: "portrait",
    },
  ] as GalleryImage[],

  destinationGuide: {
    recommendedAirport:
      "Hewanorra International Airport (UVF) is recommended because it is the closest airport to Coconut Bay. George F. L. Charles Airport (SLU) is an alternate.",
    airportTransfers:
      "If you are staying at Coconut Bay, free transfers are included for arrivals at UVF. Share your flight details with the resort reservations team so they can coordinate your arrival. Arrivals via SLU are a longer drive to the resort on the south of the island, so those guests will need to arrange their own transfer.",
    hotel:
      "Coconut Bay Beach Resort & Spa is our recommended stay for the wedding weekend, close to ceremony and reception settings, with beach access and guest services on site. Splash is family-friendly. Harmony is adults-only (18+). Serenity at Coconut Bay is a couples-only option on the same property: private plunge-pool suites, with full use of the resort.",
    bookingInstructions:
      "Book directly with Coconut Bay by January 31, 2027 and mention Shenice & Quinton’s wedding (May 12, 2027). Email reservations@cbayresort.com, call 877-252-0304 (North America) or 758-459-6000, or visit www.cbayresort.com. Confirm rates and cancellation terms with the resort.",
  },

  faqs: [
    {
      question: "What should I wear?",
      answer:
        "Please come dressed your best for our wedding by the sea. The attire page has the colors we love and the ones to skip.",
      href: "/invite/attire",
      linkLabel: "View attire",
    },
    {
      question: "Where should I stay?",
      answer:
        "We recommend Coconut Bay Beach Resort & Spa. Book directly with the resort and mention Shenice & Quinton’s wedding (May 12, 2027). Families usually stay in Splash. Adults-only travelers can choose Harmony (18+) with access to the full property. Couples can also stay at Serenity at Coconut Bay, a couples-only plunge-pool suite on the same property. Suggested stay: May 11–15, 2027. Please reserve by January 31, 2027. Email reservations@cbayresort.com or call 877-252-0304.",
    },
    {
      question: "How do I book the resort?",
      answer:
        "Email reservations@cbayresort.com, call 877-252-0304 (North America) or 758-459-6000, or visit www.cbayresort.com. Mention our wedding names and dates when you book. If your party needs 5+ rooms, you may contact groups@cbayna.com about group rates (5-night minimum). Confirm pricing and cancellation terms directly with the resort.",
    },
    {
      question: "Which airport should I fly into?",
      answer:
        "UVF (Hewanorra) is recommended for its proximity to Coconut Bay. SLU is an alternate option with a longer transfer.",
    },
    {
      question: "Can we take photos?",
      answer:
        "Yes. Photos are welcome during the ceremony, and you can share them in our Memories gallery.",
      href: "/invite/memories",
      linkLabel: "Share photos",
    },
    {
      question: "Can I bring a plus-one?",
      answer:
        "Your invitation includes a set number of adults and children. If a plus-one is included, that guest is at no charge. If a plus-one is not included, you may still add one if you are willing to cover the guest fee: about US$128 for an adult and about US$50 for a child ages 4–12 (resort service charge, VAT, and tax included). Price is subject to change. Any guest payment is due by January 31, 2027. If payment is not received by that date, their spot will be canceled.",
    },
    {
      question: "What about gifts?",
      answer:
        "Here are a few items we would love for our home. Claim an item so we know it’s covered, or if you prefer, a monetary gift is just as welcome.",
      href: "/invite/registry",
      linkLabel: "Gift here",
    },
    {
      question: "Who do I contact with travel questions?",
      answer:
        "For wedding questions, email Sarai Cairo, Reservations & Wedding Wizard, at weddings@cbayna.com and mention Shenice & Quinton’s wedding (May 12, 2027). For room reservations, email reservations@cbayresort.com, call 877-252-0304, or visit www.cbayresort.com.",
    },
    {
      question: "What if a medical emergency happens at Coconut Bay?",
      answer:
        "If you are staying at Coconut Bay and a medical emergency happens, the resort has a nursing station on site.",
    },
  ] as FaqItem[],

  rsvp: {
    hotelStatuses: [
      "Staying at Coconut Bay Resort",
      "Staying elsewhere",
      "Still arranging lodging",
    ],
    attendingOptions: [
      { value: "yes", label: "Joyfully attending" },
      { value: "no", label: "Unable to attend" },
    ],
    additionalGuestNotice:
      "A paid plus-one is about US$128 for an adult and about US$50 for a child ages 4–12 (resort service charge, VAT, and tax included). Price is subject to change. Any guest payment is due by January 31, 2027. If payment is not received by that date, their spot will be canceled.",
  },

  memories: {
    /**
     * Guest photo sharing unlocks at the start of the wedding day.
     * Set forceUnlock to true while designing/testing before May 12, 2027.
     */
    forceUnlock: false,
    unlockIso: "2027-05-12T00:00:00",
    placeholderImage: "/images/Elegant_Wedding_photo_Memories.png",
    placeholderAlt: "Instant camera with wedding photos and flowers",
    pageEyebrow: "Guest Gallery",
    pageTitle: "Memories",
    lockedMessage:
      "The guest Memories gallery opens on the wedding day, May 12th, 2027. Check back then to share your photos.",
    liveMessage:
      "Share photos from the celebration, up to about 40MB. Large photos are compressed automatically. When Google is connected, uploads go to the couple’s Drive folder so everyone can browse them.",
    uploadCta: "Upload a photo",
    emptyState: "No guest photos yet. Be the first to share a memory.",
    /**
     * Shared Drive folder guests can open if site upload fails.
     * Folder must allow “Anyone with the link” can add files (Editor or Contributor).
     */
    driveFolderUrl:
      "https://drive.google.com/drive/folders/1f_sTJnG7dxWW_GxSBzSjhFYN-D_dwp78?usp=sharing",
    driveBackupMessage:
      "Having trouble uploading here? Open our Google Drive folder and add your photos there instead.",
    driveBackupLinkLabel: "Upload on Google Drive",
  },

  images: {
    coupleCover: "/images/couple-cover.jpg",
    coupleCoverAlt: "Portrait placeholder for Shenice and Quinton",
  },
} as const;

export type WeddingConfig = typeof wedding;

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
      "If you are staying at Coconut Bay and flying into UVF, a hotel transfer is available too. On the wedding day, shuttles leave from the Coconut Bay lobby, and the walk to Eternity Beach is short and well marked.",
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
    note: "We’ve carefully chosen each item to match our home and personal style, so we kindly ask that gifts purchased be the exact items, colour and amount listed. Thank you for helping us turn our house into a home filled with love, warmth, and beautiful memories!",
    donation: {
      heading: "A Gift From the Heart",
      note: "Should you wish to give a monetary gift, our banking details are provided below.",
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
    detailsHeading: "THE DETAILS OF OUR FOREVER",
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
    // registryTagBody: "",
    registryTagCta: "View Registry",
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
      id: "flower-children",
      title: "Flower Girls",
      members: [
        { name: "Jupiter Thompson", role: "Flower Girl / Mini Bride" },
        { name: "Samiyah Clarke", role: "Flower Girl" },
      ],
    },
    {
      id: "principal-sponsors",
      title: "Sponsors",
      members: [{ name: "Rebekah Clarke" }],
    },
  ] as PartyGroup[],

  story: [
    {
      id: "met",
      title: "How We Met",
      handwrittenLabel: "The First Message",
      body: "Our story began with a simple message on Facebook, one that sparked conversations neither of us wanted to end. What started as casual chats slowly grew into a beautiful friendship. Then, as fate would have it, our paths unexpectedly crossed at one of Shenice’s school sports days. It wasn't planned, and neither of us knew we'd see each other that day, but sometimes the most beautiful moments happen when you least expect them. As time went on, our friendship blossomed into something more, and somewhere along the way, we found love in each other. What began with a simple conversation became the start of our forever.",
      image: "/images/how_we_met.png",
      imageAlt: "Phones on a bench at a sports day, where Shenice and Quinton first met",
      imageSide: "left",
    },
    {
      id: "trip",
      title: "Our First Trip",
      handwrittenLabel: "The First Flight",
      body: "Tobago will always hold a special place in our hearts. It was our first trip as a couple and our very first adventure away together. From sunny days and endless laughter to the little moments that brought us closer, every experience became part of our story. It was where we began making memories beyond the familiar, discovering new things about each other, and learning what it meant to experience life side by side. Our first getaway, but certainly not our last.",
      image: "/images/IMG_5611.jpg",
      imageAlt: "Shadows of Shenice and Quinton on the sand during their trip to Tobago",
      imageSide: "right",
    },
    {
      id: "jupiter",
      title: "Jupiter",
      handwrittenLabel: "Our First Child",
      body: "Our love story wouldn't be complete without our beautiful daughter, Jupiter. She has brought a whole new meaning to love, filling our lives with laughter, warmth, and endless surprises. She has a way of turning ordinary moments into unforgettable memories and making sure life is never too predictable. Through her, we've discovered a different kind of love and a bond that continues to grow stronger every day. What began as love between two has grown into the beautiful little family we've built together, with a lifetime of memories still waiting to be made.",
      image: "/images/ultrasound.png",
      imageAlt: "Ultrasound of Jupiter before she was born",
      imageSide: "left",
    },
    {
      id: "proposal",
      title: "The Proposal",
      handwrittenLabel: "the yes",
      body: "The proposal was simple and sweet, kept quiet until the moment arrived, though Jupiter nearly gave the secret away. It happened in our new home. Shenice was happily surprised; she never saw it coming. A quiet yes, in a place that already felt like forever.",
      image: "/images/proposal.png",
      imageAlt: "Rose gold balloons spelling Will U Marry Me, surrounded by candles and petals",
      imageSide: "right",
    },
    {
      id: "destination",
      title: "Our Forever Begins",
      handwrittenLabel: "The Next Chapter",
      body: "From a simple conversation on Facebook to a love that grew into a beautiful family, every chapter has brought us closer to this moment. We've shared laughter, adventures, milestones, and countless memories along the way, with our little Jupiter keeping us on our toes, filling our days with unexpected surprises. Now, as we prepare to say “I do,” we're looking forward to everything life has waiting for us. Our story is still being written, and we can't wait to begin this next chapter as husband and wife, surrounded by the people we love most.",
      image: "/images/Triangle-altar.jpg",
      imageAlt: "Beach ceremony with a triangular wooden altar facing the sea",
      imageSide: "left",
    },
  ] as StoryChapter[],

  reminders: [
    {
      id: "rsvp",
      title: "Wedding RSVP Deadline",
      body: "Please confirm your attendance by December 31, 2026 so we can finalize seating, meals. RSVP only for guests named on your invitation.",
    },
    {
      id: "plus-one",
      title: "Plus Ones",
      body: "Your invitation includes a set number of adults and children. If a plus-one is included, that guest is at no charge. If a plus-one is not included, you may still add one if you are willing to cover the guest fee: about US$175 for an adult and about US$51 for a child ages 4–12 (resort service charge and VAT included). Price is subject to change. Any guest payment is due by January 31, 2027. If payment is not received by that date, their spot will be canceled.",
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
      body: "Please arrive by 3:30 PM and be seated by 3:45 PM. The ceremony begins promptly at 4:00 PM.",
    },
    {
      id: "photos",
      title: "Photos",
      body: "Photos of our special day are welcome. You can share your pictures in our Memories gallery.",
      href: "/invite/memories",
      linkLabel: "Share photos",
    },
    {
      id: "gifts",
      title: "Gifts",
      body: "Here are a few items we would love for our home. Claim an item so we know it’s covered.",
      href: "/invite/registry",
      linkLabel: "Gift here",
    },
    {
      id: "nursing-station",
      title: "Nursing Station",
      body: "If you are staying at Coconut Bay Resort it has a nursing station on site for medical emergencies.",
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
        "Your invitation includes a set number of adults and children. If a plus-one is included, that guest is at no charge. If a plus-one is not included, you may still add one if you are willing to cover the guest fee: about US$175 for an adult and about US$51 for a child ages 4–12 (resort service charge and vat included). Price is subject to change. Any guest payment is due by January 31, 2027. If payment is not received by that date, their spot will be canceled.",
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
      "A paid plus-one is about US$175 for an adult and about US$51 for a child ages 4–12 (resort service charge and tax included). Price is subject to change. Any guest payment is due by January 31, 2027. If payment is not received by that date, their spot will be canceled.",
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
} as const;

export type WeddingConfig = typeof wedding;

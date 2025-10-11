// lib/tours.ts

type ItineraryDay = {
  day: number;
  title: string;
  subtitle?: string;
  details: string[];
};

type Tour = {
  id: string | number;
  slug: string;
  title: string;
  country: string;
  image: string;
  durationDays: number;
  priceFrom: number; // USD
  rating: number;
  reviewsCount: number;
  summary: string;
  tags: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
};

// Helper: auto-build itinerary (Day 1 = Arrival, last day = Departure)
function buildItinerary(
  durationDays: number,
  highlights: Array<{ title: string; details: string[] }>
): ItineraryDay[] {
  if (durationDays < 2) {
    // minimal fallback
    return [
      {
        day: 1,
        title: "Arrival",
        subtitle: "Welcome",
        details: [
          "Airport pickup / self check-in.",
          "Free time to rest or explore nearby area.",
        ],
      },
    ];
  }
  const days: ItineraryDay[] = [];

  // Day 1
  days.push({
    day: 1,
    title: "Arrival & Orientation",
    subtitle: "Welcome!",
    details: [
      "Arrive at destination airport and transfer to hotel.",
      "Hotel check-in and short orientation walk nearby.",
      "Evening at leisure / welcome dinner suggestions.",
    ],
  });

  // Middle days
  const middleDays = durationDays - 2;
  for (let i = 0; i < middleDays; i++) {
    const h = highlights[i % highlights.length];
    days.push({
      day: i + 2,
      title: h.title,
      details: h.details,
    });
  }

  // Last day
  days.push({
    day: durationDays,
    title: "Departure",
    subtitle: "See you again!",
    details: [
      "Free time (depending on flight time).",
      "Hotel check-out and transfer to airport.",
      "End of service.",
    ],
  });

  return days;
}

const tours: Tour[] = [
  // ========= ASIA =========
  {
    id: "tokyo-essentials-6d",
    slug: "tokyo-essentials-6d",
    title: "Tokyo Essentials – 6D5N",
    country: "Japan",
    image: "https://images.pexels.com/photos/208773/pexels-photo-208773.jpeg",
    durationDays: 6,
    priceFrom: 899, // USD
    rating: 4.8,
    reviewsCount: 214,
    summary:
      "City highlights, Shibuya–Asakusa walking tour, and day trip to Mt. Fuji.",
    tags: ["City Tour", "Culture", "Small Group"],
    included: ["Accommodation", "Breakfast", "Guided Tours", "Transport"],
    excluded: ["Flights", "Travel Insurance", "Personal Expenses"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Tokyo",
        subtitle: "Welcome to Japan!",
        details: [
          "Arrive at Tokyo Narita or Haneda Airport.",
          "Transfer to your hotel in central Tokyo.",
          "Evening at leisure to explore nearby areas like Shinjuku or Shibuya.",
        ],
      },
      {
        day: 2,
        title: "Tokyo City Tour",
        subtitle: "Explore Tokyo's Highlights",
        details: [
          "Visit Senso-ji Temple in Asakusa and Nakamise Shopping Street.",
          "See the Meiji Shrine and stroll through Yoyogi Park.",
          "Experience the bustling Shibuya Crossing and Hachiko Statue.",
        ],
      },
      {
        day: 3,
        title: "Modern Tokyo & Harajuku",
        details: [
          "Omotesando architecture stroll & Harajuku backstreets.",
          "Optional: teamLab Planets / Digital art museum.",
          "Food stop: ramen or sushi train experience.",
        ],
      },
      {
        day: 4,
        title: "Mt. Fuji & Kawaguchiko Day Trip",
        details: [
          "Transfer to Kawaguchiko area.",
          "Views of Mt. Fuji; Chureito Pagoda photo spots.",
          "Lake Kawaguchi promenade and local snacks.",
        ],
      },
      {
        day: 5,
        title: "Free & Easy",
        details: [
          "Shopping in Ginza / Akihabara.",
          "Optional: Odaiba bay area & night views.",
          "Evening food crawl or izakaya experience.",
        ],
      },
      {
        day: 6,
        title: "Departure",
        subtitle: "See you next time!",
        details: [
          "Free time depending on flight schedule.",
          "Hotel check-out and transfer to airport.",
        ],
      },
    ],
  },

  {
    id: "bali-nature-retreat-4d",
    slug: "bali-nature-retreat-4d",
    title: "Bali Nature Retreat – 4D3N",
    country: "Indonesia",
    image: "https://images.pexels.com/photos/2303781/pexels-photo-2303781.jpeg",
    durationDays: 4,
    priceFrom: 349,
    rating: 4.7,
    reviewsCount: 156,
    summary:
      "Ubud rice terraces, Uluwatu sunset, and waterfall hopping with a local guide.",
    tags: ["Beach", "Nature", "Short Escape"],
    included: [
      "Accommodation",
      "Daily Breakfast",
      "Private Car & Driver",
      "Entrance Fees (selected)",
    ],
    excluded: ["Flights", "Lunch & Dinner", "Travel Insurance"],
    itinerary: buildItinerary(4, [
      {
        title: "Ubud & Rice Terraces",
        details: [
          "Morning at Tegalalang Rice Terrace; optional Bali Swing.",
          "Coffee stop at local plantation.",
          "Evening stroll around Ubud market & palace.",
        ],
      },
      {
        title: "Waterfalls Day",
        details: [
          "Visit Tegenungan / Tibumana waterfalls (depending on flow).",
          "Short jungle walk & photo time.",
          "Relaxing afternoon at café or spa (optional).",
        ],
      },
      {
        title: "Uluwatu Sunset",
        details: [
          "Drive to South Bali cliffs.",
          "Uluwatu Temple & sunset view; optional Kecak dance.",
          "Seafood dinner at Jimbaran (own expense).",
        ],
      },
    ]),
  },

  {
    id: "alps-hiking-8d",
    slug: "alps-hiking-8d",
    title: "Alps Hiking Adventure – 8D7N",
    country: "Switzerland",
    image: "https://images.pexels.com/photos/196464/pexels-photo-196464.jpeg",
    durationDays: 8,
    priceFrom: 1290,
    rating: 4.9,
    reviewsCount: 98,
    summary:
      "Guided alpine trails, scenic trains, and cosy chalets with half-board.",
    tags: ["Adventure", "Hiking", "Scenic"],
    included: [
      "Chalet / Hotel",
      "Breakfast",
      "Selected Guided Hikes",
      "Local Transfers",
    ],
    excluded: ["Flights", "Lunch & Snacks", "Travel Insurance"],
    itinerary: buildItinerary(8, [
      {
        title: "Intro Hike & Panorama",
        details: [
          "Warm-up trail (8–10km) with valley viewpoints.",
          "Waterfall and river gorge stops.",
          "Evening recovery & route briefing.",
        ],
      },
      {
        title: "Scenic Train & Lake Loop",
        details: [
          "Ride a panoramic train to another valley.",
          "Leisurely loop around an alpine lake.",
          "Optional paddle/boat (seasonal).",
        ],
      },
      {
        title: "Peak Day",
        details: [
          "Summit attempt (two difficulty options).",
          "Picnic lunch on the ridge (weather permitting).",
          "Sauna / wellness time back at chalet.",
        ],
      },
      {
        title: "Free Day / Optional Paragliding",
        details: [
          "Rest morning; optional paragliding or spa.",
          "Village walk & cheese tasting.",
          "Sunset viewpoint close to town.",
        ],
      },
      {
        title: "Glacier Walk",
        details: [
          "Guided glacier experience (gear provided).",
          "Ice features & safety introduction.",
          "Return via scenic chairlift/train.",
        ],
      },
      {
        title: "Ridge Traverse",
        details: [
          "High-trail traverse with constant mountain views.",
          "Photo stops at huts & lookouts.",
          "Farewell dinner at local alpine restaurant.",
        ],
      },
    ]),
  },

  {
    id: "mediterranean-cruise-7d",
    slug: "mediterranean-cruise-7d",
    title: "Mediterranean Highlights Cruise – 7D6N",
    country: "Italy",
    image: "https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg",
    durationDays: 7,
    priceFrom: 1099,
    rating: 4.6,
    reviewsCount: 320,
    summary:
      "Rome, Barcelona, and the French Riviera with curated shore excursions.",
    tags: ["Cruise", "Family", "Relax"],
    included: [
      "Cruise Cabin",
      "Full Board on Ship",
      "Selected Shore Excursions",
      "Port Transfers (group)",
    ],
    excluded: [
      "Flights to/from Port",
      "Alcoholic Beverages",
      "Personal Expenses",
      "Travel Insurance",
    ],
    itinerary: buildItinerary(7, [
      {
        title: "Rome (Civitavecchia) Embarkation",
        details: [
          "Board the ship and safety briefing.",
          "Explore onboard facilities.",
          "Sail-away views at sunset.",
        ],
      },
      {
        title: "Florence/Pisa (shore day)",
        details: [
          "Optional excursion to Florence historical center.",
          "Photo stop Pisa (Leaning Tower).",
          "Return to ship before evening sail.",
        ],
      },
      {
        title: "French Riviera (Nice/Monaco)",
        details: [
          "Promenade des Anglais stroll.",
          "Old town market; optional Monaco add-on.",
          "Gelato & café time.",
        ],
      },
      {
        title: "Barcelona Highlights",
        details: [
          "Sagrada Família photo stop (outside).",
          "Gothic Quarter walk & tapas tasting.",
          "La Rambla and Boqueria market.",
        ],
      },
      {
        title: "Sea Day",
        details: [
          "Onboard activities & pool time.",
          "Cooking demo or wine seminar (ship program).",
          "Formal night dinner.",
        ],
      },
    ]),
  },

  // ======== Tambahan baru di bawah ini ========
  {
    id: "kyoto-osaka-classics-5d",
    slug: "kyoto-osaka-classics-5d",
    title: "Kyoto & Osaka Classics – 5D4N",
    country: "Japan",
    image: "https://images.pexels.com/photos/1295137/pexels-photo-1295137.jpeg",
    durationDays: 5,
    priceFrom: 820,
    rating: 4.8,
    reviewsCount: 173,
    summary: "Fushimi Inari sunrise, Gion lanes, Osaka street food night tour.",
    tags: ["Culture", "Food", "City Tour"],
    included: [
      "Accommodation",
      "Breakfast",
      "IC/Local Transport (selected)",
      "Guided Walks (selected)",
    ],
    excluded: ["Flights", "Lunch & Dinner", "Entrance Fees (some)"],
    itinerary: buildItinerary(5, [
      {
        title: "Fushimi Inari & Gion",
        details: [
          "Early sunrise tori gates at Fushimi Inari.",
          "Gion old streets and wooden machiya.",
          "Tea time / wagashi sweets stop.",
        ],
      },
      {
        title: "Arashiyama & Bamboo Grove",
        details: [
          "Bamboo grove walk & river bridge views.",
          "Tenryu-ji temple garden.",
          "Optional monkey park hike.",
        ],
      },
      {
        title: "Osaka Food Night",
        details: [
          "Dotonbori neon walk & takoyaki/okonomiyaki tasting.",
          "Shinsaibashi arcade shopping.",
          "Umeda night views (optional).",
        ],
      },
    ]),
  },

  {
    id: "seoul-jeju-escape-6d",
    slug: "seoul-jeju-escape-6d",
    title: "Seoul & Jeju Island Escape – 6D5N",
    country: "South Korea",
    image: "https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg",
    durationDays: 6,
    priceFrom: 940,
    rating: 4.7,
    reviewsCount: 142,
    summary:
      "K-pop districts, royal palaces, and Jeju coastal trails & waterfalls.",
    tags: ["City Tour", "Nature", "Couple"],
    included: [
      "Accommodation",
      "Breakfast",
      "Domestic flight (optional add-on)",
      "Local Transfers (selected)",
    ],
    excluded: ["Intl Flights", "Lunch & Dinner", "Travel Insurance"],
    itinerary: buildItinerary(6, [
      {
        title: "Royal Palaces & Bukchon",
        details: [
          "Gyeongbokgung palace & hanbok photo spots.",
          "Bukchon Hanok Village walk.",
          "Insadong crafts street.",
        ],
      },
      {
        title: "K-Pop Districts",
        details: [
          "Gangnam/K-Star road photo ops.",
          "Myeongdong street food crawl.",
          "N-Seoul Tower night view.",
        ],
      },
      {
        title: "Jeju Coast & Waterfalls",
        details: [
          "Flight to Jeju (or ferry) in the morning.",
          "Cheonjiyeon/Cheonjeyeon waterfalls.",
          "Coastal trail and café stop.",
        ],
      },
      {
        title: "Seongsan & Beaches",
        details: [
          "Seongsan Ilchulbong (Sunrise Peak) hike.",
          "Hamdeok/ Hyeopjae beach relax.",
          "Seafood dinner recommendations.",
        ],
      },
    ]),
  },

  {
    id: "bangkok-streetfood-4d",
    slug: "bangkok-streetfood-4d",
    title: "Bangkok Street Food & Temples – 4D3N",
    country: "Thailand",
    image: "https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg",
    durationDays: 4,
    priceFrom: 319,
    rating: 4.6,
    reviewsCount: 201,
    summary:
      "Grand Palace, Chao Phraya cruise, and legendary night market eats.",
    tags: ["Food", "City Tour", "Short Escape"],
    included: [
      "Accommodation",
      "Breakfast",
      "Selected Temple Tickets",
      "Boat Ride (selected)",
    ],
    excluded: ["Flights", "Lunch & Dinner", "Personal Expenses"],
    itinerary: buildItinerary(4, [
      {
        title: "Grand Palace & Temples",
        details: [
          "Grand Palace & Wat Phra Kaew highlights (dress code check).",
          "Wat Pho reclining Buddha & massage school (opt).",
          "River ferry across to Wat Arun (optional).",
        ],
      },
      {
        title: "Chao Phraya & Chinatown",
        details: [
          "Canal/river boat ride (khlong).",
          "Chinatown street food crawl evening.",
          "Asiatique night market (optional).",
        ],
      },
      {
        title: "Local Markets & Malls",
        details: [
          "Chatuchak (weekend) / Pratunam bargain hunt.",
          "MBK/Siam area malls & café time.",
          "Rooftop sunset drink (own expense).",
        ],
      },
    ]),
  },

  {
    id: "vietnam-north-loop-7d",
    slug: "vietnam-north-loop-7d",
    title: "Vietnam North Loop – 7D6N (Hanoi • Sapa • Ha Long)",
    country: "Vietnam",
    image: "https://images.pexels.com/photos/1619563/pexels-photo-1619563.jpeg",
    durationDays: 7,
    priceFrom: 789,
    rating: 4.8,
    reviewsCount: 187,
    summary: "Sapa terraces trek, Ha Long Bay cruise, Old Quarter cyclo ride.",
    tags: ["Adventure", "Scenic", "Small Group"],
    included: [
      "Accommodation",
      "Breakfast",
      "Overnight Train/Bus (sel.)",
      "Ha Long Day Cruise (sel.)",
    ],
    excluded: ["Flights", "Some Meals", "Travel Insurance"],
    itinerary: buildItinerary(7, [
      {
        title: "Hanoi Old Quarter",
        details: [
          "Cyclo ride around Old Quarter.",
          "Egg coffee tasting workshop.",
          "Water puppet show (optional).",
        ],
      },
      {
        title: "Sapa Terraces Trek",
        details: [
          "Transfer to Sapa highlands.",
          "Guided trek through rice terraces.",
          "Local village visit.",
        ],
      },
      {
        title: "Fansipan or Village Day",
        details: [
          "Fansipan cable car (optional) OR extended village walk.",
          "Local market stop.",
          "Overnight back to Hanoi.",
        ],
      },
      {
        title: "Ha Long Bay Cruise",
        details: [
          "Day cruise among karst islets.",
          "Kayak or sampan ride (weather permitting).",
          "Seafood lunch on boat.",
        ],
      },
    ]),
  },

  {
    id: "paris-loire-chateaux-6d",
    slug: "paris-loire-chateaux-6d",
    title: "Paris & Loire Châteaux – 6D5N",
    country: "France",
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    durationDays: 6,
    priceFrom: 1280,
    rating: 4.7,
    reviewsCount: 134,
    summary:
      "Iconic Paris landmarks and a day trip to Loire Valley castles & vineyards.",
    tags: ["Culture", "Wine", "Couple"],
    included: [
      "Accommodation",
      "Breakfast",
      "Louvre Skip-the-Line (sel.)",
      "Loire Day Trip (sel.)",
    ],
    excluded: ["Flights", "Metro Pass (top-up)", "Most Meals"],
    itinerary: buildItinerary(6, [
      {
        title: "Paris Icons",
        details: [
          "Eiffel Tower photo stops & Trocadéro view.",
          "Seine riverside walk & Île de la Cité.",
          "Notre-Dame area & Latin Quarter.",
        ],
      },
      {
        title: "Louvre & Le Marais",
        details: [
          "Louvre highlights tour.",
          "Le Marais boutiques & falafel lane.",
          "Sunset at Pont Neuf / Seine cruise (optional).",
        ],
      },
      {
        title: "Loire Valley Day Trip",
        details: [
          "Visit Chenonceau/Chambord (or similar).",
          "Wine tasting at local domain (seasonal).",
          "Return to Paris in the evening.",
        ],
      },
      {
        title: "Montmartre & Pastry",
        details: [
          "Montmartre hill & Sacré-Cœur.",
          "Pastry/croissant class (optional).",
          "Café hopping in classic brasseries.",
        ],
      },
    ]),
  },

  {
    id: "santorini-mykonos-6d",
    slug: "santorini-mykonos-6d",
    title: "Santorini & Mykonos Sunsets – 6D5N",
    country: "Greece",
    image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
    durationDays: 6,
    priceFrom: 1150,
    rating: 4.6,
    reviewsCount: 161,
    summary:
      "Caldera cruise, whitewashed lanes, and island-hopping beach days.",
    tags: ["Beach", "Relax", "Couple"],
    included: [
      "Accommodation",
      "Breakfast",
      "Ferry Tickets (sel.)",
      "Caldera Cruise (sel.)",
    ],
    excluded: ["Flights", "Lunch & Dinner", "Travel Insurance"],
    itinerary: buildItinerary(6, [
      {
        title: "Oia & Fira",
        details: [
          "Stroll whitewashed alleys of Oia & Fira.",
          "Blue-domed churches photo stops.",
          "Sunset viewpoint.",
        ],
      },
      {
        title: "Caldera Catamaran",
        details: [
          "Day cruise around caldera cliffs.",
          "Swim/snorkel stops (seasonal).",
          "BBQ lunch onboard (operator-dependent).",
        ],
      },
      {
        title: "Mykonos Old Town",
        details: [
          "Little Venice & windmills.",
          "Boutique shopping & cafés.",
          "Beach time at Ornos/Platis Gialos.",
        ],
      },
      {
        title: "Island Beaches",
        details: [
          "Choose chill or party beaches.",
          "Optional ATV rental for hidden coves.",
          "Seafood dinner by the water.",
        ],
      },
    ]),
  },

  {
    id: "rome-amalfi-delight-7d",
    slug: "rome-amalfi-delight-7d",
    title: "Rome & Amalfi Coast Delight – 7D6N",
    country: "Italy",
    image: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg",
    durationDays: 7,
    priceFrom: 1190,
    rating: 4.7,
    reviewsCount: 178,
    summary:
      "Colosseum & Vatican fast-track, plus Positano–Ravello coastal day.",
    tags: ["Culture", "Scenic", "Family"],
    included: [
      "Accommodation",
      "Breakfast",
      "Fast-track Tickets (sel.)",
      "Amalfi Day Trip (sel.)",
    ],
    excluded: ["Flights", "City Tax", "Meals not mentioned"],
    itinerary: buildItinerary(7, [
      {
        title: "Ancient Rome",
        details: [
          "Colosseum & Roman Forum (fast-track if selected).",
          "Palatine Hill panoramic views.",
          "Gelato stop near Piazza Venezia.",
        ],
      },
      {
        title: "Vatican Highlights",
        details: [
          "St. Peter’s Basilica & Square.",
          "Vatican Museums/Sistine Chapel (timed entry).",
          "Trastevere dinner suggestions.",
        ],
      },
      {
        title: "Amalfi Coast Day",
        details: [
          "Drive to Positano & Amalfi scenic stops.",
          "Ravello terrace gardens.",
          "Return to Rome in evening.",
        ],
      },
      {
        title: "Rome at Leisure",
        details: [
          "Trevi Fountain & Spanish Steps.",
          "Campo de’ Fiori / Navona walk.",
          "Aperitivo time.",
        ],
      },
    ]),
  },

  {
    id: "nz-south-island-roadtrip-10d",
    slug: "nz-south-island-roadtrip-10d",
    title: "New Zealand South Island Road Trip – 10D9N",
    country: "New Zealand",
    image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    durationDays: 10,
    priceFrom: 1890,
    rating: 4.9,
    reviewsCount: 92,
    summary:
      "Fiordland cruises, glacier valleys, and scenic drives Queenstown–Wanaka.",
    tags: ["Self-Drive", "Adventure", "Scenic"],
    included: [
      "Accommodation",
      "Car Rental (sel.)",
      "Milford / Doubtful Cruise (sel.)",
      "Maps & Support",
    ],
    excluded: ["Flights", "Fuel & Tolls", "National Park Fees (some)"],
    itinerary: buildItinerary(10, [
      {
        title: "Christchurch to Lake Tekapo",
        details: [
          "Pick up car and drive to Tekapo.",
          "Church of the Good Shepherd photo stop.",
          "Stargazing (International Dark Sky Reserve).",
        ],
      },
      {
        title: "Aoraki/Mt Cook National Park",
        details: [
          "Hooker Valley Track (easy scenic hike).",
          "Glacier viewpoints & alpine café.",
          "Drive to Wanaka/Queenstown.",
        ],
      },
      {
        title: "Queenstown Thrills",
        details: [
          "Gondola & luge / jet boat (optional).",
          "Arrowtown heritage village.",
          "Lake Wakatipu sunset.",
        ],
      },
      {
        title: "Milford/Doubtful Sound",
        details: [
          "Fiordland cruise day (weather permitting).",
          "Waterfalls & wildlife spotting.",
          "Return via scenic highway.",
        ],
      },
      {
        title: "Wanaka & Glaciers",
        details: [
          "That Wanaka Tree sunrise.",
          "Drive Haast Pass towards glaciers.",
          "Fox/Franz Josef walks (conditions dependent).",
        ],
      },
      {
        title: "West Coast to Christchurch",
        details: [
          "Punakaiki Pancake Rocks (if routing north).",
          "Arthurs Pass scenic drive.",
          "Return car in Christchurch.",
        ],
      },
    ]),
  },

  {
    id: "patagonia-trek-9d",
    slug: "patagonia-trek-9d",
    title: "Patagonia Trek – 9D8N (El Chaltén • Torres del Paine)",
    country: "Argentina",
    image: "https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg",
    durationDays: 9,
    priceFrom: 2390,
    rating: 4.9,
    reviewsCount: 68,
    summary:
      "Iconic trails, granite towers, and glaciers with expert mountain guides.",
    tags: ["Hiking", "Adventure", "Bucket List"],
    included: [
      "Mountain Lodging/Camps",
      "Guides (selected days)",
      "Park Transfers (sel.)",
      "Breakfast",
    ],
    excluded: [
      "Flights",
      "Camping Gear Rental (if needed)",
      "Some Meals",
      "Insurance",
    ],
    itinerary: buildItinerary(9, [
      {
        title: "El Chaltén Warm-up",
        details: [
          "Short hikes to viewpoints.",
          "Briefing on longer treks.",
          "Gear check & preparation.",
        ],
      },
      {
        title: "Fitz Roy / Laguna de los Tres",
        details: [
          "Full-day trek (weather dependent).",
          "Picnic lunch on trail.",
          "Return to town for dinner.",
        ],
      },
      {
        title: "Perito Moreno Glacier",
        details: [
          "Drive to El Calafate & glacier viewpoints.",
          "Optional mini-trek on ice (operator).",
          "Evening at leisure.",
        ],
      },
      {
        title: "Torres del Paine Day",
        details: [
          "Border crossing to Chile (documents!).",
          "Park viewpoints & short walks.",
          "Back to lodging/camp.",
        ],
      },
      {
        title: "W-Trail Segment",
        details: [
          "One leg of the W-trail with guide.",
          "Lookouts & suspension bridges.",
          "Return & wind-down.",
        ],
      },
    ]),
  },

  {
    id: "cappadocia-istanbul-6d",
    slug: "cappadocia-istanbul-6d",
    title: "Cappadocia Balloons & Istanbul Bazaars – 6D5N",
    country: "Turkey",
    image: "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg",
    durationDays: 6,
    priceFrom: 990,
    rating: 4.7,
    reviewsCount: 149,
    summary:
      "Sunrise hot-air balloon ride, cave churches, and Ottoman old town.",
    tags: ["Culture", "Scenic", "Couple"],
    included: [
      "Accommodation",
      "Breakfast",
      "Domestic flight (sel.)",
      "Transfers (selected)",
    ],
    excluded: ["Intl Flights", "Lunch & Dinner", "Balloon Fee (if chosen)"],
    itinerary: buildItinerary(6, [
      {
        title: "Istanbul Old City",
        details: [
          "Hagia Sophia & Blue Mosque (outside/inside time-slots).",
          "Basilica Cistern (optional).",
          "Grand Bazaar wander.",
        ],
      },
      {
        title: "Cappadocia Valleys",
        details: [
          "Flight to Cappadocia morning/evening.",
          "Goreme open-air museum & cave churches.",
          "Sunset point panorama.",
        ],
      },
      {
        title: "Balloon Sunrise",
        details: [
          "Optional hot-air balloon (weather dependent).",
          "Love Valley / Red Valley walk.",
          "Pottery/ceramic workshop (optional).",
        ],
      },
      {
        title: "Bosphorus & Bazaars",
        details: [
          "Fly back to Istanbul.",
          "Bosphorus cruise (short).",
          "Spice Bazaar & café hopping.",
        ],
      },
    ]),
  },

  {
    id: "morocco-sahara-8d",
    slug: "morocco-sahara-8d",
    title: "Morocco Sahara & Imperial Cities – 8D7N",
    country: "Morocco",
    image: "https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg",
    durationDays: 8,
    priceFrom: 1299,
    rating: 4.8,
    reviewsCount: 112,
    summary: "Fes medina, desert camel trek, starry night at a Berber camp.",
    tags: ["Culture", "Desert", "Adventure"],
    included: [
      "Accommodation/Riad",
      "Breakfast",
      "Desert Camp (sel.)",
      "Camel Trek (sel.)",
    ],
    excluded: ["Flights", "Dinners (some)", "Tips & Personal Expenses"],
    itinerary: buildItinerary(8, [
      {
        title: "Fes Medina & Tanneries",
        details: [
          "Guided medina maze walk.",
          "Leather tanneries viewpoint.",
          "Handicraft souks.",
        ],
      },
      {
        title: "Atlas Crossing to Desert",
        details: [
          "Drive via Middle Atlas scenic stops.",
          "Dunes sunset viewpoint.",
          "Berber camp dinner & music.",
        ],
      },
      {
        title: "Desert Morning & Oases",
        details: [
          "Sunrise over dunes (optional camel).",
          "Oasis visit & kasbahs.",
          "Transfer toward Marrakech.",
        ],
      },
      {
        title: "Marrakech Highlights",
        details: [
          "Jemaa el-Fnaa square & Koutoubia.",
          "Bahia Palace & Saadian Tombs.",
          "YSL Jardin Majorelle (optional).",
        ],
      },
    ]),
  },

  {
    id: "kenya-safari-7d",
    slug: "kenya-safari-7d",
    title: "Kenya Great Migration Safari – 7D6N",
    country: "Kenya",
    image: "https://images.pexels.com/photos/35600/pexels-photo.jpg",
    durationDays: 7,
    priceFrom: 2580,
    rating: 4.9,
    reviewsCount: 77,
    summary:
      "Masai Mara game drives, Big Five tracking, and sundowner under acacias.",
    tags: ["Safari", "Wildlife", "Luxury"],
    included: [
      "Lodges/Camps",
      "Full-board on Safari",
      "Game Drives",
      "Park Fees (sel.)",
    ],
    excluded: ["Intl Flights", "Visas", "Tips", "Drinks (some)"],
    itinerary: buildItinerary(7, [
      {
        title: "Masai Mara Game Drives",
        details: [
          "Morning & afternoon drives (weather/wildlife dependent).",
          "Big Five spotting attempts.",
          "Sundowner at scenic spot.",
        ],
      },
      {
        title: "Mara River & Migration",
        details: [
          "Seek crossing points (in season).",
          "Birdlife & hippo pools.",
          "Night at camp with campfire.",
        ],
      },
      {
        title: "Village & Conservancy",
        details: [
          "Optional Maasai village visit.",
          "Conservancy game drive (if included).",
          "Leisure time at lodge pool.",
        ],
      },
      {
        title: "Nakuru/Amboseli Option",
        details: [
          "Transfer to another park (itinerary variant).",
          "Flamingoes / elephants with Kilimanjaro backdrop.",
          "Relaxing evening.",
        ],
      },
    ]),
  },

  {
    id: "iceland-ring-highlights-8d",
    slug: "iceland-ring-highlights-8d",
    title: "Iceland Ring Road Highlights – 8D7N",
    country: "Iceland",
    image: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    durationDays: 8,
    priceFrom: 1990,
    rating: 4.8,
    reviewsCount: 121,
    summary:
      "Waterfalls, black-sand beaches, glaciers, and geothermal lagoons.",
    tags: ["Self-Drive", "Scenic", "Adventure"],
    included: [
      "Accommodation",
      "Car Rental (sel.)",
      "Blue Lagoon/Sky Lagoon (sel.)",
      "Maps & Support",
    ],
    excluded: ["Flights", "Fuel", "Some Entrance Fees"],
    itinerary: buildItinerary(8, [
      {
        title: "Golden Circle",
        details: [
          "Thingvellir National Park fissures.",
          "Geysir/Strokkur eruptions.",
          "Gullfoss waterfall.",
        ],
      },
      {
        title: "South Coast",
        details: [
          "Seljalandsfoss & Skógafoss waterfalls.",
          "Reynisfjara black-sand beach.",
          "Dyrhólaey cliffs (seasonal puffins).",
        ],
      },
      {
        title: "Glacier & Ice Lagoon",
        details: [
          "Skaftafell area & glacier views.",
          "Jökulsárlón glacier lagoon & Diamond Beach.",
          "Optional zodiac boat tour.",
        ],
      },
      {
        title: "North/East Fjords",
        details: [
          "Scenic fjords & fishing towns.",
          "Geothermal baths (optional).",
          "Aurora hunting (winter).",
        ],
      },
    ]),
  },

  {
    id: "sydney-great-ocean-6d",
    slug: "sydney-great-ocean-6d",
    title: "Sydney & Great Ocean Road – 6D5N",
    country: "Australia",
    image: "https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg",
    durationDays: 6,
    priceFrom: 1290,
    rating: 4.6,
    reviewsCount: 88,
    summary:
      "Sydney icons, Blue Mountains day trip, and Twelve Apostles coastal drive.",
    tags: ["City Tour", "Scenic", "Family"],
    included: [
      "Accommodation",
      "Breakfast",
      "Great Ocean Road Day (sel.)",
      "Blue Mountains Day (sel.)",
    ],
    excluded: ["Flights", "Some Meals", "Attraction Tickets (some)"],
    itinerary: buildItinerary(6, [
      {
        title: "Sydney Icons",
        details: [
          "Sydney Opera House & Harbour Bridge viewpoints.",
          "The Rocks heritage walk.",
          "Circular Quay & ferry ride (optional).",
        ],
      },
      {
        title: "Blue Mountains",
        details: [
          "Echo Point & Three Sisters.",
          "Scenic World cableway/railway (optional).",
          "Leura village cafés.",
        ],
      },
      {
        title: "Great Ocean Road",
        details: [
          "Roadtrip to the Twelve Apostles.",
          "Loch Ard Gorge & coastal lookouts.",
          "Return via koala spotting (if lucky).",
        ],
      },
      {
        title: "Bondi & Coastal Walk",
        details: [
          "Bondi to Coogee coastal walk sections.",
          "Beach time & fish-and-chips.",
          "Sunset over the Pacific.",
        ],
      },
    ]),
  },

  {
    id: "dubai-desert-luxe-4d",
    slug: "dubai-desert-luxe-4d",
    title: "Dubai Desert Luxe – 4D3N",
    country: "United Arab Emirates",
    image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
    durationDays: 4,
    priceFrom: 690,
    rating: 4.5,
    reviewsCount: 133,
    summary: "Skyline views, dune bashing, desert camp dinner with live shows.",
    tags: ["City Tour", "Desert", "Short Escape"],
    included: [
      "Accommodation",
      "Breakfast",
      "Desert Safari (sel.)",
      "Airport Transfers (sel.)",
    ],
    excluded: ["Flights", "Meals (not stated)", "Insurance"],
    itinerary: buildItinerary(4, [
      {
        title: "Downtown & Marina",
        details: [
          "Dubai Mall & Burj Khalifa area (outside/inside optional).",
          "Dubai Fountain show (evening).",
          "Marina walk night lights.",
        ],
      },
      {
        title: "Desert Safari",
        details: [
          "Dune bashing & sandboarding.",
          "Camel ride photo stop.",
          "BBQ dinner & live shows at camp.",
        ],
      },
      {
        title: "Old Dubai",
        details: [
          "Al Fahidi historical neighborhood.",
          "Abra boat across Dubai Creek.",
          "Gold & Spice Souk browsing.",
        ],
      },
    ]),
  },

  {
    id: "peru-cusco-machu-7d",
    slug: "peru-cusco-machu-7d",
    title: "Peru: Cusco & Machu Picchu – 7D6N",
    country: "Peru",
    image: "https://images.pexels.com/photos/310478/pexels-photo-310478.jpeg",
    durationDays: 7,
    priceFrom: 1590,
    rating: 4.8,
    reviewsCount: 141,
    summary:
      "Sacred Valley, train to Aguas Calientes, sunrise at Machu Picchu.",
    tags: ["Culture", "Hiking", "Bucket List"],
    included: [
      "Accommodation",
      "Breakfast",
      "Train Tickets (sel.)",
      "Machu Picchu Entry (sel.)",
    ],
    excluded: ["Flights", "Altitude Meds", "Some Meals"],
    itinerary: buildItinerary(7, [
      {
        title: "Cusco Acclimatization",
        details: [
          "Easy city walk: Plaza de Armas & San Blas.",
          "Coca tea & light dinner.",
          "Early rest to acclimate.",
        ],
      },
      {
        title: "Sacred Valley Day",
        details: [
          "Pisac market & ruins.",
          "Ollantaytambo fortress.",
          "Train to Aguas Calientes (if applicable).",
        ],
      },
      {
        title: "Machu Picchu",
        details: [
          "Morning entry to citadel (timed).",
          "Optional Huayna Picchu hike (limited permits).",
          "Return to Cusco by train.",
        ],
      },
      {
        title: "Cusco Ruins & Museums",
        details: [
          "Sacsayhuamán & Q’enqo (selected).",
          "Museum/monastery visits.",
          "Andean dinner restaurant suggestions.",
        ],
      },
    ]),
  },

  {
    id: "norway-fjords-7d",
    slug: "norway-fjords-7d",
    title: "Norway Fjords & Scenic Rail – 7D6N",
    country: "Norway",
    image: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg",
    durationDays: 7,
    priceFrom: 1890,
    rating: 4.7,
    reviewsCount: 95,
    summary:
      "Flåm railway, fjord cruises, and panoramic hikes above the water.",
    tags: ["Scenic", "Adventure", "Nature"],
    included: [
      "Accommodation",
      "Breakfast",
      "Fjord Cruise (sel.)",
      "Rail Tickets (sel.)",
    ],
    excluded: ["Flights", "Some Meals", "Insurance"],
    itinerary: buildItinerary(7, [
      {
        title: "Oslo to Myrdal & Flåm",
        details: [
          "Scenic rail via mountains.",
          "Flåm railway down to fjord.",
          "Village walk & brewery (optional).",
        ],
      },
      {
        title: "Fjord Cruise & Viewpoints",
        details: [
          "Naeroyfjord/ Aurlandsfjord cruise.",
          "Stegastein viewpoint drive.",
          "Local smokehouse tasting (optional).",
        ],
      },
      {
        title: "Bergen Old Town",
        details: [
          "Bryggen wharf & fish market.",
          "Floibanen funicular view.",
          "Café hopping in wooden lanes.",
        ],
      },
      {
        title: "Hike Above the Fjords",
        details: [
          "Moderate trail to panoramic ridge.",
          "Picnic with view.",
          "Return to town for dinner.",
        ],
      },
    ]),
  },

  {
    id: "egypt-nile-6d",
    slug: "egypt-nile-6d",
    title: "Egypt: Cairo, Giza & Nile Cruise – 6D5N",
    country: "Egypt",
    image: "https://images.pexels.com/photos/3889926/pexels-photo-3889926.jpeg",
    durationDays: 6,
    priceFrom: 1199,
    rating: 4.6,
    reviewsCount: 109,
    summary:
      "Pyramids & Sphinx, Egyptian Museum, and 3-night Nile cruise highlights.",
    tags: ["Culture", "Cruise", "History"],
    included: [
      "Accommodation/Ship",
      "Breakfast",
      "Selected Site Tickets",
      "Transfers",
    ],
    excluded: ["Flights", "Gratuities", "Drinks (some)"],
    itinerary: buildItinerary(6, [
      {
        title: "Cairo Museum & Old Cairo",
        details: [
          "Egyptian Museum highlights.",
          "Coptic/Islamic Cairo walk.",
          "Khan el-Khalili bazaar.",
        ],
      },
      {
        title: "Giza Pyramids & Sphinx",
        details: [
          "Plateau viewpoints and photo time.",
          "Optional inside ticket (limited).",
          "Evening sound & light show (opt).",
        ],
      },
      {
        title: "Nile Cruise Start",
        details: [
          "Fly to Aswan/Luxor (varies by sailing).",
          "Embark cruise ship & cabin check-in.",
          "Temple visit (e.g., Philae/Kom Ombo).",
        ],
      },
      {
        title: "Valley of the Kings",
        details: [
          "West Bank tombs & Hatshepsut temple.",
          "Colossi of Memnon photo stop.",
          "Sail evening & onboard dinner.",
        ],
      },
    ]),
  },
];

export default tours;

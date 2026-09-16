export type Tour = {
  slug: string;
  title: string;
  area: string;
  duration: string;
  type: string;
  price: string;
  priceNote: string;
  /** Nominal rupiah (untuk hint USD). */
  priceAmount?: number;
  image: string;
  description: string;
  itinerary: { time: string; place: string }[];
  included: string[];
  excluded: string[];
};

export const tours: Tour[] = [
  {
    slug: "south-lombok-adventure",
    title: "The Essential South",
    area: "South Lombok",
    duration: "1 day",
    type: "Private",
    price: "Rp 1.2M",
    priceAmount: 1200000,
    priceNote: "per trip · up to 4 guests",
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1600&q=85",
    description:
      "Hidden beaches, Merese Hill sunset and local warungs — the classic south route, at your pace.",
    itinerary: [
      { time: "08:00", place: "Hotel pickup (Kuta area)" },
      { time: "09:00", place: "Tanjung Aan Beach" },
      { time: "11:00", place: "Merese Hill" },
      { time: "13:00", place: "Local lunch" },
      { time: "14:30", place: "Mawun Beach" },
      { time: "17:00", place: "Return to hotel" },
    ],
    included: ["Private driver", "Fuel & parking", "Mineral water", "Local guide"],
    excluded: ["Lunch", "Entrance fees", "Personal expenses"],
  },
  {
    slug: "snorkel-slow-down",
    title: "Snorkel & Slow Down",
    area: "Island Life",
    duration: "1 day",
    type: "Boat",
    price: "Rp 850K",
    priceAmount: 850000,
    priceNote: "per person · min 2",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
    description:
      "Clear water, coral gardens and a slow island lunch. No rush, just ocean.",
    itinerary: [
      { time: "08:30", place: "Harbour pickup" },
      { time: "09:30", place: "Snorkel spot 1" },
      { time: "11:30", place: "Snorkel spot 2" },
      { time: "13:00", place: "Island lunch" },
      { time: "15:30", place: "Return" },
    ],
    included: ["Boat & captain", "Snorkel gear", "Lunch", "Towels"],
    excluded: ["Underwater photos", "Tips"],
  },
  {
    slug: "waterfall-culture",
    title: "Waterfalls & Sasak Village",
    area: "North Lombok",
    duration: "1 day",
    type: "Private",
    price: "Rp 1.1M",
    priceAmount: 1100000,
    priceNote: "per trip · up to 4 guests",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
    description:
      "Chase waterfalls in the morning, meet Sasak weavers in the afternoon.",
    itinerary: [
      { time: "07:30", place: "Hotel pickup" },
      { time: "10:00", place: "Sendang Gile waterfall" },
      { time: "13:00", place: "Local lunch" },
      { time: "14:30", place: "Sasak village visit" },
      { time: "17:30", place: "Return" },
    ],
    included: ["Private driver", "Local guide", "Donations", "Mineral water"],
    excluded: ["Lunch", "Personal expenses"],
  },
];

export type Vehicle = {
  name: string;
  spec: string;
  daily: string;
  weekly?: string;
  image: string;
  perks: string[];
  /** Nominal rupiah (ada bila dari DB) — untuk schema SEO. */
  dailyAmount?: number;
  weeklyAmount?: number;
};

export const scooters: Vehicle[] = [
  {
    name: "Honda Scoopy",
    spec: "Automatic · 2 persons",
    daily: "Rp 75K",
    weekly: "Rp 450K",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85",
    perks: ["2 helmets", "Phone holder", "Free delivery*"],
  },
  {
    name: "Honda Vario",
    spec: "Automatic · 2 persons",
    daily: "Rp 100K",
    weekly: "Rp 600K",
    image:
      "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=1000&q=85",
    perks: ["2 helmets", "Phone holder", "Free delivery*"],
  },
];

export const cars: Vehicle[] = [
  {
    name: "Toyota Avanza",
    spec: "Manual · 6 seats · With driver",
    daily: "Rp 650K",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",
    perks: ["Driver + fuel", "Hotel pickup", "Flexible route"],
  },
  {
    name: "Toyota Innova",
    spec: "Manual · 7 seats · With driver",
    daily: "Rp 850K",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85",
    perks: ["Driver + fuel", "Extra comfort", "Long trip ready"],
  },
];

export const transferRoutes = [
  { from: "Lombok Airport", to: "Kuta Lombok", price: "Rp 250K", amount: 250000 },
  { from: "Lombok Airport", to: "Senggigi", price: "Rp 350K", amount: 350000 },
  { from: "Lombok Airport", to: "Mataram", price: "Rp 300K", amount: 300000 },
  { from: "Lombok Airport", to: "Bangsal Harbour", price: "Rp 450K", amount: 450000 },
];

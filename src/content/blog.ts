export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  keyword: string;
  image: string;
  body: { heading?: string; text: string }[];
};

export const posts: Post[] = [
  {
    slug: "scooter-rental-kuta-lombok-guide",
    title: "Scooter Rental in Kuta Lombok: Prices, Tips & Where to Rent",
    excerpt: "From Rp 75K/day — what to check before you ride, and why automatic scooters win in the south.",
    date: "2026-09-01",
    readTime: "6 min",
    keyword: "scooter rental kuta lombok",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85",
    body: [
      {
        text: "Renting a scooter is the fastest way to feel free in South Lombok. Most rentals in Kuta charge Rp 75–100K per day for an automatic — Honda Scoopy or Vario — with helmets and a phone holder included.",
      },
      { heading: "What to check", text: "Brakes, lights, horn, tire tread and a photo of existing scratches. Ask for two helmets even if you ride solo — spare straps break. Pay on pickup, never full prepayment to strangers." },
      { heading: "South Lombok reality", text: "Roads to Tanjung Aan and Mawun are paved but sandy on the edges. Ride slow, bring water, and plan fuel — stations close early outside Kuta. For multi-day loops, ask about weekly rates." },
      { heading: "Book simply", text: "Our scooter rental starts at Rp 75K/day with free Kuta delivery. Tap Rent now and we confirm on WhatsApp within minutes." },
    ],
  },
  {
    slug: "south-lombok-tour-itinerary",
    title: "South Lombok in One Day: The Only Itinerary You Need",
    excerpt: "Tanjung Aan, Merese Hill, Mawun — timed right, without rushing.",
    date: "2026-09-05",
    readTime: "5 min",
    keyword: "south lombok tour",
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1200&q=85",
    body: [
      { text: "One day is enough for the south if you sequence it well: beach morning, hill midday, beach afternoon, sunset on the hill." },
      { heading: "The route", text: "08:00 hotel pickup, 09:00 Tanjung Aan swim, 11:00 Merese Hill viewpoint, 13:00 local lunch, 14:30 Mawun Beach, 17:00 sunset back on Merese, return by 18:30." },
      { heading: "Private vs group", text: "Private costs more per trip but wins per person for 2–4 guests — you set the pace, stop for photos, skip crowds. This is exactly how our Essential South tour runs." },
    ],
  },
  {
    slug: "lombok-airport-transfer-prices",
    title: "Lombok Airport Transfer: Fixed Prices & How to Avoid Scams",
    excerpt: "Kuta Rp 250K, Senggigi Rp 350K — what a fair airport pickup looks like.",
    date: "2026-09-08",
    readTime: "4 min",
    keyword: "lombok airport transfer",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
    body: [
      { text: "Lombok Airport (LOP) sits 30–60 minutes from most stays. Taxis wait outside, but prices float with your jet lag. Fixed-price pickup removes the negotiation." },
      { heading: "Fair prices 2026", text: "Airport to Kuta Rp 250K, Mataram Rp 300K, Senggigi Rp 350K, Bangsal Harbour Rp 450K. Driver tracks your flight and waits at arrivals with your name." },
      { heading: "How to book", text: "Use our transfer form: pick destination, date and passengers — it builds a WhatsApp request automatically. No app, no prepayment." },
    ],
  },
  {
    slug: "private-tour-vs-rent-car-lombok",
    title: "Private Tour or Rent a Car in Lombok? An Honest Comparison",
    excerpt: "Driver-guide vs self-drive — cost, freedom and stress compared.",
    date: "2026-09-10",
    readTime: "5 min",
    keyword: "private tour lombok",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    body: [
      { text: "If you want to relax and learn, take a private tour. If you want full control and can drive, rent a car with driver or self-drive for longer stays." },
      { heading: "Cost", text: "A South Lombok private trip (~Rp 1.2M for up to 4) often beats two scooters plus fuel plus parking plus getting lost — and includes a local who knows warungs and shortcuts." },
      { heading: "Our take", text: "First 2 days: private tour to learn the island. Then rent a scooter for slow days. Best of both." },
    ],
  },
];

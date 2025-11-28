/**
 * DEMO DATA FOR FALLBACK
 * Used when API is unreachable or returns empty results
 */

export const DEMO_PRODUCTS = [
  {
    id: 101,
    title: "Slotenbak 1500mm CW30",
    slug: "slotenbak-1500mm-cw30",
    price_excl_vat: 1250.00,
    stock: 8,
    weight: 450,
    volume: 850,
    width: 1500,
    description: "Professionele slotenbak voor zwaar werk. Gemaakt van Hardox 450 staal.",
    category_slug: "slotenbakken",
    brand_slug: "caterpillar",
    is_new: true,
    cloudinary_images: [{ url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&h=400&fit=crop" }]
  },
  {
    id: 102,
    title: "Dieplepelbak 800mm CW10",
    slug: "dieplepelbak-800mm-cw10",
    price_excl_vat: 895.00,
    stock: 3,
    weight: 220,
    volume: 350,
    width: 800,
    description: "Compacte graafbak voor minigravers. Ideaal voor sleuven graven.",
    category_slug: "graafbakken",
    brand_slug: "kubota",
    is_new: false,
    cloudinary_images: [{ url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop" }]
  },
  {
    id: 103,
    title: "Sorteergrijper SG-500",
    slug: "sorteergrijper-sg500",
    price_excl_vat: 4500.00,
    stock: 0, // Op bestelling
    weight: 680,
    volume: 0,
    width: 500,
    description: "Krachtige sorteergrijper met roteerfunctie. Inclusief slangen.",
    category_slug: "sorteergrijpers",
    brand_slug: "demarec",
    is_new: true,
    cloudinary_images: [{ url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop" }]
  },
  {
    id: 104,
    title: "Puinbak 1200mm CW20",
    slug: "puinbak-1200mm-cw20",
    price_excl_vat: 1650.00,
    stock: 12,
    weight: 520,
    volume: 700,
    width: 1200,
    description: "Open puinbak met spijlen 50mm h.o.h. Zeer slijtvast.",
    category_slug: "puinbakken",
    brand_slug: "volvo",
    is_new: false,
    cloudinary_images: [{ url: "https://images.unsplash.com/photo-1535050804459-066469677875?w=600&h=400&fit=crop" }]
  },
  {
    id: 105,
    title: "Kantelbak 1400mm CW10",
    slug: "kantelbak-1400mm-cw10",
    price_excl_vat: 2100.00,
    stock: 1,
    weight: 380,
    volume: 400,
    width: 1400,
    description: "Hydraulische kantelbak 2x45 graden. Inclusief cilinders.",
    category_slug: "kantelbakken",
    brand_slug: "takeuchi",
    is_new: false,
    cloudinary_images: [{ url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop" }]
  },
  {
    id: 106,
    title: "Sloophamer FX-350",
    slug: "sloophamer-fx350",
    price_excl_vat: 6200.00,
    stock: 2,
    weight: 350,
    volume: 0,
    width: 0,
    description: "Hydraulische hamer voor machines 5-8 ton. Slagkracht 850J.",
    category_slug: "sloophamers",
    brand_slug: "atlas-copco",
    is_new: true,
    cloudinary_images: [{ url: "https://images.unsplash.com/photo-1513828583688-601bf7506215?w=600&h=400&fit=crop" }]
  }
];

export const DEMO_CATEGORIES = [
  { id: 1, title: "Slotenbakken", slug: "slotenbakken", count: 12 },
  { id: 2, title: "Graafbakken", slug: "graafbakken", count: 8 },
  { id: 3, title: "Sorteergrijpers", slug: "sorteergrijpers", count: 5 },
  { id: 4, title: "Puinbakken", slug: "puinbakken", count: 15 },
  { id: 5, title: "Kantelbakken", slug: "kantelbakken", count: 6 },
  { id: 6, title: "Sloophamers", slug: "sloophamers", count: 4 },
  { id: 7, title: "Adapters", slug: "adapters", count: 20 }
];

export const DEMO_BRANDS = [
  { id: 1, title: "Caterpillar", slug: "caterpillar" },
  { id: 2, title: "Volvo", slug: "volvo" },
  { id: 3, title: "Kubota", slug: "kubota" },
  { id: 4, title: "Takeuchi", slug: "takeuchi" },
  { id: 5, title: "Komatsu", slug: "komatsu" }
];

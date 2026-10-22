const image = (id: string, width = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export type ContentImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  story: string;
  category: string;
  location: string;
  style: string;
  year: string | null;
  coverImage: string;
  beforeImage: string | null;
  afterImage: string | null;
  ogImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  images: ContentImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  ogImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  published: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId?: string | null;
  category: string;
  description: string;
  specifications?: string | null;
  price: number | null;
  priceOnRequest: boolean;
  material: string | null;
  dimensions: string | null;
  color: string | null;
  leadTime: string | null;
  coverImage: string;
  ogImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  images: ContentImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  location: string | null;
  project: string | null;
  rating: number;
  published: boolean;
  sortOrder: number;
};

export type ValueItem = {
  title: string;
  description: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentPage = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  ogImage?: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  showInFooter: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LocationPage = {
  id: string;
  slug: string;
  city: string;
  region: string | null;
  title: string;
  intro: string;
  content: string;
  image: string | null;
  ogImage?: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SiteContent = {
  businessName: string;
  tagline: string;
  logoImage: string | null;
  faviconUrl: string | null;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  priceRange: string | null;
  openingHours: string[];
  serviceAreas: string[];
  instagram: string | null;
  pinterest: string | null;
  googleMapsEmbedUrl: string | null;
  googleMapsUrl: string | null;
  googleBusinessProfileUrl: string | null;
  announcementEnabled: boolean;
  announcementText: string | null;
  announcementHref: string | null;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  aboutStory: string;
  philosophy: string;
  aboutImage: string;
  founderName: string;
  founderRole: string;
  founderImage: string | null;
  yearsExperience: number;
  projectsCompleted: number;
  citiesServed: number;
  values: ValueItem[];
  team: TeamMember[];
  whyChooseUs: ValueItem[];
  homeProjectsEyebrow: string;
  homeProjectsTitle: string;
  homeProjectsDescription: string;
  homeServicesEyebrow: string;
  homeServicesTitle: string;
  homeServicesDescription: string;
  homeProductsEyebrow: string;
  homeProductsTitle: string;
  homeProductsDescription: string;
  homeWhyEyebrow: string;
  homeWhyTitle: string;
  homeWhyDescription: string;
  homeTestimonialsEyebrow: string;
  homeTestimonialsTitle: string;
  homeCtaEyebrow: string;
  homeCtaTitle: string;
  homeCtaDescription: string;
  homeCtaImage: string | null;
  footerDescription: string;
  footerNote: string | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string | null;
};

const now = new Date("2025-01-15T10:00:00.000Z");

export const demoSettings: SiteContent = {
  businessName: "Ivory & Oak",
  tagline: "Interiors with soul",
  logoImage: null,
  faviconUrl: null,
  phone: "+91 98490 22118",
  email: "studio@ivoryandoak.in",
  whatsapp: "919849022118",
  address: "12A, Road No. 36, Jubilee Hills",
  addressLocality: "Hyderabad",
  addressRegion: "Telangana",
  postalCode: "500033",
  addressCountry: "IN",
  priceRange: null,
  openingHours: [
    "Monday-Saturday|10:00-18:00",
    "Sunday|Closed",
  ],
  serviceAreas: ["Hyderabad", "Bengaluru", "Vijayawada", "Visakhapatnam"],
  instagram: "https://instagram.com",
  pinterest: "https://pinterest.com",
  googleMapsEmbedUrl:
    "https://www.google.com/maps?q=Jubilee+Hills,+Hyderabad,+Telangana&output=embed",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Jubilee+Hills,+Hyderabad,+Telangana",
  googleBusinessProfileUrl: null,
  announcementEnabled: true,
  announcementText: "Now accepting residential projects for early 2026.",
  announcementHref: "/contact",
  heroEyebrow: "Interior design studio · Hyderabad",
  heroTitle: "A home that feels like a deep breath.",
  heroDescription:
    "Thoughtful, layered interiors for people who value the quiet luxury of home. We design spaces that hold your everyday life beautifully.",
  heroImage: image("photo-1600210492486-724fe5c67fb0", 2200),
  aboutStory:
    "Ivory & Oak began in 2013 with a simple belief: a beautiful home should not ask you to be careful. It should invite you to put your feet up, gather around the table, and live a little louder. What started as a two-person studio in Hyderabad has grown into a close-knit team of designers, architects, and detail-obsessed makers.\n\nWe work at the intersection of Indian craft and contemporary restraint. Our rooms are built around how you actually live — where the morning light lands, where the family gathers, where you retreat at the end of a long day. Every material is chosen for how it will age, every layout for how it will move with you.\n\nOver the last twelve years, we have designed more than 180 homes, apartments, kitchens, and workspaces across South India. Some clients came to us for a single room. Others trusted us with an entire home. The thread through all of them is the same: spaces that feel personal, lived-in, and quietly extraordinary.",
  philosophy:
    "We believe luxury is not excess. It is the ease of a well-planned room, the warmth of natural materials, and the confidence of a home that reflects the people inside it. Our design process is slow on purpose — because the details that make a room feel inevitable are never rushed.",
  aboutImage: image("photo-1616486338812-3dadae4b4ace", 1600),
  founderName: "Ananya Rao",
  founderRole: "Founder & Principal Designer",
  founderImage: image("photo-1573496359142-b8d87734a5a2", 800),
  yearsExperience: 12,
  projectsCompleted: 180,
  citiesServed: 6,
  values: [
    {
      title: "Quiet luxury",
      description:
        "Restraint over excess. We choose fewer, better pieces that reward you every single day.",
    },
    {
      title: "Liveable beauty",
      description:
        "Comfort is never an afterthought. Every surface and layout is designed for real life.",
    },
    {
      title: "Honest materials",
      description:
        "Natural stone, solid timber, linen, brass, and handcrafted finishes that grow more beautiful with time.",
    },
    {
      title: "A considered process",
      description:
        "Clear communication, thoughtful timelines, and no surprises — from the first sketch to the final cushion.",
    },
  ],
  team: [
    {
      name: "Ananya Rao",
      role: "Founder & Principal Designer",
      bio: "Ananya leads the studio's creative vision. Her work is shaped by a love of Indian craft, slow travel, and the way light moves through a room.",
      image: image("photo-1573496359142-b8d87734a5a2", 700),
    },
    {
      name: "Meera Shah",
      role: "Senior Interior Designer",
      bio: "Meera translates the big picture into the smallest detail. She is the person behind many of our most-loved kitchens and bedrooms.",
      image: image("photo-1494790108377-be9c29b29330", 700),
    },
    {
      name: "Kabir Menon",
      role: "Projects & Production Lead",
      bio: "Kabir works closely with our carpenters, stone masons, and vendors to keep every finish true to the drawing and every project on track.",
      image: image("photo-1500648767791-00dcc994a43e", 700),
    },
  ],
  whyChooseUs: [
    {
      title: "Designed around you",
      description:
        "No signature style imposed on your home. We begin with your routines, your objects, and the way you want to feel at home.",
    },
    {
      title: "One team, end to end",
      description:
        "Design, drawings, material sourcing, execution, and styling handled by one accountable studio.",
    },
    {
      title: "Craft, not catalogue",
      description:
        "Bespoke joinery and locally sourced finishes, made for your space rather than picked off a showroom floor.",
    },
    {
      title: "Transparent by design",
      description:
        "Detailed estimates, clear timelines, and weekly updates. You always know where your project stands.",
    },
  ],
  homeProjectsEyebrow: "Selected work",
  homeProjectsTitle: "Spaces with a sense of\nquiet permanence.",
  homeProjectsDescription:
    "A selection of homes and workspaces shaped around the people who live and work in them.",
  homeServicesEyebrow: "What we do",
  homeServicesTitle: "From the first\nsketch to the final\ncushion.",
  homeServicesDescription:
    "A full-service studio for residential and commercial interiors, with every detail handled under one roof.",
  homeProductsEyebrow: "The collection",
  homeProductsTitle: "Objects that make\na house feel yours.",
  homeProductsDescription:
    "A considered collection of furniture, lighting, textiles, and objects — made in small batches by craftspeople we trust.",
  homeWhyEyebrow: "Why Ivory & Oak",
  homeWhyTitle: "A studio built on\ntrust and detail.",
  homeWhyDescription:
    "We keep our projects limited so every home gets the attention it deserves. That means a small, senior team and one accountable point of contact.",
  homeTestimonialsEyebrow: "In their words",
  homeTestimonialsTitle: "Good homes.\nGenuine people.",
  homeCtaEyebrow: "Begin a project",
  homeCtaTitle: "Let's design a home you'll never want to leave.",
  homeCtaDescription:
    "Tell us about your space, your routines, and what you're dreaming of. We'll take it from there.",
  homeCtaImage: image("photo-1615874959474-d609969a20ed", 1800),
  footerDescription:
    "A Hyderabad-based interior design studio creating thoughtful, layered spaces across South India.",
  footerNote: null,
  seoTitle: "Ivory & Oak | Interior Design Studio, Hyderabad",
  seoDescription:
    "Thoughtful, layered interiors for homes and workspaces across Hyderabad and South India. Residential interiors, modular kitchens, wardrobes and commercial design.",
  seoKeywords: [
    "interior designer Hyderabad",
    "luxury interior design",
    "residential interiors",
    "modular kitchens",
  ],
  ogImage: null,
};

export const demoProjects: Project[] = [
  {
    id: "project-courtyard",
    slug: "the-courtyard-house",
    title: "The Courtyard House",
    subtitle: "A family home wrapped around light, air, and a beloved old mango tree.",
    description:
      "A four-bedroom family home in Jubilee Hills where an existing courtyard became the quiet heart of the plan. Warm plaster, teak, linen, and hand-cut stone bring a sense of calm to everyday family life.",
    story:
      "The family had lived on this plot for nearly three decades. They wanted a home that remembered its past but could hold a new generation. We kept the original mango tree and re-planned the ground floor around an inward-looking courtyard, pulling light deep into the living and dining rooms.\n\nThe palette is deliberately quiet: lime-washed walls, aged teak, unpolished Kota stone, and ivory linen. Custom pieces sit alongside heirloom furniture the family already owned. In the kitchen, a generous island became the new centre of gravity — a place for homework, filter coffee, and late-night conversations.\n\nThe result is a home that feels both familiar and entirely new. Not a showpiece, but a place to live.",
    category: "Residential",
    location: "Jubilee Hills, Hyderabad",
    style: "Contemporary Indian",
    year: "2024",
    coverImage: image("photo-1600210492486-724fe5c67fb0"),
    beforeImage: image("photo-1600585154340-be6161a56a0c"),
    afterImage: image("photo-1600210492486-724fe5c67fb0"),
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "ci-1",
        url: image("photo-1600607687939-ce8a6c25118c"),
        alt: "Sunlit living room with linen sofas and natural stone flooring",
        sortOrder: 1,
      },
      {
        id: "ci-2",
        url: image("photo-1616486338812-3dadae4b4ace"),
        alt: "Layered living room with warm textures and curated art",
        sortOrder: 2,
      },
      {
        id: "ci-3",
        url: image("photo-1615874694520-474822394e73"),
        alt: "Minimal lounge opening onto a planted courtyard",
        sortOrder: 3,
      },
      {
        id: "ci-4",
        url: image("photo-1600566753086-00f18fb6b3ea"),
        alt: "Dining space with timber furniture and sculptural lighting",
        sortOrder: 4,
      },
    ],
  },
  {
    id: "project-sandstone",
    slug: "sandstone-serenity",
    title: "Sandstone Serenity",
    subtitle: "A tactile, wabi-sabi apartment for a collector and her books.",
    description:
      "A serene three-bedroom apartment in Banjara Hills designed around a growing collection of art, ceramics, and first editions.",
    story:
      "Our client is a publisher who wanted a home that felt like a retreat from the city — a place with fewer things, but better ones. We reworked the apartment's cramped entry into a generous gallery hall and used lime plaster, cane, and sandstone to create a soft, tactile backdrop for her collection.\n\nBuilt-in oak shelving runs the length of the living room, interrupted by a low window seat and a single, sculptural reading chair. The kitchen was opened up without losing function, and the primary bedroom was kept deliberately spare. Every object in the home was either inherited, collected, or made by a craftsperson we know by name.",
    category: "Apartment",
    location: "Banjara Hills, Hyderabad",
    style: "Wabi-sabi",
    year: "2023",
    coverImage: image("photo-1618221195710-dd6b41faaea6"),
    beforeImage: null,
    afterImage: null,
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "ci-5",
        url: image("photo-1616486338812-3dadae4b4ace"),
        alt: "Textured plaster wall and oak shelving in a collector's apartment",
        sortOrder: 1,
      },
      {
        id: "ci-6",
        url: image("photo-1618221195710-dd6b41faaea6"),
        alt: "Calm bedroom with natural linen bedding",
        sortOrder: 2,
      },
      {
        id: "ci-7",
        url: image("photo-1586023492125-27b2c045efd7"),
        alt: "Sculptural chair and ceramic collection in soft daylight",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "project-reading-room",
    slug: "the-reading-room",
    title: "The Reading Room",
    subtitle: "A compact city apartment made generous through light and joinery.",
    description:
      "A two-bedroom apartment in Kondapur where smart storage and a muted palette create space to breathe.",
    story:
      "At just under 1,200 square feet, this apartment needed to work hard. The brief: room for two people, a home office, a serious cook's kitchen, and a quiet corner for reading. We used full-height oak joinery to absorb storage, then kept every other surface as calm as possible.\n\nA fluted glass partition separates the study from the living room without blocking light. The kitchen is small but beautifully resolved, with a slim quartz counter, open brass shelving, and a dedicated coffee station. The bedroom palette shifts to warm taupe and clay for a slower, softer feel.",
    category: "Apartment",
    location: "Kondapur, Hyderabad",
    style: "Modern classic",
    year: "2024",
    coverImage: image("photo-1556228453-efd6c1ff04f6"),
    beforeImage: null,
    afterImage: null,
    featured: true,
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "ci-8",
        url: image("photo-1556228453-efd6c1ff04f6"),
        alt: "Compact living room with warm oak joinery and soft seating",
        sortOrder: 1,
      },
      {
        id: "ci-9",
        url: image("photo-1600607687920-4e2a09cf159d"),
        alt: "Open living and dining area with refined detailing",
        sortOrder: 2,
      },
      {
        id: "ci-10",
        url: image("photo-1519710164239-da123dc03ef4"),
        alt: "Quiet reading corner with textured walls",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "project-oak-kitchen",
    slug: "oak-and-ivory-kitchen",
    title: "Oak & Ivory Kitchen",
    subtitle: "A modular kitchen designed for a family that cooks together.",
    description:
      "A warm, hard-working kitchen in Kokapet with an oak island, fluted cabinetry, and a dedicated baking zone.",
    story:
      "This kitchen belongs to a family of enthusiastic cooks. The design needed to accommodate three people working at once, a serious collection of cookware, and a love of baking. We planned the room around a central island with a prep sink and a lowered baking counter, then wrapped the walls in full-height cabinetry.\n\nFluted oak doors bring warmth without visual noise. Brass hardware, a hand-glazed backsplash, and a slim pantry with pull-out drawers add function and character. A small banquette by the window became the family's favourite breakfast spot.",
    category: "Kitchen",
    location: "Kokapet, Hyderabad",
    style: "Warm minimal",
    year: "2024",
    coverImage: image("photo-1600585154526-990dced4db0d"),
    beforeImage: null,
    afterImage: null,
    featured: false,
    published: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "ci-11",
        url: image("photo-1600585154526-990dced4db0d"),
        alt: "Oak and ivory modular kitchen with a large island",
        sortOrder: 1,
      },
      {
        id: "ci-12",
        url: image("photo-1600566752355-35792bedcfea"),
        alt: "Kitchen detail with brass hardware and fluted timber",
        sortOrder: 2,
      },
      {
        id: "ci-13",
        url: image("photo-1600573472592-401b489a3cdc"),
        alt: "Breakfast nook beside a bright kitchen window",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "project-meridian",
    slug: "meridian-workspace",
    title: "Meridian Workspace",
    subtitle: "A calm, residential-feeling office for a boutique advisory firm.",
    description:
      "A 4,000 sq ft workspace in Hitec City that borrows the warmth of home for a team that spends long days at work.",
    story:
      "The brief was simple: make the office feel less like an office. The firm wanted a space that would welcome clients, support focused work, and feel humane at 8 pm. We organised the floor around a central pantry and lounge, then bracketed it with meeting rooms, quiet booths, and open workstations.\n\nMaterials are warm and familiar — oak, bouclé, linen, and terracotta — while acoustic felt and felt-wrapped panels keep the open plan comfortable. A long library table doubles as a town-hall space. Plants, good lamps, and a properly stocked pantry do the rest.",
    category: "Commercial",
    location: "Hitec City, Hyderabad",
    style: "Warm modern",
    year: "2023",
    coverImage: image("photo-1497366754035-f200968a6e72"),
    beforeImage: null,
    afterImage: null,
    featured: true,
    published: true,
    sortOrder: 5,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "ci-14",
        url: image("photo-1497366754035-f200968a6e72"),
        alt: "Warm contemporary office lounge with timber and plants",
        sortOrder: 1,
      },
      {
        id: "ci-15",
        url: image("photo-1524758631624-e2822e304c36"),
        alt: "Open office with natural light and considered furniture",
        sortOrder: 2,
      },
      {
        id: "ci-16",
        url: image("photo-1497366811353-6870744d04b2"),
        alt: "Meeting room with soft acoustic finishes",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "project-linen-suite",
    slug: "the-linen-suite",
    title: "The Linen Suite",
    subtitle: "A quiet, textural primary suite designed for rest.",
    description:
      "A layered bedroom and bath in Gachibowli using linen, lime plaster, and warm timber to create a restful retreat.",
    story:
      "This client asked for one thing above all: a room she could truly rest in. We removed the visual noise — no television, no heavy drapes, no glossy surfaces — and built the room around texture and light.\n\nLime plaster walls in a soft clay tone meet a bed dressed entirely in washed linen. A slim oak bench, a pair of ceramic lamps, and a hand-knotted rug keep things spare but warm. The adjoining bath continues the palette with a freestanding tub, a stone basin, and brushed brass fittings.",
    category: "Bedroom",
    location: "Gachibowli, Hyderabad",
    style: "Tranquil contemporary",
    year: "2022",
    coverImage: image("photo-1616594039964-ae9021a400a0"),
    beforeImage: null,
    afterImage: null,
    featured: false,
    published: true,
    sortOrder: 6,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "ci-17",
        url: image("photo-1616594039964-ae9021a400a0"),
        alt: "Linen-dressed bed in a calm lime plaster bedroom",
        sortOrder: 1,
      },
      {
        id: "ci-18",
        url: image("photo-1618220179428-22790b461013"),
        alt: "Soft neutral bedroom with warm timber accents",
        sortOrder: 2,
      },
      {
        id: "ci-19",
        url: image("photo-1600607688969-a5bfcd646154"),
        alt: "Spa-like bathroom with stone surfaces and brass fittings",
        sortOrder: 3,
      },
    ],
  },
];

export const demoServices: Service[] = [
  {
    id: "service-residential",
    slug: "residential-interiors",
    title: "Residential Interiors",
    shortDescription:
      "Full-home design that brings architecture, interiors, and the way you live into one considered whole.",
    description:
      "From a single apartment to a multi-generational home, we design spaces that feel effortless to live in. Our residential service covers spatial planning, custom joinery, material palettes, lighting, furniture, and styling — delivered as one cohesive vision.\n\nWe begin with a long conversation about how you live, then translate it into drawings, samples, and a detailed budget. Once on site, our team manages every trade and every finish, so you have one point of contact from the first sketch to the final cushion.",
    image: image("photo-1600210492486-724fe5c67fb0"),
    published: true,
    sortOrder: 1,
  },
  {
    id: "service-living",
    slug: "living-room-design",
    title: "Living Rooms",
    shortDescription:
      "Gathering spaces layered with texture, art, and furniture chosen to be lived in — not just looked at.",
    description:
      "The living room is where a home comes together. We design rooms that can host a crowd on Sunday and feel intimate on a quiet Tuesday. Our approach balances generous seating with personal objects, warm lighting, and materials that age gracefully.\n\nWhether you love a minimal, gallery-like calm or a layered, collected look, we build the room around your art, your books, and the way your family actually uses the space.",
    image: image("photo-1616486338812-3dadae4b4ace"),
    published: true,
    sortOrder: 2,
  },
  {
    id: "service-bedrooms",
    slug: "bedroom-interiors",
    title: "Bedrooms",
    shortDescription:
      "Restful, deeply personal retreats with soft palettes, layered lighting, and beautiful storage.",
    description:
      "A good bedroom should help you slow down. We design with texture, light, and quiet in mind — from the position of the bed to the feel of the bedside table under your hand.\n\nOur bedroom work includes custom wardrobes, upholstered beds, window treatments, reading corners, and ensuite bathrooms. Every element is chosen for comfort first, beauty second, because in a bedroom the two are inseparable.",
    image: image("photo-1616594039964-ae9021a400a0"),
    published: true,
    sortOrder: 3,
  },
  {
    id: "service-kitchens",
    slug: "modular-kitchens",
    title: "Modular Kitchens",
    shortDescription:
      "Hard-working kitchens with bespoke joinery, intelligent storage, and a warm, human heart.",
    description:
      "We plan kitchens around real cooking — the way you chop, store, bake, and gather. Every layout is tested for workflow, every drawer specified for what will live inside it.\n\nOur kitchens combine bespoke cabinetry with durable, honest materials: solid timber, quartz, stone, brass, and hand-glazed tile. We coordinate appliances, plumbing, and lighting so the finished room works as beautifully as it looks.",
    image: image("photo-1600585154526-990dced4db0d"),
    published: true,
    sortOrder: 4,
  },
  {
    id: "service-wardrobes",
    slug: "wardrobes-and-storage",
    title: "Wardrobes & Storage",
    shortDescription:
      "Quietly efficient storage that makes everyday life feel easier and every room feel calmer.",
    description:
      "Storage is the invisible architecture of a calm home. We design wardrobes, walk-ins, entryway storage, and built-ins that disappear into the room while doing a serious job behind closed doors.\n\nFrom internal drawer planning to the perfect handle and paint finish, every detail is considered. The result is more space, less visual noise, and a home that is easier to keep beautiful.",
    image: image("photo-1600566753086-00f18fb6b3ea"),
    published: true,
    sortOrder: 5,
  },
  {
    id: "service-office",
    slug: "office-and-commercial",
    title: "Office & Commercial",
    shortDescription:
      "Warm, brand-led workspaces that support focus, collaboration, and a genuinely good day at work.",
    description:
      "We design offices, studios, clinics, and boutique retail spaces that feel welcoming without losing function. Our commercial work balances brand expression with acoustic comfort, practical circulation, and durable materials.\n\nFrom a 600 sq ft studio to a 10,000 sq ft headquarters, we can act as the single interior partner — planning, design, detailing, and execution — with minimal disruption to your business.",
    image: image("photo-1497366754035-f200968a6e72"),
    published: true,
    sortOrder: 6,
  },
  {
    id: "service-renovation",
    slug: "home-renovation",
    title: "Renovation",
    shortDescription:
      "Sensitive, end-to-end renovations that bring older homes into a new chapter without erasing their character.",
    description:
      "Renovating a lived-in home takes patience, planning, and a good team. We assess what is worth keeping, what needs fixing, and how to add light, storage, and flow without losing the soul of the original space.\n\nOur renovation service covers design, structural coordination, waterproofing, services, finishes, and styling. We plan in phases to keep disruption manageable, with clear timelines and transparent costs throughout.",
    image: image("photo-1600585154340-be6161a56a0c"),
    published: true,
    sortOrder: 7,
  },
];

export const demoProducts: Product[] = [
  {
    id: "product-aranya-chair",
    slug: "aranya-lounge-chair",
    name: "Aranya Lounge Chair",
    category: "Seating",
    description:
      "A low-slung lounge chair with a solid teak frame and hand-woven cane back. Designed for long afternoons with a book, the Aranya pairs a generous seat with a gently reclined back and an oiled, tactile finish.",
    price: 48500,
    priceOnRequest: false,
    material: "Solid teak, hand-woven cane, linen-blend upholstery",
    dimensions: 'W 74 cm × D 82 cm × H 78 cm, seat height 42 cm',
    color: "Natural cane / ivory linen",
    leadTime: "4–6 weeks",
    coverImage: image("photo-1567538096630-e0c55bd6374c", 1400),
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-1",
        url: image("photo-1567538096630-e0c55bd6374c", 1400),
        alt: "Aranya lounge chair in cane and teak",
        sortOrder: 1,
      },
      {
        id: "pi-2",
        url: image("photo-1592078615290-033ee584e267", 1400),
        alt: "Detail of natural cane weaving on the Aranya chair",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "product-terra-sofa",
    slug: "terra-linen-sofa",
    name: "Terra Linen Sofa",
    category: "Seating",
    description:
      "Our most-loved sofa, reimagined in a heavyweight stonewashed linen. Deep seats, feather-wrapped cushions, and a low profile make Terra the room's quiet centre of gravity. Available in three lengths and a range of house fabrics.",
    price: 124000,
    priceOnRequest: false,
    material: "Kiln-dried hardwood, stonewashed linen, feather-wrapped foam",
    dimensions: 'W 240 cm × D 96 cm × H 76 cm',
    color: "Oat / clay / charcoal",
    leadTime: "6–8 weeks",
    coverImage: image("photo-1555041469-a586c61ea9bc", 1400),
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-3",
        url: image("photo-1555041469-a586c61ea9bc", 1400),
        alt: "Terra three-seater sofa in warm neutral linen",
        sortOrder: 1,
      },
      {
        id: "pi-4",
        url: image("photo-1556228453-efd6c1ff04f6", 1400),
        alt: "Terra sofa styled in a sunlit living room",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "product-halo-pendant",
    slug: "halo-pendant-light",
    name: "Halo Pendant Light",
    category: "Lighting",
    description:
      "A hand-spun brass pendant with a softly diffused glow. Halo is designed to sit low over a dining table or kitchen island, casting a warm pool of light without glare. Each shade is finished by hand, so no two are exactly alike.",
    price: 18900,
    priceOnRequest: false,
    material: "Hand-spun brass, opal glass diffuser, fabric cord",
    dimensions: "Ø 38 cm × H 24 cm, 2 m adjustable cord",
    color: "Aged brass / blackened brass",
    leadTime: "3–4 weeks",
    coverImage: image("photo-1540932239986-30128078f3c5", 1400),
    featured: true,
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-5",
        url: image("photo-1540932239986-30128078f3c5", 1400),
        alt: "Halo brass pendant light glowing above a table",
        sortOrder: 1,
      },
      {
        id: "pi-6",
        url: image("photo-1507473885765-e6ed057f782c", 1400),
        alt: "Warm pendant lighting in a quiet interior",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "product-kota-table",
    slug: "kota-side-table",
    name: "Kota Side Table",
    category: "Tables",
    description:
      "A small, sculptural side table carved from a single block of Kota stone. The raw, honed edge and soft cylindrical form bring a little quiet drama beside a sofa or bed.",
    price: 26400,
    priceOnRequest: false,
    material: "Solid Kota stone, natural honed finish",
    dimensions: "Ø 42 cm × H 46 cm",
    color: "Grey-green stone",
    leadTime: "2–3 weeks",
    coverImage: image("photo-1494438639946-1ebd1d20bf85", 1400),
    featured: true,
    published: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-7",
        url: image("photo-1494438639946-1ebd1d20bf85", 1400),
        alt: "Kota stone side table styled with ceramic objects",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "product-dune-rug",
    slug: "dune-wool-rug",
    name: "Dune Wool Rug",
    category: "Rugs & Textiles",
    description:
      "A hand-knotted wool rug with a subtle, undulating pile inspired by wind-blown sand. Dune is woven in small batches by artisans in Bhadohi, using natural undyed wool for a soft, tonal finish.",
    price: 72000,
    priceOnRequest: false,
    material: "100% hand-knotted wool, cotton warp",
    dimensions: "5 × 8 ft / 6 × 9 ft / 8 × 10 ft (made to order)",
    color: "Sand / oat",
    leadTime: "8–10 weeks",
    coverImage: image("photo-1600210491369-e753d80a41f3", 1400),
    featured: true,
    published: true,
    sortOrder: 5,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-8",
        url: image("photo-1600210491369-e753d80a41f3", 1400),
        alt: "Dune wool rug in a softly lit living room",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "product-kanso-console",
    slug: "kanso-oak-console",
    name: "Kanso Oak Console",
    category: "Storage",
    description:
      "A slim, low console in solid white oak with hand-cut finger joints and two shallow drawers. Kanso is designed for entryways and living rooms where storage should be felt, not seen.",
    price: 86000,
    priceOnRequest: false,
    material: "Solid white oak, brass pulls, natural hard-wax oil",
    dimensions: "W 160 cm × D 38 cm × H 72 cm",
    color: "Natural oak",
    leadTime: "6–8 weeks",
    coverImage: image("photo-1594026112284-02bb6f3352fe", 1400),
    featured: false,
    published: true,
    sortOrder: 6,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-9",
        url: image("photo-1594026112284-02bb6f3352fe", 1400),
        alt: "Kanso oak console with brass detailing",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "product-sienna-vase",
    slug: "sienna-ceramic-vase",
    name: "Sienna Ceramic Vase",
    category: "Decor",
    description:
      "A hand-thrown stoneware vase in a warm, reactive glaze. Made in a small studio near Pondicherry, each piece carries subtle variations in tone and texture. Beautiful empty, even better with a few branches.",
    price: 6800,
    priceOnRequest: false,
    material: "Hand-thrown stoneware, food-safe reactive glaze",
    dimensions: "Ø 18 cm × H 32 cm",
    color: "Sienna / chalk",
    leadTime: "In stock",
    coverImage: image("photo-1578500494198-246f612d3b3d", 1400),
    featured: true,
    published: true,
    sortOrder: 7,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-10",
        url: image("photo-1578500494198-246f612d3b3d", 1400),
        alt: "Sienna handmade ceramic vase",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "product-loom-cushions",
    slug: "loom-cushion-set",
    name: "Loom Cushion Set",
    category: "Rugs & Textiles",
    description:
      "A set of three cushion covers in handwoven cotton and linen, finished with a concealed zip. The tonal palette of chalk, oat, and clay is designed to layer effortlessly with our upholstery fabrics.",
    price: 4200,
    priceOnRequest: false,
    material: "Handwoven cotton-linen, concealed zip",
    dimensions: "45 × 45 cm (set of 3)",
    color: "Chalk / oat / clay",
    leadTime: "In stock",
    coverImage: image("photo-1543248939-ff40856f65d4", 1400),
    featured: false,
    published: true,
    sortOrder: 8,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-11",
        url: image("photo-1543248939-ff40856f65d4", 1400),
        alt: "Loom cushion set in layered neutral tones",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "product-brass-mirror",
    slug: "arc-brass-mirror",
    name: "Arc Brass Mirror",
    category: "Decor",
    description:
      "A simple, beautifully proportioned mirror with a slim brass frame. Arc works above a console, in a bathroom, or leaning in a corner to bring another layer of light into the room.",
    price: null,
    priceOnRequest: true,
    material: "Solid brass frame, 5 mm float glass",
    dimensions: "W 90 cm × H 120 cm (custom sizes available)",
    color: "Antique brass",
    leadTime: "Made to order",
    coverImage: image("photo-1600607687939-ce8a6c25118c", 1400),
    featured: false,
    published: true,
    sortOrder: 9,
    createdAt: now,
    updatedAt: now,
    images: [
      {
        id: "pi-12",
        url: image("photo-1600607687939-ce8a6c25118c", 1400),
        alt: "Slim brass Arc mirror in a warm entryway",
        sortOrder: 1,
      },
    ],
  },
];

export const demoTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Aishwarya & Rohan Mehta",
    quote:
      "We were nervous about doing up our first home. Ananya and the team made it feel completely effortless — they listened to how we actually live, then gave us a home that is somehow even calmer than we imagined. Every detail feels considered, and the house just works.",
    location: "Jubilee Hills, Hyderabad",
    project: "The Courtyard House",
    rating: 5,
    published: true,
    sortOrder: 1,
  },
  {
    id: "testimonial-2",
    name: "Dr. Sneha Reddy",
    quote:
      "I wanted a bedroom I could switch off in, and they understood immediately. The room is soft, quiet, and beautiful without feeling precious. They were honest about budget, brilliant with storage, and genuinely lovely to work with.",
    location: "Gachibowli, Hyderabad",
    project: "The Linen Suite",
    rating: 5,
    published: true,
    sortOrder: 2,
  },
  {
    id: "testimonial-3",
    name: "Vikram & Priya Kapoor",
    quote:
      "The kitchen is now the heart of our home. Three of us can cook together without stepping on each other, and it still looks elegant. The joinery is beautiful, the timeline was honoured, and the after-care has been exceptional.",
    location: "Kokapet, Hyderabad",
    project: "Oak & Ivory Kitchen",
    rating: 5,
    published: true,
    sortOrder: 3,
  },
];

export const demoFaqs: Faq[] = [
  {
    id: "faq-1",
    question: "What kind of projects do you take on?",
    answer:
      "We design full homes, apartments, villas, and select commercial spaces. Most of our work is residential, covering interiors, modular kitchens, wardrobes, furniture, lighting, and styling. We also take on smaller projects when the fit is right.",
    category: "Working with us",
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "faq-2",
    question: "How long does a project take?",
    answer:
      "A single room typically takes 6 to 10 weeks. A full home usually takes 4 to 7 months, depending on scope, site readiness, and material lead times. We share a detailed timeline before work begins and update you every week.",
    category: "Process",
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "faq-3",
    question: "Do you work outside Hyderabad?",
    answer:
      "Yes. We regularly work across South India, including Bengaluru, Vijayawada, and Visakhapatnam. For projects outside Hyderabad, travel and site coordination are included in the estimate.",
    category: "Working with us",
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "faq-4",
    question: "Can I use my existing furniture?",
    answer:
      "Absolutely. We love working with pieces that already mean something to you. We will assess what stays, what can be restored, and where a new piece would make a real difference.",
    category: "Design",
    published: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "faq-5",
    question: "How do you charge for design?",
    answer:
      "We charge a design fee based on the scope and size of the project, along with a project management fee for execution. You receive a clear, itemised estimate before we begin, with no hidden mark-ups.",
    category: "Fees",
    published: true,
    sortOrder: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "faq-6",
    question: "Can I buy products without a full design project?",
    answer:
      "Yes. Our collection is available for individual purchases, and we are happy to help with selection. For larger pieces, we can arrange delivery within Hyderabad and share lead times before you order.",
    category: "Products",
    published: true,
    sortOrder: 6,
    createdAt: now,
    updatedAt: now,
  },
];

export const demoLocationPages: LocationPage[] = [
  {
    id: "location-hyderabad",
    slug: "hyderabad",
    city: "Hyderabad",
    region: "Telangana",
    title: "Interior Designers in Hyderabad",
    intro:
      "A Hyderabad studio for thoughtful homes, apartments, and workspaces — designed around the way you actually live.",
    content:
      "## A studio rooted in Hyderabad\nOur studio is in Jubilee Hills, and most of our residential work is across Hyderabad — from apartments in Gachibowli and Kokapet to family homes in Banjara Hills and Jubilee Hills. Being close to our projects matters: it lets us visit the site, meet our makers, and solve the small decisions that make a room feel resolved.\n\n## What we design\nWe take on full-home interiors, single-room transformations, modular kitchens, wardrobes and storage, home offices, and select commercial spaces. Every project begins with a conversation about routines, light, storage, and the way you want to feel at home.\n\n## How we work in the city\nOur process combines spatial planning, material selection, bespoke joinery, lighting, and site coordination. For Hyderabad homes, we plan around local light, dust, and summer heat as carefully as we plan around furniture. The result should be beautiful, but it should also be easy to live in.\n\n## Visit the studio\nIf you are considering a project, start with a conversation. We can meet at the Jubilee Hills studio by appointment, or begin with a call and a site visit.",
    image: image("photo-1600210492486-724fe5c67fb0", 1800),
    seoTitle: "Interior Designers in Hyderabad | Ivory & Oak",
    seoDescription:
      "Ivory & Oak is a Hyderabad interior design studio creating considered homes, modular kitchens, wardrobes, and workspaces across the city.",
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "location-bengaluru",
    slug: "bengaluru",
    city: "Bengaluru",
    region: "Karnataka",
    title: "Interior Designers for Bengaluru Homes",
    intro:
      "Considered residential interiors for Bengaluru apartments and homes, delivered with the same studio-led care as our Hyderabad projects.",
    content:
      "## Designing across Bengaluru\nWe work with a limited number of Bengaluru clients each year, usually for full-home interiors and larger apartment renovations. Projects are led from our Hyderabad studio, with planned site visits and close coordination with local execution partners.\n\n## A calm counterpoint to a busy city\nBengaluru homes often need to work hard: a place to host, a place to focus, and a place to switch off. We use warm materials, thoughtful storage, and layered lighting to make compact footprints feel generous without filling every corner.\n\n## Scope and process\nWe can lead the complete design and execution process, or work alongside your architect or contractor on interiors, joinery, kitchens, and styling. Before we begin, we agree the scope, visit schedule, and communication rhythm so that distance never becomes a reason for guesswork.\n\n## Starting a project\nShare your location, the size of the home, and what you are hoping to change. We will tell you honestly whether we are the right fit and what the next step looks like.",
    image: image("photo-1616486338812-3dadae4b4ace", 1800),
    seoTitle: "Interior Designers for Bengaluru Homes | Ivory & Oak",
    seoDescription:
      "Studio-led interior design for Bengaluru apartments and homes, including full-home interiors, kitchens, joinery, lighting, and styling.",
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
];

export const demoPages: ContentPage[] = [
  {
    id: "page-privacy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    excerpt: "How Ivory & Oak collects, uses, and protects your information.",
    content:
      "## Information we collect\nWe collect the details you share when you contact us or send an inquiry, including your name, phone number, email address, and message. If you browse the site, we may also receive basic technical information such as your browser type and pages visited.\n\n## How we use it\nWe use your information to respond to inquiries, prepare estimates, deliver our services, and improve the website. We do not sell your personal information.\n\n## Sharing\nWe share information only with trusted team members and service providers who help us run the studio and the website, and only where necessary.\n\n## Retention\nWe keep inquiry records for as long as needed to manage our relationship and meet legal obligations.\n\n## Your choices\nYou can ask us to update or delete your information by emailing studio@ivoryandoak.in.\n\n## Analytics and cookies\nIf analytics is enabled for this site, we use it to understand which pages are useful and to improve the experience. Analytics providers may set cookies or similar identifiers. You can block or delete cookies in your browser settings; the website will still work.\n\n## Updates\nWe may update this policy from time to time. The latest version will always be available on this page.",
    seoTitle: "Privacy Policy | Ivory & Oak",
    seoDescription:
      "How Ivory & Oak collects, uses, and protects personal information shared through the website and studio inquiries.",
    published: true,
    showInFooter: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "page-terms",
    slug: "terms-of-use",
    title: "Terms of Use",
    excerpt: "The terms that apply when you use the Ivory & Oak website.",
    content:
      "## Using this website\nThe content on this website is provided for general information about Ivory & Oak and our work. By using the site, you agree to use it lawfully and not to interfere with its operation.\n\n## Project information\nImages, finishes, and prices shown on the site are indicative. Every project is quoted individually after we understand the scope, site, and materials.\n\n## Products\nProduct availability, finishes, and lead times may change. An order is confirmed only after we have agreed the details and payment terms in writing.\n\n## Intellectual property\nAll text, images, and designs on this site belong to Ivory & Oak or are used with permission. Please do not reproduce them without written consent.\n\n## Contact\nQuestions about these terms can be sent to studio@ivoryandoak.in.",
    seoTitle: "Terms of Use | Ivory & Oak",
    seoDescription:
      "Terms of use for the Ivory & Oak interior design studio website, including project information, products, and intellectual property.",
    published: true,
    showInFooter: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
];

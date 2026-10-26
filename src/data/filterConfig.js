
/* =========================================================
   FILTER CONFIG — one entry per product type

   Each config is { groups, price }.

   groups  the filter groups, in the order they are shown
     key            unique id of the group
                    (also the URL query name: /eyeglasses?shape=Round)
     title          heading shown above the options
     type           "checkbox" (default) or "price"
     options        the choices (checkbox groups)
     getValues      (product) => array of values the product has for
                    this group. A product matches when one of its
                    values equals a selected option.
     aliases        { "Option label": ["other spelling", ...] } extra
                    values that should count as that option
     defaultOpen    open on first load (default true)
     searchable     show a search box (long lists such as brands)
     searchLabel / searchPlaceholder / emptyText   search wording
     scroll         limit the list height and scroll inside it
     display        "list" (default) or "pills" (short options, e.g. sizes)
     swatches       { "Option label": "#hex" } colour dot beside options
     chipLabel      (value) => text used on the "selected" chip

   price   the price slider
     min / max      numbers, or "auto" to use the lowest / highest
                    product price
     step           slider step
     minGap         smallest allowed distance between min and max
     maxSuffix      text after the top price when it is "no limit"
                    (e.g. "+")
========================================================= */

const getPrice = (product) => Number(product.price ?? product.salePrice ?? 0);

/* =========================================================
   CONTACT LENSES
========================================================= */

export const CONTACT_LENS_FILTERS = {
  groups: [
    {
      key: "brand",
      title: "Brand",
      options: [
        "Acuvue",
        "Air Optix",
        "Aspire",
        "Bausch + Lomb",
        "Biofinity",
        "Biomedics",
        "Biotrue",
        "Dailies",
        "FreshLook",
        "Iconnect",
        "Lacelle",
        "MyDay",
        "Optima",
        "Precision1",
        "Proclear",
        "PureVision",
        "SofLens",
        "Ultra",
      ],

      // Treat "Precision" as an alias for the "Precision1" option.
      aliases: {
        Precision1: ["Precision"],
      },

      getValues: (product) => [product.brand],
      defaultOpen: true,
      searchable: true,
      searchLabel: "Search brand",
      searchPlaceholder: "Search brand",
      emptyText: "No brands found",
      scroll: true,
    },
    {
      key: "lensType",
      title: "Lens Type",
      options: ["Spherical", "Toric", "Multifocal", "Color"],
      getValues: (product) => [product.type, product.isColor ? "Color" : ""],
      defaultOpen: false,
    },
    {
      key: "schedule",
      title: "Replacement Schedule",
      options: [
        "Daily Disposable",
        "Weekly Disposable",
        "Monthly Disposable",
      ],
      getValues: (product) => [product.replacementSchedule],
      defaultOpen: false,
    },
    {
      key: "manufacturer",
      title: "Manufacturer",
      options: [
        "Johnson & Johnson",
        "Alcon",
        "CooperVision",
        "Bausch + Lomb",
        "Aspire",
        "Iconnect",
        "Lacelle",
      ],
      getValues: (product) => [product.manufacturer],
      defaultOpen: false,
    },
    {
      key: "price",
      type: "price",
      title: "Price Range",
      defaultOpen: true,
    },
  ],

  price: {
    min: "auto",
    max: "auto",
    step: 1,
    minGap: 0,
    getPrice,
  },
};

/* =========================================================
   EYEGLASSES + SUNGLASSES
   (shared options first, then each type)
========================================================= */

const CATEGORIES = ["Men", "Women", "Kids"];

const SHAPES = [
  "Rectangle",
  "Round",
  "Square",
  "Oval",
  "Cat-Eye",
  "Geometric",
  "Aviator",
];

const COLORS = [
  "Black",
  "Brown",
  "Tortoise",
  "Crystal",
  "Gold",
  "Silver",
  "Blue",
];

const MATERIALS = ["Acetate", "Metal", "TR90", "Titanium"];

const FRAME_SIZES = ["XS", "S", "M", "L", "XL"];

/* eyeglasses "Shop by Types" (names match the navbar labels) */
const EYEGLASS_TYPES = [
  "Computer / Blue Light",
  "Single Vision",
  "Progressive / Multifocal",
  "Reading Glasses",
  "Anti-Fatigue",
  "Light Responsive",
  "Zero Power",
];

/* sunglasses "Shop by Types" (names match the navbar labels) */
const SUNGLASS_TYPES = [
  "Polarized",
  "Performance Polarized",
  "Tinted",
  "Prescription (Power)",
  "Progressives",
  "Zero Power",
];

const BRANDS = [
  "Alain Mikli",
  "Armani Exchange",
  "Arnette",
  "Bliz",
  "Bolon",
  "Brooks Brothers",
  "Brunello Cucinelli",
  "Burberry",
  "Chanel",
  "Coach",
  "Costa",
  "DbyD",
  "Diesel",
  "Dolce & Gabbana",
  "EA7 Emporio Armani",
  "Emporio Armani",
  "Fedon",
  "Ferrari",
  "Foster Grant",
  "Giorgio Armani",
  "Jimmy Choo",
  "Luxottica",
  "Michael Kors",
  "Miu Miu",
  "Molsion",
  "Moncler",
  "Native Eyewear",
  "Oakley",
  "Oliver Peoples",
  "Persol",
  "Polo Ralph Lauren",
  "Prada",
  "Prada Linea Rossa",
  "Ralph Lauren",
  "Ralph (Ralph Lauren Eyewear)",
  "Ray-Ban",
  "Scuderia Ferrari",
  "Seen",
  "Sferoflex",
  "Swarovski",
  "Tiffany & Co.",
  "Tory Burch",
  "Unofficial",
  "Versace",
  "Vogue Eyewear",
];

/* colour dots shown next to the colour names */
const FRAME_COLOR_SWATCHES = {
  Black: "#222222",
  Brown: "#795548",
  Tortoise: "#8b5e3c",
  Crystal: "#dbe7ea",
  Gold: "#c8a951",
  Silver: "#c0c4c8",
  Blue: "#3b6ea5",
};

/* ---------- shared groups ---------- */

const categoryGroup = {
  key: "category",
  title: "Category",
  options: CATEGORIES,
  getValues: (product) => [product.category],
  defaultOpen: true,
};

const brandGroup = {
  key: "brand",
  title: "Brands",
  options: BRANDS,
  getValues: (product) => [product.brand],

  /* the product data says "Vogue", the filter says "Vogue Eyewear" */
  aliases: {
    "Vogue Eyewear": ["Vogue"],
  },

  defaultOpen: false,
  searchable: true,
  searchLabel: "Search brands",
  searchPlaceholder: "Type a brand name...",
  emptyText: "No brands match your search.",
  scroll: true,
};

const shapeGroup = {
  key: "shape",
  title: "Frame Shape",
  options: SHAPES,
  getValues: (product) => [product.shape],
  defaultOpen: true,
};

const colorGroup = {
  key: "color",
  title: "Frame Color",
  options: COLORS,
  getValues: (product) => product.colors || [],
  swatches: FRAME_COLOR_SWATCHES,
  defaultOpen: true,
};

const materialGroup = {
  key: "material",
  title: "Material",
  options: MATERIALS,
  getValues: (product) => [product.material],
  defaultOpen: true,
};

const priceGroup = {
  key: "price",
  type: "price",
  title: "Price",
  defaultOpen: true,
};

const sizeGroup = {
  key: "size",
  title: "Frame Size",
  options: FRAME_SIZES,
  getValues: (product) => [product.frameSize],
  display: "pills",
  chipLabel: (value) => `Size ${value}`,
  defaultOpen: true,
};

const GLASSES_PRICE = {
  min: 0,
  max: 5000,
  step: 100,
  minGap: 100,
  maxSuffix: "+",
  getPrice,
};

/* ---------- eyeglasses-only groups ---------- */

/* category: also New Arrivals + Bestsellers (navbar links) */
const eyeglassesCategoryGroup = {
  ...categoryGroup,
  options: [...CATEGORIES, "New Arrivals", "Bestsellers"],
  getValues: (product) => [
    product.category,
    product.isNew || product.badge === "New" ? "New Arrivals" : "",
    product.bestseller ? "Bestsellers" : "",
  ],
};

/* each product needs types: ["Single Vision", ...] */
const typeGroup = {
  key: "type",
  title: "Lens Type",
  options: EYEGLASS_TYPES,
  getValues: (product) => product.types || [],
  defaultOpen: false,
};

/* ---------- sunglasses-only groups ---------- */

/* category: Men / Women / Kids + Sport, New Arrivals, Bestsellers */
const sunglassesCategoryGroup = {
  ...categoryGroup,
  options: [...CATEGORIES, "Sport", "New Arrivals", "Bestsellers"],
  getValues: (product) => [
    product.category,
    product.isNew || product.badge === "New" ? "New Arrivals" : "",
    product.bestseller ? "Bestsellers" : "",
  ],
};

/* each product needs types: ["Polarized", ...] */
const sunglassesTypeGroup = {
  key: "type",
  title: "Lens Type",
  options: SUNGLASS_TYPES,
  getValues: (product) => product.types || [],
  defaultOpen: false,
};

/* shapes + Wayfarer */
const sunglassesShapeGroup = {
  ...shapeGroup,
  options: [...SHAPES, "Wayfarer"],
};

/* =========================================================
   EXPORTS (keep these below all the groups above)
========================================================= */

export const EYEGLASSES_FILTERS = {
  groups: [
    eyeglassesCategoryGroup,
    typeGroup,
    brandGroup,
    shapeGroup,
    colorGroup,
    materialGroup,
    priceGroup,
    sizeGroup,
  ],
  price: GLASSES_PRICE,
};

export const SUNGLASSES_FILTERS = {
  groups: [
    sunglassesCategoryGroup,
    sunglassesTypeGroup,
    brandGroup,
    sunglassesShapeGroup,
    colorGroup,
    materialGroup,
    priceGroup,
    sizeGroup,
  ],
  price: GLASSES_PRICE,
};

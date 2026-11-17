/* page slug  ->  Shopify collection handle */
export const COLLECTION_HANDLES = {
  /* /brands/[slug] */
  brand: {
    acuvue: "acuvue",
    "air-optix": "air-optix",
    dailies: "dailies",
    freshlook: "freshlook",
    precision1: "precision",
    aspire: "aspire",
    biofinity: "biofinity",
    biotrue: "biotrue",
    biomedics: "biomedics",
    myday: "myday",
    proclear: "proclear",
    iconnect: "iconnect",
    lacelle: "lacelle",
    purevision: "purevision",
    soflens: "soflens",
    ultra: "ultra",
  },

  /* /lens-type/[slug]
     NOTE: Shopify me "Weekly" ka handle monthly-disposable-contact-lenses hai
     aur "Monthly" ka monthly-disposable-contact-lenses-1 (title ke hisaab se) */
  "lens-type": {
    daily: "daily-disposable-contact-lenses",
    weekly: "monthly-disposable-contact-lenses",
    monthly: "monthly-disposable-contact-lenses-1",
    color: "colour-contact-lenses",
    colour: "colour-contact-lenses",
    multifocal: "multifocal-contact-lenses-for-presbyopia",
    toric: "toric-contact-lenses-for-astigmatism",
  },

  /* /manufacturer/[slug] */
  manufacturer: {
    alcon: "alcon",
    "bausch-plus-lomb": "bausch-lomb",
    coopervision: "coopervision",
    "johnson-johnson": "acuvue",
  },
};

const PREFIX = { brand: "brand", "lens-type": "type", manufacturer: "manufacturer" };

export function getHandleCandidates(type, slug) {
  return [
    COLLECTION_HANDLES[type]?.[slug],
    `${PREFIX[type]}-${slug}`,
  ].filter(Boolean);
}
/* Page-wise content for brand / lens-type / manufacturer pages.
   Specific entries win. Anything missing uses the template below. */

const SPECIFIC = {
  "lens-type": {
    daily: {
      name: "Daily lenses",
      heading: "Buy daily disposable contact lenses online in India",
      intro:
        "Daily disposable lenses are worn once and thrown away, so you start every day with a fresh, clean pair. No cleaning, no solution and no case to carry.",
      details:
        "They suit occasional wearers, travellers and anyone with sensitive eyes. Check your power, base curve and diameter from your latest eye test before you order.",
      faqs: [
        { q: "Can I sleep in daily disposable lenses?", a: "No. Daily lenses are meant for one day of wear. Remove them at night and discard them." },
        { q: "Do daily lenses need cleaning solution?", a: "No. You open a fresh pair each day, so no solution or lens case is needed." },
        { q: "Are daily lenses good for dry eyes?", a: "Many people find them more comfortable because there is no deposit build-up. Ask your eye doctor which lens suits you." },
      ],
    },
  },
  brand: {},
  manufacturer: {
    alcon: {
      intro:
        "Alcon makes some of the most popular lenses in India, including the Air Optix and Dailies ranges.",
    },
  },
};

const TEMPLATES = {
  "lens-type": (name) => ({
    name: `${name} lenses`,
    heading: `Buy ${name} contact lenses online in India`,
    intro: `Browse ${name} contact lenses from top brands at LensMartIndia. Use the filters to narrow by brand, power and price.`,
    details:
      "Contact lenses need a valid prescription. Check your power, base curve and lens type from your latest eye test before you order.",
    faqs: [
      { q: `Who should wear ${name} lenses?`, a: `${name} lenses suit different needs and routines. Your eye doctor can tell you if they are right for your eyes.` },
      { q: "Do I need a prescription?", a: "Yes. Contact lenses need a valid prescription with power and base curve." },
      { q: "How do I look after my lenses?", a: "Wash your hands before handling lenses, never use tap water, and follow the replacement schedule on the pack." },
    ],
    brandsHeading: `Brands with ${name} lenses`,
    brandsNote: `Brands available in ${name} lenses`,
    brandField: "brand",
    brandType: "Brand",
    unit: "product",
  }),

  brand: (name) => ({
    name: `${name} lenses`,
    heading: `Buy ${name} contact lenses online in India`,
    intro: `Shop ${name} contact lenses at LensMartIndia. Compare packs, replacement schedules and prices in one place.`,
    details:
      "Contact lenses need a valid prescription. Check your power, base curve and lens type from your latest eye test before you order.",
    faqs: [
      { q: `Which ${name} lens should I choose?`, a: `It depends on your power and how often you wear lenses. Use the filters to compare the ${name} range by type and schedule.` },
      { q: `Do I need a prescription for ${name} lenses?`, a: "Yes. A valid prescription is required for all contact lenses." },
      { q: `How do I look after my ${name} lenses?`, a: "Follow the pack instructions, wash your hands before handling and replace lenses on schedule." },
    ],
    brandsHeading: "Manufacturer",
    brandsNote: `Who makes ${name}`,
    brandField: "manufacturer",
    brandType: "Organization",
    unit: "product",
  }),

  manufacturer: (name) => ({
    name,
    heading: `Buy ${name} contact lenses online in India`,
    intro: `Explore contact lenses made by ${name}. Compare brands, packs and prices at LensMartIndia.`,
    details:
      "Contact lenses need a valid prescription. Check your power, base curve and lens type from your latest eye test before you order.",
    faqs: [
      { q: `Which brands does ${name} make?`, a: `See the brands listed below. Each one has its own range of lens types and schedules.` },
      { q: `Are ${name} lenses genuine here?`, a: "Yes. LensMartIndia sells 100% genuine contact lenses." },
      { q: "Do I need a prescription?", a: "Yes. A valid prescription is required for all contact lenses." },
    ],
    brandsHeading: `${name} brands`,
    brandsNote: `Brands made by ${name}`,
    brandField: "brand",
    brandType: "Brand",
    unit: "product",
  }),
};

export function getCatalogContent(type, slug, name) {
  const base = TEMPLATES[type]?.(name || slug) || {};
  return { ...base, ...(SPECIFIC[type]?.[slug] || {}) };
}
const norm = (v) => String(v ?? "").toLowerCase().trim();

/* Shopify "Wear Schedule" values: Daily, 1-2 Weekly, Monthly, Quarterly, Yearly
   (older values like "Daily Disposable" also still match). */
export const LENS_TYPES = [
  {
    label: "Daily", slug: "daily", title: "Daily Disposable",
    group: "schedule", value: "Daily",
    match: (p) => /\bdaily\b/.test(norm(p.replacementSchedule)),
  },
  {
    label: "Weekly", slug: "weekly", title: "Weekly Disposable",
    group: "schedule", value: "1-2 Weekly",
    match: (p) => /\bweekly\b/.test(norm(p.replacementSchedule)),
  },
  {
    label: "Monthly", slug: "monthly", title: "Monthly Disposable",
    group: "schedule", value: "Monthly",
    match: (p) => /\bmonthly\b/.test(norm(p.replacementSchedule)),
  },
  {
    label: "Multifocal/Presbyopia", slug: "multifocal", title: "Multifocal",
    group: "lensType", value: "Multifocal",
    match: (p) => norm(p.type) === "multifocal",
  },
  {
    label: "Toric/Astigmatism", slug: "toric", title: "Toric",
    group: "lensType", value: "Toric",
    match: (p) => norm(p.type) === "toric",
  },
  {
    label: "Color", slug: "color", title: "Color",
    group: "lensType", value: "Colours",
    match: (p) => Boolean(p.isColor) || /^colou?rs?$/.test(norm(p.type)),
  },
];

export const findLensType = (slug) => LENS_TYPES.find((t) => t.slug === slug);
const norm = (v) => String(v ?? "").toLowerCase().trim();

export const LENS_TYPES = [
  {
    label: "Daily", slug: "daily", title: "Daily Disposable",
    group: "schedule", value: "Daily Disposable",
    match: (p) => norm(p.replacementSchedule) === "daily disposable",
  },
  {
    label: "Weekly", slug: "weekly", title: "Weekly Disposable",
    group: "schedule", value: "Weekly Disposable",
    match: (p) => norm(p.replacementSchedule) === "weekly disposable",
  },
  {
    label: "Monthly", slug: "monthly", title: "Monthly Disposable",
    group: "schedule", value: "Monthly Disposable",
    match: (p) => norm(p.replacementSchedule) === "monthly disposable",
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
    group: "lensType", value: "Color",
    match: (p) => Boolean(p.isColor) || norm(p.type) === "color",
  },
];

export const findLensType = (slug) => LENS_TYPES.find((t) => t.slug === slug);
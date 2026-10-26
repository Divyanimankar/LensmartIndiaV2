/* =========================================================
   COLLECTION DESCRIPTION CONTENT
   One entry per collection page. Edit the copy here; the
   component, the visible text and the JSON-LD all read from
   this file, so they can never drift apart.

   The brand / manufacturer list is NOT written here. It is
   built from the page's own product data (see the `products`
   prop), so it always matches what is actually listed.

   brandField: which product field holds the name
               ("brand" for glasses, "manufacturer" for lenses)
   brandType:  schema.org type used in the JSON-LD
========================================================= */

export const COLLECTION_CONTENT = {
  eyeglasses: {
    name: "Eyeglasses",
    heading: "Buy eyeglasses online in India",
    intro:
      "Browse eyeglasses for men, women and kids in acetate, metal, TR90 and titanium. Frames come in classic shapes like rectangle, round, square, oval and cat-eye.",
    details:
      "Use the filters to narrow by shape, colour, material, frame size and price. Once you find a frame you like, choose lenses that match your prescription.",
    brandsHeading: "Eyeglass brands",
    brandsNote: "Brands available in this collection",
    brandField: "brand",
    brandType: "Brand",
    unit: "style",
    faqs: [
      {
        q: "How do I find the right frame size?",
        a: "Look at the numbers printed inside the arm of a pair that already fits you, for example 52-18-140. Then use the frame size filter, which runs from XS to XL, to find a similar fit.",
      },
      {
        q: "Which frame material should I choose?",
        a: "Acetate is sturdy and comes in rich colours. Metal is slim and light. TR90 is flexible, which suits kids and active use. Titanium is very light and resists corrosion.",
      },
      {
        q: "Can I get eyeglasses with my prescription?",
        a: "Choose a frame first, then select lenses that match your prescription. If you are unsure about your power, check with your optometrist before ordering.",
      },
    ],
  },

  sunglasses: {
    name: "Sunglasses",
    heading: "Buy sunglasses online in India",
    intro:
      "Shop sunglasses for men, women and kids, from aviators and cat-eyes to round, square and oval frames in metal, acetate, TR90 and titanium.",
    details:
      "Sort by rating, bestseller or biggest discount, and filter by shape, colour, material and frame size to find a pair that suits your face.",
    brandsHeading: "Sunglasses brands",
    brandsNote: "Brands available in this collection",
    brandField: "brand",
    brandType: "Brand",
    unit: "style",
    faqs: [
      {
        q: "What should I look for in sunglasses?",
        a: "Check that the lenses are labelled UV400, which blocks both UVA and UVB rays. Lens darkness alone does not tell you how much UV protection you get.",
      },
      {
        q: "Which sunglasses shape suits my face?",
        a: "Round and oval frames soften angular faces. Square and rectangle frames add structure to rounder faces. Aviators and cat-eyes suit most face shapes.",
      },
      {
        q: "Do you have sunglasses for kids?",
        a: "Yes. Choose Kids in the category filter to see flexible TR90 frames in extra-small sizes.",
      },
    ],
  },

  "contact-lenses": {
    name: "Contact lenses",
    heading: "Buy contact lenses online in India",
    intro:
      "Browse contact lenses in daily, monthly and other replacement schedules. Use the filters to narrow by brand, type and price.",
    details:
      "Contact lenses need a valid prescription. Check your power, base curve and lens type from your latest eye test before you order.",
    brandsHeading: "Contact lens manufacturers",
    brandsNote: "Manufacturers available in this collection",
    brandField: "manufacturer",
    brandType: "Organization",
    unit: "product",
    faqs: [
      {
        q: "How often should I replace my contact lenses?",
        a: "Follow the replacement schedule printed on the pack. Daily lenses are worn once and thrown away. Monthly lenses are replaced after the number of days stated by the manufacturer.",
      },
      {
        q: "Do I need a prescription to buy contact lenses?",
        a: "Yes. Contact lenses are worn on the eye, so use the power and lens details from your optometrist's latest prescription.",
      },
      {
        q: "How do I look after my lenses?",
        a: "Wash and dry your hands before handling lenses. Use only fresh lens solution, never tap water, and take lenses out if your eyes feel sore or look red.",
      },
    ],
  },
};
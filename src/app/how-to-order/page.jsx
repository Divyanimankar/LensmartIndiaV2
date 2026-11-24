import SiteLayout from "@/components/SiteLayout";
import HowToOrderContent from "@/components/HowToOrderContent";
import { getPageBlocks, getPageSeo } from "../../lib/pageContentBlocks";
import "../../styles/howToOrder.css";

/* The Shopify Page handle that holds the "Content Blocks" metafield.
   The page must be set to VISIBLE in Shopify or the API returns nothing. */
const PAGE_HANDLE = "how-to-order";

/* ---------- SEO (Shopify "Search engine listing", with fallbacks) ---------- */
const SEO_FALLBACK = {
  title: "How to Order Online",
  description:
    "Learn how to order contact lenses, eyeglasses and sunglasses from LensMartIndia with our simple online shopping guide.",
};

export async function generateMetadata() {
  const seo = await getPageSeo(PAGE_HANDLE);
  const title = seo?.title?.trim() || SEO_FALLBACK.title;
  const description = seo?.description?.trim() || SEO_FALLBACK.description;

  return {
    title,
    description,
    alternates: { canonical: "/how-to-order" },
  };
}

/* =========================================================
   FALLBACKS – used only if a block/field is missing in Shopify
========================================================= */
const FALLBACK = {
  hero: {
    eyebrow: "A SIMPLE WAY TO SHOP",
    heading: "Your perfect lenses.",
    highlight: "Just a few steps away.",
    body: "Shopping for contact lenses should feel easy. Follow our simple guide to find your lenses, select your prescription and place your order with confidence.",
    buttonText: "Explore lenses",
    buttonUrl: "/all-products",
    list: ["Easy ordering", "Prescription guidance", "Convenient checkout"],
  },
  process: {
    eyebrow: "THE PROCESS",
    heading: "Five steps.",
    highlight: "That's it.",
  },
  guide: {
    eyebrow: "YOUR GUIDE TO ORDERING",
    heading: "From browsing to",
    highlight: "delivery.",
    body: "Everything you need to know, clearly explained at every step.",
  },
  reminder: {
    eyebrow: "A QUICK REMINDER",
    heading: "Your prescription matters.",
    highlight: "",
    body: "Always use a current contact lens prescription and confirm the lens type, power and fitting details before checkout. A glasses prescription may not be suitable for contact lenses.",
    buttonText: "Read our Prescription Guide",
    buttonUrl: "/prescription-guide",
  },
  help: {
    eyebrow: "NEED A LITTLE HELP?",
    heading: "Good to know.",
    highlight: "Before you order.",
    body: "Have a question about your order? Find a quick answer below.",
    buttonText: "Contact our team",
    buttonUrl: "/contact-us",
  },
  cta: {
    eyebrow: "READY WHEN YOU ARE",
    heading: "Your next pair starts",
    highlight: "here.",
    body: "Find the lenses that fit your needs and get started.",
    buttonText: "Shop contact lenses",
    buttonUrl: "/all-products",
  },
};

const FALLBACK_STEPS = [
  {
    tag: "CHOOSE",
    title: "Find your lenses",
    description:
      "Explore our collection and choose contact lenses that suit your needs.",
    details: ["Daily and monthly lenses", "Coloured contact lenses", "Explore trusted brands"],
  },
  {
    tag: "SELECT",
    title: "Choose your prescription",
    description:
      "Use your current contact lens prescription to select the correct power for each eye.",
    details: ["Select left eye power", "Select right eye power", "Check pack size and quantity"],
  },
  {
    tag: "REVIEW",
    title: "Review your order",
    description:
      "Check your selected lenses, prescription details, quantities and order total.",
    details: ["Verify lens type and power", "Review available discounts", "Confirm your order total"],
  },
  {
    tag: "PAY",
    title: "Complete checkout",
    description:
      "Enter your delivery information and choose a payment method available at checkout.",
    details: ["Enter your delivery address", "Choose an available payment method", "Confirm your order"],
  },
  {
    tag: "RECEIVE",
    title: "Your lenses are on the way",
    description:
      "Follow your order confirmation and shipping updates until your lenses arrive.",
    details: ["Receive order confirmation", "Check shipping updates", "Receive your lenses"],
  },
];

const FALLBACK_FAQS = [
  {
    question: "Do I need a prescription to order contact lenses?",
    answer:
      "You should have a current, suitable contact lens prescription before ordering. Contact lens prescriptions can differ from glasses prescriptions and may include additional fitting details.",
  },
  {
    question: "How do I select the correct power for each eye?",
    answer:
      "Use your contact lens prescription to select the power for your right and left eyes separately. If you are unsure about SPH, CYL, AXIS or other values, consult your eye care professional before ordering.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Changes depend on the current status of your order. Contact customer support as soon as possible to ask whether an update is possible.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Check your order confirmation and shipping updates. If tracking details are unavailable, contact customer support for assistance.",
  },
  {
    question: "What if I selected the wrong lens power?",
    answer:
      "Contact customer support promptly. Do not use lenses with an incorrect or uncertain prescription. Any exchange or return depends on the applicable store policy.",
  },
];

/* Which Shopify block feeds which section. Exact IDs are tried first, then
   any block whose ID contains one of the words. Edit these if yours differ. */
const BLOCK_IDS = {
  hero: ["how-to-section1", "hero"],
  process: ["how-to-process", "process"],
  guide: ["how-to-guide", "guide"],
  reminder: ["how-to-reminder", "reminder"],
  help: ["how-to-help", "help"],
  cta: ["how-to-cta", "cta"],
};

function findBlock(blocks, candidates) {
  for (const id of candidates) if (blocks[id]) return blocks[id];
  const ids = Object.keys(blocks);
  for (const word of candidates) {
    const hit = ids.find((id) => id.includes(word));
    if (hit) return blocks[hit];
  }
  return undefined;
}

const hasValue = (v) =>
  Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim());

/* Shopify value if it has content, otherwise the fallback */
function resolve(block = {}, fb) {
  const out = {};
  for (const key of Object.keys(fb)) {
    out[key] = hasValue(block[key]) ? block[key] : fb[key];
  }
  return out;
}

export default async function HowToOrderPage() {
  const blocks = await getPageBlocks(PAGE_HANDLE);

  const heroBlock = findBlock(blocks, BLOCK_IDS.hero);
  const processBlock = findBlock(blocks, BLOCK_IDS.process);
  const guideBlock = findBlock(blocks, BLOCK_IDS.guide);
  const reminderBlock = findBlock(blocks, BLOCK_IDS.reminder);
  const helpBlock = findBlock(blocks, BLOCK_IDS.help);
  const ctaBlock = findBlock(blocks, BLOCK_IDS.cta);

  /* Steps = the nested "Repeating items" of the guide block
     (how-to-step1 … how-to-step5), in the order set in Shopify. */
  const stepBlocks = guideBlock?.children ?? [];
  const steps = stepBlocks.length
    ? stepBlocks.map((s, i) => {
        const fb = FALLBACK_STEPS[i] || {};
        return {
          tag: s.eyebrow || fb.tag || "",
          title: s.heading || fb.title || "",
          description: s.body || fb.description || "",
          details: s.list.length ? s.list : fb.details || [],
        };
      })
    : FALLBACK_STEPS;

  /* FAQs = the nested "Repeating items" of the help block, if any.
     Block title = question, body text = answer. */
  const faqBlocks = helpBlock?.children ?? [];
  const faqs = faqBlocks.length
    ? faqBlocks
        .map((f) => ({ question: f.heading, answer: f.body }))
        .filter((f) => f.question && f.answer)
    : FALLBACK_FAQS;

  const content = {
    hero: resolve(heroBlock, FALLBACK.hero),
    process: resolve(processBlock, FALLBACK.process),
    guide: { ...resolve(guideBlock, FALLBACK.guide), steps },
    reminder: resolve(reminderBlock, FALLBACK.reminder),
    help: { ...resolve(helpBlock, FALLBACK.help), faqs: faqs.length ? faqs : FALLBACK_FAQS },
    cta: resolve(ctaBlock, FALLBACK.cta),
  };

  return (
    <SiteLayout>
      <HowToOrderContent content={content} />
    </SiteLayout>
  );
}
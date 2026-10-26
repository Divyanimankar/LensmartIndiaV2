"use client";

import { useId, useState } from "react";
import "../styles/productDescription.css";

/* =========================================================
   ProductDescription — one description section for
   contact lenses, sunglasses and eyeglasses

   Props
   - productType    "contact-lenses" | "sunglasses" | "eyeglasses"
   - product        the product object from the page
   - storeName      (optional) default "LensMartIndia"
   - defaultOpen    (optional) id of the panel open on first load
                    (default "details"; "" opens none)
   - className      (optional) extra class on the section

   Glasses only
   - selectedSize   currently selected frame size ("S", "M" ...)

   Contact lenses only (already worked out by the page)
   - lensKind       e.g. "Spherical" / "Toric"
   - scheduleLabel  e.g. "Monthly"
   - packLabel      e.g. "30 lenses/box"

   Layout and behaviour come from the sunglasses/eyeglasses
   section (intro + accordions, product specs, size, care,
   shipping). The keyword-rich heading, intro copy and
   brand / manufacturer details come from the contact lens
   section.

   SEO
   - Every panel is always in the HTML. Closed panels are only
     hidden, never removed, so the text is there for crawlers and
     for text-only readers.
   - One <h2> for the section; each accordion title is an <h3>.
   - Specs use a <dl> (term / value pairs).

   Accessibility
   - Standard accordion pattern: button inside a heading,
     aria-expanded, aria-controls, and a labelled region.
========================================================= */

const SIZE_NAMES = { S: "Small", M: "Medium", L: "Large", XL: "Extra Large" };

const filled = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

/* ---------- content for each product type ---------- */

function buildContact({ product, storeName, lensKind, scheduleLabel, packLabel }) {
  const name = product.name;

  const specs = [
    ["Replacement Schedule", scheduleLabel],
    ["Lens Type", lensKind],
    ["Lenses per Box", packLabel],
    ["Brand", product.brand],
    ["Manufacturer", product.manufacturer],
  ];

  return {
    eyebrow: "ABOUT THE LENSES",
    heading: `Buy ${name} Contact Lenses Online in India`,
    intro: [
      <>
        Buy <strong>{name}</strong> contact lenses online from {storeName}.
        This product is designed for comfortable and convenient everyday
        vision use. Please check your contact lens prescription and product
        specifications before placing your order.
      </>,
      filled(product.brand) && (
        <>
          <strong>{name}</strong> is from <strong>{product.brand}</strong>
          {filled(product.manufacturer)
            ? ` and is manufactured by ${product.manufacturer}.`
            : "."}
          {filled(packLabel) ? ` This product is available as ${packLabel}.` : ""}
        </>
      ),
    ],
    sections: [
      { id: "details", title: "Product Details", specs },
      {
        id: "order",
        title: "How to Order",
        text: "Enter your prescription for the right and left eye, choose the number of boxes for each eye, and add the product to your cart. Make sure the selected values match your contact lens prescription.",
      },
      {
        id: "shipping",
        title: "Shipping & Returns",
        text: "Delivery and replacement are subject to store policy. Please check your order details at checkout.",
      },
    ],
  };
}

function buildGlasses({ product, productType, storeName, selectedSize }) {
  const isSun = productType === "sunglasses";
  const noun = isSun ? "sunglasses" : "eyeglasses";
  const fit = SIZE_NAMES[product.frameSize] || product.frameSize;

  /* "This Rectangle frame from VOGUE is made of Acetate." — only the parts we have */
  const facts = [
    filled(product.shape) && `${product.shape} frame`,
    filled(product.brand) && `from ${product.brand}`,
  ]
    .filter(Boolean)
    .join(" ");

  const factSentence = facts
    ? `This ${facts}${
        filled(product.material) ? ` is made of ${product.material}` : ""
      }.`
    : "";

  return {
    eyebrow: "ABOUT THE FRAME",
    heading: `Buy ${product.name} Online in India`,
    intro: [
      <>
        Buy <strong>{product.name}</strong> online from {storeName}.{" "}
        {factSentence}
      </>,
      filled(product.description) && product.description,
    ],
    sections: [
      {
        id: "details",
        title: "Product Details",
        specs: [
          ["Brand", product.brand],
          ["Material", product.material],
          ["Shape", product.shape],
          ["Fit", fit],
          ["Gender", product.category],
        ],
      },
      {
        id: "size",
        title: "Size & Fit",
        text: filled(selectedSize) ? (
          <>
            Selected frame size: <strong>{selectedSize}</strong>. Choose the
            size that feels comfortable for you.
          </>
        ) : (
          "Choose the frame size that feels comfortable for you."
        ),
      },
      {
        id: "care",
        title: "Care Instructions",
        text: isSun
          ? "Keep your sunglasses in a protective case and clean the lenses with a soft microfiber cloth."
          : "Keep your eyewear in a protective case and clean the lenses with a soft microfiber cloth.",
      },
      {
        id: "shipping",
        title: "Shipping & Returns",
        text: "Check delivery by pincode above. Easy replacement is available subject to store policy.",
      },
    ],
  };
}

/* ---------- component ---------- */

export default function ProductDescription({
  productType = "contact-lenses",
  product,
  storeName = "LensMartIndia",
  defaultOpen = "details",
  className = "",
  selectedSize,
  lensKind,
  scheduleLabel,
  packLabel,
}) {
  const baseId = useId();
  const [openId, setOpenId] = useState(defaultOpen);

  if (!product) return null;

  const content =
    productType === "contact-lenses"
      ? buildContact({ product, storeName, lensKind, scheduleLabel, packLabel })
      : buildGlasses({ product, productType, storeName, selectedSize });

  const headingId = `${baseId}-heading`;

  return (
    <section
      className={`pd pd--${productType} ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <div className="pd-inner">
        <div className="pd-grid">
          {/* INTRO */}

          <div className="pd-intro">
            <p className="pd-eyebrow">{content.eyebrow}</p>

            <h2 className="pd-heading" id={headingId}>
              {content.heading}
            </h2>

            {content.intro.filter(Boolean).map((paragraph, index) => (
              <p className="pd-text" key={index}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* ACCORDIONS */}

          <div className="pd-accordions">
            {content.sections.map((section) => {
              const open = openId === section.id;
              const buttonId = `${baseId}-${section.id}-button`;
              const panelId = `${baseId}-${section.id}-panel`;
              const rows = (section.specs || []).filter(([, value]) =>
                filled(value),
              );

              return (
                <div className="pd-item" key={section.id}>
                  <h3 className="pd-item-title">
                    <button
                      type="button"
                      id={buttonId}
                      className="pd-trigger"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenId(open ? "" : section.id)}
                    >
                      <span>{section.title}</span>
                      <span className="pd-icon" aria-hidden="true">
                        {open ? "−" : "+"}
                      </span>
                    </button>
                  </h3>

                  <div
                    className="pd-panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!open}
                  >
                    {section.specs ? (
                      <dl className="pd-specs">
                        {rows.map(([label, value]) => (
                          <div className="pd-spec" key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="pd-text">{section.text}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
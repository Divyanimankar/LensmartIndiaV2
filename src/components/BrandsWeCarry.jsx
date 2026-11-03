// components/BrandsWeCarry.jsx
"use client";

// components/BrandsWeCarry.jsx

const brands = [
  { src: "/images/b1.png", alt: "IDEE Eyewear", height: 110 },
  { src: "/images/b2.png", alt: "Police Eyewear", height: 85 },
  { src: "/images/b3.png", alt: "Irus Eyewear", height: 110 },
  { src: "/images/b4.png", alt: "Guess", height: 75 },
  { src: "/images/b5.png", alt: "Furla", height: 95 },
  { src: "/images/b6.jpeg", alt: "Fila Eyewear", height: 95 },
  { src: "/images/b7.png", alt: "Chopard", height: 80 },
];

export default function BrandsWeCarry() {
  return (
    <section
      style={{
        backgroundColor: "#fffdf9",
        padding: "70px 20px",
        borderTop: "1px solid #eee6da",
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <div
          style={{
            width: "60px",
            height: "1px",
            backgroundColor: "#8a7a66",
            margin: "0 auto 24px",
          }}
        />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "48px",
            fontWeight: 400,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Brands We Carry
        </h2>
      </div>

      {/* Brands row (7 in one line) */}
      <div style={{ maxWidth: "1300px", margin: "0 auto", overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            minWidth: "900px",
          }}
        >
          {brands.map((brand, index) => (
            <div
              key={brand.alt}
              style={{
                height: "130px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 14px",
                borderLeft: index === 0 ? "none" : "1px solid #e8e1d6",
                boxSizing: "border-box",
              }}
            >
              <img
                src={brand.src}
                alt={brand.alt}
                style={{
                  width: "100%",
                  height: `${brand.height}px`,
                  objectFit: "contain",
                  objectPosition: "center",
                  mixBlendMode: "multiply",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
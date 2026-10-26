import React from "react";
import "../styles/glassesbrand.css";

// public/brands/ folder ke andar ki saari images
const brandImages = [
  "alainmikli-bt_converted.png",
  "arnette-logo-digital-b.png",
  "ax-logo-digital-b.png",
  "bliz-logo-black.png",
  "bolon-bt.png",
  "brunellocuccinelli-bt.png",
  "burberry-logo-b.png",
  "chanel-logo-digital-b.png",
  "coach-logo-b.png",
  "dbyd-rbt.png",
  "diesel-biscotto-primary-logo-rgb.png",
  "dolcegabanna-logo-b.png",
  "emporioarmani-logo-b.png",
  "fedon-rbt.png",
  "ferrari-bt.png",
  "fostergrant-bt.png",
  "giorgioarmani-logo-b.png",
  "jimmy-choo.png",
  "logo-costa_converted.png",
  "logoblack (1).png",
  "logoblack (2)_converted.png",
  "logoblack-ea7_converted.png",
  "logoblack_converted.png",
  "luxottica-bt_converted.png",
  "michaelkors-rbt_converted.png",
  "miu-logo-digital-b_converted.png",
  "moncler_converted.png",
  "native-eyewear_converted.png",
  "oakley-bt_converted.png",
  "oliverpeople-logo-digital-b_converted.png",
  "persol-rbt_converted.png",
  "poloralphlauren-logo-digital-b_converted.png",
  "prada-linea-rossarebrandcl_converted.png",
  "prada-logo-digital-b_converted.png",
  "ralphlauren-logo-digital-b_converted.png",
  "ralphlaureneyewear-logo-digital-b_converted.png",
  "rayban-rbt_converted.png",
  "scuderiaferrari_converted.png",
  "seen-bt_converted.png",
  "sferoflex-bt_converted.png",
  "swarovsky-bt_converted.png",
  "tiffanyco-logo-b_converted.png",
  "tonyburch-logo-digital-b_converted.png",
  "unofficial-bt_converted.png",
  "versace-logo-digital-b_converted.png",
];

const BrandSlider = ({ speed = 120 }) => {
  // seamless infinite loop ke liye list 2 baar repeat hoti hai
  const loopList = [...brandImages, ...brandImages];

  return (
    <section className="brand-slider">
      <h2 className="brand-slider__title">BRANDS WE CARRY</h2>

      <div className="brand-slider__viewport">
        <div
          className="brand-slider__track"
          style={{ animationDuration: `${speed}s` }}
        >
          {loopList.map((img, i) => (
            <div className="brand-slider__item" key={`${img}-${i}`}>
              <img
                src={encodeURI(`/brands/${img}`)}
                alt={img.replace(/\.[^.]+$/, "")}
                loading="lazy"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;

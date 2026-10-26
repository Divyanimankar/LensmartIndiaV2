import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import ConditionalFooter from "../components/ConditionalFooter";
import "../styles/globals.css";
import ScrollToTop from "../components/ScrollToTop";
import DiscountPopup from "@/components/DiscountPopup";
import CartDrawer from "@/components/CartDrawer";
import MotionProvider from "@/components/MotionProvider";

/* LensMart premium design system — loaded last so it layers over the
   component stylesheets. Order matters: tokens → base → motion → surfaces. */
import "../styles/lm/tokens.css";
import "../styles/lm/base.css";
import "../styles/lm/motion.css";
import "../styles/lm/header.css";
import "../styles/lm/home.css";
import "../styles/lm/hero.css";
import "../styles/lm/catalog.css";
import "../styles/lm/product.css";
import "../styles/lm/commerce.css";
import "../styles/lm/pages.css";
import "../styles/lm/footer.css";
import "../styles/lm/states.css";
import "../styles/lm/ux.css";

export const metadata = {
  title: "LensMartIndia",
  description: "Contact lenses online in India",
  icons: {
    icon: "/favicon2.png",
  },
};

export const viewport = {
  themeColor: "#faf6ee",
};

/* One consolidated font request (previously ~38 duplicated CSS @imports). */
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800" +
  "&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500" +
  "&family=Jost:wght@400;500;600;700;800&display=swap";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_HREF} />
      </head>
      <body>
        <a href="#main-content" className="lm-skip">
          Skip to content
        </a>

        <AnnouncementBar />

        <Navbar />

        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        <ConditionalFooter />
        <CartDrawer />
        <ScrollToTop />
        <DiscountPopup />
        <MotionProvider />
      </body>
    </html>
  );
}

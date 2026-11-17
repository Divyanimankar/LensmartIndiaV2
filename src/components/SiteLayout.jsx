import WishlistSync from "@/components/WishlistSync";
import CartSync from "@/components/CartSync";

export default function SiteLayout({ children }) {
  return (
    <>
      <WishlistSync />
      <CartSync />
      {children}
    </>
  );
}
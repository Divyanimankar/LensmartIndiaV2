import PageBanner from '@/components/PageBanner';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/components/ProductGrid';
import Newsletter from '@/components/Newsletter';
import { products } from '@/data/products';

export default function Page() {
  return <>
    <PageBanner title="Astigmatism / Toric Lenses" subtitle="Contact lenses designed for astigmatism." />
    <Breadcrumb current="Astigmatism / Toric" />
    <section className="container catalogSection"><ProductGrid products={products.slice(0, 8)} /></section>
    <Newsletter />
  </>;
}

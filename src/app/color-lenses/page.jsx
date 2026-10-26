import PageBanner from '@/components/PageBanner';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/components/ProductGrid';
import Newsletter from '@/components/Newsletter';
import { products } from '@/data/products';

export default function Page() {
  return <>
    <PageBanner title="Color Contact Lenses" subtitle="Explore color lenses for a refreshed look." />
    <Breadcrumb current="Color Lenses" />
    <section className="container catalogSection"><ProductGrid products={products.slice(0, 8)} /></section>
    <Newsletter />
  </>;
}

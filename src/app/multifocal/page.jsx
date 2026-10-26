import PageBanner from '@/components/PageBanner';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/components/ProductGrid';
import Newsletter from '@/components/Newsletter';
import { products } from '@/data/products';

export default function Page() {
  return <>
    <PageBanner title="Multifocal Contact Lenses" subtitle="Clear vision at near, intermediate and far distances." />
    <Breadcrumb current="Multifocal" />
    <section className="container catalogSection"><ProductGrid products={products.slice(0, 8)} /></section>
    <Newsletter />
  </>;
}

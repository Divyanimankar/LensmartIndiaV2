import SiteLayout from '@/components/SiteLayout';
import Newsletter from '@/components/Newsletter';
import PageBanner from '@/components/PageBanner';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export const metadata={title:'Bausch + Lomb Contact Lenses'};
export default function Page(){return <SiteLayout><><PageBanner title='Bausch + Lomb Contact Lenses' subtitle='Shop Bausch + Lomb contact lenses.'/><Breadcrumb current='Bausch + Lomb Contact Lenses'/><section className="container brandIntro"><div><h2>Bausch + Lomb</h2><p>Shop Bausch + Lomb contact lenses. Genuine products with clear pricing and easy ordering.</p></div><div className="brandVisual">Bausch + Lomb</div></section><section className="container catalogSection"><div className="catalogToolbar"><span>Showing available products</span><select><option>Sort by featured</option><option>Price: Low to High</option></select></div><ProductGrid products={products.filter(p=>p.brand==='Bausch + Lomb')}/></section><Newsletter/></></SiteLayout>}

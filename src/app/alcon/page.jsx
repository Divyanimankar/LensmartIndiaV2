import SiteLayout from '@/components/SiteLayout';
import Newsletter from '@/components/Newsletter';
import PageBanner from '@/components/PageBanner';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export const metadata={title:'Alcon Contact Lenses'};
export default function Page(){return <SiteLayout><><PageBanner title='Alcon Contact Lenses' subtitle='Shop popular Alcon contact lenses.'/><Breadcrumb current='Alcon Contact Lenses'/><section className="container brandIntro"><div><h2>Alcon</h2><p>Shop popular Alcon contact lenses. Genuine products with clear pricing and easy ordering.</p></div><div className="brandVisual">Alcon</div></section><section className="container catalogSection"><div className="catalogToolbar"><span>Showing available products</span><select><option>Sort by featured</option><option>Price: Low to High</option></select></div><ProductGrid products={products.filter(p=>p.brand==='Alcon')}/></section><Newsletter/></></SiteLayout>}

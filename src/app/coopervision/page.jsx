import SiteLayout from '@/components/SiteLayout';
import Newsletter from '@/components/Newsletter';
import PageBanner from '@/components/PageBanner';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export const metadata={title:'CooperVision Contact Lenses'};
export default function Page(){return <SiteLayout><><PageBanner title='CooperVision Contact Lenses' subtitle='Shop popular CooperVision contact lenses.'/><Breadcrumb current='CooperVision Contact Lenses'/><section className="container brandIntro"><div><h2>CooperVision</h2><p>Shop popular CooperVision contact lenses. Genuine products with clear pricing and easy ordering.</p></div><div className="brandVisual">CooperVision</div></section><section className="container catalogSection"><div className="catalogToolbar"><span>Showing available products</span><select><option>Sort by featured</option><option>Price: Low to High</option></select></div><ProductGrid products={products.filter(p=>p.brand==='CooperVision')}/></section><Newsletter/></></SiteLayout>}

import SiteLayout from '@/components/SiteLayout';
import Newsletter from '@/components/Newsletter';
import PageBanner from '@/components/PageBanner';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export const metadata={title:'Johnson & Johnson Contact Lenses'};
export default function Page(){return <SiteLayout><><PageBanner title='Johnson & Johnson Contact Lenses' subtitle='Shop ACUVUE and Johnson & Johnson contact lenses.'/><Breadcrumb current='Johnson & Johnson Contact Lenses'/><section className="container brandIntro"><div><h2>Johnson & Johnson</h2><p>Shop ACUVUE and Johnson & Johnson contact lenses. Genuine products with clear pricing and easy ordering.</p></div><div className="brandVisual">Johnson & Johnson</div></section><section className="container catalogSection"><div className="catalogToolbar"><span>Showing available products</span><select><option>Sort by featured</option><option>Price: Low to High</option></select></div><ProductGrid products={products.filter(p=>p.brand==='Johnson & Johnson')}/></section><Newsletter/></></SiteLayout>}

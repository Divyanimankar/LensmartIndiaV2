import SiteLayout from '@/components/SiteLayout';
import { products } from '@/data/products';

export const metadata={title:'Order Confirmed'};
export default function Page(){return <SiteLayout><><section className="container successBox"><div className="successIcon">✓</div><h1>Order Confirmed</h1><p className="muted">Thank you for shopping with LensMartIndia. Your order has been placed successfully.</p><p><b>Order ID:</b> LMI-2026-1001</p><a className="btn" href="/all-products">Continue Shopping</a></section></></SiteLayout>}

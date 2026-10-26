import Link from 'next/link';export default function Breadcrumb({current}){return <div className="container breadcrumb"><Link href="/">Home</Link> / <span>{current}</span></div>}

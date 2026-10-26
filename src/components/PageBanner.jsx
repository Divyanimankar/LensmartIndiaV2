export default function PageBanner({title, subtitle}){return <section className="pageBanner"><div className="container"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></section>}

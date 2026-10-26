import SiteLayout from '@/components/SiteLayout';

export const metadata={title:'Create Account'};
export default function Page(){return <SiteLayout><section className="authWrap"><div className="authCard"><h1>Create Account</h1><div className="field"><label>Full Name</label><input/></div><div className="field"><label>Email</label><input type="email"/></div><div className="field"><label>Phone</label><input/></div><div className="field"><label>Password</label><input type="password"/></div><button className="btn">Create Account</button><p className="muted">Already registered? <a href="/login">Login</a></p></div></section></SiteLayout>}

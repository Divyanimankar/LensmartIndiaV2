

import Link from "next/link";
import { cookies } from "next/headers";
import SiteLayout from "@/components/SiteLayout";
import RefreshOnBack from "@/components/RefreshOnBack";
import AccountDashboard from "@/components/AccountDashboard";
import "../../styles/accountpage.css";

export const dynamic = "force-dynamic";

export default async function MyAccountPage() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("sh_access")?.value;

  const btnStyle = {
    display: "block",
    textAlign: "center",
    textDecoration: "none",
  };

  return (
    <SiteLayout hideFooter>
      <RefreshOnBack />

      {isLoggedIn ? (
        <AccountDashboard />
      ) : (
        <div className="account-login-page">
          <section className="account-login-section">
            <div className="account-login-card">
              <div className="account-logo">
                <Link href="/">
                  <img src="/images/logo.png" alt="LensMartIndia" />
                </Link>
              </div>

              <h1>Log in</h1>
              <a href="/account/login" className="account-login-btn" style={btnStyle}>
                Continue to log in
              </a>
            </div>
          </section>
        </div>
      )}
    </SiteLayout>
  );
}
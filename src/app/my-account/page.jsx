// // // "use client";

// // // import { useState } from "react";
// // // import Link from "next/link";
// // // import SiteLayout from "@/components/SiteLayout";
// // // import "../../styles/accountpage.css";

// // // export default function MyAccountPage() {
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [showPassword, setShowPassword] = useState(false);

// // //   /* =========================================
// // //      LOGIN SUBMIT
// // //   ========================================= */

// // //   const handleLoginSubmit = (e) => {
// // //     e.preventDefault();

// // //     if (!email.trim() || !password.trim()) {
// // //       return;
// // //     }

// // //     console.log("Email:", email);
// // //     console.log("Password entered");

// // //     // Actual login API can be connected here later
// // //   };

// // //   return (
// // //     <SiteLayout hideFooter>
// // //       <div className="account-login-page">

// // //         <section className="account-login-section">

// // //           <div className="account-login-card">

// // //             {/* =====================================
// // //                 LOGO
// // //             ===================================== */}

// // //             <div className="account-logo">
// // //               <Link href="/">
// // //                 <img
// // //                   src="/images/logo.png"
// // //                   alt="LensMartIndia"
// // //                 />
// // //               </Link>
// // //             </div>


// // //             {/* =====================================
// // //                 HEADING
// // //             ===================================== */}

// // //             <h1>Log in</h1>


// // //             {/* =====================================
// // //                 LOGIN FORM
// // //             ===================================== */}

// // //             <form
// // //               className="account-login-form"
// // //               onSubmit={handleLoginSubmit}
// // //             >

// // //               {/* =================================
// // //                   EMAIL
// // //               ================================= */}

// // //               <div className="account-field">

// // //                 <label htmlFor="account-email">
// // //                   Email
// // //                 </label>

// // //                 <input
// // //                   type="email"
// // //                   id="account-email"
// // //                   name="email"
// // //                   placeholder="Enter your email"
// // //                   value={email}
// // //                   onChange={(e) =>
// // //                     setEmail(e.target.value)
// // //                   }
// // //                   autoComplete="email"
// // //                   required
// // //                 />

// // //               </div>


// // //               {/* =================================
// // //                   PASSWORD
// // //               ================================= */}

// // //               <div className="account-field">

// // //                 <label
// // //                   htmlFor="account-password"
// // //                   className="account-password-label"
// // //                 >
// // //                   Password
// // //                 </label>


// // //                 <div className="account-password-input">

// // //                   <input
// // //                     type={
// // //                       showPassword
// // //                         ? "text"
// // //                         : "password"
// // //                     }
// // //                     id="account-password"
// // //                     name="password"
// // //                     placeholder="Enter your password"
// // //                     value={password}
// // //                     onChange={(e) =>
// // //                       setPassword(e.target.value)
// // //                     }
// // //                     autoComplete="current-password"
// // //                     required
// // //                   />


// // //                   {/* SHOW / HIDE PASSWORD */}

// // //                   <button
// // //                     type="button"
// // //                     className="account-password-toggle"
// // //                     onClick={() =>
// // //                       setShowPassword(
// // //                         (previous) => !previous
// // //                       )
// // //                     }
// // //                     aria-label={
// // //                       showPassword
// // //                         ? "Hide password"
// // //                         : "Show password"
// // //                     }
// // //                   >

// // //                     {showPassword ? (

// // //                       /* EYE OFF ICON */

// // //                       <svg
// // //                         viewBox="0 0 24 24"
// // //                         aria-hidden="true"
// // //                       >
// // //                         <path d="M3 3l18 18" />

// // //                         <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />

// // //                         <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 5a15.4 15.4 0 0 1-3 3.5" />

// // //                         <path d="M6.6 6.6C4.4 8 3 10 3 10s3.5 5 9 5a9.8 9.8 0 0 0 3-.5" />
// // //                       </svg>

// // //                     ) : (

// // //                       /* EYE ICON */

// // //                       <svg
// // //                         viewBox="0 0 24 24"
// // //                         aria-hidden="true"
// // //                       >
// // //                         <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />

// // //                         <circle
// // //                           cx="12"
// // //                           cy="12"
// // //                           r="2.5"
// // //                         />
// // //                       </svg>

// // //                     )}

// // //                   </button>

// // //                 </div>


// // //                 {/* =================================
// // //                     FORGOT PASSWORD
// // //                 ================================= */}

// // //                 <div className="account-forgot-password">

// // //                   <Link href="">
// // //                     Forgot password?
// // //                   </Link>

// // //                 </div>

// // //               </div>


// // //               {/* =================================
// // //                   LOGIN BUTTON
// // //               ================================= */}

// // //               <button
// // //                 type="submit"
// // //                 className="account-login-btn"
// // //               >
// // //                 Log in
// // //               </button>

// // //             </form>


// // //             {/* =====================================
// // //                 OR DIVIDER
// // //             ===================================== */}

// // //             <div className="account-divider">

// // //               <span></span>

// // //               <p>or</p>

// // //               <span></span>

// // //             </div>


// // //             {/* =====================================
// // //                 SOCIAL LOGIN
// // //             ===================================== */}

// // //             <div className="account-social-buttons">


// // //               {/* GOOGLE */}

// // //               <button
// // //                 type="button"
// // //                 className="account-social-btn"
// // //               >

// // //                 <svg
// // //                   className="google-icon"
// // //                   viewBox="0 0 24 24"
// // //                   aria-hidden="true"
// // //                 >

// // //                   <path
// // //                     fill="#4285F4"
// // //                     d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"
// // //                   />

// // //                   <path
// // //                     fill="#34A853"
// // //                     d="M12 22c2.7 0 4.97-.9 6.62-2.4l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.59A10 10 0 0 0 12 22Z"
// // //                   />

// // //                   <path
// // //                     fill="#FBBC05"
// // //                     d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.12-1.32.31-1.92V7.49H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.51l3.34-2.59Z"
// // //                   />

// // //                   <path
// // //                     fill="#EA4335"
// // //                     d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.96 14.7 2 12 2a10 10 0 0 0-8.95 5.49l3.34 2.59C7.18 7.71 9.39 5.95 12 5.95Z"
// // //                   />

// // //                 </svg>

// // //                 <span>
// // //                   Sign in with Google
// // //                 </span>

// // //               </button>


// // //               {/* APPLE */}

// // //               <button
// // //                 type="button"
// // //                 className="account-social-btn"
// // //               >

// // //                 <svg
// // //                   className="apple-icon"
// // //                   viewBox="0 0 24 24"
// // //                   aria-hidden="true"
// // //                 >

// // //                   <path
// // //                     fill="currentColor"
// // //                     d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.1v-.01ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z"
// // //                   />

// // //                 </svg>

// // //                 <span>
// // //                   Sign in with Apple
// // //                 </span>

// // //               </button>

// // //             </div>


// // //             {/* =====================================
// // //                 SIGN UP
// // //             ===================================== */}

// // //             <div className="account-signup">

// // //               <span>
// // //                 Don't have an account?
// // //               </span>

// // //               <Link href="/register">
// // //                 Sign up
// // //               </Link>

// // //             </div>

// // //           </div>

// // //         </section>

// // //       </div>
// // //     </SiteLayout>
// // //   );
// // // }


// // import Link from "next/link";
// // import SiteLayout from "@/components/SiteLayout";
// // import "../../styles/accountpage.css";

// // export default function MyAccountPage() {
// //   return (
// //     <SiteLayout hideFooter>
// //       <div className="account-login-page">
// //         <section className="account-login-section">
// //           <div className="account-login-card">

// //             <div className="account-logo">
// //               <Link href="/">
// //                 <img src="/images/logo.png" alt="LensMartIndia" />
// //               </Link>
// //             </div>

// //             <h1>Log in</h1>

// //             <a
// //               href="/account/login"
// //               className="account-login-btn"
// //               style={{ display: "block", textAlign: "center", textDecoration: "none" }}
// //             >
// //               Continue to log in
// //             </a>

// //           </div>
// //         </section>
// //       </div>
// //     </SiteLayout>
// //   );
// // }





// import Link from "next/link";
// import { cookies } from "next/headers";
// import SiteLayout from "@/components/SiteLayout";
// import RefreshOnBack from "@/components/RefreshOnBack";
// import "../../styles/accountpage.css";

// export const dynamic = "force-dynamic";

// export default async function MyAccountPage() {
//   const cookieStore = await cookies();
//   const isLoggedIn = !!cookieStore.get("sh_access")?.value;

//   const btnStyle = {
//     display: "block",
//     textAlign: "center",
//     textDecoration: "none",
//   };

//   return (
//     <SiteLayout hideFooter>
//       <RefreshOnBack />

//       <div className="account-login-page">
//         <section className="account-login-section">
//           <div className="account-login-card">

//             <div className="account-logo">
//               <Link href="/">
//                 <img src="/images/logo.png" alt="LensMartIndia" />
//               </Link>
//             </div>

//             {isLoggedIn ? (
//               <>
//                 <h1>My Account</h1>
//                 <p style={{ textAlign: "center", marginBottom: 16 }}>
//                   You are logged in.
//                 </p>
//                 <a
//                   href="/account/logout"
//                   className="account-login-btn"
//                   style={btnStyle}
//                 >
//                   Log out
//                 </a>
//               </>
//             ) : (
//               <>
//                 <h1>Log in</h1>
//                 <a
//                   href="/account/login"
//                   className="account-login-btn"
//                   style={btnStyle}
//                 >
//                   Continue to log in
//                 </a>
//               </>
//             )}

//           </div>
//         </section>
//       </div>
//     </SiteLayout>
//   );
// }


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

export const metadata = {
  title: "My Account",
  description:
    "Manage your LensMartIndia account, personal details and shopping preferences.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/my-account",
  },
};

export default function MyAccountLayout({ children }) {
  return children;
}

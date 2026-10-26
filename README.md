# LensMartIndia

Next.js project using reusable components and normal external CSS3 (no Tailwind).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Main structure

- `src/app` - page routes
- `src/components` - reusable components
- `src/styles` - external CSS3 files
- `src/data` - editable product data

## Fixed in this version

- Removed broken duplicate Header import usage.
- Navbar is consistently named `Navbar.jsx`.
- Added the missing `components.css` file required by `globals.css`.
- Removed accidentally duplicated old navbar/component CSS from `navbar.css`.
- Prevented duplicate Navbar/Footer rendering by making the root layout global.
- Added working routes for Shop by Wear and Shop by Brand dropdown links.
- Removed dependency on a missing `/images/logo.png` by using an editable text logo.

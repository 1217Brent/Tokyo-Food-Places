import { JSX } from "react";

function Footer(): JSX.Element {
  return (
    <>
      <footer className="bg-amber-900 text-white text-center py-6 text-sm mt-auto">
        © {new Date().getFullYear()} Taste Tokyo. All rights reserved.
      </footer>
    </>
  );
}

export default Footer;
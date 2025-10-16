// NavbarMain.tsx
import React from "react";
import styles from "../styles/NavbarMain.module.css";
import Link from "next/link";
import { CATEGORY_GENERAL } from "../utils/config";

interface NavbarMainProps {
  setActiveCategory: (category: string) => void;
}

export const NavbarMain: React.FC<NavbarMainProps> = ({ setActiveCategory }) => {
  const handleTitleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    setActiveCategory(CATEGORY_GENERAL);
  };

  return (
    <section id="navbar-main" className={styles.navbarMainWrap}>
      <section className={styles.navLogo}>
        {/* O Link ainda é útil para SEO e para abrir em nova aba */}
        <Link href="/" className={styles.navLogoLink}>
          <h1 className={styles.navTitle} onClick={handleTitleClick}>
            News App
          </h1>
        </Link>
      </section>
    </section>
  );
};
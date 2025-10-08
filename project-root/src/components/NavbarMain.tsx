import React from "react";
import styles from "../styles/NavbarMain.module.css";
import Link from "next/link";

export const NavbarMain: React.FC = () => {
  return (
    <section className={styles.navbarMainWrap}>
      <section className={styles.navLogo}>
        <Link href="/" className={styles.navLogoLink}>
          <h1 className={styles.navTitle}>News App</h1>
        </Link>
      </section>
    </section>
  );
};

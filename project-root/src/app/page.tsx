"use client";

import styles from "../styles/index.module.css";
import { NavbarTop } from "../components/NavbarTop"; 
import { NavbarMain } from "../components/NavbarMain";
import NavbarBottom from "../components/NavbarBottom";

export default function Home() {
  return (
    <section className={styles.container}>
      <header>
        <NavbarTop />
        <NavbarMain />
        <NavbarBottom />
      </header>

      <main id="main-content">
        <section id="main-news"></section>
        <aside id="aside-wrap">
          <section id="aside-weather"></section>
          <p id="aside-most-read">Mais Lidas</p>
          <section id="aside-news"></section>
        </aside>
      </main>

      <footer>
        <section id="footer"></section>
      </footer>
    </section>
  );
}

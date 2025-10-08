"use client";

import styles from "../styles/index.module.css";
import { NavbarTop } from "../components/NavbarTop"; 
import { NavbarMain } from "../components/NavbarMain";
import NavbarBottom from "../components/NavbarBottom";
import { MainNews } from "@/components/MainNews";
import Weather from "@/components/Weather";

export default function Home() {
  return (
    <section className={styles.container}>
      <header>
        <NavbarTop />
        <NavbarMain />
        <NavbarBottom />
      </header>

      <main className={styles.mainContent}>
        <section className={styles.mainNews}>
          <MainNews />
        </section>
        <aside className={styles.asideWrap}>
          <Weather />
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

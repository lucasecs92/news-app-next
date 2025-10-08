"use client";

import styles from "../styles/index.module.css";
import { NavbarTop } from "../components/NavbarTop"; 
import { NavbarMain } from "../components/NavbarMain";
import NavbarBottom from "../components/NavbarBottom";
import { MainNews } from "@/components/MainNews";

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
          <section id="aside-weather"></section>
          <p id="aside-most-read">Mais Lidas</p>
          <section id="aside-news"></section>
        </aside>
      </main>

      {/* <main className={styles.mainContent}>
        <section className={styles.mainNews}></section>
        <aside className={styles.asideWrap}>
          <section className={styles.asideWeather}></section>
          <p className={styles.asideMostRead}>Mais Lidas</p>
          <section className={styles.asideNews}></section>
        </aside>
      </main> */}

      <footer>
        <section id="footer"></section>
      </footer>
    </section>
  );
}

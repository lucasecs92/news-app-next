"use client";

import styles from "../styles/index.module.css";
import { NavbarTop } from "../components/NavbarTop";
import { NavbarMain } from "../components/NavbarMain";
import NavbarBottom from "../components/NavbarBottom";
import { MainNews } from "@/components/MainNews";
import Weather from "@/components/Weather";
import NewsAside from "@/components/NewsAside";
import Entertainment from "@/components/Entertainment";
import Business from "@/components/Business";
import Sports from "@/components/Sports";
import Health from "@/components/Health";
import Technology from "@/components/Technology";
import Science from "@/components/Science";
import Footer from "@/components/Footer";
import { SearchResults } from "@/components/SearchResults";
import {
  CATEGORY_GENERAL,
  CATEGORY_ENTERTAINMENT,
  CATEGORY_BUSINESS,
  CATEGORY_SPORTS,
  CATEGORY_HEALTH,
  CATEGORY_TECHNOLOGY,
  CATEGORY_SCIENCE,
} from "../utils/config";
import { useState } from "react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_GENERAL);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // FUNÇÃO HANDLER
  // Esta função gerencia a mudança de categoria e também limpa a busca.
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category); // Define a nova categoria
    setSearchQuery("");         // Limpa a busca, retornando à visualização principal
  };

  const renderMainContent = () => {
    switch (activeCategory) {
      case CATEGORY_GENERAL: return <MainNews />;
      case CATEGORY_ENTERTAINMENT: return <Entertainment />;
      case CATEGORY_BUSINESS: return <Business />;
      case CATEGORY_SPORTS: return <Sports />;
      case CATEGORY_HEALTH: return <Health />;
      case CATEGORY_TECHNOLOGY: return <Technology />;
      case CATEGORY_SCIENCE: return <Science />;
      default: return <MainNews />;
    }
  };

  const mainNewsClasses = `${styles.mainNews} ${
    activeCategory !== CATEGORY_GENERAL ? styles.mainNewsNoAside : ""
  }`;

  return (
    <section className={styles.container}>
      <header>
        <NavbarTop onSearch={setSearchQuery} />
        {/* Passa a nova função handler para as navbars */}
        <NavbarMain setActiveCategory={handleCategoryChange} />
        <NavbarBottom setActiveCategory={handleCategoryChange} />
      </header>
      
      <main className={styles.mainContent}>
        {searchQuery ? (
          <SearchResults
            query={searchQuery}
          />
        ) : (
          <>
            <section className={mainNewsClasses}>{renderMainContent()}</section>

            {activeCategory === CATEGORY_GENERAL && (
              <aside className={styles.asideWrap}>
                <Weather />
                <p className={styles.asideMostRead}>Mais Lidas</p>
                <NewsAside />
              </aside>
            )}
          </>
        )}
      </main>

      <footer>
        <Footer />
      </footer>
    </section>
  );
}
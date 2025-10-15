// page.tsx
"use client";

import styles from "../styles/index.module.css";
import { NavbarTop } from "../components/NavbarTop";
import { NavbarMain } from "../components/NavbarMain";
import NavbarBottom from "../components/NavbarBottom";
import { MainNews } from "@/components/MainNews";
import Weather from "@/components/Weather";
import NewsAside from "@/components/NewsAside";

// Importar o novo componente de Entretenimento
import Entertainment from "@/components/Entertainment";
// Importar os tipos de categoria do config
import {
  CATEGORY_GENERAL,
  CATEGORY_BUSINESS,
  CATEGORY_ENTERTAINMENT,
  CATEGORY_SPORTS,
  CATEGORY_SCIENCE,
  CATEGORY_HEALTH,
  CATEGORY_TECHNOLOGY,
} from "../utils/config";
import { useState } from "react"; // Importar useState

export default function Home() {
  // Estado para controlar qual categoria de notícias está ativa
  // Por padrão, exibimos o conteúdo geral (MainNews)
  const [activeCategory, setActiveCategory] =
    useState<string>(CATEGORY_GENERAL);

  // Função para renderizar o conteúdo principal baseado na categoria ativa
  const renderMainContent = () => {
    switch (activeCategory) {
      case CATEGORY_GENERAL:
        return <MainNews />;
      case CATEGORY_ENTERTAINMENT:
        return <Entertainment />;
      // Adicione aqui os outros componentes de categoria quando criá-los
      // case CATEGORY_BUSINESS:
      //   return <BusinessNews />;
      // case CATEGORY_SPORTS:
      //   return <SportsNews />;
      // ...
      default:
        return <MainNews />; // Fallback para MainNews, pode ser Entertainment também ou uma página de erro
    }
  };

  // Determinar as classes CSS para a seção principal de notícias
  const mainNewsClasses = `${styles.mainNews} ${
    activeCategory !== CATEGORY_GENERAL ? styles.mainNewsNoAside : ""
  }`;

  return (
    <section className={styles.container}>
      <header>
        <NavbarTop />
        <NavbarMain />
        {/* Passamos o setter do estado para NavbarBottom */}
        <NavbarBottom setActiveCategory={setActiveCategory} />
      </header>

      <main className={styles.mainContent}>
        {/* Aplicamos as classes dinamicamente aqui */}
        <section className={mainNewsClasses}>
          {/* Renderiza o conteúdo dinâmico aqui */}
          {renderMainContent()}
        </section>

        {/* Lógica condicional para a aside */}
        {activeCategory === CATEGORY_GENERAL && (
          <aside className={styles.asideWrap}>
            <Weather />
            <p className={styles.asideMostRead}>Mais Lidas</p>
            <NewsAside />
          </aside>
        )}
      </main>

      <footer>
        <section id="footer"></section>
      </footer>
    </section>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/NavbarTop.module.css";

interface NavbarTopProps {
  onSearch: (query: string) => void;
}

export const NavbarTop: React.FC<NavbarTopProps> = ({ onSearch }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await fetch("https://worldtimeapi.org/api/timezone/America/Sao_Paulo");
        const data = await response.json();
        const currentDateTime = new Date(data.datetime);
        const formattedDate = currentDateTime.toLocaleString("pt-BR", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        setDate(formattedDate);
      } catch (error) {
        console.error("Erro ao obter a data:", error);
      }
    };
    fetchDate();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query);
      setQuery("");
      setShowSearch(false);
    }
  };

  const toggleSearch = () => setShowSearch((prev) => !prev);

  return (
    <section className={styles.navbarTopWrap}>
      <section
        className={`${styles.navDateWrap} ${
          showSearch && window.innerWidth <= 620 ? styles.hidden : ""
        }`}
      >
        <span className={styles.navDate}>{date}</span>
      </section>

      <section
        className={`${styles.navSearch} ${
          showSearch && window.innerWidth <= 620 ? styles.expanded : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          onClick={toggleSearch}
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M18.319 14.433A8.001 8.001 0 0 0 6.343 3.868a8 8 0 0 0 10.564 11.976l.043.045l4.242 4.243a1 1 0 1 0 1.415-1.415l-4.243-4.242zm-2.076-9.15a6 6 0 1 1-8.485 8.485a6 6 0 0 1 8.485-8.485"
          />
        </svg>

        {showSearch && (
          <input
            id="search-field"
            type="text"
            placeholder="BUSCAR"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className={styles.searchField}
          />
        )}
      </section>
    </section>
  );
};
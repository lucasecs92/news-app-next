// NavbarBottom.tsx
"use client";

import { useEffect, useState } from "react";
import styles from "../styles/NavbarBottom.module.css";
// Importar os tipos de categoria do config
import {
  CATEGORY_ENTERTAINMENT,
  CATEGORY_BUSINESS,
  CATEGORY_SPORTS,
  CATEGORY_HEALTH,
  CATEGORY_TECHNOLOGY,
  CATEGORY_SCIENCE,
} from "../utils/config";

// Definir as props esperadas por NavbarBottom
interface NavbarBottomProps {
  setActiveCategory: (category: string) => void;
}

const NavbarBottom: React.FC<NavbarBottomProps> = ({ setActiveCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (window.innerWidth < 870) setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 870) setIsMenuOpen(true);
      else setIsMenuOpen(false);
    };

    const handleScroll = () => {
      const navbarMain = document.querySelector("#navbar-main");
      if (navbarMain) {
        setIsFixed(window.scrollY >= navbarMain.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    handleResize();
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="nav-bottom-wrap"
      className={`${styles.navBottomWrap} ${isFixed ? styles.fixed : ""}`}
    >
      <menu className={styles.menuIcons} onClick={toggleMenu}>
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </svg>
        )}
      </menu>

      <ul
        className={styles.ulList}
        style={{
          display: isMenuOpen || window.innerWidth >= 870 ? "flex" : "none",
        }}
      >
        {[
          { name: "Entretenimento", category: CATEGORY_ENTERTAINMENT },
          { name: "Negócios", category: CATEGORY_BUSINESS },
          { name: "Esportes", category: CATEGORY_SPORTS },
          { name: "Saúde", category: CATEGORY_HEALTH },
          { name: "Tecnologia", category: CATEGORY_TECHNOLOGY },
          { name: "Ciência", category: CATEGORY_SCIENCE },
        ].map((item) => (
          <li key={item.name} className={styles.ulListItem}>
            <a onClick={() => handleCategoryClick(item.category)}>{item.name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NavbarBottom;
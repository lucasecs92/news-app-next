"use client";

import { useEffect, useState } from "react";
import styles from "../styles/NavbarBottom.module.css";
import {
  CATEGORY_ENTERTAINMENT,
  CATEGORY_BUSINESS,
  CATEGORY_SPORTS,
  CATEGORY_HEALTH,
  CATEGORY_TECHNOLOGY,
  CATEGORY_SCIENCE,
} from "../utils/config";

interface NavbarBottomProps {
  setActiveCategory: (category: string) => void;
}

const NavbarBottom: React.FC<NavbarBottomProps> = ({ setActiveCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (window.innerWidth < 870) setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      // Atualiza o estado que controla se a tela é larga
      setIsWideScreen(window.innerWidth >= 870);

      // Mantém a lógica de abrir/fechar o menu em telas maiores
      if (window.innerWidth >= 870) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      const navbarMain = document.querySelector("#navbar-main");
      if (navbarMain) {
        // O acesso ao 'window' aqui é seguro pois useEffect só roda no cliente
        setIsFixed(window.scrollY >= navbarMain.clientHeight);
      }
    };

    // Adiciona os event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Roda as funções uma vez no início para definir os estados iniciais
    handleResize();
    handleScroll();

    // Função de limpeza para remover os listeners quando o componente for desmontado
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez, na montagem do componente no cliente

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
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
          </svg>
        )}
      </menu>

      <ul
        className={styles.ulList}
        style={{
          display: isMenuOpen || isWideScreen ? "flex" : "none",
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
import { useEffect, useState } from "react";
import styles from "../styles/NavbarBottom.module.css";
import {
  loadEntertainmentContent,
  loadBusinessContent,
  loadSportsContent,
  loadHealthContent,
  loadTechnologyContent,
  loadScienceContent,
} from "../utils/contentLoaders";

const NavbarBottom: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleCategoryClick = (callback: () => void) => {
    callback();
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
        style={{ display: isMenuOpen || window.innerWidth >= 870 ? "flex" : "none" }}
      >
        {[
          { name: "Entretenimento", action: loadEntertainmentContent },
          { name: "Negócios", action: loadBusinessContent },
          { name: "Esportes", action: loadSportsContent },
          { name: "Saúde", action: loadHealthContent },
          { name: "Tecnologia", action: loadTechnologyContent },
          { name: "Ciência", action: loadScienceContent },
        ].map((item) => (
          <li key={item.name} className={styles.ulListItem}>
            <a onClick={() => handleCategoryClick(item.action)}>{item.name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NavbarBottom;

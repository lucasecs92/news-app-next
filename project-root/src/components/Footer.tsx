import React from 'react';
import styles from '../styles/Footer.module.css'; 

const Footer = () => {
  return (
    <section className={styles.footerContainer}>
      <p>
        <span>&copy;</span> 2024 - News App
      </p>
      <nav className={styles.footerNav}>
        <ul>
          <li>
            <a href="#">Sobre</a>
          </li>
          <li>
            <a href="#">Contato</a>
          </li>
          <li>
            <a href="#">Políticas de Privacidade</a>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default Footer;
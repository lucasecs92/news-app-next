// src/components/Entertainment.tsx
"use client";

import React, { useEffect, useState } from "react";
import { API_URL, API_KEY, COUNTRY, CATEGORY_ENTERTAINMENT } from "../utils/config";
import styles from "../styles/NewsCard.module.css"; // Vamos usar CSS Modules
import { timeSince } from "../utils/utils"; // Certifique-se de que este caminho está correto

// Definindo a interface para um artigo de notícia
interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
  // Adicione outros campos se precisar
}

const Entertainment: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntertainmentNews = async () => {
      setLoading(true);
      setError(null); // Limpa qualquer erro anterior
      try {
        const response = await fetch(
          `${API_URL}?token=${API_KEY}&country=${COUNTRY}&topic=${CATEGORY_ENTERTAINMENT}`
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        // Filtra artigos removidos e sem descrição
        const filteredArticles = data.articles.filter(
          (article: Article) =>
            article.title !== "[Removed]" && article.description !== null
        );
        setArticles(filteredArticles);
      } catch (err) {
        console.error("Erro ao buscar notícias de entretenimento: ", err);
        setError(
          "Não foi possível carregar as notícias de Entretenimento. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEntertainmentNews();
  }, []); // O array de dependências vazio significa que ele é executado apenas uma vez ao montar o componente

  if (loading) {
    return <p className={styles.loadingMessage}>Carregando notícias de Entretenimento...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  return (
    <section id="entertainment-content">
      <h2 className={styles.newsCardTitle}>Entretenimento</h2>
      {articles.length === 0 && !loading && !error ? (
        <p>Nenhuma notícia de Entretenimento encontrada.</p>
      ) : (
        articles.map((article, index) => (
          <section key={index} className={styles.newsCard}>
            <section className={styles.cardBody}>
              <img
                src={article.image || "https://via.placeholder.com/150"} // Fallback para imagem
                className={styles.newsImg}
                alt={article.title}
                title={article.title}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "https://via.placeholder.com/150") {
                        target.src = "https://via.placeholder.com/150"; // Tenta um fallback genérico
                    }
                }}
              />
              <section className={styles.newsText}>
                <h2 className={styles.navNewsTitle}>{article.title}</h2>
                <p className={styles.navNewsDescription}>{article.description}</p>
                <p className={styles.navNewsTimePublished}>
                  {timeSince(article.publishedAt)}
                </p>
              </section>
            </section>
          </section>
        ))
      )}
    </section>
  );
};

export default Entertainment;
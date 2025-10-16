"use client";

import React, { useEffect, useState } from "react";
import { API_URL, API_KEY, COUNTRY, CATEGORY_HEALTH } from "../utils/config";
import styles from "../styles/NewsCard.module.css";
import { timeSince } from "../utils/utils";

interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
}

const Health: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthNews = async () => {
      setLoading(true);
      setError(null);
      try {
        if (process.env.NODE_ENV === "development") {
          const cacheKey = "newsData_health";
          const cachedNews = sessionStorage.getItem(cacheKey);

          if (cachedNews) {
            console.log("🗂️ [Health] Usando dados do cache (sessionStorage).");
            setArticles(JSON.parse(cachedNews));
            setLoading(false);
            return;
          }
        }

        const response = await fetch(
          `${API_URL}?token=${API_KEY}&country=${COUNTRY}&topic=${CATEGORY_HEALTH}`
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        const filteredArticles = data.articles.filter(
          (article: Article) =>
            article.title !== "[Removed]" && article.description !== null
        );
        
        if (process.env.NODE_ENV === "development") {
          const cacheKey = "newsData_health";
          console.log("📡 [Health] Buscando da API e salvando no cache (sessionStorage).");
          sessionStorage.setItem(cacheKey, JSON.stringify(filteredArticles));
        }

        setArticles(filteredArticles);
      } catch (err) {
        console.error("Erro ao buscar notícias de saúde: ", err);
        setError(
          "Não foi possível carregar as notícias de Saúde. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealthNews();
  }, []);

  if (loading) {
    return <p className={styles.loadingMessage}>Carregando notícias de Saúde...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  return (
    <section id="health-content">
      <h2 className={styles.newsCardTitle}>Saúde</h2>
      {articles.length === 0 && !loading && !error ? (
        <p>Nenhuma notícia de Saúde encontrada.</p>
      ) : (
        articles.map((article, index) => (
          <section key={index} className={styles.newsCard}>
            <section className={styles.cardBody}>
              <img
                src={article.image || "https://via.placeholder.com/150"}
                className={styles.newsImg}
                alt={article.title}
                title={article.title}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "https://via.placeholder.com/150") {
                        target.src = "https://via.placeholder.com/150";
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

export default Health;
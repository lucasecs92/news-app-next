"use client";

import { useEffect, useState } from "react";
import styles from "../styles/MainNews.module.css";
import { API_URL, API_KEY, COUNTRY, CATEGORY_GENERAL } from "../utils/config";
import { timeSince, displayError } from "../utils/utils";

export interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
}

export const MainNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await fetch(
          `${API_URL}?token=${API_KEY}&country=${COUNTRY}&topic=${CATEGORY_GENERAL}`
        );
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data = await response.json();

        if (!data.articles || !Array.isArray(data.articles))
          throw new Error("Resposta inválida da API");

        const validArticles = data.articles.filter(
          (a: Article) => a.title !== "[Removed]" && a.description
        );

        setArticles(validArticles);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao buscar notícias. Por favor, tente novamente mais tarde.";
        setError(message);
        displayError(message);
      }
    };

    getNews();
  }, []);

  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <section id="main-news">
      {articles.map((article, index) => (
        <section
          key={index}
          className={styles.mainNewsCard}
          id={`main-news-card-${index}`}
        >
          <section className={styles.cardBody}>
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                title={article.title}
                className={styles.mainNewsImg}
              />
            )}
            <section className={styles.mainNewsText}>
              <h2 className={styles.mainNewsTitle}>{article.title}</h2>
              <p className={styles.mainNewsDescription}>
                {article.description}
              </p>
              <p className={styles.mainNewsTimePublished}>
                {timeSince(article.publishedAt)}
              </p>
            </section>
          </section>
        </section>
      ))}
    </section>
  );
};

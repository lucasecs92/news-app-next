// Entertainment.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { NEWS_API_PROXY_URL, COUNTRY, CATEGORY_ENTERTAINMENT } from "../utils/config"; // <- Categoria correta
import styles from "../styles/NewsCard.module.css";
import { timeSince, displayError } from "../utils/utils";

interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
  url?: string; // Adicionado
}

const Entertainment: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchEntertainmentNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const cacheKey = `newsData_${CATEGORY_ENTERTAINMENT}`; // <- Chave de cache correta

        if (process.env.NODE_ENV === "development") {
          const cachedNews = sessionStorage.getItem(cacheKey);
          if (cachedNews) {
            console.log(`🗂️ [${CATEGORY_ENTERTAINMENT}] Usando dados do cache (sessionStorage).`);
            if (!ignore) {
              setArticles(JSON.parse(cachedNews));
              setLoading(false);
            }
            return;
          }
        }

        const response = await fetch(
          `${NEWS_API_PROXY_URL}/${CATEGORY_ENTERTAINMENT}?country=${COUNTRY}` // <- URL correta
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Erro HTTP! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.articles)) {
          throw new Error("Resposta inválida da API.");
        }

        if (!ignore) {
          const filteredArticles = data.articles.filter(
            (article: Article) =>
              article.title !== "[Removed]" &&
              article.description !== null &&
              article.image
          );

          if (process.env.NODE_ENV === "development") {
            console.log(`📡 [${CATEGORY_ENTERTAINMENT}] Buscando do Proxy e salvando no cache (sessionStorage).`);
            sessionStorage.setItem(cacheKey, JSON.stringify(filteredArticles));
          }
          setArticles(filteredArticles);
        }
      } catch (err) {
        if (!ignore) {
          console.error(`Erro ao buscar notícias de ${CATEGORY_ENTERTAINMENT}: `, err);
          const message =
            err instanceof Error
              ? err.message
              : `Não foi possível carregar as notícias de ${CATEGORY_ENTERTAINMENT}. Tente novamente mais tarde.`;
          setError(message);
          displayError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchEntertainmentNews();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <p className={styles.loadingMessage}>Carregando notícias de Entretenimento...</p>; // <- Mensagem correta
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <section id="entertainment-content"> {/* <- ID correto */}
      <h2 className={styles.newsCardTitle}>Entretenimento</h2> {/* <- Título correto */}
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <a
            key={index}
            href={article.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.newsCard}
          >
            <section className={styles.cardBody}>
              <Image
                src={article.image}
                className={styles.newsImg}
                alt={article.title}
                title={article.title}
                width={300}
                height={300}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-news-image.jpg';
                  (e.target as HTMLImageElement).alt = 'Imagem não disponível';
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
          </a>
        ))
      ) : (
        <p className={styles.noResultsMessage}>Nenhuma notícia de Entretenimento encontrada.</p> 
      )}
    </section>
  );
};

export default Entertainment;
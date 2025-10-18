"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/SearchResults.module.css";
import { NEWS_API_PROXY_URL, COUNTRY, CATEGORY_GENERAL } from "../utils/config";
import { timeSince, displayError } from "../utils/utils";

export interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
  url?: string;
}

interface SearchResultsProps {
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setArticles([]);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    const fetchArticles = async (searchTerm: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${NEWS_API_PROXY_URL}/${CATEGORY_GENERAL}?q=${encodeURIComponent(searchTerm)}&country=${COUNTRY}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Erro ao buscar resultados: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.articles)) {
          throw new Error("Resposta inválida da API.");
        }

        if (!ignore) {
          const validArticles = data.articles.filter(
            (a: Article) => a.title !== "[Removed]" && a.description !== null && a.image
          );
          setArticles(validArticles);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Erro ao buscar notícias:", err);
          const message =
            err instanceof Error
              ? err.message
              : "Erro desconhecido ao buscar notícias. Tente novamente mais tarde.";
          setError(message);
          displayError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchArticles(query);
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(debounceTimeout);
    };
  }, [query]);

  return (
    <section className={styles.searchResultsContainer}>
      <section className={styles.searchResultsHeader}>
        <h2 className={styles.searchResultsCardTitle}>Resultados para: {query}</h2>
      </section>

      <section className={styles.searchResultsContent}>
        {loading && <p className={styles.loadingMessage}>Carregando resultados para {query}...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {!loading && !error && articles.length === 0 && query.trim() && (
          <p className={styles.noResultsMessage}>Nenhum resultado encontrado para {query}.</p>
        )}
        {!loading && !error && articles.length === 0 && !query.trim() && (
          <p className={styles.noResultsMessage}>Digite algo para iniciar a busca.</p>
        )}

        {!loading && !error && articles.map((article, index) => (
          <a
            key={index}
            href={article.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resultSearchCard}
          >
            <section className={styles.resultCardBody}>
              {article.image && (
                <Image
                  src={article.image}
                  className={styles.resultNewsImg}
                  alt={article.title}
                  title={article.title}
                  width={400}
                  height={250}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-news-image.jpg';
                    (e.target as HTMLImageElement).alt = 'Imagem não disponível';
                  }}
                />
              )}
              <section className={styles.resultNewsText}>
                <h2 className={styles.resultNewsTitle}>{article.title}</h2>
                <p className={styles.resultNewsP}>{article.description}</p>
              </section>
              <p className={styles.resultNewsTimePublished}>{timeSince(article.publishedAt)}</p>
            </section>
          </a>
        ))}
      </section>
    </section>
  );
};
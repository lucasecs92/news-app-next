// SearchResults.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/SearchResults.module.css";
import { NEWS_API_PROXY_URL, COUNTRY } from "../utils/config"; // Importe NEWS_API_PROXY_URL e COUNTRY
import { timeSince, displayError } from "../utils/utils"; // Assumindo que displayError está em utils

export interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
  url?: string; // Adicionado URL para o link do artigo original (API GNews geralmente fornece)
}

interface SearchResultsProps {
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se a query estiver vazia, não fazemos a busca
    if (!query.trim()) {
      setArticles([]);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false; // Flag para ignorar efeitos obsoletos (útil com React.StrictMode)
    const fetchArticles = async (searchTerm: string) => {
      setLoading(true);
      setError(null);
      try {
        // Chamando seu próprio API Route para evitar problemas de CORS
        const response = await fetch(
          `${NEWS_API_PROXY_URL}?q=${encodeURIComponent(searchTerm)}&country=${COUNTRY}`
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
          // Filtra artigos que não foram removidos, têm descrição e imagem
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
          displayError(message); // Exibe o erro usando sua função utilitária
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    // Adiciona um debounce para não fazer muitas requisições enquanto o usuário digita
    const debounceTimeout = setTimeout(() => {
      fetchArticles(query);
    }, 500); // Espera 500ms após a última digitação

    return () => {
      ignore = true; // Marca o efeito como obsoleto na limpeza
      clearTimeout(debounceTimeout); // Limpa o timeout se o componente for desmontado ou a query mudar
    };
  }, [query]); // O efeito é re-executado quando a query muda

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
          // Usar um link <a> para o artigo original é uma boa prática
          <a
            key={index}
            href={article.url || "#"} // Link para a URL do artigo ou para # se não houver
            target="_blank"           // Abre em uma nova aba
            rel="noopener noreferrer" // Medida de segurança para links externos
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
                  // Removido 'unoptimized'. Deixe o Next.js otimizar as imagens.
                  // Se houver problemas com imagens específicas, considere reavaliar.
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-news-image.jpg'; // Imagem de fallback
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
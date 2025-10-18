// Science.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { NEWS_API_PROXY_URL, COUNTRY, CATEGORY_SCIENCE } from "../utils/config";
import styles from "../styles/NewsCard.module.css";
import { timeSince, displayError } from "../utils/utils"; // Importe displayError

interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
  url?: string; // Adicionado: URL para o artigo original
}

const Science: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false; // Flag para ignorar efeitos obsoletos (React.StrictMode)

    const fetchScienceNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const cacheKey = `newsData_${CATEGORY_SCIENCE}`;

        // Lógica de cache em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          const cachedNews = sessionStorage.getItem(cacheKey);
          if (cachedNews) {
            console.log(`🗂️ [${CATEGORY_SCIENCE}] Usando dados do cache (sessionStorage).`);
            if (!ignore) {
              setArticles(JSON.parse(cachedNews));
              setLoading(false);
            }
            return;
          }
        }

        // Alteração aqui: Chame seu API Route
        const response = await fetch(
          `${NEWS_API_PROXY_URL}/${CATEGORY_SCIENCE}?country=${COUNTRY}`
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
          // Filtra artigos que não foram removidos, têm descrição e imagem
          const filteredArticles = data.articles.filter(
            (article: Article) =>
              article.title !== "[Removed]" &&
              article.description !== null &&
              article.image // Garante que o artigo tem uma imagem
          );

          // Lógica de cache em desenvolvimento (salvando após buscar do proxy)
          if (process.env.NODE_ENV === "development") {
            console.log(`📡 [${CATEGORY_SCIENCE}] Buscando do Proxy e salvando no cache (sessionStorage).`);
            sessionStorage.setItem(cacheKey, JSON.stringify(filteredArticles));
          }
          setArticles(filteredArticles);
        }
      } catch (err) {
        if (!ignore) {
          console.error(`Erro ao buscar notícias de ${CATEGORY_SCIENCE}: `, err);
          const message =
            err instanceof Error
              ? err.message
              : `Não foi possível carregar as notícias de ${CATEGORY_SCIENCE}. Tente novamente mais tarde.`;
          setError(message);
          displayError(message); // Usa a função displayError
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchScienceNews();

    return () => {
      ignore = true; // Marca o efeito como obsoleto na limpeza
    };
  }, []); // Dependência vazia, executa uma vez ao montar

  if (loading) return <p className={styles.loadingMessage}>Carregando notícias de Ciência...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <section id="science-content">
      <h2 className={styles.newsCardTitle}>Ciência</h2>
      {articles.length > 0 ? (
        articles.map((article, index) => (
          // Alteração aqui: Envolver o cartão em um link
          <a
            key={index}
            href={article.url || "#"} // Link para o URL do artigo, ou '#' como fallback
            target="_blank"           // Abre em uma nova aba
            rel="noopener noreferrer" // Medida de segurança para links externos
            className={styles.newsCard} // Aplica o estilo do cartão ao link
          >
            <section className={styles.cardBody}>
              <Image
                src={article.image} // Não precisa de fallback aqui se já filtramos por `article.image`
                className={styles.newsImg}
                alt={article.title}
                title={article.title}
                width={300}
                height={300}
                onError={(e) => {
                  // Fallback para imagem local caso a URL da imagem falhe ao carregar
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
        <p className={styles.noResultsMessage}>Nenhuma notícia de Ciência encontrada.</p> // Mensagem aprimorada
      )}
    </section>
  );
};

export default Science;
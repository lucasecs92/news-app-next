// MainNews.tsx (Exemplo)
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/MainNews.module.css";
import { NEWS_API_PROXY_URL, COUNTRY, CATEGORY_GENERAL } from "../utils/config"; // Importe NEWS_API_PROXY_URL
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
  const [loading, setLoading] = useState<boolean>(true); // Adiciona estado de loading

  useEffect(() => {
    const getNews = async () => {
      setLoading(true); // Inicia o loading
      setError(null);    // Limpa erros anteriores
      try {
        const cacheKey = `newsData_${CATEGORY_GENERAL}`;

        // No ambiente de produção, você pode considerar ter seu API Route
        // também gerenciando um cache mais sofisticado, mas para o cliente,
        // o sessionStorage ainda pode ser útil para reduzir chamadas ao proxy.
        // No entanto, é importante que o cache seja invalidado ou atualizado.
        if (process.env.NODE_ENV === "development") {
          const cachedNews = sessionStorage.getItem(cacheKey);
          if (cachedNews) {
            console.log("[MainNews] Usando dados do cache (sessionStorage).");
            setArticles(JSON.parse(cachedNews));
            setLoading(false);
            return;
          }
        }

        // ALTERAÇÃO AQUI: Chame seu API Route
        const response = await fetch(
          `${NEWS_API_PROXY_URL}/${CATEGORY_GENERAL}?country=${COUNTRY}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Erro ao buscar notícias: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.articles || !Array.isArray(data.articles))
          throw new Error("Resposta inválida da API");

        const validArticles = data.articles.filter(
          (a: Article) => a.title !== "[Removed]" && a.description && a.image // Garante que a imagem também exista
        );

        if (process.env.NODE_ENV === "development") {
           console.log("📡 [MainNews] Buscando do Proxy e salvando no cache (sessionStorage).");
           sessionStorage.setItem(cacheKey, JSON.stringify(validArticles));
        }

        setArticles(validArticles);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao buscar notícias. Por favor, tente novamente mais tarde.";
        setError(message);
        displayError(message);
      } finally {
        setLoading(false); // Finaliza o loading
      }
    };

    getNews();
  }, []);

  if (loading && articles.length === 0) { // Mostra loading apenas se não houver artigos e estiver carregando
    return <p className={styles.loadingMessage}>Carregando notícias principais...</p>;
  }

  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <section id="main-news">
      {articles.length === 0 && !loading && !error && (
        <p className={styles.errorMessage}>Nenhuma notícia encontrada.</p> // Caso não haja artigos e não esteja carregando
      )}
      {articles.map((article, index) => (
        <section
          key={index}
          className={styles.mainNewsCard}
          id={`main-news-card-${index}`}
        >
          <section className={styles.cardBody}>
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                title={article.title}
                className={styles.mainNewsImg}
                width={500}
                height={300}
                priority={index < 3}
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
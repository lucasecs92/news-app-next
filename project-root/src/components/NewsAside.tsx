"use client";

import { useEffect, useState } from "react";
import styles from "../styles/NewsAside.module.css";
import { API_URL, API_KEY, COUNTRY, CATEGORY_ENTERTAINMENT } from "../utils/config";
import { timeSince, displayError } from "../utils/utils";

interface Article {
  title: string;
  description: string | null;
  image: string;
  author?: string;
  publishedAt: string;
}

export default function NewsAside() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Evita consumo da API durante desenvolvimento sem chave
    if (!API_KEY) {
      console.warn("⚠️ API_KEY ausente. Renderizando dados mockados para evitar consumo da API.");
      const mockArticles: Article[] = [
        {
          title: "Título de exemplo (mock)",
          description: "Descrição simulada para testar o layout do componente NewsAside.",
          image: "https://via.placeholder.com/300x200",
          author: "Autor Fictício",
          publishedAt: new Date().toISOString(),
        },
      ];
      setArticles(mockArticles);
      return;
    }

    const fetchNews = async () => {
      try {
        console.log("📰 Buscando notícias do GNews...");
        const res = await fetch(
          `${API_URL}?token=${API_KEY}&country=${COUNTRY}&topic=${CATEGORY_ENTERTAINMENT}`
        );

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data = await res.json();
        console.log("✅ Dados recebidos:", data);

        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          throw new Error("Resposta inesperada da API");
        }
      } catch (err) {
        console.error("❌ Erro ao buscar notícias:", err);
        const msg = displayError("Erro ao buscar notícias.");
        setError(msg);
      }
    };

    fetchNews();
  }, []);

  return (
    <section>
      {error && <p>{error}</p>}

      {articles.length === 0 && !error && (
        <p>Carregando notícias...</p>
      )}

      {articles.map((article, index) => {
        if (article.title === "[Removed]" || article.description === null) return null;
        const timeElapsed = timeSince(article.publishedAt);

        return (
          <section
            key={index}
            className={styles.newsCardAside}
          >
            <section className={styles.cardBodyAside}>
              <img
                src={article.image}
                alt={article.title}
                title={article.title}
                className={styles.newsImgAside}
              />
              <section className={styles.newsTextAside}>
                <p className={styles.newsAuthor}>{article.author || ""}</p>
                <h2 className={styles.newsTitleAside}>{article.title}</h2>
                <p className={styles.newsDescription}>{article.description}</p>
                <p className={styles.newsTimePublished}>{timeElapsed}</p>
              </section>
            </section>
          </section>
        );
      })}
    </section>
  );
}

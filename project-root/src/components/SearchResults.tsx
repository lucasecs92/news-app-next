import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/SearchResults.module.css";
import { API_URL, API_KEY } from "../utils/config";
import { timeSince } from "../utils/utils";

export interface Article {
  title: string;
  description: string | null;
  image: string;
  publishedAt: string;
}

interface SearchResultsProps {
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para controlar o efeito e evitar chamadas duplicadas em desenvolvimento (React.StrictMode)
  const effectRan = useRef(false);

  useEffect(() => {
    const fetchArticles = async (searchTerm: string) => {
      if (!searchTerm.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(searchTerm)}&token=${API_KEY}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.articles)) throw new Error("Resposta inválida da API.");
        const validArticles = data.articles.filter(
          (a: Article) => a.title !== "[Removed]" && a.description !== null
        );
        setArticles(validArticles);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        setError("Erro ao buscar notícias.");
      } finally {
        setLoading(false);
      }
    };
    
    // Em modo de desenvolvimento, o StrictMode monta, desmonta e remonta o componente.
    // Esta lógica garante que a API seja chamada apenas uma vez.
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
        fetchArticles(query);
    }

    return () => {
        // Na primeira renderização (em dev), a cleanup function roda e define o ref como true.
        // Na segunda renderização (remontagem), a condição do if acima é satisfeita e a API é chamada.
        effectRan.current = true;
    };
  }, [query]);

  return (
    // Este container agora preenche o espaço da tag <main>
    <section className={styles.searchResultsContainer}>
      <section className={styles.searchResultsHeader}>
        <h2 className={styles.searchResultsCardTitle}>Resultados para: {query}</h2>
      </section>

      <section className={styles.searchResultsContent}>
        {loading && <p className={styles.loadingMessage}>Carregando resultados...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {!loading && !error && articles.length === 0 && <p>Nenhum resultado encontrado.</p>}

        {!loading && !error && articles.map((article, index) => (
          <section key={index} className={styles.resultSearchCard}>
            <section className={styles.resultCardBody}>
              {article.image && (
                <Image
                  src={article.image}
                  className={styles.resultNewsImg}
                  alt={article.title}
                  title={article.title}
                  width={400}
                  height={250}
                  unoptimized
                />
              )}
              <section className={styles.resultNewsText}>
                <h2 className={styles.resultNewsTitle}>{article.title}</h2>
                <p className={styles.resultNewsP}>{article.description}</p>
              </section>
              <p className={styles.resultNewsTimePublished}>{timeSince(article.publishedAt)}</p>
            </section>
          </section>
        ))}
      </section>
    </section>
  );
};
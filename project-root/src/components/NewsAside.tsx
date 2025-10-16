"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../styles/NewsAside.module.css";
import { API_URL, API_KEY, COUNTRY, CATEGORY_ENTERTAINMENT } from "../utils/config";
import { timeSince } from "../utils/utils";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface Article {
  title: string;
  description: string | null;
  image: string;
  author?: string;
  publishedAt: string;
}

// Componente auxiliar para renderizar um card de artigo com estilos flexíveis
// Nenhuma alteração necessária neste componente auxiliar
const ArticleCard = ({
  article,
  index,
  layoutClasses = [],
  cardBodyClasses = [],
  imageClass,
  textClasses = [],
  titleClass = styles.newsTitleBase,
  descriptionClass = styles.newsDescriptionBase,
  timePublishedClass = styles.newsTimePublishedBase,
  authorClass = styles.newsAuthorBase,
  showDescription = true,
  style = {},
}: {
  article: Article;
  index: number;
  layoutClasses?: string[];
  cardBodyClasses?: string[];
  imageClass: string;
  textClasses?: string[];
  titleClass?: string;
  descriptionClass?: string;
  timePublishedClass?: string;
  authorClass?: string;
  showDescription?: boolean;
  style?: React.CSSProperties;
}) => {
  if (!article || article.title === "[Removed]" || article.description === null) return null;
  
  const timeElapsed = timeSince(article.publishedAt);

  return (
    <section key={index} className={`${styles.newsCardBase} ${layoutClasses.join(' ')}`} style={style}>
      <section className={`${styles.cardBodyBase} ${cardBodyClasses.join(' ')}`}>
        <img src={article.image} alt={article.title} title={article.title} className={imageClass} />
        <section className={`${styles.newsTextBase} ${textClasses.join(' ')}`}>
          <p className={authorClass}>{article.author || ""}</p>
          <h2 className={titleClass}>{article.title}</h2>
          {showDescription && <p className={descriptionClass}>{article.description}</p>}
          <p className={timePublishedClass}>{timeElapsed}</p>
        </section>
      </section>
    </section>
  );
};

export default function NewsAside() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  const baseCardsPerPage = 2;
  const [effectiveCardsPerPage, setEffectiveCardsPerPage] = useState(baseCardsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const [translateXOffset, setTranslateXOffset] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Lógica para evitar consumo de API em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          const cacheKey = "newsData_aside";
          const cachedNews = sessionStorage.getItem(cacheKey);

          if (cachedNews) {
            console.log("🗂️ [NewsAside] Usando dados do cache (sessionStorage).");
            setArticles(JSON.parse(cachedNews));
            return; // Interrompe a execução para não chamar a API
          }
        }

        const res = await fetch(
          `${API_URL}?token=${API_KEY}&country=${COUNTRY}&topic=${CATEGORY_ENTERTAINMENT}`
        );

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data = await res.json();
        
        if (data.articles && Array.isArray(data.articles)) {
          const validArticles = data.articles.slice(0, 15);

          // Armazena os dados no cache após a chamada em desenvolvimento
          if (process.env.NODE_ENV === "development") {
             const cacheKey = "newsData_aside";
             console.log("📡 [NewsAside] Buscando da API e salvando no cache (sessionStorage).");
             sessionStorage.setItem(cacheKey, JSON.stringify(validArticles));
          }

          setArticles(validArticles);
        } else {
          throw new Error("Resposta inesperada da API");
        }
      } catch (err) {
        console.error("❌ Erro ao buscar notícias:", err);
        setError("Erro ao buscar notícias.");
      }
    };

    fetchNews();
  }, []);

  // Artigos do carrossel (índices 1 a 4 do array original de artigos)
  const carouselArticles = articles.slice(1, 5); 
  const totalCarouselPages = Math.ceil(carouselArticles.length / effectiveCardsPerPage);

  // Lógica para determinar cards por página e calcular o offset de slide
  useEffect(() => {
    const handleResize = () => {
      setEffectiveCardsPerPage(baseCardsPerPage);

      const timeoutId = setTimeout(() => {
        if (carouselViewportRef.current) {
          const viewportWidth = carouselViewportRef.current.offsetWidth;
          setTranslateXOffset(-currentPage * viewportWidth);
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage, effectiveCardsPerPage, carouselArticles.length]);

  // Funções para navegar no carrossel
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalCarouselPages - 1, prev + 1));
  };

  return (
    <section>
      {error && <p className={styles.errorMessage}>{error}</p>}

      {articles.length === 0 && !error && (
        <p className={styles.loadingMessage}>Carregando notícias...</p>
      )}

      {/* GRUPO 1: ARTIGO 1 (Índice 0) */}
      {articles.length > 0 && articles[0] && (
        <ArticleCard
          article={articles[0]}
          index={0}
          layoutClasses={[styles.mainArticleLayout]}
          imageClass={styles.newsImgLarge}
          showDescription={true}
        />
      )}

      {/* GRUPO 2: CARROSSEL (Artigos 2, 3, 4, 5 - Índices 1 a 4) */}
      {carouselArticles.length > 0 && (
        <section className={`${styles.carouselContainer} ${styles.newsCardBase}`}>
          <section ref={carouselViewportRef} className={styles.carouselViewport}>
            <section
              className={styles.carouselInnerTrack}
              style={{ transform: `translateX(${translateXOffset}px)` }}
            >
              {carouselArticles.map((article, indexInCarousel) => {
                const originalIndex = 1 + indexInCarousel;
                const cardWidthStyle = effectiveCardsPerPage === 1 ?
                  { flexBasis: '100%', maxWidth: '100%' } :
                  { flexBasis: `calc(100% / ${effectiveCardsPerPage} - 10px)`, maxWidth: `calc(100% / ${effectiveCardsPerPage} - 10px)` };

                return (
                  <ArticleCard
                    key={originalIndex}
                    article={article}
                    index={originalIndex}
                    layoutClasses={[styles.carouselCardLayout]}
                    imageClass={styles.newsImgCarousel}
                    titleClass={styles.newsTitleCarousel}
                    authorClass={styles.newsAuthorCarousel}
                    timePublishedClass={styles.newsTimePublishedCarousel}
                    showDescription={false}
                    style={cardWidthStyle}
                  />
                );
              })}
            </section>
          </section>
          <section className={styles.carouselNavigationButtons}>
            <button onClick={handlePrevPage} disabled={currentPage === 0} aria-label="Notícia Anterior">
              <MdNavigateBefore />
            </button>
            <button onClick={handleNextPage} disabled={currentPage >= totalCarouselPages - 1} aria-label="Próxima Notícia">
              <MdNavigateNext />
            </button>
          </section>
        </section>
      )}

      {/* GRUPO 1: ARTIGO 6 (Índice 5) - O mesmo estilo do Artigo 1 */}
      {articles.length > 5 && articles[5] && (
        <ArticleCard
          article={articles[5]}
          index={5}
          layoutClasses={[styles.mainArticleLayout]}
          imageClass={styles.newsImgLarge}
          showDescription={true}
        />
      )}

      {/* GRUPO 3: ARTIGOS 7, 8, 9, 10 (Índices 6 a 9) */}
      {articles.length > 9 && (
        <section className={styles.lastFourArticlesGroup}>
          {Array.from({ length: 4 }).map((_, i) => {
            const articleIndex = 6 + i;
            const article = articles[articleIndex];
            if (!article) return null;
            return (
              <ArticleCard
                key={articleIndex}
                article={article}
                index={articleIndex}
                layoutClasses={[styles.lastFourArticleLayout]}
                cardBodyClasses={[styles.cardBodyRowReverse]}
                imageClass={styles.newsImgSmall}
                titleClass={styles.newsTitleLastFour}
                showDescription={false}
              />
            );
          })}
        </section>
      )}

      {/* GRUPO 4: ARTIGOS RESTANTES (Índice 10 em diante) - Estilo de Lista Padrão */}
      {articles.length > 10 && articles.slice(10).map((article, indexInSlice) => {
        const originalIndex = 10 + indexInSlice;
        return (
          <ArticleCard
            key={originalIndex}
            article={article}
            index={originalIndex}
            layoutClasses={[styles.defaultArticleLayout]}
            imageClass={styles.newsImgDefault}
            showDescription={true}
          />
        );
      })}
    </section>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/NewsAside.module.css";
import { NEWS_API_PROXY_URL, COUNTRY, CATEGORY_ENTERTAINMENT } from "../utils/config"; 
import { timeSince } from "../utils/utils";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface Article {
  title: string;
  description: string | null;
  image: string;
  author?: string;
  publishedAt: string;
}

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
  imageWidth,
  imageHeight,
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
  imageWidth: number;
  imageHeight: number;
}) => {
  // Adiciona verificação para image (se gnews não retornar img, pode quebrar)
  if (!article || article.title === "[Removed]" || article.description === null || !article.image) return null;

  const timeElapsed = timeSince(article.publishedAt);

  return (
    <section key={index} className={`${styles.newsCardBase} ${layoutClasses.join(' ')}`} style={style}>
      <section className={`${styles.cardBodyBase} ${cardBodyClasses.join(' ')}`}>
        <Image
          src={article.image}
          alt={article.title}
          title={article.title}
          className={imageClass}
          width={imageWidth}
          height={imageHeight}
          // fallback src para evitar quebras se a imagem for inválida ou não carregar
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-news-image.jpg'; // Crie uma imagem default
            (e.target as HTMLImageElement).alt = 'Image not available';
          }}
        />
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
  const [loading, setLoading] = useState<boolean>(true); // Adiciona estado de loading
  const baseCardsPerPage = 2;
  const [effectiveCardsPerPage, setEffectiveCardsPerPage] = useState(baseCardsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const [translateXOffset, setTranslateXOffset] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true); // Inicia o loading
      setError(null);    // Limpa erros anteriores
      try {
        const cacheKey = `newsData_aside`;

        if (process.env.NODE_ENV === "development") {
          const cachedNews = sessionStorage.getItem(cacheKey);
          if (cachedNews) {
            console.log("🗂️ [NewsAside] Usando dados do cache (sessionStorage).");
            setArticles(JSON.parse(cachedNews));
            setLoading(false);
            return;
          }
        }

        // Chame o API Route
        const res = await fetch(`${NEWS_API_PROXY_URL}/${CATEGORY_ENTERTAINMENT}?country=${COUNTRY}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(`Erro ao buscar notícias: ${errorData.message || res.statusText}`);
        }

        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          const validArticles = data.articles.filter((a: Article) => a.image).slice(0, 15); // Garante que a imagem exista
          if (process.env.NODE_ENV === "development") {
             console.log("📡 [NewsAside] Buscando do Proxy e salvando no cache (sessionStorage).");
             sessionStorage.setItem(cacheKey, JSON.stringify(validArticles));
          }
          setArticles(validArticles);
        } else {
          throw new Error("Resposta inesperada da API");
        }
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao buscar notícias. Por favor, tente novamente mais tarde.";
        setError(message);
      } finally {
        setLoading(false); // Finaliza o loading
      }
    };
    fetchNews();
  }, []);

  const carouselArticles = articles.slice(1, 5);
  const totalCarouselPages = Math.ceil(carouselArticles.length / effectiveCardsPerPage);

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

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(totalCarouselPages - 1, prev + 1));

  return (
    <section>
      {loading && articles.length === 0 && (
        <p className={styles.loadingMessage}>Carregando notícias...</p>
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {articles.length === 0 && !loading && !error && (
        <p className={styles.errorMessage}>Nenhuma notícia encontrada na barra lateral.</p>
      )}

      {articles.length > 0 && articles[0] && (
        <ArticleCard
          article={articles[0]}
          index={0}
          layoutClasses={[styles.mainArticleLayout]}
          imageClass={styles.newsImgLarge}
          imageWidth={400}
          imageHeight={250}
          showDescription={true}
        />
      )}

      {carouselArticles.length > 0 && (
        <section className={`${styles.carouselContainer} ${styles.newsCardBase}`}>
          <section ref={carouselViewportRef} className={styles.carouselViewport}>
            <section className={styles.carouselInnerTrack} style={{ transform: `translateX(${translateXOffset}px)` }}>
              {carouselArticles.map((article, indexInCarousel) => {
                const originalIndex = 1 + indexInCarousel;
                const cardWidthStyle = effectiveCardsPerPage === 1 ? { flexBasis: '100%', maxWidth: '100%' } : { flexBasis: `calc(100% / ${effectiveCardsPerPage} - 10px)`, maxWidth: `calc(100% / ${effectiveCardsPerPage} - 10px)` };
                return (
                  <ArticleCard
                    key={originalIndex}
                    article={article}
                    index={originalIndex}
                    layoutClasses={[styles.carouselCardLayout]}
                    imageClass={styles.newsImgCarousel}
                    imageWidth={200}
                    imageHeight={120}
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
            <button onClick={handlePrevPage} disabled={currentPage === 0} aria-label="Notícia Anterior"><MdNavigateBefore /></button>
            <button onClick={handleNextPage} disabled={currentPage >= totalCarouselPages - 1} aria-label="Próxima Notícia"><MdNavigateNext /></button>
          </section>
        </section>
      )}

      {articles.length > 5 && articles[5] && (
        <ArticleCard
          article={articles[5]}
          index={5}
          layoutClasses={[styles.mainArticleLayout]}
          imageClass={styles.newsImgLarge}
          imageWidth={400}
          imageHeight={250}
          showDescription={true}
        />
      )}

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
                imageWidth={150}
                imageHeight={100}
                titleClass={styles.newsTitleLastFour}
                showDescription={false}
              />
            );
          })}
        </section>
      )}

      {articles.length > 10 && articles.slice(10).map((article, indexInSlice) => {
        const originalIndex = 10 + indexInSlice;
        return (
          <ArticleCard
            key={originalIndex}
            article={article}
            index={originalIndex}
            layoutClasses={[styles.defaultArticleLayout]}
            imageClass={styles.newsImgDefault}
            imageWidth={150}
            imageHeight={100}
            showDescription={true}
          />
        );
      })}
    </section>
  );
}
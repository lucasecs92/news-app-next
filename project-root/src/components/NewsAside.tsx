// NewsAside.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../styles/NewsAside.module.css";
import { API_URL, API_KEY, COUNTRY, CATEGORY_ENTERTAINMENT } from "../utils/config";
import { timeSince } from "../utils/utils"; // displayError foi removido, usando setError diretamente
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface Article {
  title: string;
  description: string | null;
  image: string;
  author?: string;
  publishedAt: string;
}

// Componente auxiliar para renderizar um card de artigo com estilos flexíveis
const ArticleCard = ({
  article,
  index,
  layoutClasses = [], // Classes aplicadas ao <section> externo do card
  cardBodyClasses = [], // Classes aplicadas à section do corpo do card (e.g., para row-reverse)
  imageClass,
  textClasses = [], // Classes para o container de texto
  titleClass = styles.newsTitleBase,
  descriptionClass = styles.newsDescriptionBase,
  timePublishedClass = styles.newsTimePublishedBase,
  authorClass = styles.newsAuthorBase,
  showDescription = true,
  style = {}, // Para estilos inline como flexBasis do carrossel
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
  style?: React.CSSProperties; // Para estilos inline
}) => {
  // Ignora artigos inválidos ou removidos
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

  const baseCardsPerPage = 2; // Exibe 2 cards por vez no desktop
  const [effectiveCardsPerPage, setEffectiveCardsPerPage] = useState(baseCardsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const [translateXOffset, setTranslateXOffset] = useState(0);

  useEffect(() => {
    // Evita consumo da API durante desenvolvimento sem chave
    if (!API_KEY) {
      console.warn("⚠️ API_KEY ausente. Renderizando dados mockados para evitar consumo da API.");
      // Dados mockados garantindo que temos pelo menos 11 artigos para cobrir todos os grupos
      const mockArticles: Article[] = [
        // Artigo 1 (índice 0) - Estilo Principal
        {
          title: "Título de Exemplo Principal (Mock 1)",
          description: "Esta é a descrição detalhada para o primeiro card de destaque. Ele ocupa a largura total e tem uma imagem maior.",
          image: "https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Main+News",
          author: "Autor Destacado",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
        },
        // Artigos 2, 3, 4, 5 (índices 1 a 4) - Estilo Carrossel
        {
          title: "Carrossel Notícia 1",
          description: "Descrição para o card do carrossel número 1. Imagem 150x150, sem descrição visível.",
          image: "https://via.placeholder.com/150x150/33FF57/FFFFFF?text=Carousel+1",
          author: "Carrossel Autor 1",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        },
        {
          title: "Carrossel Notícia 2",
          description: "Descrição para o card do carrossel número 2. Imagem 150x150, sem descrição visível.",
          image: "https://via.placeholder.com/150x150/3357FF/FFFFFF?text=Carousel+2",
          author: "Carrossel Autor 2",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
        },
        {
          title: "Carrossel Notícia 3",
          description: "Descrição para o card do carrossel número 3. Imagem 150x150, sem descrição visível.",
          image: "https://via.placeholder.com/150x150/FF33A1/FFFFFF?text=Carousel+3",
          author: "Carrossel Autor 3",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        },
        {
          title: "Carrossel Notícia 4",
          description: "Descrição para o card do carrossel número 4. Imagem 150x150, sem descrição visível.",
          image: "https://via.placeholder.com/150x150/A1FF33/FFFFFF?text=Carousel+4",
          author: "Carrossel Autor 4",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        },
        // Artigo 6 (índice 5) - Estilo Principal (igual ao Artigo 1)
        {
          title: "Notícia Importante (Mock 6)",
          description: "Este artigo é o sexto na lista e deve ter o mesmo estilo do primeiro artigo, com imagem grande e descrição completa.",
          image: "https://via.placeholder.com/600x400/FFC300/FFFFFF?text=Main+News+2",
          author: "Autor Importante",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
        },
        // Artigos 7, 8, 9, 10 (índices 6 a 9) - Estilo "Últimos Quatro" (imagem pequena, row-reverse, sem descrição)
        {
          title: "Última Notícia 1 (especial)",
          description: "Primeiro dos últimos 4 artigos. Estilo diferenciado.",
          image: "https://via.placeholder.com/100x100/C70039/FFFFFF?text=Last+1",
          author: "Autor Especial 1",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 7).toISOString(),
        },
        {
          title: "Última Notícia 2 (especial)",
          description: "Segundo dos últimos 4 artigos. Imagem 90x90, sem descrição, row-reverse.",
          image: "https://via.placeholder.com/100x100/900C3F/FFFFFF?text=Last+2",
          author: "Autor Especial 2",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
        },
        {
          title: "Última Notícia 3 (especial)",
          description: "Terceiro dos últimos 4 artigos. Imagem 90x90, sem descrição, row-reverse.",
          image: "https://via.placeholder.com/100x100/581845/FFFFFF?text=Last+3",
          author: "Autor Especial 3",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 9).toISOString(),
        },
        {
          title: "Última Notícia 4 (especial)",
          description: "Quarto e último artigo deste grupo. Imagem 90x90, sem descrição, row-reverse.",
          image: "https://via.placeholder.com/100x100/281845/FFFFFF?text=Last+4",
          author: "Autor Especial 4",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
        },
        // Artigos restantes (índice 10 em diante) - Estilo Padrão/Lista
        {
          title: "Artigo Extra (Padrão 1)",
          description: "Este é um artigo adicional, deve seguir o estilo de lista padrão (imagem média, descrição).",
          image: "https://via.placeholder.com/300x200/123456/FFFFFF?text=Extra+Default+1",
          author: "Autor Padrão",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 11).toISOString(),
        },
        {
          title: "Artigo Extra (Padrão 2)",
          description: "Para garantir que o tratamento de artigos adicionais está correto.",
          image: "https://via.placeholder.com/300x200/654321/FFFFFF?text=Extra+Default+2",
          author: "Outro Autor",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
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
          // Garante que temos artigos suficientes (pelo menos 11 para cobrir até o índice 10 e o grupo 4)
          setArticles(data.articles.slice(0, 15));
        } else {
          throw new Error("Resposta inesperada da API");
        }
      } catch (err) {
        console.error("❌ Erro ao buscar notícias:", err);
        setError("Erro ao buscar notícias."); // Mensagem de erro simplificada
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
      // Ajusta effectiveCardsPerPage com base no tamanho da tela
      if (window.innerWidth <= 750) {
        setEffectiveCardsPerPage(1);
      } else {
        setEffectiveCardsPerPage(baseCardsPerPage); // Retorna ao padrão (2)
      }

      const timeoutId = setTimeout(() => {
        if (carouselViewportRef.current) {
          const viewportWidth = carouselViewportRef.current.offsetWidth;
          // Recalcula o offset de slide para manter a página atual visível
          setTranslateXOffset(-currentPage * viewportWidth);
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    };

    handleResize(); // Executa na montagem inicial e para definir o offset
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage, effectiveCardsPerPage, carouselArticles.length]); // Adiciona carouselArticles.length para robustez

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
        // O container do carrossel também herda o estilo base para ter a borda superior e padding
        <div className={`${styles.carouselContainer} ${styles.newsCardBase}`}>
          <div ref={carouselViewportRef} className={styles.carouselViewport}>
            <div
              className={styles.carouselInnerTrack}
              style={{ transform: `translateX(${translateXOffset}px)` }}
            >
              {carouselArticles.map((article, indexInCarousel) => {
                const originalIndex = 1 + indexInCarousel; // Mapeia para o índice original no array 'articles'
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
                    showDescription={false} // Carrossel não mostra descrição
                    style={cardWidthStyle} // Aplica estilo inline para largura dinâmica
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.carouselNavigationButtons}>
            <button onClick={handlePrevPage} disabled={currentPage === 0} aria-label="Notícia Anterior">
              <MdNavigateBefore />
            </button>
            <button onClick={handleNextPage} disabled={currentPage >= totalCarouselPages - 1} aria-label="Próxima Notícia">
              <MdNavigateNext />
            </button>
          </div>
        </div>
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
      {articles.length > 9 && Array.from({ length: 4 }).map((_, i) => {
        const articleIndex = 6 + i; // Começa no índice 6
        const article = articles[articleIndex];
        if (!article) return null; // Prevenção caso o array seja menor que o esperado
        return (
          <ArticleCard
            key={articleIndex}
            article={article}
            index={articleIndex}
            layoutClasses={[styles.lastFourArticleLayout]}
            cardBodyClasses={[styles.cardBodyRowReverse]} // Aplica o flex-direction: row-reverse
            imageClass={styles.newsImgSmall}
            titleClass={styles.newsTitleLastFour}
            showDescription={false} // Não mostra descrição para estes artigos
          />
        );
      })}

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
            showDescription={true} // Artigos padrão mostram descrição
          />
        );
      })}
    </section>
  );
}
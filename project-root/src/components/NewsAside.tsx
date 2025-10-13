// NewsAside.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../styles/NewsAside.module.css";
import { API_URL, API_KEY, COUNTRY, CATEGORY_ENTERTAINMENT } from "../utils/config";
import { timeSince, displayError } from "../utils/utils";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

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

  // Estado para a paginação do carrossel
  const baseCardsPerPage = 2; // Queremos exibir 2 cards por vez no desktop
  const [effectiveCardsPerPage, setEffectiveCardsPerPage] = useState(baseCardsPerPage); // Define quantos cards exibir com base no tamanho da tela
  const [currentPage, setCurrentPage] = useState(0);

  // Ref para o container visível do carrossel para calcular a largura de um "slide"
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  // Estado para o valor de transformX para o efeito de slide
  const [translateXOffset, setTranslateXOffset] = useState(0);

  useEffect(() => {
    // Evita consumo da API durante desenvolvimento sem chave
    if (!API_KEY) {
      console.warn("⚠️ API_KEY ausente. Renderizando dados mockados para evitar consumo da API.");
      const mockArticles: Article[] = [
        {
          title: "Título de Exemplo Principal (Mock 1)",
          description: "Esta é a descrição detalhada para o primeiro card de destaque. Ele ocupa a largura total e tem uma imagem maior.",
          image: "https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Main+News",
          author: "Autor Destacado",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
        },
        // Cards para o carrossel (índices 1 a 4) - exatamente 4 artigos
        {
          title: "Carrossel Notícia 1",
          description: "Esta é a descrição para o card do carrossel número 1. Fica com imagem 90x90.",
          image: "https://via.placeholder.com/150x150/33FF57/FFFFFF?text=Carousel+1",
          author: "Carrossel Autor 1",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        },
        {
          title: "Carrossel Notícia 2",
          description: "Esta é a descrição para o card do carrossel número 2. Fica com imagem 90x90.",
          image: "https://via.placeholder.com/150x150/3357FF/FFFFFF?text=Carousel+2",
          author: "Carrossel Autor 2",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
        },
        {
          title: "Carrossel Notícia 3",
          description: "Esta é a descrição para o card do carrossel número 3. Fica com imagem 90x90.",
          image: "https://via.placeholder.com/150x150/FF33A1/FFFFFF?text=Carousel+3",
          author: "Carrossel Autor 3",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        },
        {
          title: "Carrossel Notícia 4",
          description: "Esta é a descrição para o card do carrossel número 4. Fica com imagem 90x90.",
          image: "https://via.placeholder.com/150x150/A1FF33/FFFFFF?text=Carousel+4",
          author: "Carrossel Autor 4",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        },
        // Artigos restantes (a partir do índice 5)
        {
          title: "Notícia Restante 1",
          description: "Este é um artigo que vem depois do carrossel.",
          image: "https://via.placeholder.com/300x200/33FFF6/FFFFFF?text=Remaining+1",
          author: "Autor Padrão",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
        },
        {
          title: "Notícia Restante 2",
          description: "Mais um artigo para preencher a lista após o carrossel.",
          image: "https://via.placeholder.com/300x200/FFC300/FFFFFF?text=Remaining+2",
          author: "Outro Autor",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 7).toISOString(),
        },
        {
          title: "Notícia Restante 3",
          description: "Mais um para ter certeza de que o slice está funcionando.",
          image: "https://via.placeholder.com/300x200/FF6347/FFFFFF?text=Remaining+3",
          author: "Terceiro Autor",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
        },
        // Adicionando artigos mockados para ter um total de 10+
        {
          title: "Notícia Restante 4 (Extra)",
          description: "Quarto artigo para preencher a lista após o carrossel.",
          image: "https://via.placeholder.com/300x200/C70039/FFFFFF?text=Remaining+4",
          author: "Quarto Autor",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 9).toISOString(),
        },
        {
          title: "Notícia Restante 5 (Extra)",
          description: "Quinto artigo para preencher a lista após o carrossel e atingir o mínimo de 10.",
          image: "https://via.placeholder.com/300x200/900C3F/FFFFFF?text=Remaining+5",
          author: "Quinto Autor",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
        },
        {
          title: "Notícia Restante 6 (Extra)",
          description: "Sexto artigo para garantir que há o suficiente, mesmo se um for removido.",
          image: "https://via.placeholder.com/300x200/581845/FFFFFF?text=Remaining+6",
          author: "Sexto Autor",
          publishedAt: new Date(Date.now() - 3600 * 1000 * 11).toISOString(),
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
          // Garante que temos pelo menos 10 artigos para exibir.
          // Pegamos um pouco mais (ex: 15) para ter uma margem de segurança,
          // caso alguns artigos tenham título "[Removed]" ou descrição nula.
          setArticles(data.articles.slice(0, 15));
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

  // FILTRA OS ARTIGOS PARA O CARROSSEL (índices 1 a 4)
  // O slice(1, 5) pega os índices 1, 2, 3 e 4.
  const carouselArticles = articles.slice(1, 5);

  // Lógica para determinar cards por página e calcular o offset de slide
  useEffect(() => {
    const handleResize = () => {
      // Ajusta effectiveCardsPerPage com base no tamanho da tela
      if (window.innerWidth <= 750) {
        setEffectiveCardsPerPage(1);
      } else {
        setEffectiveCardsPerPage(baseCardsPerPage); // Retorna ao padrão (2)
      }

      // Recalcula o offset de slide
      // Adiciona um pequeno atraso para garantir que o DOM renderize as mudanças de tamanho antes de calcular
      const timeoutId = setTimeout(() => {
        if (carouselViewportRef.current) {
          const viewportWidth = carouselViewportRef.current.offsetWidth;
          setTranslateXOffset(-currentPage * viewportWidth);
        }
      }, 50); // Atraso de 50ms

      return () => clearTimeout(timeoutId); // Limpa o timeout se o componente for desmontado ou as dependências mudarem
    };

    handleResize(); // Executa na montagem inicial e para definir o offset
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [currentPage, effectiveCardsPerPage]);

  const totalCarouselPages = Math.ceil(carouselArticles.length / effectiveCardsPerPage);

  // Funções para navegar no carrossel
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalCarouselPages - 1, prev + 1));
  };

  return (
    <section>
      {error && <p>{error}</p>}

      {articles.length === 0 && !error && (
        <p>Carregando notícias...</p>
      )}

      {/* RENDERIZAÇÃO DO PRIMEIRO ARTIGO (Índice 0) */}
      {articles.length > 0 && articles[0].title !== "[Removed]" && articles[0].description !== null && (
        <section key={0} className={styles.newsCardAside}>
          <section className={styles.cardBodyAside}>
            <img src={articles[0].image} alt={articles[0].title} title={articles[0].title} className={styles.newsImgAside} />
            <section className={styles.newsTextAside}>
              <p className={styles.newsAuthor}>{articles[0].author || ""}</p>
              <h2 className={styles.newsTitleAside}>{articles[0].title}</h2>
              <p className={styles.newsDescription}>{articles[0].description}</p>
              <p className={styles.newsTimePublished}>{timeSince(articles[0].publishedAt)}</p>
            </section>
          </section>
        </section>
      )}

      {/* RENDERIZAÇÃO DO CARROSSEL (índices 1 a 4) */}
      {carouselArticles.length > 0 && (
        <div className={styles.carouselContainer}>
          <div ref={carouselViewportRef} className={styles.carouselViewport}>
            <div
              className={styles.carouselInnerTrack}
              style={{ transform: `translateX(${translateXOffset}px)` }}
            >
              {carouselArticles.map((article, indexInCarousel) => {
                // Determine a largura base de cada card no carrossel
                const cardWidthStyle = effectiveCardsPerPage === 1 ?
                  { flexBasis: '100%', maxWidth: '100%' } :
                  { flexBasis: `calc(100% / ${effectiveCardsPerPage} - 10px)`, maxWidth: `calc(100% / ${effectiveCardsPerPage} - 10px)` }; // Ajuste de 10px para metade do gap

                if (article.title === "[Removed]" || article.description === null) return null;
                const timeElapsed = timeSince(article.publishedAt);

                return (
                  <section
                    key={`carousel-${indexInCarousel}`} // Key única para cada item do carrossel
                    className={`${styles.newsCardAside} ${styles.smallArticleLayoutPaged}`}
                    style={cardWidthStyle} // Aplica largura dinâmica
                  >
                    <section className={`${styles.cardBodyAside} ${styles.smallArticleBodyPaged}`}>
                      <img
                        src={article.image}
                        alt={article.title}
                        title={article.title}
                        className={styles.newsImgAside}
                      />
                      <section className={styles.newsTextAside}>
                        <p className={styles.newsAuthor}>{article.author || ""}</p>
                        <h2 className={styles.newsTitleAside}>{article.title}</h2>
                        <p className={styles.newsTimePublished}>{timeElapsed}</p>
                      </section>
                    </section>
                  </section>
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

      {/* RENDERIZAÇÃO DOS ARTIGOS RESTANTES (A partir do índice 5) */}
      {articles.slice(5).map((article, index) => {
        const originalIndex = index + 5; // Ajusta o índice para a lista original
        if (article.title === "[Removed]" || article.description === null) return null;
        const timeElapsed = timeSince(article.publishedAt);

        return (
          <section
            key={originalIndex}
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
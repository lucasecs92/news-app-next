// src/app/api/news/[category]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_API_BASE_URL = "https://gnews.io/api/v4/top-headlines";
const DEFAULT_COUNTRY = "us"; // Ou 'br' se preferir para o Brasil

export async function GET(
  request: NextRequest,
  // MODIFICAÇÃO CHAVE: Tipar 'params' como uma Promise
  context: { params: Promise<{ category: string }> } // A tipagem esperada é Promise<{ category: string }>
) {
  // Agora, você precisa aguardar a resolução de context.params
  const resolvedParams = await context.params;
  const { category } = resolvedParams; // Desestruture de resolvedParams

  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get('country') || DEFAULT_COUNTRY;
  const query = searchParams.get('q'); // Para pesquisa (se você tiver)

  if (!GNEWS_API_KEY) {
    return NextResponse.json(
      { error: "GNEWS_API_KEY not defined" },
      { status: 500 }
    );
  }

  try {
    let url = `${GNEWS_API_BASE_URL}?token=${GNEWS_API_KEY}&country=${country}&topic=${category}`;
    if (query) {
      // Se 'q' for fornecido, a GNews API geralmente prioriza a pesquisa por query
      // e ignora o 'topic'. Verifique a documentação da GNews para o comportamento exato.
      // Além disso, a GNews API espera 'q' para pesquisa e 'topic' para categorias.
      // Você deve decidir qual usar. Se 'q' estiver presente, geralmente é uma pesquisa.
      // Se não, é uma busca por categoria.
      url = `${GNEWS_API_BASE_URL}?token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}&country=${country}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Error from GNews API (${url}):`, response.status, errorData);
      return NextResponse.json(
        { error: `Failed to fetch news from GNews API: ${errorData.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route /api/news/[category]:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching news" },
      { status: 500 }
    );
  }
}
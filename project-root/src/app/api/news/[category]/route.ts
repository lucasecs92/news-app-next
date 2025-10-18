import { NextRequest, NextResponse } from 'next/server';

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_API_BASE_URL = "https://gnews.io/api/v4/top-headlines";
const DEFAULT_COUNTRY = "us"; 

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ category: string }> }
) {
  const resolvedParams = await context.params;
  const { category } = resolvedParams;

  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get('country') || DEFAULT_COUNTRY;
  const query = searchParams.get('q'); // Este é o parâmetro de busca que virá do SearchResults

  if (!GNEWS_API_KEY) {
    return NextResponse.json(
      { error: "GNEWS_API_KEY not defined" },
      { status: 500 }
    );
  }

  try {
    // Construa a URL base com token, país e categoria
    let url = `${GNEWS_API_BASE_URL}?token=${GNEWS_API_KEY}&country=${country}&topic=${category}`;
    
    // Se houver uma query de busca (do SearchResults), adicione-a à URL
    if (query) {
      url += `&q=${encodeURIComponent(query)}`; // Adiciona a query usando '&q='
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
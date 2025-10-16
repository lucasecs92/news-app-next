import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para o componente Next.js Image
  images: {
    // A propriedade remotePatterns é a forma moderna e segura de permitir domínios externos.
    remotePatterns: [
      {
        // Permite imagens servidas sob o protocolo HTTPS.
        protocol: "https",
        // O caractere curinga (wildcard) '**' permite imagens de QUALQUER hostname.
        // Isso é ideal para um agregador de notícias, onde as fontes são variadas e desconhecidas.
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
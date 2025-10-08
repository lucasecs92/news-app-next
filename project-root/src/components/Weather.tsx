import React, { useState, useEffect } from 'react';
import styles from '../styles/Weather.module.css'; 

// Definindo interfaces para tipagem dos dados da API
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

export default function Weather() { 
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    if (!apiKey) {
      setError("Chave da API do OpenWeather não configurada. Verifique seu arquivo .env.local");
      setLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt`;

          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const data: WeatherData = await response.json();
            setWeatherData(data);
          } catch (apiError) {
            console.error("Erro ao obter os dados de previsão do tempo:", apiError);
            setError("Não foi possível obter a previsão do tempo. Tente novamente mais tarde.");
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          console.error("Erro ao obter a localização:", geoError);
          let errorMessage = "Não foi possível obter sua localização. ";
          if (geoError.code === geoError.PERMISSION_DENIED) {
            errorMessage += "Permissão negada. Por favor, ative os serviços de localização.";
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            errorMessage += "Localização indisponível.";
          } else if (geoError.code === geoError.TIMEOUT) {
            errorMessage += "Tempo limite excedido ao tentar obter a localização.";
          }
          setError(errorMessage);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocalização não é suportada pelo seu navegador.");
      setLoading(false);
    }
  }, []); // O array vazio garante que o useEffect rode apenas uma vez, no carregamento do componente.

  if (loading) {
    return (
      <aside className={styles.weatherContainer}> 
        <h4 className={styles.weatherTitle}>Previsão do Tempo</h4> 
        <p className={styles.message}>Carregando previsão do tempo...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={styles.weatherContainer}>
        <h4 className={styles.weatherTitle}>Previsão do Tempo</h4>
        <p className={`${styles.message} ${styles.errorMessage}`}>{error}</p>
      </aside>
    );
  }

  if (!weatherData) {
    return null; // Não renderiza nada se não houver dados e nenhum erro.
  }

  const tempCelsius = Math.floor(weatherData.main.temp - 273.15);

  return (
    <aside className={styles.weatherContainer}>
      <h4 className={styles.weatherTitle}>Previsão do Tempo</h4>
      <section className={styles.weatherWrap}> 
        <section className={styles.previsaoLocation}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
            <path fill="currentColor" d="M256 32C167.67 32 96 96.51 96 176c0 128 160 304 160 304s160-176 160-304c0-79.49-71.67-144-160-144m0 224a64 64 0 1 1 64-64a64.07 64.07 0 0 1-64 64"/>
          </svg>
          <h5>{weatherData.name}</h5>
        </section>
        
        <section className={styles.previsaoTempWrap}>
          <span>{tempCelsius}&deg;C</span>
          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
            alt={weatherData.weather[0].description} 
          />
        </section>

        <section className={styles.previsaoHumidity}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 20.5q-2.91 0-4.955-2.006T5 13.61q0-1.373.555-2.628t1.487-2.24L12 3.884l4.958 4.858q.933.985 1.487 2.24T19 13.615q0 2.882-2.045 4.884T12 20.5m-6-6.88h12q0-1.176-.45-2.245T16.25 9.5L12 5.3L7.75 9.5q-.85.805-1.3 1.875T6 13.619"/>
          </svg>
          <span>{weatherData.main.humidity}%</span>
          <span>|</span>
          <p>{weatherData.weather[0].description}</p>
        </section>
      </section>

      <section className={styles.previsaoFooter}>
        <a href="https://weather-lucasecs92.vercel.app/" target='_blank' rel='noopener noreferrer'>
          Veja a previsão do tempo
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-6 6l6-6m-6-6l6 6"/>
          </svg>
        </a>
      </section>
    </aside>
  );
}
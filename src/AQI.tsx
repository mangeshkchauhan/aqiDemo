import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AQI.css';

const AQIFetcher = () => {
  const [aqi, setAqi] = useState({ data: { aqi: 0 }, status: 'unknown' });
  const [city, setCity] = useState('');

  useEffect(() => {
    let timeoutId: any = null;

    const cachedAqi = localStorage.getItem(city);
    if (cachedAqi) {
      const data = JSON.parse(cachedAqi)
      setAqi(data);
      return;
    }

    const fetchAqi = async () => {
      const AQI_API_URL = `https://api.waqi.info/feed/${city}`;
      const response = await axios.get(AQI_API_URL, { params: { token: '0d00e5d486c34d95b328f7a8a0fa096a249a7bd5' } });
      const data = response.data;
      
      setAqi(data);
      localStorage.setItem(city, JSON.stringify(data));
    };

    if (city) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fetchAqi();
      }, 500);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [city]);

  return (
    <div className="AQIFetcher">
      <input type="text" placeholder="Enter city name" onChange={e => setCity(e.target.value)} />
      {aqi.status === 'ok' && (
        <div className="AQIFetcher-result">
          AQI for <strong>{city}:</strong> {aqi.data.aqi}
        </div>
      )}
      {aqi.status === 'error' && (
        <div className="AQIFetcher-result">
          Cannot find the AQI for <strong>{city}</strong>
        </div>
      )}
    </div>
  );
};

export default AQIFetcher;
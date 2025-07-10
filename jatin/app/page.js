'use client'
import { useEffect, useState } from 'react';

const symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'adausdt', 'xrpusdt', 'solusdt'];

export default function Home() {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${symbols
        .map((s) => `${s}@ticker`)
        .join('/')}`
    );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const data = message.data;
console.log(data);

      setPrices((prev) => ({
        ...prev,
        [data.s]: {
          symbol: data.s,
          price: parseFloat(data.c),
          change: parseFloat(data.P),
          volume: parseFloat(data.v),
          time: new Date().toLocaleTimeString(),
          prevPrice: prev[data.s]?.price || parseFloat(data.c),
          
        },
      }));
    };

    return () => socket.close();
  }, []);

  return (
    <div  style={styles.wrapper}>
      <h2 className='laet' style={{ textAlign: 'center', marginBottom: 20 }}>
        Last update: {new Date().toLocaleTimeString()}
      </h2>
      <div className="main"style={styles.grid}>
        {symbols.map((symbolKey) => {
          const data = prices[symbolKey.toUpperCase()];
          if (!data) return null;

          const isUp = data.price > data.prevPrice;

          return (
            <div
              key={symbolKey}
              style={{
                ...styles.card,
                borderColor: isUp ? '#4caf50' : '#f44336',
                
              }}
            >
              <h3>{data.symbol.replace('USDT', '/USDT')}</h3>
              <h2 style={{ color: isUp ? '#4caf50' : '#f44336' }}>
                ${data.price.toFixed(6)}
              </h2>
              <p>Vol: {Number(data.volume).toLocaleString()} </p>
              <p style={{ fontWeight: 'bold' }}>
                {data.change > 0 ? '+' : ''}
                {data.change.toFixed(2)}%
              </p>
              <p style={{ fontSize: 14,  }}>{data.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: 60,
    minHeight: '100vh',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '30px',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    border: '2px solid',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  
};

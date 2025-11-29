import { addDays, format, subDays } from "date-fns";

export interface Company {
  ticker: string;
  name: string;
  sector: string;
  market_cap: string;
  change_percent: number;
  volume: string;
  signal: "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "STRONG SELL";
}

export interface StockPoint {
  date: string;
  price: number;
  predicted?: number;
  lower_bound?: number;
  upper_bound?: number;
}

export const COMPANIES: Company[] = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", market_cap: "2.8T", change_percent: 1.2, volume: "45.2M", signal: "BUY" },
  { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", market_cap: "2.4T", change_percent: 0.8, volume: "22.1M", signal: "HOLD" },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology", market_cap: "1.7T", change_percent: -0.5, volume: "18.5M", signal: "HOLD" },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", market_cap: "1.3T", change_percent: 2.1, volume: "35.8M", signal: "STRONG BUY" },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotive", market_cap: "800B", change_percent: -1.8, volume: "98.2M", signal: "SELL" },
  { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductors", market_cap: "1.1T", change_percent: 3.5, volume: "52.4M", signal: "STRONG BUY" },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Financial", market_cap: "400B", change_percent: 0.2, volume: "9.1M", signal: "HOLD" },
  { ticker: "V", name: "Visa Inc.", sector: "Financial", market_cap: "450B", change_percent: -0.1, volume: "6.3M", signal: "HOLD" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", market_cap: "420B", change_percent: 0.4, volume: "7.8M", signal: "BUY" },
  { ticker: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive", market_cap: "400B", change_percent: 0.1, volume: "12.4M", signal: "HOLD" },
  { ticker: "PG", name: "Procter & Gamble", sector: "Consumer Defensive", market_cap: "360B", change_percent: 0.3, volume: "5.1M", signal: "HOLD" },
  { ticker: "MA", name: "Mastercard Inc.", sector: "Financial", market_cap: "350B", change_percent: -0.2, volume: "4.2M", signal: "BUY" },
  { ticker: "HD", name: "Home Depot", sector: "Consumer Cyclical", market_cap: "320B", change_percent: 0.5, volume: "3.8M", signal: "HOLD" },
  { ticker: "CVX", name: "Chevron Corp.", sector: "Energy", market_cap: "300B", change_percent: 1.1, volume: "8.5M", signal: "BUY" },
  { ticker: "MRK", name: "Merck & Co.", sector: "Healthcare", market_cap: "280B", change_percent: 0.2, volume: "6.4M", signal: "HOLD" },
  { ticker: "KO", name: "Coca-Cola Co.", sector: "Consumer Defensive", market_cap: "270B", change_percent: 0.1, volume: "11.2M", signal: "HOLD" },
  { ticker: "PEP", name: "PepsiCo Inc.", sector: "Consumer Defensive", market_cap: "260B", change_percent: 0.0, volume: "5.6M", signal: "HOLD" },
  { ticker: "BAC", name: "Bank of America", sector: "Financial", market_cap: "250B", change_percent: -0.3, volume: "32.1M", signal: "SELL" },
  { ticker: "CSCO", name: "Cisco Systems", sector: "Technology", market_cap: "220B", change_percent: -0.4, volume: "14.2M", signal: "HOLD" },
  { ticker: "INTC", name: "Intel Corp.", sector: "Technology", market_cap: "180B", change_percent: -2.1, volume: "41.5M", signal: "STRONG SELL" },
  { ticker: "AMD", name: "Advanced Micro Devices", sector: "Technology", market_cap: "170B", change_percent: 2.8, volume: "65.4M", signal: "BUY" },
  { ticker: "NFLX", name: "Netflix Inc.", sector: "Communication Services", market_cap: "190B", change_percent: 1.5, volume: "7.2M", signal: "BUY" },
  { ticker: "DIS", name: "Walt Disney Co.", sector: "Communication Services", market_cap: "160B", change_percent: 0.6, volume: "12.8M", signal: "HOLD" },
  { ticker: "CRM", name: "Salesforce Inc.", sector: "Technology", market_cap: "210B", change_percent: 0.9, volume: "6.1M", signal: "BUY" },
  { ticker: "ORCL", name: "Oracle Corp.", sector: "Technology", market_cap: "230B", change_percent: 0.7, volume: "8.3M", signal: "HOLD" },
];

// Generate random walk stock data
export const generateStockData = (ticker: string, days = 365): StockPoint[] => {
  const data: StockPoint[] = [];
  let price = Math.random() * 100 + 50; // Start price between 50 and 150
  const volatility = 0.02;

  // Seed randomness based on ticker to make it consistent-ish
  let seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const startDate = subDays(new Date(), days);

  for (let i = 0; i < days; i++) {
    const change = (random() - 0.5) * volatility;
    price = price * (1 + change);
    data.push({
      date: format(addDays(startDate, i), "yyyy-MM-dd"),
      price: Number(price.toFixed(2)),
    });
  }
  return data;
};

// Generate predictions extending from the last real data point
export const generatePredictions = (lastPrice: number, lastDate: string, days = 30): StockPoint[] => {
  const data: StockPoint[] = [];
  let price = lastPrice;
  const startDate = new Date(lastDate);

  for (let i = 1; i <= days; i++) {
    // Trend slightly upwards
    const change = (Math.random() - 0.4) * 0.02; 
    price = price * (1 + change);
    
    const confidence = i * 0.5; // Confidence interval widens over time

    data.push({
      date: format(addDays(startDate, i), "yyyy-MM-dd"),
      price: 0, // Placeholder, chart will only show predicted
      predicted: Number(price.toFixed(2)),
      lower_bound: Number((price - confidence).toFixed(2)),
      upper_bound: Number((price + confidence).toFixed(2)),
    });
  }
  return data;
};

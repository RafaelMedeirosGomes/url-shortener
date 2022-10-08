import "dotenv/config";

interface config {
  SERVER_PORT: number;
  DB_URI: string;
  DB_USER?: string;
  DB_PASS?: string;
  DB_NAME: string;
  URL_PREFIX: string;
  URL_EXPIRY_TIME: number;
}

function loadConfig(): config {
  const SERVER_PORT = parseInt(process.env.SERVER_PORT ?? "5000", 10);
  const DB_URI = process.env.DB_URI ?? "mongodb://localhost:27017";
  const DB_USER = process.env.DB_USER;
  const DB_PASS = process.env.DB_PASS;
  const DB_NAME = process.env.DB_NAME ?? "shortener";
  const URL_PREFIX = process.env.URL_PREFIX ?? "www.us.com/";
  const URL_EXPIRY_TIME = parseInt(process.env.URL_EXPIRY_TIME ?? "1", 10);

  return {
    SERVER_PORT,
    DB_URI,
    DB_USER,
    DB_PASS,
    DB_NAME,
    URL_PREFIX,
    URL_EXPIRY_TIME,
  };
}

export { loadConfig };

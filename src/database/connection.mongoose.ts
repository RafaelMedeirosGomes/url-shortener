import { connect, Mongoose } from "mongoose";

async function connection(): Promise<Mongoose> {
  const hostURI = process.env.DB_URI ?? "localhost:27017";
  const username = process.env.DB_USER ?? "user";
  const password = process.env.DB_PASS ?? "password";
  const dbName = process.env.DB_NAME ?? "shortener";
  const conn = await connect(hostURI, {
    auth: { username, password },
    dbName,
  });
  return conn;
}

export default connection();

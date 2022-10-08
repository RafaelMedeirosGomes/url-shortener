import { connect, Mongoose } from "mongoose";
import { loadConfig } from "../utils/config";

async function connection(): Promise<Mongoose> {
  const { DB_URI, DB_USER, DB_PASS, DB_NAME } = loadConfig();
  const conn = await connect(DB_URI, {
    auth: { username: DB_USER, password: DB_PASS },
    dbName: DB_NAME,
  });
  return conn;
}

export default connection;

import { connect, Mongoose } from "mongoose";

async function connection(): Promise<Mongoose> {
  const hostURI = process.env.HOST_URI ?? "localhost:27017";
  const conn = await connect(`mongodb://${hostURI}/shortener`);
  return conn;
}

export default connection();

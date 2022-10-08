import connection from "./database/connection.mongoose";
import app from "./app";
import { loadConfig } from "./utils/config";

async function main(): Promise<void> {
  let conn: typeof import("mongoose");
  try {
    conn = await connection();
    const { SERVER_PORT } = loadConfig();
    const server = app.listen(SERVER_PORT, () => {
      console.log(`Server online on port ${SERVER_PORT}`);
    });
    process.on("SIGINT", async () => {
      server.close(() => {
        console.log("\nStopping server");
      });
      try {
        await conn.disconnect();
        console.log("Disconnected from db");
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

void main();

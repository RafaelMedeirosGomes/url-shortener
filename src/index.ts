import connection from "./database/connection.mongoose";
import app from "./app";
import { loadConfig } from "./utils/config";

async function main(): Promise<void> {
  const { SERVER_PORT } = loadConfig();
  const server = app.listen(SERVER_PORT, () => {
    console.log(`Server online on port ${SERVER_PORT}`);
  });

  process.on("SIGINT", async () => {
    server.close(() => {
      console.log("\nStopping server");
    });
    const Mongoose = await connection;
    try {
      await Mongoose.disconnect();
      console.log("Disconnected from db");
    } catch (error) {
      console.error(error);
    }
  });
}

void main();

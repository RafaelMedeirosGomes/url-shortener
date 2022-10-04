import "dotenv/config";

import connection from "./database/connection.mongoose";
import app from "./app";

async function main(): Promise<void> {
  const SERVER_PORT = process.env.SERVER_PORT ?? "5000";

  const server = app.listen(SERVER_PORT, () => {
    console.log(`Server online on port ${SERVER_PORT}`);
  });

  process.on("SIGINT", () => {
    server.close(() => {
      console.log("\nStopping server");
    });
    connection
      .then(async (Mongoose) => {
        return await Mongoose.disconnect();
      })
      .then(() => console.log("Disconnected from db"))
      .catch(console.error);
  });
}

void main();

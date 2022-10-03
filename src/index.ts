import "dotenv/config";

import app from "./app";

function main(): void {
  const SERVER_PORT = process.env.SERVER_PORT ?? "5000";

  app.listen(SERVER_PORT, () => {
    console.log(`Server online on port ${SERVER_PORT}`);
  });
}

main();

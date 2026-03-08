import dotenv from "dotenv";
dotenv.config({ path: ".env.production" });

import { createServer } from "http";
import next from "next";

const app = next({ dev: false });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  createServer(handler).listen(3000, () => {
    console.log("🌐 M-PATHY is running on http://localhost:3000");
  });
});
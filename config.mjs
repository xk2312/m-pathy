// config.mjs
import dotenv from "dotenv";
dotenv.config({ path: "/srv/m-pathy/.env.production" }); // ENV-Fix

import("./server.js"); // startet Next unter Node, ohne Edge!

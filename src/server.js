


// import http from "http";
// import { createApp } from "./app.js";
// import { initSocket } from "./socket/index.js";
// import { connectDB } from "./config/db.js";
// import { env } from "./config/env.js";

// async function start() {
//   await connectDB();

//   // Create a temporary http server so socket can attach
//   const tempApp = (req, res) => res.end("Starting...");
//   const server = http.createServer(tempApp);

//   // Init socket and get io
//   const io = initSocket(server);

//   // Create express app with io
//   const app = createApp(io);

//   // Replace request handler with express app
//   server.removeAllListeners("request");
//   server.on("request", app);

//   server.listen(env.PORT, () => {
//     console.log(`🚀 Server running on port ${env.PORT}`);
//   });
// }

// start().catch((err) => {
//   console.error("❌ Failed to start server:", err);
//   process.exit(1);
// });

import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/index.js";

await connectDB();

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  },
});

initSocket(io);

server.listen(env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${env.PORT || 5000}`);
});
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
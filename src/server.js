// import dotenv from "dotenv";
// import http from "http";
// import { Server } from "socket.io";

// import app from "./app.js";
// import connectDB from "./config/db.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {

//     try {

//         await connectDB();

//         const server = http.createServer(app);

//         // ==========================
//         // Socket.IO
//         // ==========================

//         const io = new Server(server, {

//             cors: {

//                 origin: "http://localhost:5173",

//                 credentials: true,

//             },

//         });

//         io.on("connection", (socket) => {

//             console.log(
//                 "User connected:",
//                 socket.id
//             );

//             socket.on("disconnect", () => {

//                 console.log(
//                     "User disconnected:",
//                     socket.id
//                 );

//             });

//         });

//         server.listen(
//             PORT,
//             "0.0.0.0",
//             () => {

//                 console.log(
//                     `🚀 Server running on http://localhost:${PORT}`
//                 );

//             }
//         );

//     } catch (error) {

//         console.error(
//             "Database connection failed:",
//             error
//         );

//         process.exit(1);

//     }

// };

// startServer();



// import dotenv from "dotenv";
// //dotenv.config();
// import http from "http";

// import app from "./app.js";
// import connectDB from "./config/db.js";

// import { initializeSocket }
// from "./sockets/index.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {

//     try {

//         await connectDB();

//         const server = http.createServer(app);

//         // ==========================
//         // Initialize Socket.IO
//         // ==========================

//         initializeSocket(server);

//         server.listen(
//             PORT,
//             "0.0.0.0",
//             () => {

//                 console.log(
//                     `🚀 Server running on http://localhost:${PORT}`
//                 );

//             }
//         );

//     } catch (error) {

//         console.error(
//             "Database connection failed:",
//             error
//         );

//         process.exit(1);

//     }

// };

// startServer();








import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/index.js";

// ==========================
// Load .env file
// ==========================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// ==========================
// Check if env variables are loaded
// ==========================

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // ==========================
    // Initialize Socket.IO
    // ==========================

    initializeSocket(server);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
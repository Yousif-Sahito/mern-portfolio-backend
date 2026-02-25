// // import { Server } from "socket.io";

// // export function initSocket(httpServer) {
// //   const io = new Server(httpServer, {
// //     cors: {
// //       origin: ["http://localhost:5173"],
// //       credentials: true,
// //     },
// //   });

// //   io.on("connection", (socket) => {
// //     console.log("🔌 Socket connected:", socket.id);

// //     socket.on("disconnect", () => {
// //       console.log("❌ Socket disconnected:", socket.id);
// //     });
// //   });

// //   return io;
// // }

// // // ✅ matches controller usage: emitProjectEvent(io, eventName, payload)
// // export function emitProjectEvent(io, eventName, payload) {
// //   if (!io) return;
// //   io.emit(eventName, payload);
// // }


// let ioInstance = null;

// export function initSocket(io) {
//   ioInstance = io;

//   io.on("connection", (socket) => {
//     console.log("🔌 Socket connected:", socket.id);

//     // user joins room based on visitorId
//     socket.on("join", (visitorId) => {
//       if (!visitorId) return;
//       socket.join(visitorId);
//       // console.log("✅ Joined room:", visitorId);
//     });

//     socket.on("disconnect", () => {
//       // console.log("❌ Disconnected:", socket.id);
//     });
//   });
// }

// // Emit event to a specific visitor
// export function emitToVisitor(visitorId, eventName, payload) {
//   if (!ioInstance) return;
//   ioInstance.to(visitorId).emit(eventName, payload);
// }

// // (Optional) emit to admin dashboard (everyone)
// export function emitToAdmins(eventName, payload) {
//   if (!ioInstance) return;
//   ioInstance.emit(eventName, payload);
// }


let ioInstance = null;

export function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("join", (visitorId) => {
      if (!visitorId) return;
      socket.join(visitorId);
    });

    socket.on("disconnect", () => {});
  });
}

// ✅ NEW: keep your old project code working
export function emitProjectEvent(io, eventName, payload) {
  // if controller passes io, use it
  if (io) io.emit(eventName, payload);
  // fallback if you want to use global instance
  else if (ioInstance) ioInstance.emit(eventName, payload);
}

// Notify a specific visitor (read receipts)
export function emitToVisitor(visitorId, eventName, payload) {
  if (!ioInstance) return;
  ioInstance.to(visitorId).emit(eventName, payload);
}

// Optional broadcast
export function emitToAdmins(eventName, payload) {
  if (!ioInstance) return;
  ioInstance.emit(eventName, payload);
}

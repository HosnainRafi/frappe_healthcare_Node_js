const logger = require("../utils/logger");

module.exports = (io) => {
  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join room for specific doctor's queue
    socket.on("join-doctor-queue", (doctorId) => {
      socket.join(`doctor-queue-${doctorId}`);
      logger.info(`Socket ${socket.id} joined doctor-queue-${doctorId}`);
    });

    // Join room for patient updates
    socket.on("join-patient-room", (patientId) => {
      socket.join(`patient-${patientId}`);
      logger.info(`Socket ${socket.id} joined patient-${patientId}`);
    });

    // Leave room
    socket.on("leave-room", (room) => {
      socket.leave(room);
      logger.info(`Socket ${socket.id} left ${room}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  // Helper function to emit to specific rooms
  global.emitToRoom = (room, event, data) => {
    io.to(room).emit(event, data);
  };

  global.emitToAll = (event, data) => {
    io.emit(event, data);
  };
};

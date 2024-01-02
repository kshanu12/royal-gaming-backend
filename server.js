const io = require("socket.io")(3030, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] },
  secure: true,
});

var total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

io.on("connection", (socket) => {
  console.log("A User Connected");
  socket.on("new_bet", (index, newAmount) => {
    total[index] += newAmount;
    console.log("inside new_bet");
    io.emit("refresh_changes", total);
  });
});

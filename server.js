const io = require("socket.io")(3030, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] },
  secure: true,
});

var total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

io.on("connection", (socket) => {
  console.log("A User Connected");

  socket.emit("refresh_changes", total);

  socket.on("new_game", () => {
    total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  })

  socket.on("generate_result", () => {
    const cardWon = Math.floor((Math.random() * (12)) + 0);
    io.emit("card_won",cardWon);
  });

  socket.on("new_bet", (index, newAmount) => {
    total[index] += newAmount;
    console.log("inside new_bet");
    io.emit("refresh_changes", total);
  });
});

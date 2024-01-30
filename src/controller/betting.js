import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getCoinsWon(req, res) {
  console.log("inside getCoinsWon API");
  try {
    console.log("", req.body);
    const cardCoinsDetails = req.body.cardCoinsDetails;
    const cardWon = req.body.cardWon;

    let totalCoinsOnTable = 0,
      coinsWon = 0;
    for (var i = 0; i < cardCoinsDetails.length; i++) {
      totalCoinsOnTable += cardCoinsDetails[i].totalBet;
    }
    console.log(totalCoinsOnTable);
    if (
      parseInt(totalCoinsOnTable * 0.8) >
      cardCoinsDetails[cardWon].totalBet * 10
    ) {
      coinsWon = parseInt(
        (cardCoinsDetails[cardWon].userBet /
          cardCoinsDetails[cardWon].totalBet) *
          100
      );
    } else {
      coinsWon = parseInt(
        (totalCoinsOnTable * 0.8 * cardCoinsDetails[cardWon].userBet) /
          cardCoinsDetails[cardWon].totalBet
      );
    }
    res.status(200).json(coinsWon);
  } catch (e) {
    console.log("ERROR: ", e);
    res.status(400).json({ error: e });
  }
}

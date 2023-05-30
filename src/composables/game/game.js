//composables
import getDatabase from "@/composables/get/getDatabase";
import useDatabase from "@/composables/use/useDatabase";
import useDocument from "@/composables/use/useDocument";
import getUser from "@/composables/get/getUser";
//other
import store from "../../store/index";

const game = (table, datplayer, datdocs, profiles, rankings) => {
  //functions to clean up table
  const { removeArrayObject, updateArrayObject, updateDoc } = useDocument(
    "tables",
    table.id
  );

  //realtime database
  const { addDat: addturn } = useDatabase(
    "tables/" + table.id + "/currentturn/"
  );

  const namesOfSuits = { c: "Clubs", d: "Diamonds", h: "Hearts", s: "Spades" };
  const nameOfValues = [
    "Ace",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Jack",
    "Queen",
    "King",
  ];

  //54 cards 13 of each suit plus 2 jokers
  const cards = "cccccccccccccdddddddddddddhhhhhhhhhhhhhsssssssssssssjj";
  let middlecard = datdocs.middlecard;
  let hand = datplayer.cards;

  const deal = () => {
    // GET TABLE USERS DEPENDING ON WHETHER ITS GAME WITH COMPUTER OR NOT
    let tableUsers = [];
    if (table.computer === false) tableUsers = table.users;
    else {
      const { user } = getUser();
      tableUsers = [{ userid: "1" }, { userid: "2" }, { userid: "3" }];
      tableUsers.push({ userid: user.value.uid });
    }

    for (let usr of tableUsers) {
      for (let i = 0; i < 5; i++) {
        const suit = cards.charAt(Math.floor(Math.random() * cards.length));
        let value = 0;
        if (suit === "j") {
          value = Math.floor(Math.random() * 2) + 1;
        } else {
          value = Math.floor(Math.random() * 13) + 1;
        }
        const path = require("@/assets/cards/" + suit + value + ".png");
        const objecthand = { suit, value, id: i, path };
        hand.push(objecthand);
      }
      hand = sorthand(hand).slice(0);
      handdatabase(usr.userid, hand);
      hand = [];
    }
    middle();
  };

  //set middlecard for the first time
  const middle = () => {
    const suit = cards.charAt(Math.floor(Math.random() * cards.length));
    const value = Math.floor(Math.random() * 13) + 1;
    //if joker redo
    if (suit === "j") {
      middle();
    } else if ((suit === "h" || suit === "s") && value === 13) {
      middle();
    }
    //if function card redo
    else if (
      value === 1 ||
      value === 2 ||
      value === 3 ||
      value === 4 ||
      value === 11
    ) {
      middle();
    }
    //if function king redo
    const path = require("@/assets/cards/" + suit + value + ".png");

    //set middlecard and add it to database
    middlecard = { suit, value, path };
    middledatabase();
  };

  //draw card
  const draw = (userid, userTurn) => {
    const { documents: playercards } = getDatabase(
      "tables/" + table.id + "/users/" + userid + "/cards/"
    );
    hand = playercards.value;
    const { documents } = getDatabase("tables/" + table.id);

    if (documents.value.currentturn.turn === userTurn) {
      const suit = cards.charAt(Math.floor(Math.random() * cards.length));
      let value = 0;

      if (suit === "j") {
        value = Math.floor(Math.random() * 2) + 1;
      } else {
        value = Math.floor(Math.random() * 13) + 1;
      }

      const path = require("@/assets/cards/" + suit + value + ".png");
      const objecthand = { suit, value, id: hand.length, path };

      hand.push(objecthand);
      hand = sorthand(hand).slice(0);
      handdatabase(userid, hand);

      if (documents.value.function.amount > 0) {
        demanddecrease(documents.value);
      }

      drawMessage(userid);

      turndatabase(1);

      if (documents.value.makao.user === userid) {
        makao();
      }
    }
  };

  //sorthand
  const sorthand = (userhand) => {
    //prepare all suits and temporary hands
    const suits = ["c", "d", "s", "h", "j"];
    const sortedhand = [];
    for (const suit of suits) {
      const tosortvalues = [];
      for (const card of userhand) {
        if (card.suit === suit) {
          //save all curently looking for cards with right suit into temporary hand
          tosortvalues.push({
            suit: card.suit,
            value: card.value,
            id: card.id,
            path: card.path,
          });
        }
      }
      //sort values
      tosortvalues.sort(function(a, b) {
        return a.value - b.value;
      });
      //save in other temporary hand and clear the first one before looking at another suit
      sortedhand.push(...tosortvalues);
      // tosortvalues = [];
    }
    //return
    let i = -1;
    return sortedhand.map((card) => {
      i += 1;
      return { ...card, id: i };
    });
  };

  const throwcard = (userid, card, nextuserid, previoususerid) => {
    //throwMessage
    const { documents: playercards } = getDatabase(
      "tables/" + table.id + "/users/" + userid + "/cards/"
    );
    hand = playercards.value;
    const { documents } = getDatabase("tables/" + table.id);
    if (documents.value.currentturn.turn === datplayer.information.turn) {
      if (documents.value.function.type === "demandyes") {
        demandthrow(card, userid, documents.value);
      } else {
        if (card.suit === "j") {
          handleThrownCard(userid, hand, card);

          if (hand.length === 0) {
            ifvictory(userid, documents.value);
          } else {
            functionjoker();
          }
        } else if (
          card.suit === documents.value.middlecard.suit ||
          card.value === documents.value.middlecard.value
        ) {
          handleThrownCard(userid, hand, card);

          if (hand.length === 0) {
            ifvictory(userid, documents.value);
          } else {
            if (card.value === 2 || card.value === 3) {
              function23(card, nextuserid, userid);
            } else if (card.value === 4) {
              functionstop(userid);
            } else if (card.value === 13) {
              functionking(card, nextuserid, previoususerid, userid);
            } else if (card.value === 1) {
              functionsuit();
            } else if (card.value === 11) {
              functiondemand();
            } else {
              ifmakao(userid);
              turndatabase(1);
            }
          }
        }
      }
    }
  };

  const handleThrownCard = (userId, userHand, userCard) => {
    middlecard = userCard;
    middledatabase();
    userHand.splice(userCard.id, 1);
    userHand = sorthand(userHand).slice(0);
    handdatabase(userId, userHand);
    throwMessage(userId, userCard);
  };

  //cardfunctions
  //draw 2 and 3
  const function23 = (card, nextuserid, userid) => {
    const { documents: nextplayer } = getDatabase(
      "tables/" + table.id + "/users/" + nextuserid + "/cards/"
    );
    const nexthand = nextplayer.value;

    functiondraw(card.value, nextuserid, nexthand, userid, 2);
  };

  //stop
  const functionstop = (userid) => {
    ifmakao(userid);
    turndatabase(2);
  };

  //king
  const functionking = (card, nextuserid, previoususerid, userid) => {
    if (card.suit === "h") {
      const { documents: nextplayer } = getDatabase(
        "tables/" + table.id + "/users/" + nextuserid + "/cards/"
      );
      const nexthand = nextplayer.value;

      functiondraw(5, nextuserid, nexthand, userid, 2);
    } else if (card.suit === "s") {
      const { documents: previousplayer } = getDatabase(
        "tables/" + table.id + "/users/" + previoususerid + "/cards/"
      );
      const previoushand = previousplayer.value;

      functiondraw(5, previoususerid, previoushand, userid, 1);
    } else {
      turndatabase(1);
    }
  };

  //suit
  const functionsuit = () => {
    const { addDat } = useDatabase("tables/" + table.id + "/function/");
    addDat({ amount: 0, type: "ace" });
  };

  //demand
  const functiondemand = () => {
    const { addDat } = useDatabase("tables/" + table.id + "/function/");
    addDat({ amount: 0, type: "demandnot" });
  };

  //joker
  const functionjoker = () => {
    const { addDat } = useDatabase("tables/" + table.id + "/function/");
    addDat({ amount: 0, type: "joker" });
  };

  //joker if demand
  const demandjoker = (documents, ifjack) => {
    const { addDat } = useDatabase("tables/" + table.id + "/function/");
    if (ifjack === false) {
      addDat({
        amount: documents.function.amount,
        type: "demandjoker",
        value: documents.function.value,
      });
    } else {
      addDat({
        amount: documents.function.amount,
        type: "demandjokerjack",
        value: documents.function.value,
      });
    }
  };

  //for 2 3 and king
  const functiondraw = async (
    amount,
    funuserid,
    funhand,
    userid,
    databaseMovement
  ) => {
    for (let i = 0; i < amount; i++) {
      //choose a character from 54 characters
      const suit = cards.charAt(Math.floor(Math.random() * cards.length));
      let value = 0;
      //if joker choose value from 1 to 2, otherwise from 1 to 13
      if (suit === "j") {
        value = Math.floor(Math.random() * 2) + 1;
      } else {
        value = Math.floor(Math.random() * 13) + 1;
      }
      //get path save, to an object then push to array and clear before next loop
      const path = require("@/assets/cards/" + suit + value + ".png");
      const objecthand = { suit, value, id: funhand.length, path };
      funhand.push(objecthand);
    }

    //sort hand
    funhand = sorthand(funhand).slice(0);

    //change hand in database
    const { addDat } = useDatabase(
      "tables/" + table.id + "/users/" + funuserid + "/cards/"
    );
    addDat(
      funhand.map((doc) => {
        return { ...doc };
      })
    );
    ifmakao(userid);

    //changeturn
    turndatabase(databaseMovement);

    //remove makao status if user has
    removemakao(funuserid);
  };

  const demandthrow = (card, userid, documents) => {
    //if joker was thrown
    if (card.suit === "j") {
      //ifjack checks if anything was thrown since demand
      let ifjack = false;
      if (documents.middlecard.value === 11) {
        ifjack = true;
      }

      handleThrownCard(userid, hand, card);

      //check if player has only one card left
      ifmakao(userid);

      if (hand.length === 0) {
        ifvictory(userid, documents);
      } else {
        //activate joker function
        demandjoker(documents, ifjack);
      }
    }
    //if no demanded card was thrown yet you can throw Jack
    else if (documents.middlecard.value === 11 && card.value === 11) {
      handleThrownCard(userid, hand, card);

      //check if player has only one card left
      ifmakao(userid);
      if (hand.length === 0) {
        ifvictory(userid, documents);
      } else {
        functiondemand();
      }
    }
    //if clicked on card is demanded
    else if (card.value === documents.function.value) {
      handleThrownCard(userid, hand, card);

      //check if player has only one card left
      ifmakao(userid);

      if (hand.length === 0) {
        ifvictory(userid, documents);
      } else {
        turndatabase(1);

        //decrease turn count
        demanddecrease(documents);
      }
    }
  };

  //databases functions
  const demanddecrease = (documents) => {
    const { addDat } = useDatabase("tables/" + table.id + "/function/");
    const turns = documents.function.amount - 1;
    if (turns === 0) {
      addDat({ amount: 0, type: "" });
    } else {
      addDat({
        amount: turns,
        type: "demandyes",
        value: documents.function.value,
      });
    }
  };

  const middledatabase = () => {
    const { addDat: addmiddlecard } = useDatabase(
      "tables/" + table.id + "/middlecard/"
    );
    addmiddlecard(middlecard);
  };

  const handdatabase = async (userid, newHand) => {
    // let handToDatabase = newHand === null ? hand : newHand;
    let handToDatabase = newHand;
    const { addDat } = useDatabase(
      "tables/" + table.id + "/users/" + userid + "/cards/"
    );
    addDat(
      handToDatabase.map((doc) => {
        return { ...doc };
      })
    );
  };

  const turndatabase = (amount) => {
    const { documents } = getDatabase("tables/" + table.id);
    let currentturn = documents.value.currentturn.turn;
    for (let i = 0; i < amount; i++) {
      if (currentturn === datdocs.playercount.number) {
        currentturn = 0;
      }
      currentturn += 1;
    }
    addturn({ turn: currentturn });
  };

  //check if player has only one card left on his hand
  const ifmakao = (userid) => {
    if (table.computer === true) return;
    if (hand.length === 1) {
      const { addDat: addMakao } = useDatabase(
        "tables/" + table.id + "/makao/"
      );
      addMakao({ user: userid });
    }
  };
  const makao = () => {
    const { addDat: addMakao } = useDatabase("tables/" + table.id + "/makao/");
    addMakao({ user: "" });
  };
  const stopmakao = (userid) => {
    const { documents: makaoplayer } = getDatabase(
      "tables/" + table.id + "/users/" + userid + "/cards/"
    );
    const makaoplayerhand = makaoplayer.value;

    functiondraw(5, userid, makaoplayerhand, 0);

    const { addDat: addMakao } = useDatabase("tables/" + table.id + "/makao/");
    addMakao({ user: "" });
  };
  //clear makao status if cards changed
  const removemakao = async (userid) => {
    const { documents: makaouser } = await getDatabase(
      "tables/" + table.id + "/makao/"
    );
    if (makaouser.value.user !== "" && userid === makaouser.value.user) {
      const { addDat: addMakao } = await useDatabase(
        "tables/" + table.id + "/makao/"
      );
      addMakao({ user: "" });
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  //check if somebody won
  const ifvictory = async (userid, documents) => {
    // CLEAR INTERVAL FUNCTION IF COMPUTER GAME
    if (table.computer === true) store.commit("clearIntervalFn");

    // CLEAR READY STATUS FOR USERS
    for (const usr of table.users) {
      const readyfalseuser = {
        name: usr.name,
        userid: usr.userid,
        ready: false,
      };
      const currentuser = {
        name: usr.name,
        userid: usr.userid,
        ready: true,
      };
      updateArrayObject("users", readyfalseuser);
      removeArrayObject("users", currentuser);
    }
    let points = 5;
    if (table.ranking === true) {
      for (let i = 2; i < documents.playercount.number; i++) {
        points += 5;
      }
      rankingresult(points, userid);
    }

    if (table.computer === false) gameresult(userid);

    resultinformation(userid, points);

    const { deleteDat } = useDatabase("tables/" + table.id);
    deleteDat();

    await updateDoc({
      inprogress: false,
    });
  };

  //if its a ranking game count points and victory and loss
  const rankingresult = async (points, userid) => {
    for (const usr of rankings) {
      //prepare user ranking info for change
      const { updateDoc } = await useDocument("user_ranking", usr.value.id);
      let rankpoints = usr.value.points;
      let rankwon = usr.value.ranking_won;
      let ranklost = usr.value.ranking_lost;
      //if winner
      if (userid === usr.value.id) {
        rankpoints += points;
        rankwon += 1;
      }
      //if loser
      else {
        rankpoints -= 5;
        ranklost += 1;
      }
      //update database
      updateDoc({
        points: rankpoints,
        ranking_won: rankwon,
        ranking_lost: ranklost,
      });
    }
  };

  //change in profile won and lost count
  const gameresult = async (userid) => {
    for (const usr of profiles) {
      //prepare user ranking info for change
      const { updateDoc } = await useDocument("user_profile", usr.value.id);
      let won = usr.value.won;
      let lost = usr.value.lost;
      //if winner
      if (userid === usr.value.id) {
        won += 1;
      }
      //if loser
      else {
        lost += 1;
      }
      //update database
      updateDoc({
        won: won,
        lost: lost,
      });
    }
  };

  ////////////////////////////////////////////////////////////////////////
  // MESSAGES WRITTEN TO CHAT

  const resultinformation = (userid, points) => {
    let text = "Game result: ";

    for (const usr of table.users) {
      if (usr.userid === userid) {
        text += ` [ Winner: ${usr.name}${
          table.ranking === true ? `(${points})` : ""
        }] `;
      } else {
        text += ` [ Loser: ${usr.name}${
          table.ranking === true ? `(-5)` : ""
        }] `;
      }
    }

    generateMessage(text);
    text = "";
  };

  const drawMessage = (userId) => {
    const userName = getUserName(userId);

    const text = `${userName} has drawn a card`;
    generateMessage(text);
  };

  const throwMessage = (userId, card) => {
    const userName = getUserName(userId);
    let text = `${userName} has thrown`;
    if (card.suit === "j") text += ` a Joker`;
    else
      text += ` ${nameOfValues[card.value - 1]} of ${namesOfSuits[card.suit]}`;
    generateMessage(text);
  };

  const aceMessage = (userId, card) => {
    const userName = getUserName(userId);
    const text = `${userName} decided to change Ace suit to ${
      namesOfSuits[card.suit]
    }`;
    generateMessage(text);
  };
  const demandMessage = (userId, value) => {
    const userName = getUserName(userId);
    const demandValue = value !== 0 ? `${nameOfValues[value - 1]}s` : "nothing";

    const text = `${userName} decided to demand ${demandValue}`;
    generateMessage(text);
  };
  const jokerMessage = (userId, card) => {
    const userName = getUserName(userId);
    const text = `${userName} decided to change joker to ${
      nameOfValues[card.value - 1]
    } of ${namesOfSuits[card.suit]}`;
    generateMessage(text);
  };

  const getUserName = (userId) => {
    if (userId !== datplayer.information.id) return `Computer ${userId}`;
    else return datplayer.information.name;
  };

  const generateMessage = async (messageText) => {
    const message = {
      text: messageText,
      createdAt: Date.now(),
    };

    await updateArrayObject("messages", message);
  };

  ////////////////////////////////////////////////////////////////////////////////
  // function to handle computer throwing cards
  const computerThrowCard = (userId, nextUserId, previousUserId) => {
    const { documents: playercards } = getDatabase(
      "tables/" + table.id + "/users/" + userId + "/cards/"
    );
    //////////////////////////////////////////////////////////////////
    const { documents: middlecard } = getDatabase(
      "tables/" + table.id + "/middlecard/"
    );
    //////////////////////////////////////////////////////////////////
    const { documents } = getDatabase("tables/" + table.id);
    //action to check if computer already did something
    let action = false;
    let computerHand = playercards.value;

    playercards.value.forEach((card) => {
      if (action === false) {
        //If card is demanded throw matching card or draw
        if (documents.value.function.type === "demandyes") {
          demandComputerThrow(computerHand, userId, documents.value);
          action = true;
        } else if (card.suit === "j") {
          // If card is joker set card to one on the hand that is not joker(or king of hearts if impossible)
          throwMessage(userId, card);
          computerJoker(
            computerHand,
            card.id,
            documents,
            userId,
            nextUserId,
            previousUserId
          );
          action = true;
        } else if (
          card.suit === middlecard.value.suit ||
          card.value === middlecard.value.value
        ) {
          // Throw card and handle function if there is
          handleThrownCard(userId, computerHand, card);
          if (computerHand.length === 0) {
            ifvictory(userId, documents.value);
          } else {
            computerCheckCardValue(
              computerHand,
              card,
              userId,
              nextUserId,
              previousUserId
            );
          }

          action = true;
        }
      }
    });
    if (action === false) {
      draw(userId, +userId + 1);
    }
  };

  const computerCheckCardValue = (
    computerHand,
    card,
    userId,
    nextUserId,
    previousUserId
  ) => {
    if (card.value === 2 || card.value === 3) {
      function23(card, nextUserId, userId);
    } else if (card.value === 4) {
      functionstop(userId);
    } else if (card.value === 13) {
      functionking(card, nextUserId, previousUserId, userId);
    } else if (card.value === 1) {
      computerSuit(computerHand, userId, card);
    } else if (card.value === 11) {
      computerDemand(computerHand, userId);
    } else {
      turndatabase(1);
    }
  };

  const demandComputerThrow = (computerHand, userId, documents) => {
    let action = false;
    computerHand.forEach((card) => {
      // Check if chosen card is demanded
      if (action === false) {
        if (card.value === documents.function.value) {
          handleThrownCard(userId, computerHand, card);

          if (computerHand.length === 0) {
            ifvictory(userId, documents);
          } else {
            turndatabase(1);

            //decrease turn count
            demanddecrease(documents);

            action = true;
          }
        } //if no demanded card was thrown yet you can throw Jack
        else if (documents.middlecard.value === 11 && card.value === 11) {
          handleThrownCard(userId, computerHand, card);

          if (computerHand.length === 0) {
            ifvictory(userId, documents);
          } else {
            computerDemand(computerHand, userId);
            action = true;
          }
        } else if (card.suit === "j") {
          handleThrownCard(userId, computerHand, card);

          if (computerHand.length === 0) {
            ifvictory(userId, documents);
          } else {
            //activate joker function
            computerDemandJoker(computerHand, userId, documents);
            turndatabase(1);
            demanddecrease(documents);
            action = true;
          }
        }
      }
    });
    if (action === false) draw(userId, +userId + 1);
  };

  const computerDemandJoker = (computerHand, userId, documents) => {
    // get suits to check wich suit repeats the most in computer hand
    const suits = { h: 0, s: 0, c: 0, d: 0 };

    computerHand.forEach((card) => {
      if (card.value !== "j") {
        suits[card.suit] += 1;
      }
    });
    computerNewMiddleCard(
      biggestSuit(suits),
      documents.function.value,
      jokerMessage,
      userId
    );
  };

  const computerDemand = (computerHand, userId) => {
    const { addDat } = useDatabase("tables/" + table.id + "/function/");

    let cardValue = 0;
    computerHand.forEach((card) => {
      if (
        card.value === 5 ||
        card.value === 6 ||
        card.value === 7 ||
        card.value === 8 ||
        card.value === 9 ||
        card.value === 10 ||
        card.value === 12
      )
        cardValue = card.value;
    });
    if (cardValue === 0) {
      addDat({ amount: 0, type: "" });
    } else {
      addDat({
        amount: 3,
        type: "demandyes",
        value: cardValue,
      });
    }

    demandMessage(userId, cardValue);
    turndatabase(1);
  };

  // Find the most often repeated suit in hand
  const biggestSuit = (suits) => {
    let max = ["h", suits["h"]];
    if (suits["s"] > suits["h"]) max = ["s", suits["s"]];
    if (suits["c"] > suits["s"]) max = ["c", suits["c"]];
    if (suits["d"] > suits["c"]) max = ["d", suits["d"]];
    return max[0];
  };

  const computerJoker = (
    computerHand,
    cardId,
    documents,
    userId,
    nextUserId,
    previousUserId
  ) => {
    // CHECK IF COMPUTER ALREADY WON
    if (computerHand.length === 1) ifvictory(userId, documents);
    else {
      // GET NEW HAND WITHOUT THROWN CARD
      let newComputerHand = [...computerHand];
      newComputerHand.splice(cardId, 1);
      newComputerHand = sorthand(newComputerHand).slice(0);
      handdatabase(userId, newComputerHand);

      // CHANGE CARD INTO FIRST ONE ON HAND
      let ifOnlyJokerLeft = true;
      newComputerHand.forEach((card) => {
        //MAKE SURE THE CARD ISN'T JOKER
        if (card.suit !== "j" && ifOnlyJokerLeft === true) {
          ifOnlyJokerLeft = false;
          computerNewMiddleCard(card.suit, card.value, jokerMessage, userId);
          computerCheckCardValue(
            computerHand,
            card,
            userId,
            nextUserId,
            previousUserId
          );
        }
      });
      // SET FIVE OF HEARTS AS A CARD WHEN ONLY JOKERS LEFT ON HAND
      if (ifOnlyJokerLeft) {
        computerNewMiddleCard("h", 5, jokerMessage, userId);
        turndatabase(1);
      }
    }
  };

  const computerSuit = (computerHand, userId, oldCard) => {
    let action = false;
    let newCard = oldCard;

    // Check if there is any card other than joker left on the hand
    computerHand.forEach((card) => {
      if (card.suit !== "j" && action === false) {
        newCard = card;
        action = true;
      }
    });
    computerNewMiddleCard(newCard.suit, 1, aceMessage, userId);

    turndatabase(1);
  };
  const computerNewMiddleCard = (suit, value, messageFn, userId) => {
    // create new card
    const card = {};
    card.suit = suit;
    card.value = value;
    card.path = require("@/assets/cards/" + card.suit + card.value + ".png");
    // set new card as middle
    middlecard = card;
    middledatabase();
    // create message to chat
    messageFn(userId, card);
  };

  return {
    deal,
    hand,
    draw,
    middlecard,
    throwcard,
    computerThrowCard,
    function23,
    functionstop,
    functionking,
    functionsuit,
    functiondemand,
    functionjoker,
    turndatabase,
    demanddecrease,
    makao,
    stopmakao,
    ifmakao,
    aceMessage,
    demandMessage,
    jokerMessage,
  };
};

export default game;

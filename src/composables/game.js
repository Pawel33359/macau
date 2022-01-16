//composables
import getDatabase from "@/composables/getDatabase";
import useDatabase from "@/composables/useDatabase";
import useDocument from "@/composables/useDocument";


const game = (table,datplayer,datdocs, profiles, rankings)=>{

    //functions to clean up table
    const { removeArrayObject, updateArrayObject, updateDoc} = useDocument("tables", table.id);

    //realtime database
    const { addDat: addturn } = useDatabase("tables/" + table.id + "/currentturn/");

            //54 cards 13 of each suit plus 2 jokers
            

        var objecthand = {}
        var middlecard = datdocs.middlecard      
        var hand = datplayer.cards
        var suit = ""
        var value = 0
        var path = ""
        var cards = "cccccccccccccdddddddddddddhhhhhhhhhhhhhsssssssssssssjj"
        const deal = ()=>{
            for( var usr of table.users){
                for ( var i = 0; i < 5; i++ ) {
                    suit = cards.charAt(Math.floor(Math.random() * cards.length));
                    if(suit=="j"){
                        value = Math.floor(Math.random() * 2) + 1
                    }else{
                        value = Math.floor(Math.random() * 13) + 1 
                    }
                    path = require('@/assets/cards/'+suit+value+".png")
                    objecthand={suit: suit, value: value, id: i, path: path}
                    hand.push(objecthand)
                    suit = ""
                    value = 0
                }
                hand =  sorthand(hand).slice(0)
                handdatabase(usr.userid)
                hand = []
            }
            middle()
        }

        //set middlecard for the first time
        const middle = ()=>{
            suit = cards.charAt(Math.floor(Math.random() * cards.length));
            value = Math.floor(Math.random() * 13) + 1
            //if joker redo
            if(suit=="j"){
                middle();
            }
            else if( ( suit=="h" || suit=="s") && value==13){
                middle();
            }
            //if function card redo
            else if(value == 1 || value == 2 || value == 3 || value == 4 || value == 11){
                middle();
            }
            //if function king redo
            path = require('@/assets/cards/'+suit+value+".png")
            //set middlecard
            middlecard={suit: suit, value: value, path: path}
            
            //add middlecard to database
            middledatabase()
        }

        //draw card

        const draw = (userid)=>{
        const { documents: playercards } = getDatabase("tables/" + table.id + "/users/" + userid + "/cards/");
        hand = playercards.value
        const { documents } = getDatabase("tables/" + table.id);
            if(documents.value.currentturn.turn == datplayer.information.turn){
                    suit = cards.charAt(Math.floor(Math.random() * cards.length));

                    if(suit=="j"){
                        value = Math.floor(Math.random() * 2) + 1
                    }else{
                        value = Math.floor(Math.random() * 13) + 1 
                    }

                    path = require('@/assets/cards/'+suit+value+".png")
                    objecthand={suit: suit, value: value,id: hand.length, path: path}
        
                    hand.push(objecthand)
                    suit = ""
                    value = 0

                hand =sorthand(hand).slice(0)

                handdatabase(userid)

                if(documents.value.function.amount >0){
                    demanddecrease(documents.value)
                }

                turndatabase(1)

                if(documents.value.makao.user == userid){
                    makao()
                }
            }
        }

        //sorthand
        const sorthand = (userhand)=>{
            //prepare all suits and temporary hands
            var suits = ["c","d","s","h","j"]
            var sortedhand = []
            var tosortvalues = []
            for(var suit of suits){
                for(var card of userhand){
                    if(card.suit == suit){
                        //save all curently looking for cards with right suit into temporary hand
                        tosortvalues.push({suit: card.suit, value: card.value,id: card.id, path: card.path})
                    }
                }
                //sort values
                tosortvalues.sort(function(a, b) {
                    return a.value - b.value;
                });
                //save in other temporary hand and clear the first one before looking at another suit 
                sortedhand.push(...tosortvalues)
                tosortvalues = []
            }
            //return
            var i = -1
            return sortedhand.map((card)=>{
                i+=1
                return{...card, id: i};
            })
        }


        const throwcard = (userid,card,nextuserid,previoususerid)=>{
            const { documents: playercards } = getDatabase("tables/" + table.id + "/users/" + userid + "/cards/");
            hand = playercards.value
            const { documents } = getDatabase("tables/" + table.id);
            if(documents.value.currentturn.turn == datplayer.information.turn){
                if(documents.value.function.type == "demandyes"){
                    demandthrow(card,userid,documents.value)
                }
                else{
                    if(card.suit == "j"){
                        middlecard = card
                        middledatabase()
                        hand.splice(card.id, 1)
                        hand =sorthand(hand).slice(0)
                        handdatabase(userid)
                        if(hand.length == 0){
                            ifvictory(userid,documents.value)
                        }else{
                            functionjoker()
                        }
                    }
                    else if(card.suit == documents.value.middlecard.suit || card.value == documents.value.middlecard.value){
                        middlecard = card
                        middledatabase()
                        hand.splice(card.id, 1)
                        hand = sorthand(hand).slice(0)
                        handdatabase(userid)
                        if(hand.length == 0){
                            ifvictory(userid,documents.value)
                        }else{
                            if(card.value == 2 || card.value == 3){
                                function23(card,nextuserid,userid);
                            }else if(card.value == 4){
                                functionstop(userid);
                            }else if(card.value == 13){
                                functionking(card,nextuserid,previoususerid,userid);
                            }else if(card.value == 1){
                                functionsuit();
                            }else if(card.value == 11){
                                functiondemand();
                            }else{
                                ifmakao(userid)
                                turndatabase(1)
                            }
                        }
                    }
                }
            }
        }

        

        //cardfunctions
        //draw 2 and 3
        const function23 = (card,nextuserid,userid) =>{

            const { documents: nextplayer } = getDatabase("tables/" + table.id + "/users/" + nextuserid +"/cards/");
            var nexthand = nextplayer.value
          
            functiondraw(card.value,nextuserid,nexthand,userid)
        }

        //stop
        const functionstop = (userid) =>{
            ifmakao(userid)
            turndatabase(2)
        }

        //king
        const functionking = (card,nextuserid,previoususerid,userid) =>{
           if(card.suit == "h"){
            const { documents: nextplayer } = getDatabase("tables/" + table.id + "/users/" + nextuserid +"/cards/");
            var nexthand = nextplayer.value

            functiondraw(5,nextuserid,nexthand,userid)

           }else if(card.suit == "s"){
            const { documents: previousplayer } = getDatabase("tables/" + table.id + "/users/" + previoususerid +"/cards/");
            var previoushand = previousplayer.value
            
            functiondraw(5,previoususerid,previoushand,userid)
           }else{
            turndatabase(1)
           }
        }



        //suit
        const functionsuit = () =>{
            const { addDat } = useDatabase("tables/" + table.id + "/function/");
            addDat({amount: 0, type: "ace"})
        }


        //demand
         const functiondemand = () =>{
            const { addDat } = useDatabase("tables/" + table.id + "/function/");
            addDat({amount: 0, type: "demandnot"})
        }


        //joker
        const functionjoker = () =>{
            const { addDat } = useDatabase("tables/" + table.id + "/function/");
            addDat({amount: 0, type: "joker"})
        }

        //joker if demand
        const demandjoker  = (documents,ifjack) =>{
            const { addDat } = useDatabase("tables/" + table.id + "/function/");
            if(ifjack == false){
                addDat({amount: documents.function.amount, type: "demandjoker",value: documents.function.value})
            }else{
                addDat({amount: documents.function.amount, type: "demandjokerjack",value: documents.function.value})
            }
        }





        //for 2 3 and king
        const functiondraw = async(amount,funuserid,funhand,userid) =>{
            for ( var i = 0; i < amount; i++ ) {
                //choose a character from 54 characters
                suit = cards.charAt(Math.floor(Math.random() * cards.length));
                //if joker choose value from 1 to 2, otherwise from 1 to 13
                    if(suit=="j"){
                        value = Math.floor(Math.random() * 2) + 1
                    }else{
                    value = Math.floor(Math.random() * 13) + 1 
                    }
                    //get path save, to an object then push to array and clear before next loop 
                path = require('@/assets/cards/'+suit+value+".png")
                objecthand={suit: suit, value: value,id: funhand.length, path: path}
                funhand.push(objecthand)
                suit = ""
                value = 0
            }

            //sort hand
            funhand =sorthand(funhand).slice(0)

            //change hand in database
            const { addDat } = useDatabase("tables/" + table.id + "/users/" + funuserid + "/cards/");
            addDat(funhand.map((doc)=>{
                return{...doc}
            }))
            ifmakao(userid)

            //changeturn
            turndatabase(2)

            //remove makao status if user has
            removemakao(funuserid)
        }




        const demandthrow = (card,userid,documents)=>{
            //if joker was thrown
            if(card.suit == "j"){
                //ifjack checks if anything was thrown since demand
                var ifjack = false
                if(documents.middlecard.value == 11){
                    ifjack = true
                }

                middlecard = card
                middledatabase()
                
                hand.splice(card.id, 1)
                hand =sorthand(hand).slice(0)
                //change hand in database
                handdatabase(userid)

                //check if player has only one card left
                ifmakao(userid)


                if(hand.length == 0){
                    ifvictory(userid,documents)
                }else{
                    //activate joker function
                    demandjoker(documents,ifjack)
                }
            }

            //if no demanded card was thrown yet you can throw Jack
            else if(documents.middlecard.value == 11 && card.value == 11){
   
                //check if player has only one card left
                ifmakao(userid)

                if(hand.length == 0){
                    ifvictory(userid,documents)
                }else{
                    functiondemand();
                }
            }

            //if clicked on card is demanded
            else if(card.value == documents.function.value){
                middlecard = card
                middledatabase()

                hand.splice(card.id, 1)
                hand = sorthand(hand).slice(0)
                //change hand in database
                handdatabase(userid)

                //check if player has only one card left
                ifmakao(userid)

                if(hand.length == 0){
                    ifvictory(userid,documents)
                }else{
                    turndatabase(1)

                    //decrease turn count
                    demanddecrease(documents)
                }
            }
        }




        //databases functions
        const demanddecrease=(documents)=>{
            const { addDat } = useDatabase("tables/" + table.id + "/function/");
            var turns = documents.function.amount
            turns = turns - 1
            if(turns == 0){
                addDat({amount: 0, type: ""})
            }else{
                addDat({amount: turns, type: "demandyes", value: documents.function.value})
            }
        }


        
        const middledatabase =()=>{
            const { addDat: addmiddlecard } = useDatabase("tables/" + table.id + "/middlecard/");
            addmiddlecard(middlecard)
        }
        const handdatabase = async (userid)=>{
            const { addDat } = useDatabase("tables/" + table.id + "/users/" + userid + "/cards/");
            addDat(hand.map((doc)=>{
                return{...doc}
            }))
        }

        const turndatabase = (amount)=>{
            const { documents } = getDatabase("tables/" + table.id);        
            var currentturn = documents.value.currentturn.turn
            for(var i =0; i< amount;i++){
                if(currentturn == datdocs.playercount.number){
                    currentturn = 0
                }
                currentturn += 1
            }
            addturn({turn: currentturn})
        }


        //check if player has only one card left on his hand
        const ifmakao =(userid)=>{
            if(hand.length == 1){
                const { addDat: addMakao } = useDatabase("tables/" + table.id + "/makao/");
                addMakao({user: userid})
            }
        }
        const makao = ()=>{
            const { addDat: addMakao } = useDatabase("tables/" + table.id + "/makao/");
            addMakao({user: ""})
        }
        const stopmakao = (userid)=>{
            const { documents: makaoplayer } = getDatabase("tables/" + table.id + "/users/" + userid +"/cards/");
            var makaoplayerhand = makaoplayer.value

            functiondraw(5,userid,makaoplayerhand)

            const { addDat: addMakao } = useDatabase("tables/" + table.id + "/makao/");
            addMakao({user: ""})
        }
        //clear makao status if cards changed
        const removemakao =async(userid)=>{
          
            const { documents: makaouser } = await getDatabase("tables/" + table.id + "/makao/");
            if(makaouser.value.user != "" && userid == makaouser.value.user){
                const { addDat: addMakao } = await useDatabase("tables/" + table.id + "/makao/");
                addMakao({user: ""})
            }
            
        }


        //check if somebody won
        
        const ifvictory = async(userid,documents)=>{
                for(var usr of table.users){
                    var readyfalseuser = {
                        name: usr.name,
                        userid: usr.userid,
                        ready: false
                      }
                    var currentuser = {
                        name: usr.name,
                        userid: usr.userid,
                        ready: true
                      }
                    updateArrayObject('users', readyfalseuser)
                    removeArrayObject('users', currentuser)
                }
                if(table.ranking == true){
                    var points = 5
                    for(var i = 2; i<documents.playercount.number;i++){
                        points+=5
                    }
                    rankingresult(points,userid)
                }
                gameresult(userid)

                resultinformation(userid,points)

                const { deleteDat } = useDatabase("tables/" + table.id);
                deleteDat()
       
                await updateDoc({
                    inprogress: false
                });
        }

        //if its a ranking game count points and victory and loss
        const rankingresult = async(points,userid)=>{
            for(var usr of rankings){
                //prepare user ranking info for change
                const { updateDoc } = await useDocument("user_ranking", usr.value.id);
                var rankpoints = usr.value.points
                var rankwon = usr.value.ranking_won
                var ranklost = usr.value.ranking_lost
                //if winner
                if(userid == usr.value.id){
                    rankpoints+= points
                    rankwon+=1
                }
                //if loser
                else{
                    rankpoints-= 5
                    ranklost+=1
                }
                //update database
                updateDoc({
                    points: rankpoints,
                    ranking_won: rankwon,
                    ranking_lost: ranklost
                })
            }
        }
        
        //change in profile won and lost count
        const gameresult = async(userid)=>{
            for(var usr of profiles){
                //prepare user ranking info for change
                const { updateDoc } = await useDocument("user_profile", usr.value.id);
                var won = usr.value.won
                var lost = usr.value.lost
                //if winner
                if(userid == usr.value.id){
                    won+=1
                }
                //if loser
                else{
                    lost+=1
                }
                //update database
                updateDoc({
                    won: won,
                    lost: lost
                })
            }
        }

        const resultinformation = async(userid,points)=>{
            const { error, updateDoc } = useDocument("tables", table.id);
            var text = "Game result: ";

            for(var usr of table.users){
                if(usr.userid == userid){
                    text += " [ Winner: " + usr.name + "(+" +points+")] " 
                }else{
                    text += " [ Loser: "+ usr.name + "(-5)] " 
                }
            }

            const message = {
                text: text,
                createdAt: Date.now(),
              };
        
              await updateDoc({
                  messages:[...table.messages, message]
              });
              if (!error.value) {
                text = "";
              }

        }

        
        return {deal,hand,draw,middlecard,throwcard,
            function23,functionstop,functionking,functionsuit,functiondemand,functionjoker,
            turndatabase,demanddecrease,
            makao,stopmakao,ifmakao
        }
}

export default game
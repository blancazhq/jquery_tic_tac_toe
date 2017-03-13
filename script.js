$(document).ready(function () {
  //game parameter init
  var result_array = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  var result_array_copy = [];
  var index_array = [[0, 0],[0, 1],[0, 2],[1, 0],[1, 1],[1, 2],[2, 0],[2, 1],[2, 2]]
  var turn = "player1";
  var game_runner = true;
  var player1_score = 0;
  var player2_score = 0;
  var vsComputer = false;
  var cross_pic_source = "url(images/cross.png)";
  var circle_pic_source = "url(images/circle.png)";

  //check winner function
  function checkWinner(array){
    function decideWinner(str, winner){
      if (str === "O"){
        winner = "player1"
      } else if(str === "X"){
        winner = "player2"
      }
      return winner
      }
      var winner = "";
      function matches(a,b,c){
        return a === b && b === c && b !== null;
      }

      if(matches(array[0][0],array[1][1],array[2][2])){
        return decideWinner(array[0][0], winner)
      }
      if(matches(array[0][2],array[1][1],array[2][0])){
        return decideWinner(array[1][1], winner)
      }

      for(var i=0; i<3; i++){
        if(matches(array[i][0],array[i][1],array[i][2])){
          return decideWinner(array[i][0], winner);
        }
        if(matches(array[0][i],array[1][i],array[2][i])){
          return decideWinner(array[0][i], winner);
        }
      }
  }

  //show winner ballon function
  function showWinner(winner){
    if(winner === "player1"){
      $("#winner_wrapper").css({"background-image": "url(images/winner_circle.png)", "background-repeat": "no-repeat", "background-size":"cover"});
    } else if(winner === "player2"){
      $("#winner_wrapper").css({"background-image": "url(images/winner_cross.png)", "background-repeat": "no-repeat", "background-size":"cover"});
    }
    TweenMax.from("#winner_wrapper", 6, {y: 0, x: 0})
    TweenMax.to("#winner_wrapper", 6, {y: -1000, x: 700})
  }

  //start new game function
  function startNewGame(){
    result_array = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
      ]
    turn = "player1";
    game_runner = true;
    $(".square").css({"background-image": "none"});
  }

  function resetScore(){
    player1_score = 0;
    $("#player1_score").text(player1_score);
    player2_score = 0;
    $("#player2_score").text(player2_score);
  }

  function gemAnimation(element){
    TweenMax.from(element, 1, {scale: 0})
    TweenMax.to(element, 1, {scale: 1})
  }

  function isNotOccupied(element){
    return $(element).css("background-image") === "none"
  }

  function changeBackground(element, source){
    $(element).css({"background-image": source, "background-repeat": "no-repeat", "background-size":"10vw 10vw", "background-position":"40% 40%"});
  }

  function makeMove(element, source, array_index1, array_index2, str){
    changeBackground(element, source);
    result_array[array_index1][array_index2] = str;
    gemAnimation(element);
  }

  function makeRandomMove(){
    var computerChoice = Math.random() * 9;
    for(var i = 0; i<9; i++){
      if(computerChoice>i && computerChoice <= i+1 && isNotOccupied(".square"+(i+1))){
        makeMove(".square"+(i+1), cross_pic_source, index_array[i][0], index_array[i][1], "X")
      }else if(computerChoice>i && computerChoice <= i+1 && !isNotOccupied(".square"+(i+1))){
        makeRandomMove()
      }
    }
  }
  //nav bar init
  $("#new_game").on("click", startNewGame)

  $("#score_board").hide();

  $("#score_board_button").on("click", function(){
    $("#score_board").toggle();
  })

  $("#reset_score_board").on("click", resetScore)

  $("#two_players").on("click", function(){
    startNewGame();
    vsComputer = false;
    $("#two_players").css({"text-decoration": "underline"});
    $("#vs_computer").css({"text-decoration": "none"});
  })

  $("#vs_computer").on("click", function(){
    startNewGame();
    vsComputer = true;
    $("#two_players").css({"text-decoration": "none"});
    $("#vs_computer").css({"text-decoration": "underline"});
  })

  //click to start
  $("#square_wrapper").on("click", ".square", function(){
      //Copying the current array for computer to make a random move.
      if(game_runner === true && turn === "player1" && isNotOccupied(this)){
        changeBackground(this, circle_pic_source);
        gemAnimation(this)
        for(var i = 0; i<9; i++){
          if($(this).attr("class").split(' ')[1] === "square"+(i+1)){
            result_array[index_array[i][0]][index_array[i][1]] = "O";
          }
        }
        if(checkWinner(result_array) === "player1"){
          showWinner(checkWinner(result_array));
          setTimeout(startNewGame, 2000);
          player1_score += 1;
          $("#player1_score").text(player1_score);
          game_runner = false;
        }
        if(vsComputer === false){
          turn = "player2";
        }
        //computer move
        if(vsComputer === true){
          function makeAMove(){
            var computerChoiceCounter = 1;
            var checkedTwo = false;
            for(var i = 0; i<9; i++){
              if(computerChoiceCounter === i+1 && isNotOccupied(".square"+(i+1))){
                //computer try to test whether it's going to win within one step
                result_array_copy = JSON.parse(JSON.stringify(result_array));
                result_array_copy[index_array[i][0]][index_array[i][1]] = "X";
                if(checkWinner(result_array_copy) === "player2"){
                  makeMove(".square"+(i+1), cross_pic_source, index_array[i][0], index_array[i][1], "X");
                }else{
                  //computer try to test whether the player is going to win within one step
                  result_array_copy = JSON.parse(JSON.stringify(result_array));
                  result_array_copy[index_array[i][0]][index_array[i][1]] = "O";
                  if(checkWinner(result_array_copy) === "player1"){
                    makeMove(".square"+(i+1), cross_pic_source, index_array[i][0], index_array[i][1], "X");
                  }else{
                    computerChoiceCounter += 1;
                  }
                }
              }else if(computerChoiceCounter === i+1 && !isNotOccupied(".square"+(i+1))){
                computerChoiceCounter += 1;
              }
            }

            //when computer cannot win or prevent the player from winning within one step,
            //it try to prevent the player from "a two way winning."
            //In other words, if the player has two gems together or two gems on the furtherest opposite corner,
            //the player might be able to win in a few steps. The computer is going to prevent this situation.
            if(computerChoiceCounter>9 && checkedTwo === false){
              if(result_array[1][1] === "O"){
                if(result_array[1][0] === "O"){
                  if(isNotOccupied(".square1")){
                    makeMove(".square1", cross_pic_source, index_array[0][0], index_array[0][1], "X");
                  }else if(isNotOccupied(".square7")){
                    makeMove(".square7", cross_pic_source, index_array[6][0], index_array[6][1], "X");
                  }
                }else if(result_array[0][1] === "O"){
                  if(isNotOccupied(".square1")){
                    makeMove(".square1", cross_pic_source, index_array[0][0], index_array[0][1], "X");
                  }else if(isNotOccupied(".square3")){
                    makeMove(".square3", cross_pic_source, index_array[2][0], index_array[2][1], "X");
                  }
                }else if(result_array[1][2] === "O"){
                  if(isNotOccupied(".square9")){
                    makeMove(".square9", cross_pic_source, index_array[8][0], index_array[8][1], "X");
                  }else if(isNotOccupied(".square3")){
                    makeMove(".square3", cross_pic_source, index_array[2][0], index_array[2][1], "X");
                  }
                }else if(result_array[2][1] === "O"){
                  if(isNotOccupied(".square9")){
                    makeMove(".square9", cross_pic_source, index_array[8][0], index_array[8][1], "X");
                  }else if(isNotOccupied(".square7")){
                    makeMove(".square7", cross_pic_source, index_array[6][0], index_array[6][1], "X");
                  }
                }else if(result_array[0][0] === "O"){
                  if(isNotOccupied(".square2")){
                    makeMove(".square2", cross_pic_source, index_array[1][0], index_array[1][1], "X");
                  }else if(isNotOccupied(".square3")){
                    makeMove(".square3", cross_pic_source, index_array[2][0], index_array[2][1], "X");
                  }else if(isNotOccupied(".square4")){
                    makeMove(".square4", cross_pic_source, index_array[3][0], index_array[3][1], "X");
                  }else if(isNotOccupied(".square7")){
                    makeMove(".square7", cross_pic_source, index_array[6][0], index_array[6][1], "X");
                  }
                }else if(result_array[0][2] === "O"){
                  if(isNotOccupied(".square1")){
                    makeMove(".square1", cross_pic_source, index_array[0][0], index_array[0][1], "X");
                  }else if(isNotOccupied(".square2")){
                    makeMove(".square2", cross_pic_source, index_array[1][0], index_array[1][1], "X");
                  }else if(isNotOccupied(".square9")){
                    makeMove(".square9", cross_pic_source, index_array[8][0], index_array[8][1], "X");
                  }else if(isNotOccupied(".square6")){
                    makeMove(".square6", cross_pic_source, index_array[5][0], index_array[5][1], "X");
                  }
                }else if(result_array[2][0] === "O"){
                  if(isNotOccupied(".square1")){
                    makeMove(".square1", cross_pic_source, index_array[0][0], index_array[0][1], "X");
                  }else if(isNotOccupied(".square4")){
                    makeMove(".square4", cross_pic_source, index_array[3][0], index_array[3][1], "X");
                  }else if(isNotOccupied(".square8")){
                    makeMove(".square8", cross_pic_source, index_array[7][0], index_array[7][1], "X");
                  }else if(isNotOccupied(".square6")){
                    makeMove(".square6", cross_pic_source, index_array[5][0], index_array[5][1], "X");
                  }
                }else if(result_array[2][2] === "O"){
                  if(isNotOccupied(".square3")){
                    makeMove(".square3", cross_pic_source, index_array[2][0], index_array[2][1], "X");
                  }else if(isNotOccupied(".square6")){
                    makeMove(".square6", cross_pic_source, index_array[5][0], index_array[5][1], "X");
                  }else if(isNotOccupied(".square7")){
                    makeMove(".square7", cross_pic_source, index_array[6][0], index_array[6][1], "X");
                  }else if(isNotOccupied(".square8")){
                    makeMove(".square8", cross_pic_source, index_array[7][0], index_array[7][1], "X");
                  }
                }
              }else if(result_array[0][0] === "O" && result_array[2][2] === "O"){
                if(isNotOccupied(".square3")){
                  makeMove(".square3", cross_pic_source, index_array[2][0], index_array[2][1], "X");
                }else if(isNotOccupied(".square7")){
                  makeMove(".square7", cross_pic_source, index_array[6][0], index_array[6][1], "X");
                }
              }else if(result_array[0][2] === "O" && result_array[2][0] === "O"){
                if(isNotOccupied(".square1")){
                  makeMove(".square1", cross_pic_source, index_array[0][0], index_array[0][1], "X");
                }else if(isNotOccupied(".square9")){
                  makeMove(".square9", cross_pic_source, index_array[8][0], index_array[8][1], "X");
                }
              }
            }

            if(computerChoiceCounter>9 && checkedTwo === false){
              if(isNotOccupied(".square5")){
                makeMove(".square5", cross_pic_source, index_array[4][0], index_array[4][1], "X");
              }else{
                computerChoiceCounter =1;
                makeRandomMove();
              }
            }
          }

          function checkNull(element, index, array){
            return element === null;
          }
          function checkAvailable(result_array){
            for(var i=0; i<result_array.length; i++){
              if(result_array[i].some(checkNull)){
                return;
              }
            }game_runner = false;
          }
          checkAvailable(result_array);
          if(game_runner === true){
            setTimeout(makeAMove, 500);
          }
          setTimeout(function(){
            if(checkWinner(result_array) === "player2"){
              showWinner(checkWinner(result_array));
              setTimeout(startNewGame, 2000);
              player2_score += 1;
              $("#player2_score").text(player2_score);
              game_runner = false;
            }
          }, 600);
        }
      }//player2 move
      else if(vsComputer === false && game_runner === true && turn === "player2" && isNotOccupied(this)){
        changeBackground(this, cross_pic_source);
        gemAnimation(this)
        for(var i = 0; i<9; i++){
          if($(this).attr("class").split(' ')[1] === "square"+(i+1)){
            result_array[index_array[i][0]][index_array[i][1]] = "X";
          }
        }
        if(checkWinner(result_array) === "player2"){
          showWinner(checkWinner(result_array));
          setTimeout(startNewGame, 2000);
          player2_score += 1;
          $("#player2_score").text(player2_score);
          game_runner = false;
        }
        turn = "player1";
      }

      //detect draw: stringify the result array, if the length is smaller than 9, than it's a draw. It's going to start a new game.
      var result_array_1d = [];
      for(var i = 0; i < 9; i++){
          result_array_1d.push(result_array[index_array[i][0]][index_array[i][1]]);
      }
      function combine(a, b){
        return a + b;
      }
      var result_array_string = result_array_1d.reduce(combine, "");
      if(result_array_string.length <= 9){
        setTimeout(startNewGame, 2000);
      }
  })
})

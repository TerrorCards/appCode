var gBattleUser = {};
var gBattleTarget = {};
var gBattleWinner = '';
var gBattleLoser = '';
var gArrResults = [];

function loadBattlePlayers() {
	gBattleUser.ID = gUser.ID;
	gBattleUser.Moves = -999;
	callServer("battleYourStats", {user:gUser.ID}, gUser.ID, populateBattleStats);
	myApp.popup('.battle-players-list');
	var vHeight = ($(window).height() - 100);
	var vWidth = (($(window).width() / 2) - 100);
	$("#tblBattlePlayerList").css("height", vHeight + "px");
	$("#divBattlePopup").css("height", vHeight + "px");
	$("#divBattleResult").css("left", vWidth + "px");
	callServer("battlePlayerList", {rating:gUser.Rating}, gUser.ID, populateBattlePlayers);	 	
}

function populateBattleStats(pParams) {
	if(pParams.length > 0) {
		$.each(pParams, function (index, value) {
			$("#tdBattleCurrWins").text(value.Curr_Win);
			$("#tdBattleCurrLoses").text(value.Curr_Lose);
			$("#tdBattleMoves").text(value.AvailablePlays);
			gBattleUser.Moves = value.AvailablePlays;
		});	
	}	
}

function populateBattlePlayers(pParams) {
	if(pParams.length > 0) {
		$('#tblBattlePlayerList tbody').empty();
		$('#tblBattlePlayerList tbody').append('<tr><td>Player</td><td>Rating</td></tr>');
		$.each(pParams, function (index, value) {
			$('#tblBattlePlayerList tbody').append('<tr><td>&nbsp;</td><td>&nbsp;</td></tr>');
			$('#tblBattlePlayerList tbody').append('<tr onclick=prepBattle({target:"'+value.Player+'"})><td>' + value.Player + '</td><td>' + value.Rating + '</td></tr>');
		});
	}
	
	$("#btnStartBattle").attr("disabled", true);
	$("#btnBattleList").unbind( "click" );
    $("#btnBattleList")
    	.click(function (event) {
        event.preventDefault();
		loadBattlePlayers();
	});	
}

function prepBattle(pParam) {
	if(gBattleUser.Moves == -999) {
		callServer("battleSetup", {target:pParam.target}, gUser.ID, loadBattleSetup);	
	} else { 
		if(gBattleUser.Moves > 0) {
	    	callServer("battleSetup", {target:pParam.target}, gUser.ID, loadBattleSetup); 
	    } else {
	    	myApp.alert("Sorry, out of battles, try back in 1 hour","Terror Cards");	
	    } 
    }   
}

function loadBattleSetup(pArray) {
	gBattleWinner = '';
	gBattleLoser = '';
	gArrResults = [];
	$("#btnStartBattle").unbind( "click" );
	$("#divBattleReward").css("display", "none");
	$("#battleRewardImg").attr("src", "");

  if(pArray.length > 0) {
  	myApp.closeModal('.battle-players-list');
      $.each(pArray, function (index, value) { 		       	       
	  	if(value.Player == gUser.ID) {
	  		$("#myBattleID").text(value.Player);
	  		$("#myAttackVal").text(value.AttackMax);
	  		$("#myDefenseVal").text(Math.floor(value.DefenseMax / 2));
	  		$("#myLifeVal").text(value.LifeMax);
	  		gBattleUser.ID = value.Player;
	  		gBattleUser.Attack = value.AttackMax;
	  		gBattleUser.Defense = Math.floor(value.DefenseMax / 2);
	  		gBattleUser.Life = value.LifeMax;	
	  	} else {
	  		$("#targetBattleID").text(value.Player);
	  		$("#targetAttackVal").text(value.AttackMax);
	  		$("#targetDefenseVal").text(Math.floor(value.DefenseMax / 2));
	  		$("#targetLifeVal").text(value.LifeMax);
	  		gBattleTarget.ID = value.Player;
	  		gBattleTarget.Attack = value.AttackMax;
	  		gBattleTarget.Defense = Math.floor(value.DefenseMax / 2);
	  		gBattleTarget.Life = value.LifeMax;	  			  			
	  	}
	  	
	  	$("#AttackImg").attr("src", value.AttackImg); 
	  	$("#DefenseImg").attr("src", value.DefenseImg);
	  	$("#LifeImg").attr("src", value.LifeImg);            
      });
      
      $("#btnStartBattle").attr("disabled", false);
      $("#btnBattleList").attr("disabled", false);
      $("#divBattleReward").css("display", "none");
      $("#divBattleResult").css("display", "none");
    
          $("#btnStartBattle")
            .click(function (event) {
                event.preventDefault();
				myApp.confirm('Are you sure?', 'Terror Cards', function () {
        			playOutBattle();
    			});
            });    
  }  
}

function playOutBattle() {
	$("#btnStartBattle").attr("disabled", true);
	$("#btnBattleList").attr("disabled", true);
	var rounds = 10;
	var i = 1;
	var winner = '';
	var loser = '';
	var whoseTurn = "you";
	while(i <= rounds) {
		//setTimeout(function(i,rounds) {
			if(i == 1) {
				//determine who goes first
				whoseTurn = firstAttackBattle();
			}		
			var result = playBattleRound({"turn":whoseTurn, "round":i});
			gArrResults.push(result);
			if(gBattleWinner !== "") {
				battleEndGame(gArrResults);
				break;
			}
			if(i == rounds) {
				battleEndGame(gArrResults);
				break;			
			}
			if(whoseTurn == "you") {
				whoseTurn = "target";
			} else {
				whoseTurn = "you";
			}
			i++;		
		//},2000);	
	}
}


function playBattleRound(pParam) {
	var attack = 0;
	var defense = 0;
	$("#divBattleResult").css("display", "block");
	if(pParam.turn == "you") {
		//your attack
		attack = Math.floor(Math.random() * gBattleUser.Attack) + 1;
		//target defense
		defense = Math.floor((Math.floor(Math.random() * gBattleTarget.Defense) + 1) / 2);	
		var difference = attack - defense;
		if(difference > 0) {
			gBattleTarget.Life = gBattleTarget.Life - difference;
			//$("#targetLifeVal").text(gBattleTarget.Life);	
		} else {
			difference = 0;	
		}
		if(gBattleTarget.Life <= 0) {
			//target no life left, you won
			gBattleWinner = gBattleUser.ID;
			gBattleLoser = gBattleTarget.ID;
		}
		//playBattleResults({round:pParam.round, player:gBattleTarget.ID, damage:difference, lifeLeft:gBattleTarget.Life});
		return {round:pParam.round, player:gBattleTarget.ID, damage:difference, lifeLeft:gBattleTarget.Life};	
	} else {
		//target attack
		attack = Math.floor(Math.random() * gBattleTarget.Attack) + 1;
		//you defense
		defense = Math.floor((Math.floor(Math.random() * gBattleUser.Defense) + 1) / 2);
		var difference = attack - defense;
		if(difference > 0) {
			gBattleUser.Life = gBattleUser.Life - difference;
			//$("#myLifeVal").text(gBattleUser.Life);	
		} else {
			difference = 0;
		}
		if(gBattleUser.Life <= 0) {
			//target no life left, you won
			gBattleWinner = gBattleTarget.ID;
			gBattleLoser = gBattleUser.ID;
		}
		//playBattleResults({round:pParam.round, player:gBattleUser.ID, damage:difference, lifeLeft:gBattleUser.Life});
		return {round:pParam.round, player:gBattleUser.ID, damage:difference, lifeLeft:gBattleUser.Life};		
	}
}

function firstAttackBattle() {
	var ran_num = Math.floor(Math.random() * 10) + 1;
	var oddEven = ran_num % 2;
	if(oddEven == 1) {
		return "you";		
	} else {
		return "target";
	}
}

function battleEndGame(pParam) {
	if(gBattleWinner == "") {
		if(gBattleUser.Life >= gBattleTarget.Life) {
			gBattleWinner = gBattleUser.ID;
			gBattleLoser = gBattleTarget.ID;
		} else {
			gBattleWinner = gBattleTarget.ID;
			gBattleLoser = gBattleUser.ID;
		}	
	}
			
	if(gBattleWinner !== "") {
		callServer("battleResult", {winner:gBattleWinner, loser:gBattleLoser, you:gBattleUser.ID, target:gBattleTarget.ID }, gUser.ID, playBattleResults);	
	} else {
		callServer("battleResult", {winner:'', loser:'', you:gBattleUser.ID, target:gBattleTarget.ID }, gUser.ID, playBattleResults);	
	}
			
}

function playBattleResults(pParam) {
	$.each(gArrResults, function (index, value) {
		var test = setTimeout(function() {
			if(value.player == gUser.ID) {
				if(value.lifeLeft <= 0) {
					$("#myLifeVal").text("0");	
				} else {
					$("#myLifeVal").text(value.lifeLeft);					
				}		
			} else {
				if(value.lifeLeft <= 0) {
					$("#targetLifeVal").text("0");	
				} else {
					$("#targetLifeVal").text(value.lifeLeft);	
				}	
			}
			$("#divBattleID").text(value.player);	
			$("#divBattleDamage").text("hurt " + value.damage);
			
			if((index+1) == gArrResults.length) {
				$("#divBattleID").text(gBattleWinner);
				$("#divBattleDamage").text("is the winner!");
				if(pParam[0].Reward !== "") {
					$("#divBattleReward").css("display", "block");
					$("#battleRewardImg").attr("src", pParam[0].Reward);	
				}
				$("#btnBattleList").attr("disabled", false);				
			}		
		},2000 * index);
	});
}


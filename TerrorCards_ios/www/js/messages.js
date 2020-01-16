function pullMessagesFull() { 
    callServer("messagesFull", {count:50, place:'board'}, gUser.ID, loadMessagesFull); 
}

function pullMessagesSmall() {
	callServer("messagesFull", {count:10, place:'home'}, gUser.ID, loadMessagesFull);	
}


function loadMessagesFull(pArray, pPlace) {
	if(pPlace == "board") {
		$("#messageContent").text('');		
	} else {
		$("#indexContent_news").text('');
	}

  if(pArray.length > 0) {
  	var header = '<table class="indexContent_news_sub">';
  	var msgObj = header;
      $.each(pArray, function (index, value) {
          var msgInfo = value;
          //var msgObj = "";
	       //msgObj = msgObj + '     <table  class="indexContent_news_sub">';
	       msgObj = msgObj + '     		<tr><td class="messageBoardName"><img src="'+msgInfo.Image+'" width="35" height="35"></td>';
	       msgObj = msgObj + '     		<td class="messageBoardName">'+msgInfo.ID+'<br><span style="font-size:10pt;">('+msgInfo.Rating+')</span></td></tr>';
	       msgObj = msgObj + '     		<tr><td colspan=2 class="messageBoardName"><br>'+msgInfo.Text+'<br></td></tr>';
           msgObj = msgObj + '     		<tr><td colspan=2><br><table width="100%"><tr>';
           if(msgInfo.ID !== gUser.ID){
           msgObj = msgObj + '     		<td><a href="trade.html" onclick="checkTradeWithSelf(&quot;'+msgInfo.ID+'&quot;,&quot;N&quot;);"><img src="images/tradearrow.png"></a><td>';          
           msgObj = msgObj + '     		<td><a onclick="insertFriend(&quot;'+msgInfo.ID+'&quot;);"><img src="images/addperson.png"></a><td>';
           msgObj = msgObj + '     		<td><a onclick="messageFlag(&quot;'+msgInfo.ID+'&quot;);"><img src="images/icons/white/flag.png" width="16"></a><td>';           
           msgObj = msgObj + '     		<td><a onclick="insertBlock(&quot;'+msgInfo.ID+'&quot;);"><img src="images/icons/white/remove.png" width="16"></a><td>'; 
           }
           msgObj = msgObj + '     		</tr></table></td></tr>'; 
           msgObj = msgObj + '     		<tr><td colspan=2><hr><br></td></tr>';     		       	       
	                 
          /*
	       msgObj = msgObj + '     <div class="indexContent_news_sub">';
	       msgObj = msgObj + '     		<div class="messageIcon"><img src="'+gUser.Image+'" width="35" height="35"></div>';
	       msgObj = msgObj + '     		<div class="messageBoardName whiteFont" style="font-weight:bold;">'+msgInfo.ID+'</div>';
	       msgObj = msgObj + '     		<div class="messageBoardText whiteFont">'+msgInfo.Text+'</div>';
           msgObj = msgObj + '     		<div class="messageActions"><table width="100%"><tr>';
           msgObj = msgObj + '     		<td><a href="trade.html" onclick=setTradePartner("'+msgInfo.ID+'");><img src="images/tradearrow.png"></a><td>';
           msgObj = msgObj + '     		<td><a onclick=insertFriend("'+msgInfo.ID+'");><img src="images/addperson.png"></a><td>';
           msgObj = msgObj + '     		</tr></table></div>';      		       	       
	       msgObj = msgObj + '     </div><br>'; 
	       */      
          /*
          if(pPlace == "board") {
          	$("#messageContent").append(msgObj);
          } else {
          	$("#indexContent_news").append(msgObj);	
          }
			*/
      });
      msgObj = msgObj + '     </table><br>';
          if(pPlace == "board") {
          	$("#messageContent").append(msgObj);
          } else {
          	$("#indexContent_news").append(msgObj);	
          }      
  }
  
}

function checkPostTimer() {
	var currTime = new Date();
    if(gBoardTimer !== null) {
      if((currTime - gBoardTimer) > 30000) {
          postToBoard();
      } else {
          myApp.alert("Please wait 30 seconds to post again.", 'Terror Cards');             
      }
    } else {    	
    	postToBoard();
    }	
}

function tryPostBoard() {
	if(gUser.Registered === "1") {
		/*
		myApp.popup('.popup-board');
		$("#txtMessageBoard").keyup(function(evt) {	
			messageCharCount();	
		});	
		*/
		//window.location.replace("postMessage.html");
		var newPost = $("#txtMessageInput").val();
		if(newPost == "") {
			myApp.alert("Please register before posting", 'Terror Cards');	
		} else {
			checkPostTimer();
		}	
	} else {
		myApp.alert("Please register before posting", 'Terror Cards');
	}	
}

function postToBoard() {
	var newPost = $("#txtMessageInput").val();
	var myStr = newPost.replace(/'/g, '');
	myStr = myStr.replace(/"/g, '');
	//var newMsg = $("#txtMessageBoard").attr('value');
	callServer('appendBoardMessages',{"message":myStr},gUser.ID,appendBoardComplete);
}

function appendBoardComplete(pData) {
	$("#txtMessageInput").val('');
	//myApp.closeModal('.popup-board');
	gBoardTimer = new Date();
	pullMessagesSmall();
	window.history.back();
	//pullMessagesFull();	
}

function messageCharCount() {
	var charCount = ($("#txtMessageInput").val()).length;
	var content = ($("#txtMessageInput").val()).substring(0, 254);
	if(charCount >= 255) {
		$("#txtMessageInput").val(content);		
	}
	$("#messageCharCount").text(charCount + " / 255");
}

function messageFlag(pId) {
		myApp.confirm('Flag comment for inappropriate content?', 'Terror Cards', function () {
	        callServer('flagMessage',{"area":"Message","id":pId},gUser.ID,flagCommentResponse);
	    });	
}

function flagCommentResponse() {
	myApp.alert("Thank you, flag sent to Administrator.", 'Terror Cards');	
}



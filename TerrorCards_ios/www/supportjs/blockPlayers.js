function pullBlockList(pParam) { 
    callServer("pullBlockList", {block:''}, gUser.ID, loadBlock); 
}

function insertBlock(pParam) { 
	if(gUser.Registered === "1") {	
		myApp.confirm('Block all messages from this player?', 'Terror Cards', function () {
	        callServer("insertBlock", {block:pParam}, gUser.ID, callbackInsertBlock);
	    }); 
	} else {
		myApp.alert("Please register before blocking players.", 'Terror Cards');	
	}    
}

function deleteBlock(pParam) {
	callServer("deleteBlock", {block:pParam}, gUser.ID, callbackDeleteBlock);	
}

function loadBlock(pArray) {
	$("#blockList").text('');

	if(pArray.length > 0) {
		var msgObj = "";
		msgObj = msgObj + '<table width="99%"><tr><td colspan=3></td></tr>';
    	$.each(pArray, function (index, value) {
        	var msgInfo = value;
		   	msgObj = msgObj + '<tr>';
		   	msgObj = msgObj + '	<td width="30%"><img src="'+msgInfo.Image+'" width="35"></td>';
		   	msgObj = msgObj + '	<td class="whiteFont BlockList" style="vertical-align:middle;" width="40%">'+msgInfo.Block+'</td>';
		   	msgObj = msgObj + '	<td width="15%" style="vertical-align:middle;"><a href="trade.html" onclick="setTradePartner(&quot;'+msgInfo.Block+'&quot;,&quot;N&quot;);"><img src="images/tradearrow.png"></a><td>';
		   	msgObj = msgObj + '	<td width="15%" style="vertical-align:middle;"><a onclick="deleteBlock(&quot;'+msgInfo.Block+'&quot;);"><img src="images/deleteperson.png"></a><td>';		   	
		   	msgObj = msgObj + '</tr>';      	
      	});
      	msgObj = msgObj + '</table>';
      	$("#blockList").append(msgObj);
  	}
  
}

function callbackInsertBlock(pParams) {
	if(pParams === "success") {
		pullMessagesFull();
		pullMessagesSmall();		
		myApp.alert("Messages from the player is now blocked", 'Terror Cards');
	} else if (pParams === "failed") {
		myApp.alert("Person is already blocked", 'Terror Cards');
	} else {
		myApp.alert("Sorry, not able to block player", 'Terror Cards');
	}
}

function callbackDeleteBlock(pParams) {
	if(pParams === "success") {
		pullBlockList(gUser.ID);		
		myApp.alert("Player is no longer blocked", 'Terror Cards');
	} else if (pParams === "failed") {
		myApp.alert("Sorry, could not remove", 'Terror Cards');
	} else {
		myApp.alert("Sorry, error occurred", 'Terror Cards');
	}
}


function pullFriendsList(pParam) { 
	setTimeout(function() {
    	callServer("pullFriendsList", {friend:''}, gUser.ID, loadFriends); 
    	pullBlockList(pParam); 		
	},2000);   
}

function insertFriend(pParam) { 
	if(gUser.Registered === "1") {	
    	callServer("insertFriend", {friend:pParam}, gUser.ID, callbackInsertFriend); 
	} else {
		myApp.alert("Please register before adding friends.", 'Terror Cards');	
	}    
}

function deleteFriend(pParam) {
	callServer("deleteFriend", {friend:pParam}, gUser.ID, callbackDeleteFriend);	
}

function loadFriends(pArray) {
	$("#friendList").text('');

	if(pArray.length > 0) {
		var msgObj = "";
		msgObj = msgObj + '<table width="99%"><tr><td colspan=3></td></tr>';
    	$.each(pArray, function (index, value) {
        	var msgInfo = value;
		   	msgObj = msgObj + '<tr>';
		   	msgObj = msgObj + '	<td width="30%"><img src="'+msgInfo.Image+'" width="35"></td>';
		   	msgObj = msgObj + '	<td class="whiteFont friendList" style="vertical-align:middle;" width="40%">'+msgInfo.Friend+'</td>';
		   	msgObj = msgObj + '	<td width="15%" style="vertical-align:middle;"><a href="trade.html" onclick="checkTradeWithSelf(&quot;'+msgInfo.Friend+'&quot;,&quot;N&quot;);"><img src="images/tradearrow.png"></a><td>';
		   	msgObj = msgObj + '	<td width="15%" style="vertical-align:middle;"><a onclick="deleteFriend(&quot;'+msgInfo.Friend+'&quot;);"><img src="images/deleteperson.png"></a><td>';		   	
		   	msgObj = msgObj + '</tr>';      	
      	});
      	msgObj = msgObj + '</table>';
      	$("#friendList").append(msgObj);
  	}
  
}

function callbackInsertFriend(pParams) {
	if(pParams === "success") {
		myApp.alert("Added to your friends", 'Terror Cards');
	} else if (pParams === "failed") {
		myApp.alert("Friend already exist", 'Terror Cards');
	} else {
		myApp.alert("Sorry, not able to add friend", 'Terror Cards');
	}
}

function callbackDeleteFriend(pParams) {
	if(pParams === "success") {
		myApp.alert("Friend removed", 'Terror Cards');
		pullFriendsList(gUser.ID);
	} else if (pParams === "failed") {
		myApp.alert("Sorry, could not remove", 'Terror Cards');
	} else {
		myApp.alert("Sorry, error occurred", 'Terror Cards');
	}
}

function searchFriend() {
	var txt = $("#txtUserSearch").val();
	if(txt !== "") {
		$("#searchUserNode").show();
		callServer("searchFriend", {friend:txt}, gUser.ID, searchListUser);	
	} else {
		$("#searchUserList").text('');
		$("#searchUserNode").hide();
	}
}

function searchListUser(pArray) {
	$("#searchUserList").text('');

	if(pArray.length > 0) {
		var msgObj = "";
		msgObj = msgObj + '<table width="99%"><tr><td colspan=3></td></tr>';
    	$.each(pArray, function (index, value) {
        	var msgInfo = value;
		   	msgObj = msgObj + '<tr>';
		   	msgObj = msgObj + '	<td width="30%"><img src="'+msgInfo.Image+'" width="35"></td>';
		   	msgObj = msgObj + '	<td class="whiteFont friendList" style="vertical-align:middle;" width="40%">'+msgInfo.Friend+'</td>';
		   	msgObj = msgObj + '	<td width="15%" style="vertical-align:middle;"><a href="trade.html" onclick="checkTradeWithSelf(&quot;'+msgInfo.Friend+'&quot;,&quot;N&quot;);"><img src="images/tradearrow.png"></a><td>';
		   	msgObj = msgObj + '	<td width="15%" style="vertical-align:middle;"><a onclick="insertFriend(&quot;'+msgInfo.Friend+'&quot;);"><img src="images/addperson.png"></a><td>';		   	
		   	msgObj = msgObj + '</tr>';      	
      	});
      	msgObj = msgObj + '</table>';
      	$("#searchUserList").append(msgObj);
  	}	
}


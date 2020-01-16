gTradeList = [];
gTradeListYou = [];
gTradeListOther = [];
gTradeMessages = [];

function checkTradeWithSelf(pUser) {
	if(pUser !== gUser.ID) {
		setTradePartner(pUser,'N');	
	}
}

function setTradePartner(pUser, pNeeds) {
	if(gUser.Registered === "1") {
		gTradeList = [];
		gTradeListYou = [];
		gTradeListOther = [];	
		gUser2.ID = pUser;
		gUser2.Name = pUser;
		pullTradeCards(gUser.ID,gUser2.ID,pNeeds);
		if(pNeeds == 'Y') {
			$("#btnTradeNeeds").text("Show All");
			$("#btnTradeNeeds").attr("onclick","setTradePartner('"+gUser2.ID+"', 'N')");
		} else {
			$("#btnTradeNeeds").text("Show Needs");
			$("#btnTradeNeeds").attr("onclick","setTradePartner('"+gUser2.ID+"', 'Y')");			
		}
	} else {
		myApp.alert("Please register before trading", 'Terror Cards');	
	}	
}

function pullTradeCards(pUserId,pOther,pNeeds) {
	gTradeList = [];
	gTradeListYou = [];
	gTradeListOther = [];	
	$("#trade_tradelist_1_insert").empty();
	$("#trade_tradelist_1_base").empty();
	$("#trade_tradelist_2_insert").empty();
	$("#trade_tradelist_2_base").empty();
	$("#previewTradeYou").empty();
	$("#previewTradeOther").empty();
	//callServer('tradeSetup',null,pUserId,loadUserTradeCards);
	//callServer('tradeSetup',null,pOther,loadUserTradeCards);
	callServer('tradeSetup',{receiver:pOther, needs:pNeeds},pUserId,loadUserTradeCards);
	callServer('tradeSetup',{receiver:pUserId, needs:pNeeds},pOther,loadUserTradeCards);		
}

function loadUserTradeCards(pArray) {
	setCardTradeInfo(pArray,gUser.ID);
	setCardTradeInfo(pArray,gUser2.ID);	
}


function setCardTradeInfo(pArray,pUser) {
  if(pArray.length > 0) {
  	var cardInfo;
  	var statHolder;
  	var currCard = "";
  	var currSet = "";
  	var currCount = 1;
    $.each(pArray, function( index, value ) {
      cardInfo = value;
      cardInfo.index = index;
	      statHolder = '<div class="card_header">';
	      if(cardInfo.Count == "1") {
	      	statHolder = statHolder + '<div class="card_header_count" id="'+cardInfo.Name+cardInfo.SetName+cardInfo.UserID+'_count"></div>';
	      } else {
	      	statHolder = statHolder + '<div class="card_header_count" id="'+cardInfo.Name+cardInfo.SetName+cardInfo.UserID+'_count">'+cardInfo.Count+'</div>';
	      }
	      //statHolder = statHolder + '<div class="card_header_message">Sold Out</div>';	      
	      statHolder = statHolder + '<div>';
	      	var item = '<li>'+statHolder;
	      	item = item + '<img src="' + cardInfo.Image + '" id="'+cardInfo.Name+cardInfo.SetName+cardInfo.UserID+'_image" alt="'+cardInfo.ID+'" class="tradeItemButton" />';
	      	item = item + '</li>';
	      	//item = item + '<div id="'+ index +'_'+cardInfo.ID+'" class="tradeItemButton">Trade</div></li>';
	      
	      if(cardInfo.UserID == pUser) {
	      	if(pUser == gUser.ID) {
	      		if(cardInfo.Type == "Insert" || cardInfo.Type == "Award") {
	      			$("#trade_tradelist_1_insert").append(item);	
	      		} else {
	      			$("#trade_tradelist_1_base").append(item);
	      		}
	      		//$("#trade_tradelist_1").append(item);
				$("#"+cardInfo.Name+cardInfo.SetName+cardInfo.UserID+"_image").on( "doubletap", (function(cardInfo) {
					return function() {			  		
						var currClass = $(this).attr("class");			  		
					   	if(currClass === "tradeItemButton") {
					   		if(gTradeListYou.length >= 9) {
					   			//show alert	
					   		} else {
					   			if(checkCardCountTrade(cardInfo, "you", this)) {
					   				AddTradeList(cardInfo, "you", index +'_'+cardInfo.ID, pArray, this);	
					   			}
					   		}		
					   	} else {
					   		if(gTradeListYou.length <= 0) {
					   			//show alert	
					   		} else {
					   			if(checkCardCountTrade(cardInfo, "you", this)) {
					   				AddTradeList(cardInfo, "you", index +'_'+cardInfo.ID, pArray, this);					   		
					   			}	
					   		}
					   	}			  							
					};
				})(cardInfo)
				);	      			
	      	} else {
	      		if(cardInfo.Type == "Insert" || cardInfo.Type == "Award") {
	      			$("#trade_tradelist_2_insert").append(item);	
	      		} else {
	      			$("#trade_tradelist_2_base").append(item);
	      		}	      		
	      		//$("#trade_tradelist_2").append(item);
				$("#"+cardInfo.Name+cardInfo.SetName+cardInfo.UserID+"_image").on( "doubletap", (function(cardInfo) {
					return function() {			  		
						var currClass = $(this).attr("class");			  		
					   	if(currClass === "tradeItemButton") {
					   		if(gTradeListOther.length >= 9) {
					   			//show alert	
					   		} else {
					   			if(checkCardCountTrade(cardInfo, "other", this)) {
					   				AddTradeList(cardInfo, "other", index +'_'+cardInfo.ID, pArray, this);	
								}
							}		
					   	} else {
					   		if(gTradeListOther.length <= 0) {
					   			//show alert	
					   		} else {	
					   			if(checkCardCountTrade(cardInfo, "other", this)) {				   		
					   				AddTradeList(cardInfo, "other", index +'_'+cardInfo.ID, pArray, this);
					   			}
					   		}	
					   	}			  							
					};
				})(cardInfo)
				);	      			
	      	}
      	  } 
    });
  }
}

function flipCardBack(pImage,pCard) {
	$(pImage).attr("src", "http://gisgames.com/terrorcards/cards/2015/base/back/back_01.jpg");	
}

function AddTradeList(pItem, pOwner, pID, pArray, pImage) {
	if(pOwner === "you") {
		gTradeListYou.push(pItem);
		var result = $.grep(gTradeListYou, function(e){ return e.ID == pItem.ID; });
		if (result.length >= pItem.Count) {
			$("#"+pImage.id).removeClass( "tradeItemButton" ).addClass( "tradeItemRemove" );
		}			
	} else {
		gTradeListOther.push(pItem);
		var result = $.grep(gTradeListOther, function(e){ return e.ID == pItem.ID; });
		if (result.length >= pItem.Count) {
			$("#"+pImage.id).removeClass( "tradeItemButton" ).addClass( "tradeItemRemove" );
		}				
	}			
	previewContainer(pItem, pOwner, pImage);		
}

function RemoveFromTradeList(pItem, pOwner, pIndex, pID, pImage) {
	if(pOwner === "you") {
		var currRecord = gTradeListYou[pIndex];
	    gTradeListYou.splice(pIndex, 1);			    
	} else {
		var currRecord = gTradeListOther[pIndex];
	    gTradeListOther.splice(pIndex, 1);	
	}
	$("#"+pID).removeClass( "tradeItemRemove" ).addClass( "tradeItemButton" );
	previewContainer(pItem, pOwner, pImage);	
}

function checkCardCountTrade(pItem, pOwner, pImage) {
	var status = true;
	if(pItem.Count > 1) {
		if(pOwner === "you"){
			var result = $.grep(gTradeListYou, function(e){ return e.ID == pItem.ID; });
			if (result.length < pItem.Count) {
			  status = true;
			} else {
			  status = false;
			}

		} else {
			var result = $.grep(gTradeListOther, function(e){ return e.ID == pItem.ID; });
			if (result.length < pItem.Count) {
			  status = true;
			} else {
			  status = false;
			}						
		}
	} else {
		//check single card if click already, don't allow click again'
		if($("#"+pImage.id).hasClass( "tradeItemRemove" )) {
			status = false;
		} else {
			status = true;
		}
	}
	return status;
}


function previewContainer(pItem, pOwner, pImage) {
	if(pOwner === "you") {
		$("#previewTradeYou").empty();
		var prevTable = $("#previewTradeYou")[0];
		var row = prevTable.insertRow(0);			
		$.each(gTradeListYou, function( index, result ) {
			var cell = row.insertCell(index);
			var img = document.createElement("img");
			img.src = result.Image;
			img.height = "75";
						
			$(img).on( "doubletap", (function(evt) {
				var imgID = result.Name+result.SetName+result.UserID+"_image";
				var imageObj = $("#"+imgID);
				RemoveFromTradeList(result, "you", index, imgID, imageObj);	
			}));				
			$(cell).append(img);		
		});			
	} else {
		$("#previewTradeOther").empty();
		var prevTable = $("#previewTradeOther")[0];
		var row = prevTable.insertRow(0);			
		$.each(gTradeListOther, function( index, result ) {
			var cell = row.insertCell(index);				
			var img = document.createElement("img");
			img.src = result.Image;
			img.height = "75";			

			$(img).on( "doubletap", (function(evt) {
				var imgID = result.Name+result.SetName+result.UserID+"_image";
				var imageObj = $("#"+imgID);			
				RemoveFromTradeList(result, "other", index, imgID, imageObj);	
			}));
			
			$(cell).append(img);		
		});			
	}
}


function ConfirmTradeList() {
	$("#trade_tradelist_you").empty();
	$("#trade_tradelist_other").empty();	
	$.each(gTradeListYou, function( index, result ) {
		      	var item = '<li>';
		      	item = item + '<img src="' + result.Image + '" alt="image" onclick="gallery_showCardDetail(this)" />';
		      	item = item + '</li>';				
				$("#trade_tradelist_you").append(item);	

	});
	$.each(gTradeListOther, function( index, result ) {
		      	var item = '<li>';
		      	item = item + '<img src="' + result.Image + '" alt="image" onclick="gallery_showCardDetail(this)" />';
		      	item = item + '</li>';				
				$("#trade_tradelist_other").append(item);
				
	});	
}

function SaveTrade() {
	gTradeList = [];
	$.each(gTradeListYou, function( index, result ) {
		gTradeList.push(result);
	});
	$.each(gTradeListOther, function( index, result ) {
		gTradeList.push(result);
	});	
	var dataTransfer = {};
	dataTransfer.trade = gTradeList;
	dataTransfer.msg = "";
	var msg = $("#tradeMessageInput").val();
	if(msg !== "") {
		dataTransfer.msg = msg;		
	}
	callServer("saveTrade",dataTransfer,gUser.ID,TradeConfirmResponse);		
}

function promptTrade(pTradeID) {
	callServer("executeTrade",pTradeID,gUser.ID,ExecuteConfirmResponse);		
}

function cancelTrade(pTradeID) {
	callServer("cancelTrade",pTradeID,gUser.ID,ExecuteConfirmResponse);		
}

function ExecuteConfirmResponse(pMessage) {
	myApp.alert(pMessage, 'Terror Cards');	
	ShowTrades(gUser.ID);		
}

function TradeConfirmResponse(pMessage) {
	gTradeList = [];
	gTradeYou = [];
	gTradeOther = [];		
	$("#trade_tradelist_1_insert").empty();
	$("#trade_tradelist_1_base").empty();
	$("#trade_tradelist_2_insert").empty();
	$("#trade_tradelist_2_base").empty();
	$("#trade_tradelist_you").empty();
	$("#trade_tradelist_other").empty();
	$("#previewTradeYou").empty();
	$("#previewTradeOther").empty();
	$("#tradeMessageInput").text('');
	location.href="index.html";			
}

function CheckActiveTades() {
	callServer("CheckActiveTades","PENDING",gUser.ID,ShowActiveTradeIdicator);
}

function ShowActiveTradeIdicator(pArray) {
	if(pArray.length > 0) {
		if(pArray[0].count >= 1) {
			$("#tradeMenuIcon").attr('src', '../www/images/icons/white/retweet_active.png');
		} else {
			$("#tradeMenuIcon").attr('src', '../www/images/icons/white/retweet.png');	
		}
	} else {
		$("#tradeMenuIcon").attr('src', '../www/images/icons/white/retweet.png');	
	}	
}

function ShowTrades(pUserId) {
	$("#trade_pending1").empty();
	$("#trade_pending2").empty();
	$("#trade_pending3").empty();
	callServer("showTrades","PENDING",pUserId,ShowPendingTrades);
	callServer("showTrades","ACCEPTED",pUserId,ShowAcceptedTrades);	
	callServer("showTrades","CANCELLED",pUserId,ShowCancelledTrades);		
}

function ShowPendingTrades(pArray) {
  if(pArray.length > 0) {
  	var cardInfo;
  	var statHolder;
  	var yourList = "";
  	var othersList = "";
  	var btnCancel = "";
  	var btnAgree = "";
  	var tradePartner = "";
  	
	var uniqueTradeArray = [];
	$.each(pArray, function(i, item){
	  if ($.inArray(item.TradeID,uniqueTradeArray) === -1){
	    uniqueTradeArray.push(item.TradeID);
	  }
	});
  	
    $.each(uniqueTradeArray, function( index, TradeVal ) {
    	yourList ="";
    	othersList = "";
    	btnAgree = "";
    	btnCancel = "";
    	tradePartner = "";
    	var tradeDate = new Date();
    	var tradeIDTime;
    	
    	requestTradeMessages({tradeID:TradeVal, cell:"msg"+index});
    	
    	$.each(pArray, function( idx, cardVal ) {	
	      cardInfo = cardVal;
	      if(cardInfo.TradeID === TradeVal) {
	      		tradeDate = cardInfo.TradeDate;
	      		tradeIDTime = cardInfo.TradeID;
		      if(cardInfo.Name) {
		      	if(cardInfo.UserID === gUser.ID) {
		      		yourList = yourList + '<img src="'+ cardInfo.Image + '" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
		      	} else {
		      		tradePartner = cardInfo.UserID;
		      		othersList = othersList + '<img src="'+ cardInfo.Image +'" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';	
		      	}      	  
		      }
		      if(cardInfo.TradeOwner !== gUser.ID) {
		      	btnAgree = '<input type=button value="Agree" class="ui-corner-all ui-btn ui-btn-b" onclick=promptTrade("'+ cardInfo.TradeID +'");>';
		      }
		      btnCancel = '<input type=button value="Cancel" class="ui-corner-all ui-btn ui-btn-b" onclick=cancelTrade("'+ cardInfo.TradeID +'");>';      
      	  }  
    	});
    	
    		var tradeBlock = '<br><table border=1 class="tradeTable">';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="50%" class="leftPad">'+tradePartner+' <a href="trade.html" onclick="setTradePartner(&quot;'+tradePartner+'&quot;);"><img src="images/tradearrow.png"></a>&nbsp;&nbsp;&nbsp;&nbsp;';
            tradeBlock = tradeBlock + '<a style="padding-left:10px;" onclick="insertFriend(&quot;'+tradePartner+'&quot;);"><img src="images/addperson.png"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="images/icons/white/flag.png" onclick="messageFlag(&quot;'+TradeVal+'&quot;);" width="16"></td>';
            tradeBlock = tradeBlock + '<td width="50%" class="rightPad" id="td'+ TradeVal +'"></td>';
            tradeBlock = tradeBlock + '</tr>';    		
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="50%" class="leftPad">GET</td>';
            tradeBlock = tradeBlock + '<td width="50%" class="leftPad">GIVE</td>';
            tradeBlock = tradeBlock + '</tr>';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td class="left5Pad">'+ othersList +'</td>';
            tradeBlock = tradeBlock + '<td class="left5Pad">'+ yourList +'</td>';
            tradeBlock = tradeBlock + '</tr>'; 
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td colspan=2 class="leftPad">';
            tradeBlock = tradeBlock + '<table width="100%"><tr>';
            tradeBlock = tradeBlock + '<td>'+ btnCancel +'</td>';
            tradeBlock = tradeBlock + '<td>'+ btnAgree +'</td>';
            tradeBlock = tradeBlock + '<td id="msg'+index+'" class="msg-style"><img src="images/message.png" onclick="popUpMessages({tradeID:&quot;'+TradeVal+'&quot;});"> </td>';
            tradeBlock = tradeBlock + '</tr></table>';
            tradeBlock = tradeBlock + '</td>'; 
            tradeBlock = tradeBlock + '</tr>';                                     		
            tradeBlock = tradeBlock + '</table>';     
    		$("#trade_pending1").append(tradeBlock);    	
			
			var expDate = new Date(tradeDate);
			expDate = expDate.setDate(new Date(tradeDate).getDate() + 1);
			var expSec = (new Date(expDate)).getTime() / 1000;
			var tradeDateSec = new Date().getTime() / 1000;
			var remainderTime = expSec - tradeDateSec;
			
			tradeTimer(remainderTime,tradeIDTime);						
    	
	});
  }	
}

function ShowAcceptedTrades(pArray) {
	console.log(pArray);
  if(pArray.length > 0) {
  	var cardInfo;
  	var statHolder;
  	var yourList = "";
  	var othersList = "";
  	var btnCancel = "";
  	var btnAgree = "";
    var tradePartner = "";
  	
	var uniqueTradeArray = [];
	$.each(pArray, function(i, item){
	  if ($.inArray(item.TradeID,uniqueTradeArray) === -1){
	    uniqueTradeArray.push(item.TradeID);
	  }
	});
  	
    $.each(uniqueTradeArray, function( index, TradeVal ) {
    	yourList ="";
    	othersList = "";
    	tradePartner = "";
    	$.each(pArray, function( idx, cardVal ) {	
	      cardInfo = cardVal;
	      if(cardInfo.TradeID === TradeVal) {
		      if(cardInfo.Name) {
		      	if(cardInfo.UserID === gUser.ID) {
		      		yourList = yourList + '<img src="'+ cardInfo.Image +'" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
		      	} else {
		      		tradePartner = cardInfo.UserID;
		      		othersList = othersList + '<img src="'+ cardInfo.Image +'" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';	
		      	}      	  
		      }     
      	  }  
    	});
    	
    		var tradeBlock = '<br><table border=1 class="tradeTable">';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="50%">'+tradePartner+' <a href="trade.html" onclick="setTradePartner(&quot;'+tradePartner+'&quot;);"><img src="images/tradearrow.png"></a></td>';
            tradeBlock = tradeBlock + '<td width="50%"><a onclick="insertFriend(&quot;'+tradePartner+'&quot;);"><img src="images/addperson.png"></a></td>';
            tradeBlock = tradeBlock + '</tr>';     		
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="50%">GET</td>';
            tradeBlock = tradeBlock + '<td width="50%">GIVE</td>';
            tradeBlock = tradeBlock + '</tr>';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td>'+ othersList +'</td>';
            tradeBlock = tradeBlock + '<td>'+ yourList +'</td>';
            tradeBlock = tradeBlock + '</tr>';                                     		
            tradeBlock = tradeBlock + '</table>';     
    		$("#trade_pending2").append(tradeBlock);    	
    	
	});
  }
}

function ShowCancelledTrades(pArray) {
	console.log(pArray);
  if(pArray.length > 0) {
  	var cardInfo;
  	var statHolder;
  	var yourList = "";
  	var othersList = "";
  	var btnCancel = "";
  	var btnAgree = "";
    var tradePartner = "";
  	
	var uniqueTradeArray = [];
	$.each(pArray, function(i, item){
	  if ($.inArray(item.TradeID,uniqueTradeArray) === -1){
	    uniqueTradeArray.push(item.TradeID);
	  }
	});
  	
    $.each(uniqueTradeArray, function( index, TradeVal ) {
    	yourList ="";
    	othersList = "";
    	tradePartner = "";
    	$.each(pArray, function( idx, cardVal ) {	
	      cardInfo = cardVal;
	      if(cardInfo.TradeID === TradeVal) {
		      if(cardInfo.Name) {
		      	if(cardInfo.UserID === gUser.ID) {
		      		yourList = yourList + '<img src="'+ cardInfo.Image +'" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
		      	} else {
		      		tradePartner = cardInfo.UserID;
		      		othersList = othersList + '<img src="'+ cardInfo.Image +'" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';	
		      	}      	  
		      }     
      	  }  
    	});
    	
    		var tradeBlock = '<br><table border=1 class="tradeTable">';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="50%">'+tradePartner+' <a href="trade.html" onclick="setTradePartner(&quot;'+tradePartner+'&quot;);"><img src="images/tradearrow.png"></a></td>';
            tradeBlock = tradeBlock + '<td width="50%"><a onclick="insertFriend(&quot;'+tradePartner+'&quot;);"><img src="images/addperson.png"></a></td>';
            tradeBlock = tradeBlock + '</tr>';     		
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="50%">GET</td>';
            tradeBlock = tradeBlock + '<td width="50%">GIVE</td>';
            tradeBlock = tradeBlock + '</tr>';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td>'+ othersList +'</td>';
            tradeBlock = tradeBlock + '<td>'+ yourList +'</td>';
            tradeBlock = tradeBlock + '</tr>';                                     		
            tradeBlock = tradeBlock + '</table>';     
    		$("#trade_pending3").append(tradeBlock);    	
    	
	});
  }	
}

function requestTradeMessages(param) {
	callServer('requestTradeMessages',param,gUser.ID,showTradeMessages);		
}

function showTradeMessages(pData) {
	$("#"+pData.cell).append(pData.results.length);	
	gTradeMessages = gTradeMessages.concat(pData.results);	
}

function popUpMessages(pData) {
	var filteredList = [];
	$("#messageTradeID").text('');
	$("#messageThread").text('');
	$("#txtMessageTrade").val('');	
	gTradeMessages.forEach(function(item, index) {
		if(item.ID == (pData.tradeID).toString()) {
			filteredList.push(item);	
		}
	});
	$("#messageTradeID").text(pData.tradeID);
	var deviceHeight = $(window).height();
	var deviceWidth = $(window).width();
	$("#messageThread").css({'height': (deviceHeight - 230) + 'px'});
	$("#txtMessageTrade").css({'width': '98%'});
	if (filteredList.length > 0) {
		filteredList.forEach(function(item, index) {
			$("#messageThread").append(item.Member + "<br>" + item.Message + "<br><br>");
		});
	}
	myApp.popup('.popup-messages');	
}

function appendTradeMessage() {
	var tradeID = $("#messageTradeID").text();
	var newMsg = $("#txtMessageTrade").val();
	callServer('appendTradeMessages',{"tradeID":tradeID, "message":newMsg},gUser.ID,appendMessageComplete);
}

function appendMessageComplete(pData) {
	$("#messageTradeID").text('');
	$("#txtMessageTrade").val('');
	myApp.closeModal('.popup-messages');
	ShowTrades(gUser.ID);	
}

//var count=30;

//var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
function tradeTimer(pTime,pTradeVal)
{
	pTime=pTime-1;
	if (pTime <= 0)
	{
		$("#td"+pTradeVal).text("Trade Expired");
		callServer('tradeReset',{"tradeID":pTradeVal},gUser.ID,ShowTrades);
		//return;
	} else {
		var hours = Math.floor(( pTime / 3600 ) % 24);
		var minutes = Math.floor(( pTime / 60 ) % 60);
		var seconds = Math.floor(pTime % 60);		
		$("#td"+pTradeVal).text(hours+":"+minutes+":"+seconds);		
		setTimeout(function() {tradeTimer(pTime,pTradeVal);}, 1000);	
	}
	
}

gTradeList = [];
gTradeListYou = [];
gTradeListOther = [];
gTradeMessages = [];

function checkTradeWithSelf(pUser) {
	console.log(gUser.ID);
	if(pUser !== gUser.ID) {
		setTradePartner(pUser);	
	}
}

function setTradePartner(pUser) {
	if(gUser.Registered === "1") {
		gTradeList = [];
		gTradeListYou = [];
		gTradeListOther = [];	
		gUser2.ID = pUser;
		gUser2.Name = pUser;
		pullTradeCards(gUser.ID,gUser2.ID);
	} else {
		alert("Please register before trading");	
	}	
}

function pullTradeCards(pUserId,pOther) {
	gTradeList = [];
	gTradeListYou = [];
	gTradeListOther = [];	
	$("#trade_tradelist_1").empty();
	$("#trade_tradelist_2").empty();
	callServer('tradeSetup',null,pUserId,loadUserTradeCards);
	callServer('tradeSetup',null,pOther,loadUserTradeCards);	
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
      cardInfo.count = currCount;
      if(cardInfo.Name !== currCard || cardInfo.SetName !== currSet) {
      	  currCount = 1;
	      statHolder = '<div class="card_header">';
	      statHolder = statHolder + '<div class="card_header_count" id="'+cardInfo.Name+cardInfo.SetName+cardInfo.UserID+'_count"></div>';
	      //statHolder = statHolder + '<div class="card_header_message">Sold Out</div>';	      
	      statHolder = statHolder + '<div>';
	      	var item = '<li>'+statHolder;
	      	item = item + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + cardInfo.Name + '.jpg" id="'+ index +'_'+cardInfo.ID+'" alt="'+cardInfo.ID+'" class="tradeItemButton" />';
	      	item = item + '</li>';
	      	//item = item + '<div id="'+ index +'_'+cardInfo.ID+'" class="tradeItemButton">Trade</div></li>';
	      
	      if(cardInfo.UserID == pUser) {
	      	if(pUser == gUser.ID) {
	      		$("#trade_tradelist_1").append(item);
				$('#'+ index +'_'+cardInfo.ID).on( "doubletap", (function(cardInfo) {
					return function() {			  		
						var currClass = $(this).attr("class");			  		
					   	if(currClass === "tradeItemButton") {
					   		if(gTradeListYou.length >= 9) {
					   			//show alert	
					   		} else {
					   			if(checkCardCountTrade(cardInfo, "you")) {
					   				AddTradeList(cardInfo, "you", index +'_'+cardInfo.ID, pArray);	
					   				$(this).removeClass( "tradeItemButton" ).addClass( "tradeItemRemove" );
					   			}
					   		}		
					   	} else {
					   		if(gTradeListYou.length <= 0) {
					   			//show alert	
					   		} else {
					   			if(checkCardCountTrade(cardInfo, "you")) {					   		
					   				RemoveFromTradeList(cardInfo, "you", index, index +'_'+cardInfo.ID, pArray);
					   				$(this).removeClass( "tradeItemRemove" ).addClass( "tradeItemButton" );
					   			}	
					   		}
					   	}			  							
					};
				})(cardInfo)
				);	      			
	      	} else {
	      		$("#trade_tradelist_2").append(item);
				var clickMe = $('#'+ index +'_'+cardInfo.ID).on( "doubletap", (function(cardInfo) {
					return function() {			  		
						var currClass = $(this).attr("class");			  		
					   	if(currClass === "tradeItemButton") {
					   		if(gTradeListOther.length >= 9) {
					   			//show alert	
					   		} else {
					   			if(checkCardCountTrade(cardInfo, "other")) {
					   				AddTradeList(cardInfo, "other", index +'_'+cardInfo.ID, pArray);	
									$(this).removeClass( "tradeItemButton" ).addClass( "tradeItemRemove" );
								}
							}		
					   	} else {
					   		if(gTradeListOther.length <= 0) {
					   			//show alert	
					   		} else {	
					   			if(checkCardCountTrade(cardInfo, "other")) {				   		
					   				RemoveFromTradeList(cardInfo, "other", index, index +'_'+cardInfo.ID, pArray);
					   				$(this).removeClass( "tradeItemRemove" ).addClass( "tradeItemButton" );
					   			}
					   		}	
					   	}			  							
					};
				})(cardInfo)
				);	      			
	      	}
      	  } 
			
			//document.getElementById(index +'_'+cardInfo.ID).addEventListener("click", function() {
			//	AddTradeList(cardInfo);	
			//})();     	  
      	  
      } else {
      	currCount ++;
      	$("#"+cardInfo.Name+cardInfo.SetName+cardInfo.UserID+"_count").text(currCount);
      	var alt = $('#'+ index +'_'+cardInfo.ID).attr("alt");
      	var IDArr = alt.split(",");
      	cardInfo.count = currCount;
      }
      currCard = cardInfo.Name;
      currSet =  cardInfo.SetName;
    });
  }
}

function flipCardBack(pImage,pCard) {
	$(pImage).attr("src", "http://gisgames.com/terrorcards/cards/2015/base/back/back_01.jpg");	
}

function AddTradeList(pItem, pOwner, pID, pArray) {
	//gTradeList.push({card:pItem, userId:pUserId});
	//console.log(pItem);
	var clone = pArray.slice(0);
	
	if(pOwner === "you") {
		var remainderArr = filterTradeArray(gTradeListYou, clone);
		pItem = TradeCheckArrayVal(remainderArr, pItem);
		gTradeListYou.push(pItem);
		console.log("*************");
		console.log(gTradeListYou);
		//console.log(remainderArr);
		//console.log("--------------")		
		//console.log(gTradeListYou);	
	} else {
		var remainderArr = filterTradeArray(gTradeListOther,clone);
		gTradeListOther.push(pItem);
		$.each(gTradeListOther, function( index, result ) {
			$.each(pArray, function( idx, item ) {
				if(result.Name === item.Name && result.SetName === item.SetName) {
					if(result.ID !== item.ID) {
						result.ID = item.ID;
					}	
				}	
			});		
		});			
	}
	previewContainer(pItem, pOwner);
}

function filterTradeArray(pTradeList,pClone,pUser) {
	/*
	var removeArr = [];
	$.each(pTradeList, function( index, result ) {
		$.each(pClone, function( idx, item ) {
			if(result.ID === item.ID) {	
				removeArr.push(idx);
			}	
		});
	});	
	$.each(removeArr, function(index, item ) {
		pClone.splice(item, 1);			
	});	
	return pClone;
	*/
	var flag = false;
	for( var i=pClone.length - 1; i>=0; i--){
		//console.log("clone:"+pClone[i].ID);
	 	for( var j=0; j<pTradeList.length; j++){
	 			 	    	//console.log("trade:"+pTradeList[j].ID);
	 	    if(pClone[i] && (pClone[i].ID === pTradeList[j].ID)){
	    		pClone.splice(i, 1);
	    		//console.log("match:"+pTradeList[j].ID);
	    		flag = true;
	    		break;
	    	}
	    	if (flag) {
	    		break;
	    	}
	    }
	}
	//console.log(pClone);
	return pClone;	
}

function TradeCheckArrayVal(pClone, pResult) {
	console.log(pClone);
	console.log(pResult.ID);
	for( var i=pClone.length - 1; i>=0; i--){
		if(pResult.Name === pClone[i].Name && pResult.SetName === pClone[i].SetName) {
					console.log("item: " + pClone[i].ID);
			if(pResult.ID !== pClone[i].ID) {
				pResult.ID = pClone[i].ID;
				break;	
			}
		}	
	};	
	return pResult;
}

function RemoveFromTradeList(pItem, pOwner, pIndex, pID) {
	if(pOwner === "you") {
		//var index = gTradeListYou.indexOf(pItem);
		//if (index > -1) {
	    	gTradeListYou.splice(pIndex, 1);
		//}
	} else {
		//var index = gTradeListOther.indexOf(pItem);
		//if (index > -1) {
	    	gTradeListOther.splice(pIndex, 1);
		//}		
	}
	previewContainer(pItem, pOwner);	
}

function checkCardCountTrade(pItem, pOwner) {
	var counter = 0;
	var status = true;
	if($("#"+pItem.Name+pItem.SetName+pItem.UserID+"_count").text() !== "") {
		var cardCount = parseInt($("#"+pItem.Name+pItem.SetName+pItem.UserID+"_count").text());
		if(pOwner === "you"){
			$.each(gTradeListYou, function( index, result ) {
				if(result.Name === pItem.Name && result.SetName === pItem.SetName) {
					counter++;	
				}			
			});
		} else {
			$.each(gTradeListOther, function( index, result ) {
				if(result.Name === pItem.Name && result.SetName === pItem.SetName) {
					counter++;	
				}			
			});			
		}
		if(counter < cardCount) {
			status = true;
		} else {
			status = false;
		}
	} else {
		//check single card if click already, don't allow click again'
		if($("#"+pItem.index+"_"+pItem.ID).hasClass( "tradeItemRemove" )) {
			status = false;
		} else {
			status = true;
		}
	}
	return status;
}

function previewContainer(pItem, pOwner) {
	if(pOwner === "you") {
		$("#previewTradeYou").empty();
		var prevTable = $("#previewTradeYou")[0];
		var row = prevTable.insertRow(0);			
		$.each(gTradeListYou, function( index, result ) {
			var cell = row.insertCell(index);
			var img = document.createElement("img");
			img.src = "http://gisgames.com/terrorcards/cards/2015/base/front/" + result.Name + ".jpg";
			img.height = "75";
						
			$(img).on( "doubletap", (function(evt) {
				RemoveFromTradeList(pItem, "you", index);
				console.log(result.count);
				$("#"+result.index+"_"+result.ID).removeClass( "tradeItemRemove" ).addClass( "tradeItemButton" );	
			}));
	      	//var item = '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + result.Name + '.jpg" id="'+result.Name+result.SetName+'_image" alt="image" height="75" />';				
			$(cell).append(img);		
		});			
	} else {
		$("#previewTradeOther").empty();
		var prevTable = $("#previewTradeOther")[0];
		var row = prevTable.insertRow(0);			
		$.each(gTradeListOther, function( index, result ) {
			var cell = row.insertCell(index);
	      	//var item = '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + result.Name + '.jpg" id="'+result.Name+result.SetName+'_image" alt="image" height="75" />';				
			var img = document.createElement("img");
			img.src = "http://gisgames.com/terrorcards/cards/2015/base/front/" + result.Name + ".jpg";
			img.height = "75";			

			$(img).on( "doubletap", (function(evt) {
				RemoveFromTradeList(pItem, "other", index);
				$("#"+result.index+"_"+result.ID).removeClass( "tradeItemRemove" ).addClass( "tradeItemButton" );	
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
		      	item = item + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + result.Name + '.jpg" alt="image" onclick="gallery_showCardDetail(this)" />';
		      	item = item + '</li>';				
				$("#trade_tradelist_you").append(item);	

	});
	$.each(gTradeListOther, function( index, result ) {
		      	var item = '<li>';
		      	item = item + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + result.Name + '.jpg" alt="image" onclick="gallery_showCardDetail(this)" />';
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
	alert(pMessage);	
	ShowTrades(gUser.ID);		
}

function TradeConfirmResponse(pMessage) {
	gTradeList = [];
	gTradeYou = [];
	gTradeOther = [];		
	$("#trade_tradelist_1").empty();
	$("#trade_tradelist_2").empty();
	$("#trade_tradelist_you").empty();
	$("#trade_tradelist_other").empty();
	$("#previewTradeYou").empty();
	$("#previewTradeOther").empty();
	$("#tradeMessageInput").text('');
	location.href="index.html";			
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
    	
    	requestTradeMessages({tradeID:TradeVal, cell:"msg"+index});
    	
    	$.each(pArray, function( idx, cardVal ) {	
	      cardInfo = cardVal;
	      if(cardInfo.TradeID === TradeVal) {
	      		//console.log(cardInfo);
		      if(cardInfo.Name) {
		      	if(cardInfo.UserID === gUser.ID) {
		      		yourList = yourList + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + cardInfo.Name + '.jpg" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" />';
		      	} else {
		      		tradePartner = cardInfo.UserID;
		      		othersList = othersList + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + cardInfo.Name + '.jpg" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" />';	
		      	}      	  
		      }
		      if(cardInfo.TradeOwner !== gUser.ID) {
		      	console.log(cardInfo.TradeOwner + " : " + gUser.ID);
		      	btnAgree = '<input type=button value="Agree" class="ui-corner-all ui-btn ui-btn-b" onclick=promptTrade("'+ cardInfo.TradeID +'");>';
		      }
		      btnCancel = '<input type=button value="Cancel" class="ui-corner-all ui-btn ui-btn-b" onclick=cancelTrade("'+ cardInfo.TradeID +'");>';      
      	  }  
    	});
    	
    		var tradeBlock = '<br><table border=1 class="tradeTable">';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="100%" colspan=2 class="leftPad">'+tradePartner+' <a href="trade.html" onclick=setTradePartner("'+tradePartner+'");><img src="images/tradearrow.png"></a></td>';
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
            tradeBlock = tradeBlock + '<td id="msg'+index+'" class="msg-style" onclick=popUpMessages({tradeID:"'+TradeVal+'"})><img src="images/message.png"> </td>';
            tradeBlock = tradeBlock + '</tr></table>';
            tradeBlock = tradeBlock + '</td>'; 
            tradeBlock = tradeBlock + '</tr>';                                     		
            tradeBlock = tradeBlock + '</table>';     
    		$("#trade_pending1").append(tradeBlock);    	
    	
	});
  }	
}

function ShowAcceptedTrades(pArray) {
  gTradeMessages = [];
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
	      		//console.log(cardInfo);
		      if(cardInfo.Name) {
		      	if(cardInfo.UserID === gUser.ID) {
		      		yourList = yourList + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + cardInfo.Name + '.jpg" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" />';
		      	} else {
		      		tradePartner = cardInfo.UserID;
		      		othersList = othersList + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + cardInfo.Name + '.jpg" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" />';	
		      	}      	  
		      }     
      	  }  
    	});
    	
    		var tradeBlock = '<br><table border=1 class="tradeTable">';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="100%" colspan=2>'+tradePartner+' <a href="trade.html" onclick=setTradePartner("'+tradePartner+'");><img src="images/tradearrow.png"></a></td>';
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
	      		//console.log(cardInfo);
		      if(cardInfo.Name) {
		      	if(cardInfo.UserID === gUser.ID) {
		      		yourList = yourList + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + cardInfo.Name + '.jpg" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" />';
		      	} else {
		      		tradePartner = cardInfo.UserID;
		      		othersList = othersList + '<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + cardInfo.Name + '.jpg" id="'+cardInfo.Name+cardInfo.SetName+'_image" alt="image" width="75" />';	
		      	}      	  
		      }     
      	  }  
    	});
    	
    		var tradeBlock = '<br><table border=1 class="tradeTable">';
            tradeBlock = tradeBlock + '<tr>';
            tradeBlock = tradeBlock + '<td width="100%" colspan=2>'+tradePartner+' <a href="trade.html" onclick=setTradePartner("'+tradePartner+'");><img src="images/tradearrow.png"></a></td>';
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
		//console.log(filteredList);
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

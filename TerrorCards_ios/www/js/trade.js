gYourCards = [];
gOtherCards = [];
//gTradeList = [];
gTradeListYou = [];
gTradeListOther = [];
gTradeMessages = [];
gTradeCardSets = [];

function checkTradeWithSelf(pUser) {
	if (pUser !== gUser.ID) {
		callServer("cardSets", null, gUser.ID, loadTradeCardYearDropDown);
		gTradeListYou = [];
		gTradeListOther = [];
		setTradePartner(pUser, 'N');
	}
}

function togglePreviewList(pParam) {
	if (pParam == "cards") {
		$("#preview_my_wants").hide();
		$("#preview_my_cards").show();
	} else if (pParam == "wants") {
		$("#preview_my_wants").show();
		$("#preview_my_cards").hide();
	} else {
		$("#preview_my_wants").hide();
		$("#preview_my_cards").hide();
	}
}

function setTradePartner(pUser, pNeeds) {
	if (gUser.Registered === "1") {
		gYourCards = [];
		gOtherCards = [];
		gUser2.ID = pUser;
		gUser2.Name = pUser;
		pullTradeCards(gUser.ID, gUser2.ID);
		if (pNeeds == 'Y') {
			$("#btnTradeNeeds").text("Show All");
			$("#btnTradeNeeds").attr("onclick", "pullTradeCards('" + gUser.ID + "','" + gUser2.ID + "', 'N')");
		} else {
			$("#btnTradeNeeds").text("Show Needs");
			$("#btnTradeNeeds").attr("onclick", "pullTradeCards('" + gUser.ID + "','" + gUser2.ID + "', 'Y')");
		}
	} else {
		myApp.alert("Please register before trading", 'Terror Cards');
	}
}

function pullTradeCards(pUserId, pOther) {
	gYourCards = [];
	gOtherCards = [];
	$("#trade_tradelist_1_cards").empty();
	$("#trade_tradelist_2_cards").empty();
	setTimeout(function() {
		var yearData = $("#slTradeCardYear").val();
		var categoryData = $("#slTradeCardCategory").val();
		var needsData = $("#slTradeCardNeeds").val();

		callServer('tradeSetup', {
			receiver : pOther,
			needs : needsData,
			category : categoryData,
			year : yearData
		}, pUserId, loadUserTradeCards);
		callServer('tradeSetup', {
			receiver : pUserId,
			needs : needsData,
			category : categoryData,
			year : yearData
		}, pOther, loadUserTradeCards);
	}, 1000);
}

function loadUserTradeCards(pArray) {
	var currUser = '';
	var cardList;
	$.each(pArray, function(index, value) {
		if (value.UserID == gUser.ID) {
			currUser = gUser.ID;
			gYourCards.push(value);
			cardList = gYourCards;
		} else {
			currUser = gUser2.ID;
			gOtherCards.push(value);
			cardList = gOtherCards;
		}
	});
	setCardTradeInfo(cardList, currUser);
	//setCardTradeInfo(gOtherCards,gUser2.ID);
}

function setCardTradeInfo(pArray, pUser) {
	if(typeof(pArray) !== "undefined") {
		if (pArray.length > 0) {
			var cardInfo;
			var statHolder;
			var currCard = "";
			var currSet = "";
			var currCount = 1;
			$.each(pArray, function(index, value) {
				//TODO loop though exisitng list and set the proper count if card list is refreshed but still has cards that exist in the tradelist
				if (gTradeListYou.length > 0) {
					$.each(gTradeListYou, function(index, val) {
						if (val.ID == value.ID) {
							value.RuntimeCount = value.RuntimeCount - val.RuntimeCount;
						}
					});
				}
				if (gTradeListOther > 0) {
					$.each(gTradeListOther, function(index, val) {
						if (val.ID == value.ID) {
							value.RuntimeCount = value.RuntimeCount - val.RuntimeCount;
						}
					});
				}
	
				cardInfo = value;
				cardInfo.index = index;
				statHolder = '<div class="card_header">';
				if (cardInfo.RuntimeCount == "1") {
					statHolder = statHolder + '<div class="card_header_count" id="' + cardInfo.ID + '_count"></div>';
				} else {
					statHolder = statHolder + '<div class="card_header_count" id="' + cardInfo.ID + '_count">' + cardInfo.RuntimeCount + '</div>';
				}
				statHolder = statHolder + '<div class="card_header_message" id="' + cardInfo.ID + '_cardCountTrade"></div>';
				statHolder = statHolder + '<div>';
				var item = '<li>' + statHolder;
				item = item + '<img src="images/waitSmall.png" data-src="' + cardInfo.Image + '" id="' + cardInfo.ID + '_image" alt="' + cardInfo.ID + '" class="tradeItemButton lazy-trade" />';
				item = item + '</div></li>';
	
				if (cardInfo.UserID == pUser) {
					if (pUser == gUser.ID) {
						/*
						 if(cardInfo.Type == "Insert" || cardInfo.Type == "Award") {
						 $("#trade_tradelist_1_insert").append(item);
						 } else {
						 $("#trade_tradelist_1_base").append(item);
						 }
						 */
						$("#trade_tradelist_1_cards").append(item);
						$("#" + cardInfo.ID + "_image").on("tap", (function(cardInfo) {
							return function() {
								TradeCardCount(cardInfo.Name, cardInfo.SetName, cardInfo.Card_Year, cardInfo.ID + "_cardCountTrade");
							};
						})(cardInfo));
						$("#" + cardInfo.ID + "_image").on("doubletap", (function(cardInfo) {
							return function() {
								var currClass = $(this).attr("class");
								if ($(this).hasClass( "tradeItemButton" )) {
									if (gTradeListYou.length >= 9) {
										//show alert
									} else {
										if (checkCardCountTrade(cardInfo, "you", this)) {
											AddTradeList(cardInfo, "you", index + '_' + cardInfo.ID, gTradeListYou, this);
										}
									}
								} else {
									if (gTradeListYou.length <= 0) {
										//show alert
									} else {
										if (checkCardCountTrade(cardInfo, "you", this)) {
											AddTradeList(cardInfo, "you", index + '_' + cardInfo.ID, gTradeListYou, this);
										}
									}
								}
							};
						})(cardInfo));
					} else {
						/*
						 if(cardInfo.Type == "Insert" || cardInfo.Type == "Award") {
						 $("#trade_tradelist_2_insert").append(item);
						 } else {
						 $("#trade_tradelist_2_base").append(item);
						 }
						 */
						$("#trade_tradelist_2_cards").append(item);
						$("#" + cardInfo.ID + "_image").on("tap", (function(cardInfo) {
							return function() {
								TradeCardCount(cardInfo.Name, cardInfo.SetName, cardInfo.Card_Year, cardInfo.ID + "_cardCountTrade");
							};
						})(cardInfo));
						$("#" + cardInfo.ID + "_image").on("doubletap", (function(cardInfo) {
							return function() {
								var currClass = $(this).attr("class");
								if ($(this).hasClass( "tradeItemButton" )) {
									if (gTradeListOther.length >= 9) {
										//show alert
									} else {
										if (checkCardCountTrade(cardInfo, "other", this)) {
											AddTradeList(cardInfo, "other", index + '_' + cardInfo.ID, gTradeListOther, this);
										}
									}
								} else {
									if (gTradeListOther.length <= 0) {
										//show alert
									} else {
										if (checkCardCountTrade(cardInfo, "other", this)) {
											AddTradeList(cardInfo, "other", index + '_' + cardInfo.ID, gTradeListOther, this);
										}
									}
								}
							};
						})(cardInfo));
					}
				}
			});
			lzlTrade.update();
		}
	}
}

function AddTradeList(pItem, pOwner, pID, pArray, pImage) {
	var result = $.grep(pArray, function(e) {
		return e.ID == pItem.ID;
	});
	if (result.length > 0) {
		$.each(pArray, function(index, value) {
			if (value.ID == pItem.ID) {
				value.RuntimeCount = parseInt(value.RuntimeCount) + 1;
				pItem.RuntimeCount = parseInt(pItem.RuntimeCount) - 1;
				if (pItem.RuntimeCount <= 0) {
					$("#" + pImage.id).removeClass("tradeItemButton").addClass("tradeItemRemove");
				}
			}
		});
	} else {
		pItem.RuntimeCount = 1;
		//force the count in trade list to 1 to start tracking
		var copiedObject = jQuery.extend({}, pItem);
		pArray.push(copiedObject);
		pItem.RuntimeCount = parseInt(pItem.Count) - 1;
		//set it back so global list has correct runtime count
		if (pItem.RuntimeCount <= 0) {
			$("#" + pImage.id).removeClass("tradeItemButton").addClass("tradeItemRemove");
		}
	}
	if (pItem.Count > 1 && pItem.RuntimeCount >= 1) {
		var imgID = pItem.ID + "_count";
		var imageObj = $("#" + imgID).html(pItem.RuntimeCount);
	} else {
		var imgID = pItem.ID + "_count";
		$("#" + imgID).html('');
	}
	previewContainer(pItem, pOwner, pImage, pArray);
}

function RemoveFromTradeList(pItem, pClick, pOwner, pIndex, pID, pImage, pArray) {
	var value;
	var popIndx = -1;
	var popId = -1;
	var result = $.grep(pArray, function(e) {
		return e.ID == pClick.ID;
	});
	if (result.length > 0) {
		$.each(pArray, function(index, value) {
			if (value.ID == pClick.ID) {
				value.RuntimeCount = parseInt(value.RuntimeCount) - 1;
				pItem.RuntimeCount = parseInt(pItem.RuntimeCount) + 1;
				$('#' + value.ID + "_preview_count").html(value.RuntimeCount);

				if (pItem.RuntimeCount > 0) {
					$("#" + pItem.ID + "_image").removeClass("tradeItemRemove").addClass("tradeItemButton");
				}
				if (value.RuntimeCount == 0) {
					popIndx = index;
					popId = value.ID;
				}
			}
		});
		if (popIndx !== -1) {
			pArray.splice(popIndx, 1);
			var test = $('#' + popId + "_preview_holder").remove();
			previewContainer(pItem, pOwner, pImage, pArray);
		}
		if (pItem.Count > 1 && pItem.RuntimeCount >= 1) {
			var imgID = pItem.ID + "_count";
			$("#" + imgID).html(pItem.RuntimeCount);
		} else {
			var imgID = pItem.ID + "_count";
			$("#" + imgID).html('');
		}
		//previewContainer(pItem, pOwner, pImage, pArray);
	}
}

function checkCardCountTrade(pItem, pOwner, pImage) {
	var status = true;
	if (pItem.RuntimeCount > 1) {
		if (pOwner === "you") {
			//var result = $.grep(gTradeListYou, function(e){ return e.ID == pItem.ID; });
			if (pItem.RuntimeCount <= pItem.Count) {
				status = true;
			} else {
				status = false;
			}

		} else {
			//var result = $.grep(gTradeListOther, function(e){ return e.ID == pItem.ID; });
			if (pItem.RuntimeCount <= pItem.Count) {
				status = true;
			} else {
				status = false;
			}
		}
	} else {
		//check single card if click already, don't allow click again'
		if ($("#" + pImage.id).hasClass("tradeItemRemove")) {
			status = false;
		} else {
			status = true;
		}
	}
	return status;
}

function previewContainer(pItem, pOwner, pImage, pArray) {
	if (pOwner === "you") {
		//$("#previewTradeYou").empty();
		var prevTable = $("#previewTradeYou")[0];
	} else {
		var prevTable = $("#previewTradeOther")[0];
	}
	if ( typeof (prevTable.rows[0]) === "undefined") {
		var row = prevTable.insertRow(0);
	} else {
		var row = prevTable.rows[0];
	}
	$.each(pArray, function(index, result) {
		if (result.ID == pItem.ID) {
			if (result.RuntimeCount == 1) {
				var cell = row.insertCell(-1);
				var img = document.createElement("img");
				img.id = result.ID + "_preview";
				img.src = result.Image;
				img.height = "75";

				var div = document.createElement("div");
				div.id = result.ID + "_preview_holder";
				div.className = "card_header";

				var div2 = document.createElement("div");
				div2.id = result.ID + "_preview_count";
				div2.className = "card_header_count";
				$(div).append(img);
				$(div).append(div2);

				$(img).on("doubletap", (function(evt) {
					var imgID = result.ID + "_image";
					var imageObj = $("#" + imgID);
					RemoveFromTradeList(pItem, result, "you", index, imgID, imageObj, pArray);
				}));

				$(cell).append(div);
				return true;
			} else {
				var imgID = result.ID + "_preview_count";
				var imageObj = $("#" + imgID).html(result.RuntimeCount);
			}
		} else {
			//console.log("3");
		}
	});
}

function TradeCardCount(pName, pSet, pYear, pNode) {
	callServer("getCardCount", {
		name : pName,
		'set' : pSet,
		'year' : pYear,
		'node' : pNode
	}, gUser.ID, updateTradeCardCount);
}

function updateTradeCardCount(pParams) {
	//var divID = pParams[0].node;
	//var divCount = $("#"+divID).html(pParams[0].count);
}

function ConfirmTradeList() {

	togglePreviewList('none');

	$("#trade_tradelist_you").empty();
	$("#trade_tradelist_other").empty();
	$.each(gTradeListYou, function(index, result) {

		var statHolder = '<div class="card_header">';
		if (result.RuntimeCount == "1") {
			statHolder = statHolder + '<div class="card_header_count"></div>';
		} else {
			statHolder = statHolder + '<div class="card_header_count">' + result.RuntimeCount + '</div>';
		}
		//statHolder = statHolder + '<div class="card_header_message">Sold Out</div>';
		statHolder = statHolder + '<div>';
		var item = '<li>' + statHolder;
		item = item + '<img src="' + result.Image + '" class="tradeItemButton" onclick="gallery_showCardDetail(this)" />';
		item = item + '</li>';
		$("#trade_tradelist_you").append(item);

	});
	$.each(gTradeListOther, function(index, result) {
		var statHolder = '<div class="card_header">';
		if (result.RuntimeCount == "1") {
			statHolder = statHolder + '<div class="card_header_count"></div>';
		} else {
			statHolder = statHolder + '<div class="card_header_count">' + result.RuntimeCount + '</div>';
		}
		//statHolder = statHolder + '<div class="card_header_message">Sold Out</div>';
		statHolder = statHolder + '<div>';
		var item = '<li>' + statHolder;
		item = item + '<img src="' + result.Image + '" class="tradeItemButton" onclick="gallery_showCardDetail(this)" />';
		item = item + '</li>';
		$("#trade_tradelist_other").append(item);

	});
	
	var element_to_scroll_to = $('#trade_tab3p')[0];
	element_to_scroll_to.scrollIntoView();
	setTimeout(function() {
		var element_to_scroll_to = $('#tradeSetupPage')[0];
		element_to_scroll_to.scrollIntoView();			
	},500);
		
}

function SaveTrade() {
	gTradeList = [];
	if((gTradeListYou.length <= 9 && gTradeListYou.length >= 1) && (gTradeListOther.length <= 9 && gTradeListOther.length >= 1)) {
		$.each(gTradeListYou, function(index, result) {
			gTradeList.push(result);
		});
		$.each(gTradeListOther, function(index, result) {
			gTradeList.push(result);
		});
		var dataTransfer = {};
		dataTransfer.trade = gTradeList;
		dataTransfer.msg = "";
		var msg = htmlEntities($("#tradeMessageInput").val());
		if (msg !== "") {
			dataTransfer.msg = msg;
		}
		callServer("saveTrade", dataTransfer, gUser.ID, TradeConfirmResponse);		
	} else {
		myApp.alert("Error occurred, please check the trade again", 'Terror Cards');
	}
}

function promptTrade(pTradeID) {
	callServer("executeTrade", pTradeID, gUser.ID, ExecuteConfirmResponse);
}

function cancelTrade(pTradeID) {
	callServer("cancelTrade", pTradeID, gUser.ID, ExecuteConfirmResponse);
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
	location.href = "index.html";
}

function CheckActiveTades() {
	callServer("CheckActiveTades", "PENDING", gUser.ID, ShowActiveTradeIdicator);
}

function ShowActiveTradeIdicator(pArray) {
	if (pArray.length > 0) {
		if (pArray[0].count >= 1) {
			$("#tradeMenuIcon").attr('src', 'images/icons/white/retweet_active.png');
		} else {
			$("#tradeMenuIcon").attr('src', 'images/icons/white/retweet.png');
		}
	} else {
		$("#tradeMenuIcon").attr('src', 'images/icons/white/retweet.png');
	}
}

function ShowTrades(pUserId) {
	$("#trade_pending1").empty();
	$("#trade_pending2").empty();
	$("#trade_pending3").empty();
	callServer("showTrades", "PENDING", pUserId, ShowPendingTrades);
	callServer("showTrades", "ACCEPTED", pUserId, ShowAcceptedTrades);
	callServer("showTrades", "CANCELLED", pUserId, ShowCancelledTrades);
}

function ShowPendingTrades(pArray) {
	console.log(pArray);
	if (pArray.length > 0) {
		var cardInfo;
		var statHolder;
		var yourList = "";
		var othersList = "";
		var btnCancel = "";
		var btnAgree = "";
		var tradePartner = "";
		$("#trade_pending1").text('');

		var uniqueTradeArray = [];
		$.each(pArray, function(i, item) {
			if ($.inArray(item.TradeID, uniqueTradeArray) === -1) {
				uniqueTradeArray.push(item.TradeID);
			}
		});

		$.each(uniqueTradeArray, function(index, TradeVal) {
			yourList = "";
			othersList = "";
			btnAgree = "";
			btnCancel = "";
			tradePartner = "";
			var tradeDate = new Date();
			var tradeIDTime;

			requestTradeMessages({
				tradeID : TradeVal,
				cell : "msg" + index
			});

			$.each(pArray, function(idx, cardVal) {
				cardInfo = cardVal;
				if (cardInfo.TradeID === TradeVal) {
					tradeDate = cardInfo.TradeDate;
					tradeIDTime = cardInfo.TradeID;
					if (cardInfo.Name) {
						if (cardInfo.UserID === gUser.ID) {
							var statHolder = '<div class="card_header">';
							if (cardInfo.Count == "1") {
								statHolder = statHolder + '<div class="card_header_count"></div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							} else {
								statHolder = statHolder + '<div class="card_header_count">' + cardInfo.Count + '</div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							}
							//statHolder = statHolder + '<div class="card_header_message">Sold Out</div>';
							statHolder = statHolder + '<div>';
							yourList = yourList + statHolder + '<img src="' + cardInfo.Image + '" id="' + cardInfo.Name + cardInfo.SetName + '_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
							//yourList = yourList + "</div></div>";
						} else {
							tradePartner = cardInfo.UserID;
							var statHolder = '<div class="card_header">';
							if (cardInfo.Count == "1") {
								statHolder = statHolder + '<div class="card_header_count"></div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							} else {
								statHolder = statHolder + '<div class="card_header_count">' + cardInfo.Count + '</div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							}
							//statHolder = statHolder + '<div class="card_header_message">Sold Out</div>';
							statHolder = statHolder + '<div>';
							othersList = othersList + statHolder + '<img src="' + cardInfo.Image + '" id="' + cardInfo.Name + cardInfo.SetName + '_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
							//othersList = othersList + "</div>";
						}
					}
					if (cardInfo.TradeOwner !== gUser.ID) {
						btnAgree = '<input type=button value="Agree" class="ui-corner-all ui-btn ui-btn-b" onclick=promptTrade("' + cardInfo.TradeID + '");>';
					}
					btnCancel = '<input type=button value="Cancel" class="ui-corner-all ui-btn ui-btn-b" onclick=cancelTrade("' + cardInfo.TradeID + '");>';
				}
			});

			var tradeBlock = '<br><table border=1 class="tradeTable">';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td width="50%" class="leftPad">' + tradePartner + ' <a href="trade.html" onclick="setTradePartner(&quot;' + tradePartner + '&quot;);"><img src="images/tradearrow.png"></a>&nbsp;&nbsp;&nbsp;';
			tradeBlock = tradeBlock + '<a style="padding-left:10px;" onclick="insertFriend(&quot;' + tradePartner + '&quot;);"><img src="images/addperson.png"></a>&nbsp;&nbsp;&nbsp;&nbsp;<img src="images/icons/white/flag.png" onclick="messageFlag(&quot;' + TradeVal + '&quot;);" width="16"></td>';
			tradeBlock = tradeBlock + '<td width="50%" class="rightPad" id="td' + TradeVal + '"></td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td width="50%" class="leftPad">You will get</td>';
			tradeBlock = tradeBlock + '<td width="50%" class="leftPad">You will give</td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td class="left5Pad">' + othersList + '</td>';
			tradeBlock = tradeBlock + '<td class="left5Pad">' + yourList + '</td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td colspan=2 class="leftPad">';
			tradeBlock = tradeBlock + '<table width="100%"><tr>';
			tradeBlock = tradeBlock + '<td>' + btnCancel + '</td>';
			tradeBlock = tradeBlock + '<td>' + btnAgree + '</td>';
			tradeBlock = tradeBlock + '<td id="msg' + index + '" class="msg-style"><img src="images/message.png" onclick="popUpMessages({tradeID:&quot;' + TradeVal + '&quot;});"> </td>';
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

			tradeTimer(remainderTime, tradeIDTime);

		});
	}
}

function ShowAcceptedTrades(pArray) {
	//console.log(pArray);
	if (pArray.length > 0) {
		var cardInfo;
		var statHolder;
		var yourList = "";
		var othersList = "";
		var btnCancel = "";
		var btnAgree = "";
		var tradePartner = "";
		$("#trade_pending2").text('');

		var uniqueTradeArray = [];
		$.each(pArray, function(i, item) {
			if ($.inArray(item.TradeID, uniqueTradeArray) === -1) {
				uniqueTradeArray.push(item.TradeID);
			}
		});

		$.each(uniqueTradeArray, function(index, TradeVal) {
			yourList = "";
			othersList = "";
			tradePartner = "";
			$.each(pArray, function(idx, cardVal) {
				cardInfo = cardVal;
				if (cardInfo.TradeID === TradeVal) {
					if (cardInfo.Name) {
						if (cardInfo.UserID === gUser.ID) {
							var statHolder = '<div class="card_header">';
							if (cardInfo.Count == "1") {
								statHolder = statHolder + '<div class="card_header_count"></div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							} else {
								statHolder = statHolder + '<div class="card_header_count">' + cardInfo.Count + '</div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							}
							statHolder = statHolder + '<div>';
							yourList = yourList + statHolder + '<img src="' + cardInfo.Image + '" id="' + cardInfo.Name + cardInfo.SetName + '_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
						} else {
							tradePartner = cardInfo.UserID;
							var statHolder = '<div class="card_header">';
							if (cardInfo.Count == "1") {
								statHolder = statHolder + '<div class="card_header_count"></div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							} else {
								statHolder = statHolder + '<div class="card_header_count">' + cardInfo.Count + '</div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							}
							statHolder = statHolder + '<div>';
							othersList = othersList + statHolder + '<img src="' + cardInfo.Image + '" id="' + cardInfo.Name + cardInfo.SetName + '_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
						}
					}
				}
			});

			var tradeBlock = '<br><table border=1 class="tradeTable">';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td width="50%">' + tradePartner + ' <a href="trade.html" onclick="setTradePartner(&quot;' + tradePartner + '&quot;);"><img src="images/tradearrow.png"></a></td>';
			tradeBlock = tradeBlock + '<td width="50%"><a onclick="insertFriend(&quot;' + tradePartner + '&quot;);"><img src="images/addperson.png"></a></td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td width="50%">You will get</td>';
			tradeBlock = tradeBlock + '<td width="50%">You will give</td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td class="left5Pad">' + othersList + '</td>';
			tradeBlock = tradeBlock + '<td class="left5Pad">' + yourList + '</td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '</table>';
			$("#trade_pending2").append(tradeBlock);

		});
	}
}

function ShowCancelledTrades(pArray) {
	//console.log(pArray);
	if (pArray.length > 0) {
		var cardInfo;
		var statHolder = "";
		var yourList = "";
		var othersList = "";
		var btnCancel = "";
		var btnAgree = "";
		var tradePartner = "";
		$("#trade_pending3").text('');

		var uniqueTradeArray = [];
		$.each(pArray, function(i, item) {
			if ($.inArray(item.TradeID, uniqueTradeArray) === -1) {
				uniqueTradeArray.push(item.TradeID);
			}
		});

		$.each(uniqueTradeArray, function(index, TradeVal) {
			yourList = "";
			othersList = "";
			tradePartner = "";
			$.each(pArray, function(idx, cardVal) {
				cardInfo = cardVal;
				console.log(cardInfo);
				if (cardInfo.TradeID === TradeVal) {
					if (cardInfo.Name) {
						if (cardInfo.UserID === gUser.ID) {
							var statHolder = '<div class="card_header">';
							if (cardInfo.Count == "1") {
								statHolder = statHolder + '<div class="card_header_count"></div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							} else {
								statHolder = statHolder + '<div class="card_header_count">' + cardInfo.Count + '</div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							}
							statHolder = statHolder + '<div>';
							yourList = yourList + statHolder + '<img src="' + cardInfo.Image + '" id="' + cardInfo.Name + cardInfo.SetName + '_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
							//yourList = yourList + '<div><div style="position:absolute;top:0px;left:0px;">'+cardInfo.Count+'<div><img src="' + cardInfo.Image + '" id="' + cardInfo.Name + cardInfo.SetName + '_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" /></div>';
						} else {
							var statHolder = '<div class="card_header">';
							tradePartner = cardInfo.UserID;
							if (cardInfo.Count == "1") {
								statHolder = statHolder + '<div class="card_header_count"></div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							} else {
								statHolder = statHolder + '<div class="card_header_count">' + cardInfo.Count + '</div>';
								statHolder = statHolder + '<div class="card_header_owned">' + cardInfo.OwnedCount + '</div>';
							}
							statHolder = statHolder + '<div>';
							othersList = othersList + statHolder + '<img src="' + cardInfo.Image + '" id="' + cardInfo.Name + cardInfo.SetName + '_image" alt="image" width="75" onclick="gallery_showCardDetail(this)" />';
						}
					}
				}
			});

			var tradeBlock = '<br><table border=1 class="tradeTable">';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td width="50%">' + tradePartner + ' <a href="trade.html" onclick="setTradePartner(&quot;' + tradePartner + '&quot;);"><img src="images/tradearrow.png"></a></td>';
			tradeBlock = tradeBlock + '<td width="50%"><a onclick="insertFriend(&quot;' + tradePartner + '&quot;);"><img src="images/addperson.png"></a></td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td width="50%">You will get</td>';
			tradeBlock = tradeBlock + '<td width="50%">You will give</td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '<tr>';
			tradeBlock = tradeBlock + '<td class="left5Pad">' + othersList + '</td>';
			tradeBlock = tradeBlock + '<td class="left5Pad">' + yourList + '</td>';
			tradeBlock = tradeBlock + '</tr>';
			tradeBlock = tradeBlock + '</table>';
			$("#trade_pending3").append(tradeBlock);

		});
	}
}

function requestTradeMessages(param) {
	callServer('requestTradeMessages', param, gUser.ID, showTradeMessages);
}

function showTradeMessages(pData) {
	$("#" + pData.cell).append(pData.results.length);
	gTradeMessages = gTradeMessages.concat(pData.results);
}

function popUpMessages(pData) {
	var filteredList = [];
	$("#messageTradeID").text('');
	$("#messageThread").text('');
	$("#txtMessageTrade").val('');
	gTradeMessages.forEach(function(item, index) {
		if (item.ID == (pData.tradeID).toString()) {
			filteredList.push(item);
		}
	});
	$("#messageTradeID").text(pData.tradeID);
	var deviceHeight = $(window).height();
	var deviceWidth = $(window).width();
	$("#messageThread").css({
		'height' : (deviceHeight - 230) + 'px'
	});
	$("#txtMessageTrade").css({
		'width' : '98%'
	});
	if (filteredList.length > 0) {
		filteredList.forEach(function(item, index) {
			$("#messageThread").append(item.Member + "<br>" + item.Message + "<br><br>");
		});
	}
	myApp.popup('.popup-messages');
}

function appendTradeMessage() {
	var tradeID = $("#messageTradeID").text();
	var newMsg = htmlEntities($("#txtMessageTrade").val());
	console.log(newMsg);
	callServer('appendTradeMessages', {
		"tradeID" : tradeID,
		"message" : newMsg
	}, gUser.ID, appendMessageComplete);
}

function appendMessageComplete(pData) {
	$("#messageTradeID").text('');
	$("#txtMessageTrade").val('');
	myApp.closeModal('.popup-messages');
	ShowTrades(gUser.ID);
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

//var count=30;

//var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
function tradeTimer(pTime, pTradeVal) {
	pTime = pTime - 1;
	if (pTime <= 0) {
		$("#td" + pTradeVal).text("Trade Expired");
		callServer('tradeReset', {
			"tradeID" : pTradeVal
		}, gUser.ID, ShowTrades);
		//return;
	} else {
		var hours = Math.floor((pTime / 3600 ) % 24);
		var minutes = Math.floor((pTime / 60 ) % 60);
		var seconds = Math.floor(pTime % 60);
		$("#td" + pTradeVal).text(hours + ":" + minutes + ":" + seconds);
		setTimeout(function() {
			tradeTimer(pTime, pTradeVal);
		}, 1000);
	}

}

//*********** Trade card set filtering ****************
function switchTradeYear() {
	loadTradeCardSetsDropDown($("#slTradeCardYear").val(), null);
	pullTradeCards(gUser.ID, gUser2.ID);
}

function loadTradeCardYearDropDown(pArray) {
	gTradeCardSets = pArray;
	setTimeout(function() {
		var uniqueYears = [];
		$.each(gTradeCardSets, function(index, value) {
			if (uniqueYears.indexOf(value.Year) == -1) {
				uniqueYears.push(value.Year);
			}
		});
		var selectYear = $('#slTradeCardYear');
		selectYear.empty();
		$.each(uniqueYears, function(index, value) {
			selectYear.append('<option value="' + value + '">' + value + '</option>');
		});
		loadTradeCardSetsDropDown(uniqueYears[0], null);
	}, 1000);
}

function loadTradeCardSetsDropDown(pYear, pSelected) {
	var selectYear = $('#slTradeCardCategory');
	selectYear.empty();
	selectYear.append('<option value="All">All Sets</option>');
	$.each(gTradeCardSets, function(index, value) {
		if (value.Year == pYear) {
			if (pSelected == value.SetName) {
				var friendly = (value.SetName).replace(/_/g, " ");
				selectYear.append('<option value="' + value.SetName + '" selected>' + friendly + '</option>');
			} else {
				var friendly = (value.SetName).replace(/_/g, " ");
				selectYear.append('<option value="' + value.SetName + '">' + friendly + '</option>');
			}
		}
	});
	//callServer("cards", {year:$("#slTradeCardYear").val(), category:$("#slTradeCardCategory").val()}, gUser.ID, loadGalleryImages);
}

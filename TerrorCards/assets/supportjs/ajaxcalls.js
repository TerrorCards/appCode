export const serverpath = "http://gisgames.com/CardTemplate/";

export function prepData(pData) {
    if(pData !== null) {
        var jsonstr = JSON.stringify(pData);    
    } else {
        var jsonstr = JSON.stringify({});        
    }
    return jsonstr;	
}

export function callServer(pTask,pData,pUserId) {
    switch(pTask) {
        case "cards": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uType", "Base");
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "cards_players.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }
        case "sets": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "card_sets.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }  
        case "cardCount": {
          var jsonstr = prepData(pData);
          let formData  = new FormData();
          formData.append("uUserId", pUserId);
          formData.append("uContent", jsonstr);
          let test = fetch(serverpath + "cards_count.php", {
            method: 'POST',
            headers: {
              "Content-Type": 'multipart/form-data'
            },
            body: formData
          });
          return test;
          break;
        }               
        case "userInfo": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uAction", "userInfo");
            formData.append("uContent1", "tet");
            let test = fetch(serverpath + "profile.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "messagesFull": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent", pData);
            let test = fetch(serverpath + "messages.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "appendBoardMessages": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "messagesPost.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }         
        case "packs": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uType", "Base");
            formData.append("uContent", pData.count);
            let test = fetch(serverpath + "packs.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "packsOrder": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent", jsonstr);
            formData.append("uAction", "BuyPack");
            let test = fetch(serverpath + "packs_Result.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }  
        case "showTrades": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent1", jsonstr);
            formData.append("uAction", "showTrades");
            let test = fetch(serverpath + "tradeList.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "tradeSetup": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uType", "All");
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "tradeCardList.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "saveTrade": {
            console.log(pData.uContent1);
            let c1 = prepData(pData.uContent1);
            let c2 = prepData(pData.uContent2);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent1", c1);
            formData.append("uContent2", c2);
            formData.append("uMsg", pData.msg);
            formData.append("uAction", "saveTrade");            
            let test = fetch(serverpath + "trade.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "executeTrade": {
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent1", pData);
            formData.append("uContent2", "");
            formData.append("uAction", "executeTrade");            
            let test = fetch(serverpath + "trade.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "cancelTrade": {
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent1", pData);
            formData.append("uContent2", "");
            formData.append("uAction", "cancelTrade");            
            let test = fetch(serverpath + "trade.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }         
        case "requestTradeMessages": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uTradeID", pData);
            let test = fetch(serverpath + "tradeMessages.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }         
        case "appendTradeMessages": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent1", jsonstr);            
            let test = fetch(serverpath + "tradeAppendMessage.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }  
        case "pullFactoryList": {
            //var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent", pData);
            let test = fetch(serverpath + "meld_pull_list.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        } 
        case "meldFactoryItem": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "meldCreateResult.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }  
        case "fetchNews": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "news.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }                        
        case "loginCheck": {
            //var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uAction", "checkLogin");
            formData.append("uPassword", pData);
            let test = fetch(serverpath + "checkLogin.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
        }  
      case "forgotPassword": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uAction", "recoverPassword");
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "forgetPassword.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
      }  
      case "defaultAccount": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uAction", "defaultAccount");
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "create_profile.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
      } 
      case "registerUser": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uAction", "register");
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "register.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
      }  
      case "pullFriendsList": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uAction", "select");
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "friends.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
      }
      case "pullSearchList": {
          var jsonstr = prepData(pData);
          let formData  = new FormData();
          formData.append("uUserId", pUserId);
          formData.append("uAction", "search");
          formData.append("uContent", jsonstr);
          let test = fetch(serverpath + "friends.php", {
            method: 'POST',
            headers: {
              "Content-Type": 'multipart/form-data'
            },
            body: formData
          });
          return test;
          break;
      }        
      case "pullBlockList": {
            var jsonstr = prepData(pData);
            let formData  = new FormData();
            formData.append("uUserId", pUserId);
            formData.append("uAction", "select");
            formData.append("uContent", jsonstr);
            let test = fetch(serverpath + "playerBlock.php", {
              method: 'POST',
              headers: {
                "Content-Type": 'multipart/form-data'
              },
              body: formData
            });
            return test;
            break;
      } 
      case "addFriend": {
        var jsonstr = prepData(pData);
        let formData  = new FormData();
        formData.append("uUserId", pUserId);
        formData.append("uAction", "insert");
        formData.append("uContent", jsonstr);
        let test = fetch(serverpath + "friends.php", {
          method: 'POST',
          headers: {
            "Content-Type": 'multipart/form-data'
          },
          body: formData
        });
        return test;
        break;
      }       
      case "deleteFriend": {
        var jsonstr = prepData(pData);
        let formData  = new FormData();
        formData.append("uUserId", pUserId);
        formData.append("uAction", "delete");
        formData.append("uContent", jsonstr);
        let test = fetch(serverpath + "friends.php", {
          method: 'POST',
          headers: {
            "Content-Type": 'multipart/form-data'
          },
          body: formData
        });
        return test;
        break;
      }
      case "insertBlockPlayer": {
        var jsonstr = prepData(pData);
        let formData  = new FormData();
        formData.append("uUserId", pUserId);
        formData.append("uAction", "insert");
        formData.append("uContent", jsonstr);
        let test = fetch(serverpath + "playerBlock.php", {
          method: 'POST',
          headers: {
            "Content-Type": 'multipart/form-data'
          },
          body: formData
        });
        return test;
        break;
      }
      case "removeBlockPlayer": {
        var jsonstr = prepData(pData);
        let formData  = new FormData();
        formData.append("uUserId", pUserId);
        formData.append("uAction", "delete");
        formData.append("uContent", jsonstr);
        let test = fetch(serverpath + "playerBlock.php", {
          method: 'POST',
          headers: {
            "Content-Type": 'multipart/form-data'
          },
          body: formData
        });
        return test;
        break;
      }      
      case "flagComment": {
        var jsonstr = prepData(pData);
        let formData  = new FormData();
        formData.append("uUserId", pUserId);
        formData.append("uContent", jsonstr);
        let test = fetch(serverpath + "flagContent.php", {
          method: 'POST',
          headers: {
            "Content-Type": 'multipart/form-data'
          },
          body: formData
        });
        return test;
        break;
      }           
      case "updateUserPic": {
          var jsonstr = prepData(pData);
          let formData  = new FormData();
          formData.append("uUserId", pUserId);
          formData.append("uAction", "update");
          formData.append("uContent", jsonstr);
          let test = fetch(serverpath + "updateUserPic.php", {
            method: 'POST',
            headers: {
              "Content-Type": 'multipart/form-data'
            },
            body: formData
          });
          return test;
          break;
      }                     
      default:
          break;
    }
}

export function callServer2(pTask,pData,pUserId,pCallback) {
    /*
    if(pTask === "cards") {
    	gCardList = [];
    	var jsonstr = prepData(pData);
    	//console.log(jsonstr);
        var cards = $.post(serverpath + "cards_players.php", { uContent: jsonstr, uType: 'Base', uUserId: pUserId })
          .done(function (result) {
          	 //console.log(result);
             var data = jQuery.parseJSON(result);
          	 gCardList = gCardList.concat(data);            
             pCallback(data);
          });       
    }
    else if (pTask === "cardSets") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "card_sets.php", { uContent: jsonstr, uUserId: pUserId, uAction: "CardSets" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }    
    else if (pTask === "getCardCount") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "cards_count.php", { uContent: jsonstr, uUserId: pUserId, uAction: "CardCount" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }     
    else if (pTask === "checkList") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "checkList.php", { uContent: jsonstr, uUserId: pUserId })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }    
    else if (pTask === "packs") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "packs.php", { uContent: jsonstr, uUserId: pUserId })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }
    else if (pTask === "packsOrder") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "packs_Result.php", { uContent: jsonstr, uUserId: pUserId, uAction: "BuyPacks" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }
    else if (pTask === "tradeSetup") {
    	var jsonstr = prepData(pData);
        var cards = $.post(serverpath + "tradeCardList.php", { uContent: jsonstr, uType: 'All', uUserId: pUserId })
          .done(function (result) {
          	 //console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
          });      
    } 
    else if (pTask === "saveTrade") {
    	var user1Param = {cards:null, userId:null};
	    var user2Param = {cards:null, userId:null};
	    var user1Cards = [];
	    var user2Cards = [];	    
		$.each(pData.trade, function( index, result ) {
			if(result.UserID === gUser.ID) {
				user1Param.userId = result.UserID;
				var cardID = result.ID + "_" + result.Card_Year + "_" + result.RuntimeCount;
				user1Cards.push(cardID);	
			} else {
				user2Param.userId = result.UserID;
				var cardID = result.ID + "_" + result.Card_Year + "_" + result.RuntimeCount;
				user2Cards.push(cardID);
			}	
		});
		
		user1Param.cards = user1Cards.join(",");
		user2Param.cards = user2Cards.join(","); 
		param1 = prepData(user1Param);  
		param2 = prepData(user2Param);
        var cards = $.post(serverpath + "trade.php", { uContent1: param1, uContent2: param2, uMsg:pData.msg, uUserId: pUserId, uAction:'saveTrade' })
          .done(function (result) {
          	 console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
         });
               
    }
    else if (pTask === "CheckActiveTades") {
    	var jsonstr = prepData(pData);
        $.post(serverpath + "tradeActiveCheck.php", { uContent: jsonstr, uUserId: pUserId, uAction:'showTrades' })
          .done(function (result) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
         });      
    }    
    else if (pTask === "showTrades") {
    	var jsonstr = prepData(pData);
        $.post(serverpath + "tradeList.php", { uContent1: jsonstr, uUserId: pUserId, uAction:'showTrades' })
          .done(function (result) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
         });      
    }         
    else if (pTask === "executeTrade") {
    	
        var cards = $.post(serverpath + "trade.php", { uContent1: pData, uContent2: '', uUserId: pUserId, uAction:'executeTrade' })
          .done(function (result) {
          	//console.log("result");
          	 console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
         });      
    }
    else if (pTask === "cancelTrade") {
    	
        var cards = $.post(serverpath + "trade.php", { uContent1: pData, uContent2: '', uUserId: pUserId, uAction:'cancelTrade' })
          .done(function (result) {
          	//console.log("result");
          	 //console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
         });      
    }    
    else if (pTask === "requestTradeMessages") {
    	//var jsonstr = pData;
    	//console.log(pData);
    	var tradeID = pData.tradeID;
        $.post( serverpath + "tradeMessages.php", { uTradeID: tradeID, uUserId: pUserId })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback({results:data, cell:pData.cell});
        });      
    } 
    else if (pTask === "appendTradeMessages") { 
    	var jsonstr = prepData(pData);   	
        var msg = $.post(serverpath + "tradeAppendMessage.php", { uContent1: jsonstr, uUserId: pUserId, uAction:'appendMessage' })
          .done(function (result) {
          	 //console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
         });      
    } 
    else if (pTask === "tradeReset") { 
    	var jsonstr = prepData(pData);   	
        var msg = $.post(serverpath + "tradeReset.php", { uContent: jsonstr, uUserId: pUserId, uAction:'tradeReset' })
          .done(function (result) {
          	 //console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(pUserId);
         });      
    }          
    //****** account handlers **********
    else if (pTask === "defaultAccount") {
    	var jsonstr = prepData(pData);    	   	
        $.post( serverpath + "create_profile.php", { uContent: jsonstr, uUserId: pUserId, uAction: 'defaultAccount' })
          .done(function(result) {
             var data = jQuery.parseJSON(result);
             pCallback(data);
        	})
          .fail(function(xhr, textStatus, errorThrown) {
    		alert(xhr.responseText);
    		alert(errorThrown);
  		});
              
    } 
    else if (pTask === "user") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "create_profile.php", { uContent: jsonstr, uUserId: pUserId, uAction: "getUser" })
          .done(function( result ) {
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    else if (pTask === "loginCheck") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "checkLogin.php", { uPassword: pData, uUserId: pUserId, uAction: "checkLogin" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    else if (pTask === "userInfo") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "profile.php", { uPassword: pData, uUserId: pUserId, uAction: "userInfo" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }
    else if (pTask === "registerUser") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "register.php", { uContent: jsonstr, uUserId: pUserId, uAction: "register" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    else if (pTask === "forgotPassword") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "forgetPassword.php", { uContent: jsonstr, uUserId: pUserId, uAction: "recoverPassword" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }     
    else if (pTask === "updateUserPic") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "updateUserPic.php", { uContent: jsonstr, uUserId: pUserId, uAction: "update" })
          .done(function( result ) {
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }        
    //******** Message Boards *********
    else if (pTask === "messagesFull") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "messages.php", { uContent: pData.count, uUserId: pUserId })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data, pData.place);
        });      
    }
    else if (pTask === "appendBoardMessages") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "messagesPost.php", { uContent: jsonstr, uUserId: pUserId })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }
    else if (pTask === "fetchNews") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "news.php", { uContent: jsonstr, uUserId: pUserId })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    else if (pTask === "flagMessage") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "flagContent.php", { uContent: jsonstr, uUserId: pUserId })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }       
    //******** Friends Mgmt *********
    else if (pTask === "pullFriendsList") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "friends.php", { uContent: jsonstr, uUserId: pUserId, uAction: "select" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    else if (pTask === "insertFriend") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "friends.php", { uContent: jsonstr, uUserId: pUserId, uAction: "insert" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    else if (pTask === "deleteFriend") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "friends.php", { uContent: jsonstr, uUserId: pUserId, uAction: "delete" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    else if (pTask === "pullBlockList") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "playerBlock.php", { uContent: jsonstr, uUserId: pUserId, uAction: "select" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }    
    else if (pTask === "insertBlock") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "playerBlock.php", { uContent: jsonstr, uUserId: pUserId, uAction: "insert" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }
    else if (pTask === "deleteBlock") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "playerBlock.php", { uContent: jsonstr, uUserId: pUserId, uAction: "delete" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }        
    //******** InApp Mgmt **************
     else if (pTask === "loadInApp") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "inAppList.php", { uContent: jsonstr, uUserId: pUserId, uAction: "select" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
     else if (pTask === "updateCredit") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "updateUserCredit.php", { uContent: jsonstr, uUserId: pUserId, uAction: "update" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    }
    //******** COntact Us ***********
     else if (pTask === "contactUS") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "contactUs.php", { uContent: jsonstr, uUserId: pUserId, uAction: "email" })
          .done(function( result ) {
          	console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    //******** Factory actions ***********
     else if (pTask === "pullFactoryList") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "meld_pull_list.php", { uContent: jsonstr, uUserId: pUserId, uAction: "meldList" })
          .done(function( result ) {
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    //******** Factory actions ***********
     else if (pTask === "meldFactoryItem") {
    	var jsonstr = prepData(pData);
        $.post( serverpath + "meldCreateResult.php", { uContent: jsonstr, uUserId: pUserId, uAction: "meldCreation" })
          .done(function( result ) {
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });      
    } 
    //******** BATTLE actions ************
    else if (pTask === "battleSetup") { 
     	var jsonstr = prepData(pData);
        $.post( serverpath + "battle/battle_players.php", { uContent: jsonstr, uUserId: pUserId, uAction: "setup" })
          .done(function( result ) {
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });   	
    } 
    else if (pTask === "battleResult") { 
     	var jsonstr = prepData(pData);
        $.post( serverpath + "battle/battle_result.php", { uContent: jsonstr, uUserId: pUserId, uAction: "setup" })
          .done(function( result ) {
             console.log(result);          	
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });   	
    }
    else if (pTask === "battlePlayerList") { 
     	var jsonstr = prepData(pData);
        $.post( serverpath + "battle/battle_players_list.php", { uContent: jsonstr, uUserId: pUserId, uAction: "setup" })
          .done(function( result ) {
          	//console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });   	
    }
    else if (pTask === "battleYourStats") { 
     	var jsonstr = prepData(pData);
        $.post( serverpath + "battle/battle_your_stats.php", { uContent: jsonstr, uUserId: pUserId, uAction: "setup" })
          .done(function( result ) {
          	console.log(result);
             var data = jQuery.parseJSON(result);
             pCallback(data);
        });   	
    }                                                                 
    else {
    	
    }
    */
}
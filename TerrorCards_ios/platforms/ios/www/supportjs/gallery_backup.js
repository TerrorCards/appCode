function loadGalleryImages(pArray) {
  if(pArray.length > 0) {
	//$("#photoslist_1").text('');
	//$("#photoslist_2").text('');
  	
	$("#txtSearch").keyup(function() {  	
  		searchMyCards();
 	});
  	
  	var cardInfo;
  	var statHolder;
  	var currCard = "";
  	var currSet = "";
  	var currCount = 1;
    $.each(pArray, function( index, value ) {
      cardInfo = value;
	      statHolder = '<div class="card_header">';
	      //statHolder = statHolder + '<div class="card_header_type">'+cardInfo.SetName+'</div>';
	      if(cardInfo.Count == "1") {
	      	statHolder = statHolder + '<div class="card_header_count"></div>';	
	      } else {
	      	statHolder = statHolder + '<div class="card_header_count">'+cardInfo.Count+'</div>';
	      }
	      //statHolder = statHolder + '<div class="card_header_quality">'+cardInfo.Quality+'</div>';
	      //statHolder = statHolder + '<div class="card_header_message">Sold Out</div>';
	      statHolder = statHolder + '<div>';
	      if(cardInfo.Type === "Base" || cardInfo.Type === "Parallel") {
	      		var thumbImg = (cardInfo.Image).replace(/full/g,"thumbs");
	      		//console.log(thumbImg);
	      		$("#photoslist_1").append('<li>'+statHolder+'<img src="' + thumbImg + '" id="'+cardInfo.Name+cardInfo.SetName+'_gallery" alt="image" /></li>');
				var clickMe = $('#'+cardInfo.Name+cardInfo.SetName+'_gallery').on( "doubletap", (function(cardInfo) {
					return function() {			  		
						gallery_showCardDetail(this,cardInfo.Name,cardInfo.SetName);				  							
					};
				})(cardInfo)
				);      		
      		} else {
      			var thumbImg = (cardInfo.Image).replace(/full/g,"thumbs");
      			$("#photoslist_2").append('<li>'+statHolder+'<img src="' + thumbImg + '" id="'+cardInfo.Name+cardInfo.SetName+'_gallery" alt="image" /></li>');	
 				var clickMe = $('#'+cardInfo.Name+cardInfo.SetName+'_gallery').on( "doubletap", (function(cardInfo) {
					return function() {			  		
						gallery_showCardDetail(this,cardInfo.Name,cardInfo.SetName);				  							
					};
				})(cardInfo)
				);     		
      		}
    });
  }
  
}

function gallery_showCardDetail(pImage, pName, pSet) {
	var width = ($( document ).width() - 50);
	myApp.popup('.card-detail');
	var fullImg = (pImage.src).replace(/thumbs/g,"full"); 
	$("#gallery_card_detail").text('');
	$("#gallery_card_detail").append('<img src="'+ fullImg +'" id="'+fullImg+'_detail" alt="image" onclick="flipCardGallery(this)" width="'+width+'" />');

	callServer("getCardCount", {name:pName, 'set':pSet}, gUser.ID, getCardCountCallback);	
}

function flipCardGallery(pImage) {
	
	var src = pImage.src;
	if(src.indexOf("front") > -1) {
		var newSrc = src.replace(/front/g,"back");
	} else {
		var newSrc = src.replace(/back/g,"front");			
	}
	$(pImage).attr("src", newSrc);	
}

function getCardCountCallback(pArray) {	
	$("#cardDetailCount").text('');	
	if(pArray.length > 0) {
		$("#cardDetailCount").text('Card Count: ' + pArray[0].count);
	}	
}

function loadCheckList(pArray) {
	$("#photoslist_3").text('');

	if(pArray.length > 0) {
		var msgObj = "";
		msgObj = msgObj + '<table width="95%"><tr><td colspan=4></td></tr>';
    	$.each(pArray, function (index, value) {
        	var msgInfo = value;
		   	msgObj = msgObj + '<tr>';
		   	//console.log(msgInfo.Owned);
		   	if(msgInfo.Owned == 'Y') {
		   		msgObj = msgObj + '	<td class="whiteFont friendList checklist-style" width="15%"><img src="images/black_x.png" width="25"></td>';	
		   	} else {
		   		msgObj = msgObj + '	<td class="whiteFont friendList checklist-style" width="15%"></td>';
		   	}
		   	msgObj = msgObj + '	<td class="whiteFont friendList checklist-style">' + msgInfo.SetName + '<td>';
		   	msgObj = msgObj + '	<td class="whiteFont friendList checklist-style">' + msgInfo.Name + '<td>';
		   	//msgObj = msgObj + '	<td width="10%"><a href="trade.html" onclick=setTradePartner("'+msgInfo.Name+'");><img src="images/tradearrow.png"></a><td>';		   	
		   	msgObj = msgObj + '</tr>';      	
      	});
      	msgObj = msgObj + '</table>';
      	$("#photoslist_3").append(msgObj);
  	}	
}

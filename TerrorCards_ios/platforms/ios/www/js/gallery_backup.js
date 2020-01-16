gCardSets = [];

function loadGalleryImages(pArray) {
  if(pArray.length > 0) {
	$("#photoslist_1").text('');
	//$("#photoslist_2").text('');
  	
	$("#txtSearch").keyup(function() {  	
  		searchMyCards();
 	});
  	
  	/*
  	var howMany = pArray.length / 5000;
  	if(howMany > 1) {
  		var arrayPiece = chunkArray(pArray,5000);	
  	} else {
		var arrayPiece = pArray;  		
  	}
  	console.log(arrayPiece);
  	*/
  	
  	var cardInfo;
  	var statHolder;
  	var currCard = "";
  	var currSet = "";
  	var currCount = 1;
  	var counter = 0;
    $.each(pArray, function( index, value ) {
    
      cardInfo = value;
	  statHolder = '<div class="card_header">';
	  if(cardInfo.Count !== null) {
		if(cardInfo.Count == "1") {
		  statHolder = statHolder + '<div class="card_header_count"></div>';	
		} else {
		  statHolder = statHolder + '<div class="card_header_count">'+cardInfo.Count+'</div>';
		}
	  }
	  statHolder = statHolder + '<div>';
		var thumbImg = (cardInfo.Image).replace(/full/g,"thumbs");
		//console.log(thumbImg);
		if(cardInfo.Count !== null) {
			$imgContent = '<li>'+statHolder+'<img src="' + thumbImg + '" id="'+cardInfo.Name+cardInfo.SetName+'_gallery" alt="image" /></li>';
		} else {
			$imgContent = '<li>'+statHolder+'<img src="' + thumbImg + '" id="'+cardInfo.Name+cardInfo.SetName+'_gallery" alt="image" style="opacity: 0.3" /></li>';	
		}
		$("#photoslist_1").append($imgContent);
		var clickMe = $('#'+cardInfo.Name+cardInfo.SetName+'_gallery').on( "doubletap", (function(cardInfo) {
			return function() {			  		
				gallery_showCardDetail(this,cardInfo.Name,cardInfo.SetName,null);				  							
			};
		})(cardInfo)
		); 
		counter = counter + 1;
    });
  }
  
}

function chunkArray(array, size) {
  var chunked_arr = [];
  var index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

function gallery_showCardDetail(pImage, pName, pSet, pYear) {
	if(pYear == null) {
		pYear = $("#slMyCardYear").val();
	}
	var width = ($( document ).width() - 50);
	myApp.popup('.card-detail');
	var fullImg = (pImage.src).replace(/thumbs/g,"full"); 
	$("#gallery_card_detail").text('');
	$("#gallery_card_detail").append('<img src="'+ fullImg +'" id="'+fullImg+'_detail" alt="image" onclick="flipCardGallery(this)" width="'+width+'" />');

	callServer("getCardCount", {name:pName, 'set':pSet, 'year':pYear}, gUser.ID, getCardCountCallback);	
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

function populateCardSets(pArray) {
	gCardSets = pArray;				
}

function loadCardYearDropDown() {
	setTimeout(function(){
		var uniqueYears = [];
	    $.each(gCardSets, function( index, value ) {
	    	if(uniqueYears.indexOf(value.Year) == -1) {
	    		uniqueYears.push(value.Year);
	    	}		
	    });
		var selectYear = $('#slMyCardYear');
		selectYear.empty();
		$.each(uniqueYears, function( index, value ) {
			selectYear.append('<option value="'+ value +'">'+ value +'</option>');
		});
		loadCardSetsDropDown(uniqueYears[0],null);
	},1000);				
}

function loadCardSetsDropDown(pYear,pSelected,pView) {
	var selectYear = $('#slMyCardCategory');
	selectYear.empty();
	selectYear.append('<option value="All">All</option>');
    $.each(gCardSets, function( index, value ) {
    	if(value.Year == pYear) {
    		if(pSelected == value.SetName) {
    			var friendly = (value.SetName).replace(/_/g, " ");
    			selectYear.append('<option value="'+ value.SetName +'" selected>'+ friendly +'</option>');
    		} else {
    			var friendly = (value.SetName).replace(/_/g, " ");
    			selectYear.append('<option value="'+ value.SetName +'">'+ friendly +'</option>');	
    		}
    	}		
    });
    callServer("cards", {year:$("#slMyCardYear").val(), category:$("#slMyCardCategory").val(), view:$("#slViewCards").val()}, gUser.ID, loadGalleryImages);			
}

function getCardByYearSet() {
	//callServer("cards", {year:$("#slMyCardYear").val(), category:$("#slMyCardCategory").val()}, gUser.ID, loadGalleryImages);
	loadCardSetsDropDown($("#slMyCardYear").val(), $("#slMyCardCategory").val(), $("#slViewCards").val());				
}

function getCardByView() {
	loadCardSetsDropDown($("#slMyCardYear").val(), $("#slMyCardCategory").val(), $("#slViewCards").val());	
}

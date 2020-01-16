function dynamicSort(property) {
	$("#photoslist_1").text('');
	$("#photoslist_2").text('');
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function(a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
    
}

function startsWith(wordToCompare) {
	$("#photoslist_1").text('');
	$("#photoslist_2").text('');
    return function(element) {
        return (element.Description.toLowerCase().indexOf(wordToCompare.toLowerCase()) >= 0|| element.SetName.toLowerCase().indexOf(wordToCompare.toLowerCase()) >= 0);
    };
}

function searchMyCards() {
	$("#txtSearch").unbind();
	var val = $("#txtSearch").val();
	var arrFilter = gCardList.filter(startsWith(val));

	if(arrFilter.length > 0) {	
		loadGalleryImages(arrFilter);
	} else {
		$("#txtSearch").keyup(function() {  	
	  		searchMyCards();
	 	});		
	}
}

function showSortMenu() {
	myApp.popup('.card-sort');
}

function sortMyCards(pVal,pDirection) {
	myApp.closeModal('.card-sort');
	$('#sortDescriptionAsc').attr('src', 'images/arrowAsc_black.png');
	$('#sortDescriptionDesc').attr('src', 'images/arrowDesc_black.png');
	$('#sortSetNameAsc').attr('src', 'images/arrowAsc_black.png');
	$('#sortSetNameDesc').attr('src', 'images/arrowDesc_black.png');
	$('#sortCountAsc').attr('src', 'images/arrowAsc_black.png');
	$('#sortCountDesc').attr('src', 'images/arrowDesc_black.png');		
	$('#sort'+pVal+pDirection).attr('src', 'images/arrow'+ pDirection +'_red.png');
	
	
	if(pDirection === "Desc") {
		var arrSort = gCardList.sort(dynamicSort("-"+pVal));
	} else {
		var arrSort = gCardList.sort(dynamicSort(pVal));	
	}

	$("#txtSearch").unbind();
			
	loadGalleryImages(arrSort);	
}



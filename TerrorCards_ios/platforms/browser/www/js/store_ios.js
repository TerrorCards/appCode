

function launchInApp() {
	myApp.popup('.in-app-store');
	//callServer("loadInApp", null, gUser.ID, loadInAppProducts);
		
	//myApp.closeModal('.in-app-store');
}

function loadInAppProducts(pArray) {
	$('#tblInAppStore').text('');
	gInAppList = [];
	gProductID = [];
	if(pArray.length > 0) {
		$.each(pArray, function (index, value) {
			var item = {
        		id:    value.ID,
        		title: value.Name,
        		description: value.Desc,
        		price: value.Amount			
			};
			gInAppList.push(item);
			gProductID.push(value.ID);
		});

		inAppPurchase
		  .getProducts(gProductID)
		  .then(function (products) {
		    initializeStore(products);
		    /*
		       [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
		    */
		  })
		  .catch(function (err) {
		    console.log(err);
		  });
	
		//initializeStore(pArray);		
	}	
}

function initializeStore(pArray) {
	$('#tblInAppStore').text('');
	$('#tblInAppStore').height($(document).height() - 50);

    // We register a dummy product. It's ok, it shouldn't
    // prevent the store "ready" event from firing.
    if(pArray.length > 0) {
    	$.each(pArray, function (index, value) {
			var content = "<table width='95%' cellpadding='2' cellspacing='2'>";
			for(i=0; i<1; i++){
				content += '<tr>';
				content += '<td width="100"><img src="images/icon_inapp.png"></td>';
		    	content += '<td id="td_'+value.productId+'" class="vertAlign">'+value.title+'</td><td class="vertAlign"><input type="button" id="btn_'+value.productId+'" value="'+value.price+'" onclick=confirmOrder("'+value.productId+'") class="ui-corner-all ui-btn ui-btn-b"></td></tr>';
			}
			content += "</table><p>";        	
		 
		 	$('#tblInAppStore').append(content);	    

	    
	    });		    
	    
	}	

}

function confirmOrder(p) {
	if(gUser.Suspended == "0") {
		myApp.confirm('Are you sure?', 'Terror Cards', function () {
	        makeIAPTransaction(p);
	    });
    } else {
    	myApp.alert("Sorry, not allowed, contact support.", 'Terror Cards');	
    }	
}

function makeIAPTransaction(p) {
	// first buy the product...
	var value = 0;
	inAppPurchase
	  .buy(p)
	  .then(function (data) {
	    // ...then mark it as consumed:
	    if(p.indexOf("25k") > -1) {
	    	value = 25000;
	    } else if(p.indexOf("100k") > -1) {
	    	value = 100000;
	    } else if(p.indexOf("250k") > -1) {
	    	value = 250000;
	    } else if(p.indexOf("500k") > -1) {
	    	value = 500000;
	    } else if(p.indexOf("750k") > -1) {
	    	value = 750000;
	    } else if(p.indexOf("1m") > -1) {
	    	value = 1000000;
	    } else {
	    	value = 0;
	    }
	    callServer("updateCredit", {credit:value}, gUser.ID, updateUserPicCallBack);
	    showOrderConfirm(value);
	    return inAppPurchase.consume(data.productType, data.receipt, data.signature);
	  })
	  .then(function () {
	    //alert('product was successfully consumed!');
	  })
	  .catch(function (err) {
	    console.log(err);
	  });	
}

function showOrderConfirm(val) {
	myApp.alert("Added " + val, 'Terror Cards');	
}

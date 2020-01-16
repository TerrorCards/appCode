function launchInApp() {
	myApp.popup('.in-app-store');
		
	//myApp.closeModal('.in-app-store');
}

function loadInAppProducts(pArray) {
	$('#tblInAppStore').text('');
	gInAppList = [];
	if(pArray.length > 0) {
		$.each(pArray, function (index, value) {
			var item = {
        		id:    value.ID,
        		alias: value.Name,
        		type:  store.CONSUMABLE,
        		custom: value.Amount			
			};
			gInAppList.push(item);
		});
	
		initializeStore(pArray);		
	}
}

function initializeStore(pArray) {
	$('#tblInAppStore').height($(document).height() - 50);
	
    // Let's set a pretty high verbosity level, so that we see a lot of stuff
    // in the console (reassuring us that something is happening).
    store.verbosity = store.INFO;
    
    store.validator = "http://gisgames.com/cardTemplate/store_return.php";

    // We register a dummy product. It's ok, it shouldn't
    // prevent the store "ready" event from firing.
    if(gInAppList.length > 0) {
    	$.each(gInAppList, function (index, value) {
		    store.register(value);	    
	    
			var content = "<table width='95%' cellpadding='2' cellspacing='2'>";
			for(i=0; i<1; i++){
				content += '<tr>';
				content += '<td width="100"><img src="images/icon_inapp.png"></td>';
		    	content += '<td id="td_'+value.id+'" class="vertAlign">'+value.alias+'</td><td class="vertAlign"><input type="button" id="btn_'+value.id+'" value="0" onclick=confirmOrder("'+value.id+'") class="ui-corner-all ui-btn ui-btn-b"></td></tr>';
			}
			content += "</table><p>";        	
		 
		 	$('#tblInAppStore').append(content);	    

	    	store.when(value.alias).approved(function (order) {
	        	order.finish();
	        	callServer("updateCredit", {credit:value.custom}, gUser.ID, updateUserPicCallBack);
	        	myApp.alert("Added " + value.alias, 'Terror Cards');
	    	});

	    
	    });		
	
	    store.when("product").updated(function (p) {
	        //app.renderIAP(p);
	        if (p.valid) {
		        $("#btn_"+p.id).val(p.price);
			}
	    });	    
	    
	}	
	    store.error(function(error) {
	        //alert('ERROR ' + error.code + ': ' + error.message);
	    });
	       

    // When every goes as expected, it's time to celebrate!
    // The "ready" event should be welcomed with music and fireworks,
    // go ask your boss about it! (just in case)
    store.ready(function() {
        alert("\\o/ STORE READY \\o/");
    });

    // After we've done our setup, we tell the store to do
    // it's first refresh. Nothing will happen if we do not call store.refresh()
    store.refresh();
}

function confirmOrder(p) {
	if(gUser.Suspended == "0") {
		myApp.confirm('Are you sure?', 'Terror Cards', function () {
	        store.order(p);
	    });
    } else {
    	myApp.alert("Sorry, not allowed, contact support.", 'Terror Cards');	
    }	
}

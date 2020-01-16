function checkStorage() {
	//deleteStorage();
	if(typeof(Storage) !== "undefined") {
	    if(localStorage.getItem("userID")) {
			gUser.ID = localStorage.getItem("userID");
			pullUserInfo();    	
	    }
		if (gUser.ID === "") {
			//$('#createDefaultAccount').on('touchstart click', function(){
			$('#createDefaultAccount').on('touchstart', function(){
				createDefaultAccount();
			});	
			$('#checkUserSubmit').on('touchstart', function(){
				loginCheck();
			});		
			
			myApp.popup('.popup-login');
			//createDefaultAccount();		
		}    	    
	} else {
	    // Sorry! No Web Storage support..
	    alert("sorry, can't store user info");
	}
}

function setStorage(pParam) {
	localStorage.setItem("userID", gUser.ID);
	localStorage.setItem("userCredit", gUser.Credit);		
}


function deleteStorage() {
	localStorage.removeItem("userID");	
	localStorage.removeItem("userCredit");	
}

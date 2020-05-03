$('#checkUserSubmit').on("click", loginCheck);
$('#createDefaultAccount').on("click", createDefaultAccount);

function loginCheck() {
    if(checkVirtual())
    {	
		if($("#LoginForm_UserName").val() === "" || $("#LoginForm_Password").val() === "") {
			$("#LoginForm_Message").text("Sorry, missing ID or password");	
		} else {
			callServer("loginCheck",$("#LoginForm_Password").val(),$("#LoginForm_UserName").val(),loginCheckResult);	
		}
	}	
}

function loginCheckResult(pParam) {
	if(pParam.Response === "Failed") {
		$("#LoginForm_Message").text("Sorry, Not a valid user");	
	} else {
		accountCreated(pParam);
	}	
}

function checkVirtual(){		
    var virtualCheck = device.isVirtual;
    if(virtualCheck == null || virtualCheck == true )
    {
        myApp.alert("Sorry, not a real device", "Terror Cards");
        return false;
    }
    else{
        return true;
	}
   return true;
}


function createDefaultAccount() {
	//check if it's a valid device and not a virtual
	//if(device.actual) {
	if(checkVirtual())
    {
		callServer("defaultAccount",{device:"previn"},null,accountCreated);
	}
	//} else {
	//	myApp.alert("Sorry, not a real device", 'Terror Cards');	
	//}
}

function accountCreated(pParam) {
	if(pParam.ID !== "NA") {
		gUser.ID = pParam.Name;
	    gUser.Image = pParam.Image;
	    gUser.Active =  pParam.Active;
	    gUser.Credit = pParam.Credit;	
		setStorage();
		callServer("userInfo", null, gUser.ID, appStateCalls);
		loadUserInfo();	
		myApp.closeModal('.popup-login');
	} else {
		myApp.alert("Sorry device already registered to another account", 'Terror Cards');
	}	
}

function pullUserInfo() {
	callServer("user",null,gUser.ID,loadUserInfo);		
}

function loadUserInfo() {
    $("#userName").text(gUser.ID);
    $("#profile_UserCredit").text(gUser.Credit);
}

//***** Register Form checks ********
function checkRegisterForm() {
    if(checkVirtual())
    {	
		myApp.confirm('Do you agree to the terms of the EULA?', 'Terror Cards', function () {
			if($("#RegisterForm_Username").val() === "" || $("#RegisterForm_Email").val() === "" || $("#RegisterForm_Password").val() === "") {
				myApp.alert("Please fill out all the fields", 'Terror Cards');	
			} else {
				if(($("#RegisterForm_Email").val()).indexOf("@") >= 0) {
					if(($("#RegisterForm_Password").val()).length >= 8) {
						if(($("#RegisterForm_Username").val()).indexOf("!") == -1) {
							var formData = {user:($("#RegisterForm_Username").val()).trim(), password:($("#RegisterForm_Password").val()).trim(), email:($("#RegisterForm_Email").val()).trim(), device:device.uuid};
							callServer("registerUser",formData,gUser.ID,registerCallback);
						} else {
							myApp.alert("No special characters for User name", 'Terror Cards');	
						}	
					} else {
						myApp.alert("Please make sure password is 8 characters or more.", 'Terror Cards');
					}
				} else {
					myApp.alert("Not a valid email", 'Terror Cards');
				}	
			}
		});
	}
}

function registerCallback(pParams) {
	if(pParams.Response === 'Success') {
		myApp.alert("Thanks for registering. Go forth and trade.", 'Terror Cards');
		gUser.ID = pParams.Name;
		setStorage(pParams);
		$("#userName").text(gUser.ID);
		callServer("userInfo", null, gUser.ID, appStateCalls);
		myApp.closeModal('.popup-signup');	
	} else {
		myApp.alert(pParams.Message, 'Terror Cards');		
	}
}

function forgotPassword() {
	if($("#forgotForm_Email").val() !== "") {
		var formData = {email:$("#forgotForm_Email").val()};
		callServer("forgotPassword",formData,'',forgotPasswordCallBack);	
	} else {
		myApp.alert("Please provide an email", 'Terror Cards');
	}
}

function forgotPasswordCallBack(pParams) {
	if(pParams.Status === "Fail") {
		myApp.alert("Sorry, no email found", 'Terror Cards');
	} else {
		myApp.alert("Email sent with password", 'Terror Cards');
	}
}

function goBackToLogin() {
	myApp.closeModal('.popup-forgot');
	myApp.popup('.popup-login');	
}

//********** Update player Image in database  ******************
function updateUserPic() {
	if(gUser.Image !== "") {
		var formData = {newImage:gUser.Image};
		callServer("updateUserPic",formData,gUser.ID,updateUserPicCallBack);			
	}
}

function updateUserPicCallBack(pParam) {
	callServer("userInfo", null, gUser.ID, appStateCalls);	
}

//********* Contact Us ************
function showContactUs(pUser) {
	myApp.popup('.popup-contactus');	
}

function submitContactUs() {
	if($("#txtContactUs").val() === "") {
		myApp.alert("Sorry, form is blank", 'Terror Cards');	
	} else {
		var data = {message:$("#txtContactUs").val(), email:$("#txtContactUsEmail").val()};
		callServer("contactUS",data,gUser.ID,contactUsResponse);	
	}	
}

function contactUsResponse(pParam) {
	myApp.alert(pParam[0].Message, 'Terror Cards');	
	myApp.closeModal('.popup-contactus');
}


//********* Promo Code ***********/
function checkPromoCode() {
	if($("#txtPromoCode").val() === "") {
		myApp.alert("Sorry, promo code is blank", 'Terror Cards');	
	} else {
		var data = {promo:$("#txtPromoCode").val()};
		callServer("processPromo",data,gUser.ID,promoResponse);	
	}	
}

function promoResponse(msg) {
	myApp.alert(msg[0].Message, 'Terror Cards');
	$("#txtPromoCode").val("");	
	callServer("userInfo", null, gUser.ID, appStateCalls);	
}


//********** this is call all the time to refresh info and credit and app state **********
function appStateCalls(pParam) {
	if(gUser.ID !== "") {
    	gUser.Image = pParam.Image;
    	gUser.Active = pParam.Active;
    	gUser.Credit = pParam.Credit;
    	gUser.Registered = pParam.Registered;
    	gUser.Suspended = pParam.Suspended;
    	gUser.New = "";	
    	gUser.Rating = pParam.Rating;	
				
		if(pParam.DailyMessage !== "") {
			myApp.alert(pParam.DailyMessage, 'Terror Cards');			
			$("#messageDailyLogin").text(pParam.DailyMessage);
			//myApp.popup('.popup-dailylogin');			
		}
		if (gUser.Registered === "0") {
			$('#needRegister').show();	
		} else {
			$('#needRegister').hide();	
		}
		
		$("#creditHolder").text("Credit: " + pParam.Credit);
		$("#mainProfilePic").attr('src', gUser.Image);
		$("#ratingHolder").text(gUser.Rating + " % Complete");
		callServer("cardSets", null, gUser.ID, populateCardSets);
		//callServer("cards", {year:$("#slMyCardYear").val(), category:$("#slMyCardCategory").val()}, gUser.ID, loadGalleryImages);
		callServer("packs", null, gUser.ID, market_loadActivePacks);
		callServer("packs", null, gUser.ID, market_FeaturedPack);
		callServer("messagesFull", {count:50, place:'board'}, gUser.ID, loadMessagesFull);
		callServer("messagesFull", {count:10, place:'home'}, gUser.ID, loadMessagesFull);   
		callServer("checkList", null, gUser.ID, loadCheckList);
		callServer("CheckActiveTades","PENDING",gUser.ID,ShowActiveTradeIdicator);
		//callServer("loadInApp", null, gUser.ID, loadInAppProducts);
  	}
}


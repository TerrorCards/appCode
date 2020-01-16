function chooseProfilePic() {
	navigator.camera.getPicture(cameraSuccess, cameraError, {
		destinationType: Camera.DestinationType.DATA_URL, 
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		quality: 100,
		targetWidth: 200,
		targetHeight: 200
	});
		
}

function cameraSuccess(base64) {

	if (base64.substring(0,21)=="content://com.android") {
	  photo_split=base64.split("%3A");
	  base64="content://media/external/images/media/"+photo_split[1];
	}
    $("#mainProfilePic").attr('src', 'data:image/png;base64, ' + base64);
    gUser.Image = base64;
    updateUserPic();
    //alert($("#mainProfilePic").attr('src'));
}

function cameraError(message) {
    alert('Failed because: ' + message);
}



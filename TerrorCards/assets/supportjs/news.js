function pullNews() { 
    callServer("fetchNews", {count:10}, gUser.ID, loadNews); 
}


function loadNews(pArray) {
  $("#productNews").text('');		

  if(pArray.length > 0) {
  	var header = '<table class="indexContent_news_sub">';
  	var msgObj = header;
      $.each(pArray, function (index, value) {
          var msgInfo = value;
	       msgObj = msgObj + '<tr><td colspan=2 class="messageBoardName"><br><div width="'+ $(window).width() +'">'+msgInfo.Text+'</div><br></td></tr>';
	       msgObj = msgObj + '<tr><td colspan=2 style="font-size:9pt;"><br>'+msgInfo.Timestamp+'<br></td></tr>';	       
           msgObj = msgObj + '<tr><td colspan=2><hr><br></td></tr>';     		       	       
	                
      });
      msgObj = msgObj + '     </table><br>';
      $("#productNews").append(msgObj);     
  }
  
}


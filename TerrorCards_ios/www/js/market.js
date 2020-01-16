
function market_loadActivePacks(pArray) {
	market_showUserCredit();

  if(pArray.length > 0) {
  	$("#marketList").text('');
  	$("#marketList").append('<li class="table_row"><div class="table_section"> </div><div class="table_section"> </div><div class="table_section"> </div> </li>');
      $.each(pArray, function (index, value) {
          var packInfo = value;
          var packObj = "";
          packObj = packObj + '<li class="table_row">';
          packObj = packObj + '<div class="table_section">' + packInfo.Name + '<br><img src="' + packInfo.Image + '" width="100"></div>';
          packObj = packObj + '<div class="table_section pack-desc-size">' + packInfo.Desc + '</div>';
          packObj = packObj + '<div class="table_section pack-desc-size">' + packInfo.PerPack + ' cards per pack</div>';
          if(packInfo.Ratio !== "0") {
          packObj = packObj + '<div class="table_section pack-desc-size">1:' + packInfo.Ratio + ' insert chance</div>';    
          }      
          packObj = packObj + '<div class="table_section"><button id="btnPack' + index + '" class="ui-btn ui-btn-b">' + packInfo.Cost + '</button></div>';
          packObj = packObj + '</li>';
          $("#marketList").append(packObj);

          $("#btnPack" + index)
            .click(function (event) {
                event.preventDefault();
				myApp.confirm('Are you sure?', 'Terror Cards', function () {
        			market_packButton(packInfo);
    			});

                //var r = confirm("Are you sure?");
                //if (r == true) {
                //    market_packButton(packInfo);
                //}

            });

      });
  }
  
}

function market_packButton(pPackInfo) { 
	if(parseInt(pPackInfo.Cost) <= parseInt(gUser.Credit)) {
    	var packOrder = {'packID':pPackInfo.ID,'packName':pPackInfo.Name,'userID':gUser.ID, 'packSets': pPackInfo.Set, 'packChase': pPackInfo.Chase, 'packCost': pPackInfo.Cost, 'packPer': pPackInfo.PerPack};

    	callServer("packsOrder", packOrder, gUser.ID, market_showPackResults);		
	} else {
		myApp.alert("Sorry, not enough credit ", 'Terror Cards');
	} 
}

function market_showPackResults(pPackResults) {
	var width = ($( document ).width() - 50);
	$("#market_packResult").text('');
  if(pPackResults.length > 0) {
      //console.log(pPackResults);
    $.each(pPackResults, function( index, value ) {
		$("#market_packResult").append('<img src="' + value.Image + '" id="'+value.Name+value.SetName+'_image" alt="image" width="'+width+'" /><br><br>');    	
    	/*
	    if(value.Type === "Base" || value.Type === "Parallel") {
	      	$("#market_packResult").append('<img src="http://gisgames.com/terrorcards/cards/2015/base/front/' + value.Name + '.jpg" id="'+value.Name+value.SetName+'_image" alt="image" width="'+width+'" /><br><br>');
      	} else {
      		$("#market_packResult").append('<img src="http://gisgames.com/terrorcards/cards/2015/insert/' + value.SetName + '/' + value.Name + '.jpg" id="'+value.Name+value.SetName+'_image" alt="image" width="'+width+'" /><br><br>');	
      	}
      	*/
    });
    //$("#market_packResult").css("display","block");
    myApp.popup('.pack-result');
  } 
  
  callServer("packs", null, gUser.ID, market_loadActivePacks);
  callServer("userInfo", null, gUser.ID, appStateCalls);
  market_showUserCredit();       
}

function market_clearMarketResult() {
	$("#market_packResult").text('');
	$("#market_packResult").css("display","none");	
}

function market_FeaturedPack(pArray) {
	$("#index_FeaturedPack").text('');
	var counter = 0;
  if(pArray.length > 0) {
      $.each(pArray, function (index, value) {
      	if(counter < 1) {
          var packInfo = value;
          var packObj = "";
          //packObj = packObj + '<li class="">';
          packObj = packObj + '<table width="98%"><tr>';
          packObj = packObj + '<td width="30%"><div class=""><br><img src="' + packInfo.Image + '" width="75"></div></td>';
          packObj = packObj + '<td width="70%"><div class="">' + packInfo.Name + '<br>' + packInfo.Desc + '</div>';
          packObj = packObj + '<div style="vertical-align:bottom;"><button id="featurebtnPack' + index + '" class="ui-corner-all ui-btn ui-btn-b"> ' + packInfo.Cost + ' </button></div></td>';
          packObj = packObj + '</tr></table>';
          //packObj = packObj + '</li>';
          $("#index_FeaturedPack").append(packObj);

          $("#featurebtnPack" + index)
            .click(function (event) {
                event.preventDefault();
				myApp.confirm('Are you sure?', 'Terror Cards', function () {
        			market_packButton(packInfo);
    			});
                //var r = confirm("Are you sure?");
                //if (r == true) {
                //    market_packButton(packInfo);
                //}

            });
            counter++;
		}
      });
  }
  
}

function market_showUserCredit() {
	$("#market_coin_display").text(gUser.Credit);	
}


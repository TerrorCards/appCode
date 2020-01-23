
function ShowFactory(pUserId) {
	callServer("pullFactoryList","",pUserId,factory_loadActiveMelds);		
}

function factory_loadActiveMelds(pArray) {
  if(pArray.length > 0) {
  	$("#factoryList").text('');
  	//$("#factoryList").append('<li class="table_row"><div class="table_section"> </div><div class="table_section"> </div><div class="table_section"> </div> </li>');
      $.each(pArray, function (index, value) {
          var factoryInfo = value;
          var factoryObj = "";
          factoryObj = factoryObj + '<table width="100%" class="tableFactory">';
          factoryObj = factoryObj + '<tr><td width="45%"><img src="' + factoryInfo.MeldImage + '" width="95%"><br>To obtain the card above, combine the necessary cards on the right.<br><br>Chance of success: '+factoryInfo.MeldChance+'%</td>';
          factoryObj = factoryObj + '<td width="55%" style="vertical-align:top"><table width="100%">';
          factoryObj = factoryObj + '<tr><td></td><td>Have / Need</td></tr>';
          if(factoryInfo.MeldRequirement1 != null && factoryInfo.MeldRequirement1 != "0")          
          	{factoryObj = factoryObj + '<tr><td><img src="' + factoryInfo.CardImage1 + '" width="75"></td><td>'+factoryInfo.UserCountNeed1+' / '+factoryInfo.MeldCountNeed1+'</td></tr>';}
          if(factoryInfo.MeldRequirement2 != null && factoryInfo.MeldRequirement2 != "0")
          	{factoryObj = factoryObj + '<tr><td><img src="' + factoryInfo.CardImage2 + '" width="75"></td><td>'+factoryInfo.UserCountNeed2+' / '+factoryInfo.MeldCountNeed2+'</td></tr>';}
          if(factoryInfo.MeldRequirement3 != null && factoryInfo.MeldRequirement3 != "0")
          	{factoryObj = factoryObj + '<tr><td><img src="' + factoryInfo.CardImage3 + '" width="75"></td><td>'+factoryInfo.UserCountNeed3+' / '+factoryInfo.MeldCountNeed3+'</td></tr>';}
          if(factoryInfo.MeldRequirement4 != null && factoryInfo.MeldRequirement4 != "0")
          	{factoryObj = factoryObj + '<tr><td><img src="' + factoryInfo.CardImage4 + '" width="75"></td><td>'+factoryInfo.UserCountNeed4+' / '+factoryInfo.MeldCountNeed4+'</td></tr>'; } 
          if(factoryInfo.MeldMet === true) {
          	factoryObj = factoryObj + '<tr><td colspan=2><button id="btnMeld' + index + '" class="ui-btn ui-btn-b">Create</button></td></tr>';
          } else {
          	factoryObj = factoryObj + '<tr><td colspan=2><button id="btnMeld' + index + '" class="ui-btn ui-btn-b" disabled>Create</button></td></tr>';	
          }
          factoryObj = factoryObj + '</table></td></tr></table><br><br>';
          
          $("#factoryList").append(factoryObj);

          $("#btnMeld" + index)
            .click(function (event) {
                event.preventDefault();
				myApp.confirm('Are you sure?', 'Terror Cards', function () {
        			//factory_meldButton(factoryInfo);
        			$(event.target).html("Processing");
        			$(event.target).attr("disabled", true);
        			callServer("meldFactoryItem", factoryInfo, gUser.ID, factory_showResults);	
    			});


            });

      });
  }
  
}

function factory_meldButton(pPackInfo) { 
	if(parseInt(pPackInfo.Cost) <= parseInt(gUser.Credit)) {
    	var packOrder = {'packID':pPackInfo.ID,'packName':pPackInfo.Name,'userID':gUser.ID, 'packSets': pPackInfo.Set, 'packChase': pPackInfo.Chase, 'packCost': pPackInfo.Cost, 'packPer': pPackInfo.PerPack};

    	callServer("packsOrder", packOrder, gUser.ID, market_showPackResults);		
	} else {
		myApp.alert("Sorry, not enough credit ", 'Terror Cards');
	} 
}

function factory_showResults(pPackResults) {
	var width = ($( document ).width() - 50);
	$("#market_packResult").text('');
  if(pPackResults.length > 0) {
    $.each(pPackResults, function( index, value ) {
		$("#market_packResult").append('<img src="' + value.Image + '" alt="image" width="'+width+'" /><br><br>');    	
    });
    myApp.popup('.pack-result');
  } 
  
  ShowFactory(gUser.ID);       
}

function market_clearMarketResult() {
	$("#market_packResult").text('');
	$("#market_packResult").css("display","none");	
}



function ShowHelpAlert(type) {
    switch(type) {
        case "TradeList": {
            var msg = "If you see a white counter, you are receving/giving more than 1.<br><br>";
            msg = msg + "Red counter shows how many you own on your side, and how many they own on their side.<br><br>";
            msg = msg + "You have 24 hours to accept or reject the trade. Trades get automatically cancelled after 24 hours.<br><br>";
            msg = msg + "If atleast 1 card from either side is involved in another trade, and that trade is accepted, this trade will automatically be cancelled.<br><br>";
            myApp.alert(msg, 'Trade Help');
            break;
        }
        case "TradeSetup": {
            var msg = "Please review the 2 instructions on the trade screen.<br><br>";
            msg = msg + "You can give and/or receive up to 9 distinct cards on either side of the trade.";
            msg = msg + "Of those 9 cards, you can trade as many of them as you own.<br><br>";
            msg = msg + "<div style='font-weight:bold'>Tips for successful trades:</div>";
            msg = msg + "<div style='padding-bottom:5px; text-align:left'>1) Keep card counts similiar.</div>";
            msg = msg + "<div style='padding-bottom:5px; text-align:left'>2) Keep the type the same (insert for insert, base for base).</div>";
            msg = msg + "<div style='padding-bottom:5px; text-align:left'>3) Awards(usually has a crown logo) even if higher card count than a non award, usually demand more in trade.</div>";
            myApp.alert(msg, 'Trade Setup Help');
            break;
        }        
        case "Home": {
            var tableObj = "<table width='100%'>";
            tableObj = tableObj + "<tr><td style='background-color:#000'><img src='images/tradearrow.png' width='20'></td><td style='text-align:left; padding-left:3px'> Offer a trade to this member.</td></tr>";
            tableObj = tableObj + "<tr><td style='background-color:#000'><img src='images/addperson.png' width='20'></td><td style='text-align:left; padding-left:3px'> Add member as a friend.</td></tr>";
            tableObj = tableObj + "<tr><td style='background-color:#000'><img src='images/icons/white/flag.png' width='20'></td><td style='text-align:left; padding-left:3px'> Flag this post to the administrator.</td></tr>";
            tableObj = tableObj + "<tr><td style='background-color:#000'><img src='images/icons/white/remove.png' width='20'></td><td style='text-align:left; padding-left:3px'> Do not see post from this member.</td></tr>";            
            tableObj = tableObj + "</table>";
            var tableObj2 = "<table width='100%'>";
            tableObj2 = tableObj2 + "<tr><td>LF:</td><td style='text-align:left; padding-left:3px'> Looking For</td></tr>";
            tableObj2 = tableObj2 + "<tr><td>FT:</td><td style='text-align:left; padding-left:3px'> For Trade</td></tr>";
            tableObj2 = tableObj2 + "<tr><td>CC:</td><td style='text-align:left; padding-left:3px'> Card Count</td></tr>";
            tableObj2 = tableObj2 + "<tr><td style='vertical-align:top;'>Dupe:</td><td style='text-align:left; padding-left:3px'> Duplicates (more than 1)</td></tr>";           
            tableObj2 = tableObj2 + "<tr><td style='vertical-align:top;'>Hoard:</td><td style='text-align:left; padding-left:3px'> Obtaining as many copies of a certain card</td></tr>";             
            tableObj2 = tableObj2 + "</table>";            
            var msg = "For each member's post, below is actions you can perform:<br>";
            msg = msg + tableObj;
            msg = msg + "<br><br>Common abbreviations:<br>";
            msg = msg + tableObj2;
            myApp.alert(msg, 'Help Guide');
            break;
        } 
        case "Factory": {
            var msg = "The Factory lets you combine cards for special edition cards<br><br>";
            msg = msg + "The large card on the left is the card you are trying to obtain. The cards on the right are the ingrediants to obtain the left card. ";
            msg = msg + "There are 2 numbers in the right group of cards. First number is the amount you own. The second number is the amount you need.<br><br>";
            msg = msg + "If you meet the requirements, the button to attempt a meld will enabled. The percentage shows you, your chance successful chance. ";            
            msg = msg + "All attempts will permenantly remove the ingredient cards from your account.";             
            myApp.alert(msg, 'Trade Help');
            break;
        } 
        case "Gallery": {
            var msg = "This is where you view your cards and all the others in the app.<br><br>";
            msg = msg + "If you toggle from Owned to All in the first option, any card you are missing will show up with a washed out effect.<br><br>";
            msg = msg + "<li>Double tap on a card to show card in full size.</li><br>"; 
            msg = msg + "<li>Once in full view, tap to view the back of the card.</li><br>"; 
            msg = msg + "<li>Card Count displays the total amount of the cards owned by the community members.</li>";            
            myApp.alert(msg, 'Gallery Help');
            break;
        } 
        case "Market": {
            var msg = "These are the available pack of cards to purchase.<br><br>";
            msg = msg + "Each pack contains base/common cards and possibly rare insert/chase cards.<br>";
            msg = msg + "Odds to get the rare insert is stated. For example, 1 in 10 packs means within opening 1 to 10 packs, you will get the insert.<br><br>"; 
            msg = msg + "You can purchase addition credit by tapping on the circle plus icon next to your credit balance.<br>"; 
            msg = msg + "Making any credit purchase unlocks the Pandora's Box pack which contains all available inserts (uness otherwise specified) at reduced odds.";            
            myApp.alert(msg, 'Market Help');
            break;
        }                               
    }	

}



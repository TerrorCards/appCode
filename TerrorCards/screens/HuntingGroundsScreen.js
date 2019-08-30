import React from 'react';
import { ScrollView, StyleSheet, FlatList, View, Image, Text, Dimensions, Alert, TouchableOpacity, 
	TouchableWithoutFeedback, ImageBackground, Button, Platform, TextInput, AsyncStorage } from 'react-native';
import GridView, { SuperGridSectionList } from 'react-native-super-grid';
import { Overlay } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import HeaderController from './Header';
 
export default class HuntingGroundsScreen extends React.Component {
	static navigationOptions = {
		header: null
		 };

  constructor(props) {
    super(props);
    this.state = {
		setList: [],
		tradeIdHolder: [],
		pendingButtonColor: "#C1C1C1",
		acceptedButtonColor: "#000000",
		cancelledButtonColor: "#000000",
		status: "PENDING",
		overlayerVisible: false,
		overlayImage: "",
		messageVisible: false,
		tradeMessageHolder: [],
		messageTextInput: "",
		showMessages: [],
		activeTradeID: 0,
		userId: null,
		userProfile: null,

		opponentSelected: false,
		opponentList: [],
		battleCount: 5
    };
  }
 
  componentWillMount() {

	//this._retrieveData();

  }
 
  componentDidMount() {
	
  }
 
  	render() { 

		let showbattleView = () => {
			return(<View style={{flexDirection: "column", flex:1}}>
			<View style={{flexDirection: "column", flex:1}}>
				<View style={{flexDirection: "row", flex:2}}>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#ccc", justifyContent: 'flex-end', alignItems:"center"}}>
						<Text>{"My Name"}</Text>
					</View>
				</View>
				<View style={{flexDirection: "row", flex:1}}>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#fff", justifyContent: 'flex-end', alignItems:"center"}}>
						<Text>{"Attack"}</Text>
						<Text>{"100"}</Text>
					</View>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#f00", justifyContent: 'flex-end', alignItems:"center"}}>
						<Text>{"Defense"}</Text>
						<Text>{"100"}</Text>							
					</View>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#0f0", justifyContent: 'flex-end', alignItems:"center"}}>
						<Text>{"Life"}</Text>
						<Text>{"100"}</Text>							
					</View>	
				</View>						
			</View>
			<View style={{flexDirection: "row", flex:2, alignContent:"center"}}>
				<View style={{flexDirection: "column", flex:1, backgroundColor:"#990000", justifyContent:"center", alignItems:"center"}}>
					<Image style={{width: (Dimensions.get('window').width/3)-30, height: 200}} source={{uri:"http://gisgames.com/CardTemplate/images/TerrorCards.png"}}/>
				</View>
				<View style={{flexDirection: "column", flex:1, backgroundColor:"#990000", justifyContent:"center", alignItems:"center"}}>
					<Image style={{width: (Dimensions.get('window').width/3)-30, height: 200}} source={{uri:"http://gisgames.com/CardTemplate/images/TerrorCards.png"}}/>
				</View>	
				<View style={{flexDirection: "column", flex:1, backgroundColor:"#990000", justifyContent:"center", alignItems:"center"}}>
					<Image style={{width: (Dimensions.get('window').width/3)-30, height: 200}} source={{uri:"http://gisgames.com/CardTemplate/images/TerrorCards.png"}}/>
				</View>											
			</View>
			<View style={{flexDirection: "column", flex:1}}>					
				<View style={{flexDirection: "row", flex:1}}>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#fff", alignItems:"center"}}>
						<Text>{"100"}</Text>
						<Text>{"Attack"}</Text>
					</View>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#f00", alignItems:"center"}}>
						<Text>{"100"}</Text>
						<Text>{"Defense"}</Text>							
					</View>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#0f0", alignItems:"center"}}>
						<Text>{"100"}</Text>
						<Text>{"Life"}</Text>							
					</View>	
				</View>
				<View style={{flexDirection: "row", flex:2}}>
					<View style={{flexDirection: "column", flex:1, backgroundColor:"#ccc", justifyContent: 'flex-start', alignItems:"center"}}>
						<Text>{"Their Name"}</Text>
					</View>
				</View>						
			</View>										
		</View>	);
		}

		let showOpponentSelect =() => {
			return(<ScrollView style={{flex:1}}>
			<View style={{flexDirection: "column", flex:1}}>
			<View key={1} style={{flexDirection: "row", flex:1, alignContent:"center", paddingTop:10, paddingBottom:10}}>
				<Text style={{color:"#fff", fontSize:14, alignContent:"center"}}>{"Select Your Opponent"}</Text>
			</View>
			{this.generateOpponentList()}								
			</View>
			</ScrollView>);			
		}


		return (
			<View style={{flex:1}}>
				<ImageBackground
				style={{flex: 1}}
				source={require('../assets/images/tc_app_bg.jpg') }
				>
				{(this.state.opponentSelected)?showbattleView():showOpponentSelect()}			
				
				</ImageBackground>
			</View>
		);
	}
 
	generateOpponentList =() => {
		let list = [];
		list.push(
		<View key={1} style={{flexDirection: "row", flex:2, alignContent:"center"}}>
			<View style={{flexDirection: "column", flex:1, backgroundColor:"#990000", justifyContent:"center", alignItems:"center"}}>
				<Image style={{width: 50, height: 50}} source={{uri:"http://gisgames.com/CardTemplate/images/TerrorCards.png"}}/>
			</View>
			<View style={{flexDirection: "column", flex:1, backgroundColor:"#990000", justifyContent:"center", alignItems:"center"}}>
				<Text>{"opponent Name"}</Text>
			</View>	
			<View style={{flexDirection: "column", flex:1, backgroundColor:"#990000", justifyContent:"center", alignItems:"center"}}>
				<TouchableWithoutFeedback onPress={() => {this.warnBattleCost()}}> 
				<Text>{"start battle"}</Text>
				</TouchableWithoutFeedback>
			</View>						
		</View>										
		);	
		return list;	
	}

	onCloseOverlay =() => {
		this.setState({overlayImage:"", overlayerVisible:false, messageVisible: false, showMessages: [], messageTextInput: ""});
	}
	
	warnBattleCost =() => {
        Alert.alert(
			'Terror Cards',
			"This will cost you 1 battle, proceed?",
			[{text: 'OK', onPress: () => this.setState({opponentSelected:true})},],
			{cancelable: true},
		  ); 		
	}
	
    //end
}
 
const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  paddingTop: 0
	},
	overlayContainer: {
		flex: 1,
		alignItems: "center"
	},
	flexRow: {
		flexDirection: "row"
	},
	scrollViewSize: {
		flex: 0
	},
	imageSize: {
		width: 75,
		height: 100
	},
	halfWidth: {
		width: Dimensions.get('window').width / 2
	},
	halfRow1: {
		width: Dimensions.get('window').width / 2,
		backgroundColor: "#aaa"
	},
	halfRow2: {
		width: Dimensions.get('window').width / 2,
		backgroundColor: "#fff"
	},	
	tradeRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: 'center'
	},
	tradeCol: {
		flex: 1,
		flexDirection: "column",
		paddingBottom: 10,
		paddingTop: 5
	},
	tradeViewButtons: {
		paddingTop: 35,
		paddingBottom: 5,
		width: Dimensions.get('window').width,
		flexDirection: "row",
		alignItems: 'center'
	},
	thirdView: {
		width: Dimensions.get('window').width / 3,
		alignItems: 'center'
	},
	flex1: {
		flex: 1,
		alignItems: 'center'
	},	
	tradePartner: {
		backgroundColor: "#000000",
		height: 30,
		flexDirection: "row",
		flex: 1
	},
	tradePartnerTextHolder: {
		width: Dimensions.get('window').width - 75
	},	
	tradePartnerText: {
		color: "#ffffff",
		fontSize: 18
	},
	tradeMessageCount: {
		color: "#ffffff",
		fontSize: 18,
		paddingLeft: 5
	},	
	tradePartnerMessageIcon: {
		width: 75
	},
	fullImage: {
		width: Dimensions.get('window').width - 50,
		height: Dimensions.get('window').height - 50
	},
	closeIcon: {
		position: "absolute",
		top: 25,
		right: 10
	},
	msgListHolder: {
		paddingTop: 110
	},		
	msgActionHolder: {
		top: 75,
		height: 100		
	},
	tempCardCount: {
		    backgroundColor: '#fff',
		    borderRadius: 3
	}	
});

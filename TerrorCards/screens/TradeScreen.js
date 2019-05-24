import React from 'react';
import { ScrollView, StyleSheet, FlatList, View, Image, Text, Dimensions, Alert, TouchableOpacity, 
	TouchableWithoutFeedback, ImageBackground, Button, Platform, TextInput, AsyncStorage } from 'react-native';
import GridView, { SuperGridSectionList } from 'react-native-super-grid';
import { Overlay } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import HeaderController from './Header';
 
export default class TradeScreen extends React.Component {
	static navigationOptions = {
		header: null
		 };

  constructor(props) {
    super(props);
    this.state = {
		setList: [],
		tradeIdHolder: [],
		pendingButtonColor: "#000000",
		acceptedButtonColor: "#C1C1C1",
		cancelledButtonColor: "#C1C1C1",
		status: "PENDING",
		overlayerVisible: false,
		overlayImage: "",
		messageVisible: false,
		tradeMessageHolder: [],
		messageTextInput: "",
		showMessages: [],
		activeTradeID: 0,
		userId: null,
		userProfile: null
    };
  }
 
  componentWillMount() {
    //pull your card list
    //pull other card list
    //this.clickTimeout = null;
    //this._getData();
	this._retrieveData();
	//this.requestTrades({"task":"showTrades", "status":this.state.status, "userId":this.state.userId});
	//this.requestTradeMessages(this.state.status);
  }
 
  componentDidMount() {

    const {navigation} = this.props;
    navigation.addListener ('willFocus', () => {
      if(this.state.userProfile !== null) {
        this._requestProfile(); 
      }
    });	
  }
 
  	render() { 
		let filterByUser = [];
		let filterByOther = [];
		let arrTrades = [];
		let tradeList =() => {
			if(this.state.tradeIdHolder.length > 0) {
				this.state.tradeIdHolder.map((tradeID, index) => {
					let msgCount = 0; 
					if(this.state.tradeMessageHolder.length > 0) {
						let tradeMsg = this.state.tradeMessageHolder.filter((msg) => {
							if(tradeID == msg.ID) {
								return msg;
							}
						});
						msgCount = tradeMsg.length;
					}
					let filterByID = this.state.setList.filter((tradeItem) => {
						//console.log(tradeItem); 
						if(tradeID == tradeItem.tradeID) {
							return tradeItem;
						}
					});										
					filterByUser = filterByID.filter((byUser) => {
						if(byUser.userID == this.state.userId) {
							return byUser;
						}
					});					
					filterByOther = filterByID.filter((byUser) => {
						if(byUser.userID != this.state.userId) {
							return byUser;
						}
					});	
					let buttonsSection =(tradeID) => {
						if(this.state.status == "PENDING") {
							return(<View key={index+"button"} style={styles.tradeRow}>
							<View style={styles.halfRow1}>
								<Button
									style={styles.halfWidth}
									onPress={() => {
										Alert.alert('Terror Cards','Accept Trade',
										[
											{text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
											{text: 'Yes', onPress: () => {this.executeTrade(tradeID)}, style: 'cancel'},
										],
										{ cancelable: false }
										)}}
										title={"ACCEPT"}
										color="#228B22"
								/> 
							</View>
							<View style={styles.halfRow1}>
								<Button
									style={styles.halfWidth}
									onPress={() => {
										Alert.alert('Terror Cards','Cancel Trade',
										[
											{text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
											{text: 'Yes', onPress: () => {this.cancelTrade(tradeID)}, style: 'cancel'},
										],
										{ cancelable: false }
										)}}
										title={"CANCEL"}
										color="#FF0000"
								/> 
							</View>								 								
						</View>);
						}
					}
					if(filterByUser.length > 0 || filterByOther.length > 0) {
						let other = "";
						if(filterByOther.length > 0) {
							other = filterByOther[0].userID;
						}
						arrTrades.push(
							<View key={index} style={styles.tradeCol}>
								<View style={styles.tradePartner}>
									<View style={styles.tradePartnerTextHolder}>
										<Text style={styles.tradePartnerText}>{"Trade with " + other}</Text>
									</View>
									<View style={styles.tradePartnerMessageIcon}>
										<TouchableWithoutFeedback onPress={() => {this.showTradeMessages(filterByID[0].tradeID)}}>
										<View style={styles.flexRow}>
										<Icon
											name={Platform.OS === "ios" ? "ios-chatboxes" : "md-chatboxes"}
											color="#fff"
											size={30}
										/>  
										<Text style={styles.tradeMessageCount}>{msgCount}</Text>
										</View>
										</TouchableWithoutFeedback> 
									</View>
								</View>
								<View key={index+"cards"} style={styles.tradeRow}>
									<View key={index+"yours"} style={styles.halfRow1}>
										<Text>{"You will give up"}</Text>
										<GridView key={index}
										itemDimension={75}
										items={filterByUser}
										renderItem={item => (
										<View>
											<TouchableWithoutFeedback onPress={() => {this._getFullCard(item.cardImage);}}>
												<Image key={item.itemId} source={{uri: item.cardImage }} style={styles.imageSize} resizeMode={'contain'}/>
											</TouchableWithoutFeedback>
											<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width:30, height:20, alignContent:"center"}}>
												<Text style={styles.tempCardCount}>{item.cardCount}</Text>
											</View>
										</View>
										)}
										/>
									</View>
									<View key={index+"other"} style={styles.halfRow2}>
										<Text>{"You will receive"}</Text>
										<GridView key={index}
											itemDimension={75}
											items={filterByOther}
											renderItem={item => (
											<View>
												<TouchableWithoutFeedback onPress={() => {this._getFullCard(item.cardImage);}}>
													<Image key={item.itemId} source={{uri: item.cardImage }} style={styles.imageSize} resizeMode={'contain'}/>
												</TouchableWithoutFeedback>
												<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width:30, height:20, alignContent:"center"}}>
													<Text style={styles.tempCardCount}>{item.cardCount}</Text>
												</View>
											</View>
											)}
											/>								
									</View>
								</View>	
								{buttonsSection(tradeID)}
							</View>					
						);				
					}
				});
			}
			return arrTrades;
		}
		let messageBlocks =() => {
			let msgArray = [];
			if(this.state.showMessages.length > 0) {
				this.state.showMessages.map((msg, index)  => {
					msgArray.push(<Text key={index}>{msg.Member + " : " + msg.Message}</Text>);
				});
			}
			return msgArray;
		}
		return (
			<View style={styles.container}>
				<ImageBackground
				style={{flex: 1}}
				source={require('../assets/images/tc_app_bg.jpg') }
				>  
				<HeaderController userId={this.state.userId} userProfile={this.state.userProfile} />
					<View style={styles.tradeViewButtons}>
					<View style={{flex:1}}>
						<Button
						 style={styles.flex1}
							onPress={() => {this.viewTradeList('PENDING');}}
							title={"PENDING"}
							color={this.state.pendingButtonColor}
						/>
					</View>
					<View style={{flex:1}}>
						<Button
						 style={styles.flex1}
							onPress={() => {this.viewTradeList('ACCEPTED');}}
							title={"ACCEPTED"}
							color={this.state.acceptedButtonColor}
						/>
					</View>
					<View style={{flex:1}}>
						<Button
						 style={styles.flex1}
							onPress={() => {this.viewTradeList('CANCELLED');}}
							title={"CANCELLED"}
							color={this.state.cancelledButtonColor}
						/>
					</View>
					</View>																
				<ScrollView style={styles.scrollViewSize}> 
				{tradeList()}
				</ScrollView>
				<Overlay isVisible={this.state.overlayerVisible} fullScreen={true} onBackdropPress={() => this.setState({overlayerVisible: false})} >
					<View style={styles.overlayContainer}>
						<TouchableWithoutFeedback onPress={() => {this.onCloseOverlay()}}>
						<Icon
							name={Platform.OS === "ios" ? "ios-close" : "md-close"}
							color="#ccc"
							size={35}
							style={styles.closeIcon}
							/>  
						</TouchableWithoutFeedback>  					
						<Image source={{uri: this.state.overlayImage }} style={styles.fullImage} resizeMode={'contain'}/>
					</View>
				</Overlay>
				<Overlay isVisible={this.state.messageVisible} fullScreen={true} onBackdropPress={() => this.setState({messageVisible: false})} >
					<View style={styles.overlayContainer}>
						<TouchableWithoutFeedback onPress={() => {this.onCloseOverlay()}}>
						<Icon
							name={Platform.OS === "ios" ? "ios-close" : "md-close"}
							color="#ccc"
							size={35}
							style={styles.closeIcon}
							/>  
						</TouchableWithoutFeedback>  
						<View style={styles.msgActionHolder}>
						<TextInput
        					style={{height: 75, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
        					onChangeText={(text) => this.setState({messageTextInput:text})}
							value={this.state.messageTextInput}
							maxLength = {255}
							multiline = {true}
							numberOfLines = {4}
      					/>
						<Button
						 style={styles.flex1}
							onPress={() => {this.postNewMessage()}}
							title={"New Message"}
							color={"#c9c9c9"}
						/>
						</View>											
						<View style={styles.msgListHolder}><ScrollView>{messageBlocks()}</ScrollView></View>
					</View>
				</Overlay>				
				</ImageBackground>
			</View>
		);
	}
 
	requestTrades = async (params) => {
		let result =  callServer(params.task, params.status, params.userId)
		.then((resp)=>{ return resp.json(); })
		.then((json)=>{ 
			console.log(json); 
			let tradeIdHolder = [];
			let sets = [];
			json.forEach(element => {
				//console.log(element);
				sets.push({
					"tradeID": element.TradeID, 
					"tradeDate": element.TradeDate,
					"tradeOwner": element.TradeOwner,
					"tradeMessages": element.TradeMessage,
					"userID": element.UserID,
					"cardImage": element.Image,
					"cardCount": element.Count,
					"cardNumber": element.Number,
					"cardYear": element.CardYear,
					"itemId": element.ID
				});
				if(tradeIdHolder.indexOf(element.TradeID) <= -1) {
					tradeIdHolder.push(element.TradeID);
					//this.requestTradeMessages(element.TradeID);	
				}
			});
			this.setState({setList: sets, tradeIdHolder: tradeIdHolder},() => {
				//if(this.state.tradeIdHolder.length > 0) {
				//	this.requestTradeMessages(this.state.tradeIdHolder.join(","));
				//}
				tradeIdHolder.map((ti) => {
					this.requestTradeMessages(ti);
				});
			});			
		})
		.catch((error) => { 
		console.error(error);
		});
	}

	requestTradeMessages = async (tradeID) => {
		let result =  await callServer("requestTradeMessages", tradeID, this.state.userId)
		.then((resp)=>{ return resp.json(); })
		.then((json)=>{
			let msg = [...this.state.tradeMessageHolder];
			let removeCurrForRefresh = msg.filter((m) => {
				return (m.ID !== tradeID);
			});
			json.forEach(element => {
				removeCurrForRefresh.push(element);
			});	
			this.setState({tradeMessageHolder: removeCurrForRefresh});		
		})
		.catch((error) => { 
		console.error(error);
		});
	}

	showTradeMessages =(trade) => {
		//console.log(trade);
		if(this.state.tradeMessageHolder.length > 0) {
			let filtered = this.state.tradeMessageHolder.filter((tmh) => {
				return(tmh.ID === trade);
			});
			if(filtered.length > 0) {
				this.setState({showMessages: filtered, messageVisible: true, activeTradeID: trade});
			} else {
				Alert.alert(
					'Terror Cards',
					'No messages for this trade',
					[{text: 'OK', onPress: () => console.log('OK Pressed')},],
					{cancelable: false},
				  ); 
			}
		}
		
	}	

	executeTrade =(trade) => {
		callServer("executeTrade", trade, this.state.userId)
		.then((resp)=>{ return resp.json(); })
		.then((json)=>{ 
			this.requestTrades({"task":"showTrades", "status":this.state.status, "userId":this.state.userId}); 		
		})
		.catch((error) => { 
		console.error(error);
		});
	}

	cancelTrade =(trade) => {
		callServer("cancelTrade", trade, this.state.userId)
		.then((resp)=>{ return resp.json(); })
		.then((json)=>{ 
			this.requestTrades({"task":"showTrades", "status":this.state.status, "userId":this.state.userId}); 		
		})
		.catch((error) => { 
		console.error(error);
		});		
	}

	postNewMessage = async() => {
		if(this.state.messageTextInput !== "") {
			let obj = {
				tradeID: this.state.activeTradeID,
				message: this.state.messageTextInput
			}
			//console.log(obj);
			
			let result =  await callServer("appendTradeMessages", obj, this.state.userId)
			.then((resp)=>{ return resp.json(); })
			.then((json)=>{ 
				this.requestTradeMessages(this.state.activeTradeID);
				this.onCloseOverlay();		
			})
			.catch((error) => { 
			console.error(error);
			});	
					
		}
	}


	viewTradeList = (status) => {
		if(status == "PENDING") {
			this.setState({
				pendingButtonColor: "#000000",
				acceptedButtonColor: "#C1C1C1",
				cancelledButtonColor: "#C1C1C1"
			});
		} else if(status == "ACCEPTED") {
			this.setState({
				pendingButtonColor: "#C1C1C1",
				acceptedButtonColor: "#000000",
				cancelledButtonColor: "#C1C1C1"
			});
		} else {
			this.setState({
				pendingButtonColor: "#C1C1C1",
				acceptedButtonColor: "#C1C1C1",
				cancelledButtonColor: "#000000"
			});			
		}
		this.state.status = status;
		this.requestTrades({"task":"showTrades", "status":status, "userId":this.state.userId});
	}
	 
	processTrade = (action, tradeItem) => {

	}	
 
	//Show card in detail
	_getFullCard =(img) => {
		let fullImg = img.replace("thumbs", "full");
		this.setState({overlayImage: fullImg, overlayerVisible: true});
	}

	onCloseOverlay =() => {
		this.setState({overlayImage:"", overlayerVisible:false, messageVisible: false, showMessages: [], messageTextInput: ""});
	}


	_retrieveData = async () => {
		try {
		  const value = await AsyncStorage.getItem('UserId');
		  if (value !== null) {
			// We have data!!
			this.setState({"userId":value});
			this._requestProfile();
		  }
		} catch (error) {
		   // Error retrieving data
		}
	  }
	
	  _requestProfile = async() => {
		await callServer("userInfo", "", this.state.userId)
		.then((resp)=>{ return resp.json(); })
		.then((json)=>{ 
		  console.log(json);
		  if(json.ID) {
			//valid user
			this.setState({userProfile: json},() => {
				this.requestTrades({"task":"showTrades", "status":this.state.status, "userId":this.state.userId}); 	
			}); 			           
		  } else {
			//no user in DB
			Alert.alert(
			  'Terror Cards',
			  'Sorry, error occurred.',
			  [{text: 'OK', onPress: () => console.log('OK Pressed')},],
			  {cancelable: false},
			);      
		  }
		})
		.catch((error) => { 
		  console.error(error);
		});     
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
		flexDirection: "row"
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

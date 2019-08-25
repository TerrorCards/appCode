import React from 'react';
import {
	ScrollView, StyleSheet, FlatList, View, Image, Text, Dimensions, Alert, ImageBackground,
	Picker, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, Platform, TextInput
} from 'react-native';
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import GridView, { SuperGridSectionList } from 'react-native-super-grid';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';

export default class HuntingGrounds extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: "choosePlayer",
			userList: []
		};
	}

	componentWillMount() {
		//pull your card list
		this.populatePlayerList();
	}

	componentDidMount() {
	}

	render() {

		return (<View style={{ flex: 1 }}>
			{this.pullUserList()}
		</View>);
	}

	requestPlayers = async () => {
		let result = callServer(params.task, params.filter, params.userId)
			.then((resp) => { return resp.json(); })
			.then((json) => {
				console.log(json);


			})
			.catch((error) => {
				console.error(error);
			});
	}

	populatePlayerList =() => {

	}

	pullUserList =() => {
		return(
		  <FlatList
		  data={this.state.userList}
		  renderItem={({ item }) => (
			<View style={styles.msgBlock}> 
			  <View style={styles.imgHolder}>
				<Image source={{uri: item.Image }} style={styles.avatarImg} resizeMode={'contain'}/>
			  </View>
			  <View style={{flex:1}}>
				<Text>{(item.hasOwnProperty("Friend")?item.Friend:item.Block)}</Text>
			  </View>
			  <View style={{width:50, height:50}}>
				<TouchableWithoutFeedback onPress={() => {this.requestTradeSetup(item.Friend)}}>
					<Icon
						name={Platform.OS === "ios" ? "ios-repeat" : "md-repeat"}
						color="#000"
						size={24}
					/> 
				</TouchableWithoutFeedback>            
			  </View>
			  {
				(this.state.userListType === "search") && 
				<View style={{width:50, height:50}}>
				<TouchableWithoutFeedback onPress={() => {this.requestAddFriend(item.Friend)}}>
					<Icon
						name={Platform.OS === "ios" ? "ios-person-add" : "md-person-add"}
						color="#000"
						size={24}
					  /> 
				</TouchableWithoutFeedback>
				</View>            
			  }
			  {(this.state.userListType !== "search") &&
			  <View style={{width:50, height:50}}>
				<TouchableWithoutFeedback onPress={() => {
				  (item.hasOwnProperty("Friend")?this.requestRemoveFriend(item.Friend):this.requestRemoveBlock(item.Block))
				}}>
					<Icon
						name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
						color="#000"
						size={24}
					  /> 
				</TouchableWithoutFeedback>
			  </View>
			  }
			</View>
		  )} 
		  keyExtractor={item => (item.hasOwnProperty("Friend")?item.Friend:item.Block)}
		  ItemSeparatorComponent={this.renderSeparator}
		/>
		);    
	  }


	_showAlert = (msg) => {
		Alert.alert(
			'Trade Message',
			msg,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false }
		);

	}

	//end
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		backgroundColor: '#fff',
		alignItems: 'center'
	},
	pickerContainer: {
		flex: 1,
		height: 50,
		flexDirection: "row",
		backgroundColor: "#f00"
	},
	progressContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#00f"
	},
	progressWant: {
		width: Dimensions.get('window').width / 3,
		height: 35,
		backgroundColor: "#0f0"
	},
	progressGive: {
		width: Dimensions.get('window').width / 3,
		height: 35,
		backgroundColor: "#ccc"
	},
	progressSum: {
		width: Dimensions.get('window').width / 3,
		height: 35,
		backgroundColor: "#ccc"
	},
	horizontalScrollContainer: {
		height: 75,
		width: Dimensions.get('window').width
	},
	tempThumbnailImage: {
		width: 50,
		height: 75
	},
	tempThumbnailView: {
		height: 100,
		width: 75,
		backgroundColor: '#c1c1c1',
		borderColor: '#000',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	tempThumbHolder: {
		flex: 1,
		flexDirection: 'row',
		height: 100
	},
	tempCardCount: {
		backgroundColor: '#fff',
		borderRadius: 3
	},
	fullWidth: {
		width: Dimensions.get('window').width
	},

	packImage: {
		width: 180,
		height: 252
	},
	packView: {
		width: 200,
	},
	descriptionView: {
		flex: 1,
		flexDirection: "column",
		alignItems: 'center',
	},
	textView: {
		flex: 1,
		flexDirection: "column"
	},
	buttonView: {
		flex: 0,
		flexDirection: "column"
	},
	buttonItem: {
		backgroundColor: "rgba(0,0,0, 1)",
		width: 100,
		height: 50,
		borderColor: "transparent",
		borderWidth: 0,
		borderRadius: 5,
		bottom: +25
	},
	imageSize: {
		width: 65,
		height: 90
	},

	tradeRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: 'center'
	},

	halfRow1: {
		width: Dimensions.get('window').width / 2,
		backgroundColor: "#aaa",
		flex: 1
	},
	halfRow2: {
		width: Dimensions.get('window').width / 2,
		backgroundColor: "#fff",
		flex: 1
	},

});


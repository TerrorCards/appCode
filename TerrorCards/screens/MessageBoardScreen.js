import React from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, Image, Platform, TouchableWithoutFeedback, Modal, AsyncStorage, Alert, ImageBackground} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import TradeSetupScreen from './TradeSetupScreen';
 
export default class MessageBoardScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      overlayerVisible: false,
      modalVisible: false,
      targetPerson: ""
    };

    this.arrayholder = [];
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: Dimensions.get('window').width - 10,
          backgroundColor: '#CED0CE',
          marginLeft: 25,
        }}
      />
    );
  };

  componentDidMount(){
    this.requestMessages({"task":"messagesFull", "count": "5", "type":this.props.type, "userId":this.props.userId});   
  }

  render() {

    return (
      <View>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View style={styles.msgBlock}> 
              <View style={styles.imgHolder}>
                <Image source={{uri: item.img }} style={styles.avatarImg} resizeMode={'contain'}/>
              </View>
              <View style={styles.msgTextHolder}>
                <Text>{item.name}</Text>
                <Text style={styles.bottomPadder}>{item.msg}</Text>
                <View style={styles.msgActionHolder}>
                  {(this.props.userId !== item.name) && 
                    <View style={styles.actionSpacer}>
                    <TouchableWithoutFeedback onPress={() => {this.requestTradeSetup(item.name)}}>
                    <Icon
                        name={Platform.OS === "ios" ? "ios-repeat" : "md-repeat"}
                        color="#000"
                        size={24}
                    /> 
                    </TouchableWithoutFeedback>
                    </View>                  
                  }
                  {(this.props.userId !== item.name) && 
                  <View style={styles.actionSpacer}>
                    <TouchableWithoutFeedback onPress={() => {this.requestAddFriend(item.name)}}>
                    <Icon
                        name={Platform.OS === "ios" ? "ios-person-add" : "md-person-add"}
                        color="#000"
                        size={24}
                      /> 
                    </TouchableWithoutFeedback>  
                  </View> 
                  }
                  {(this.props.userId !== item.name) && 
                  <View style={styles.actionSpacer}>
                    <TouchableWithoutFeedback onPress={() => {this.requestFlagComment(item.name, item.msg)}}>
                    <Icon
                        name={Platform.OS === "ios" ? "ios-flag" : "md-flag"}
                        color="#000"
                        size={24}
                      /> 
                    </TouchableWithoutFeedback>
                  </View>
                  }
                  <View style={styles.actionSpacer}>
                    <TouchableWithoutFeedback onPress={() => {this.requestBlockUser(item.name)}}>
                    <Icon
                        name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
                        color="#000"
                        size={24}
                      /> 
                    </TouchableWithoutFeedback>
                  </View>                                                     
                </View>
              </View>
            </View>
          )} 
          keyExtractor={item => item.date+item.name}
          ItemSeparatorComponent={this.renderSeparator}
        />  
        <Modal
          animationType="slide"
          transparent={false}
          backdropOpacity={0.1}
          visible={this.state.modalVisible}
          swipeToClose={false}
          onRequestClose={() => {
            this.setState({modalVisible:false});
          }}>
          <View style={{marginTop: 0, marginLeft:0, flex:1}}>
            <ImageBackground
            style={{flex: 1}}
            source={require('../assets/images/tc_app_bg.jpg') }
            >
            <View style={{flex:1}}>
              <TradeSetupScreen closeCallBack={this.closeModal} partner={this.state.targetPerson} userId={this.props.userId} />
            </View>
            </ImageBackground>
          </View>
        </Modal>              
        </View>
    );
  }

  requestMessages =(params) => {
    let result =  callServer(params.task, params.type, params.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      let msgList = [];
      json.forEach(element => {   
        msgList.push({ name: element.ID, img: element.Image, msg: element.Text, date: element.Timestamp, key: element.Timestamp});
      })
      this.setState({data: msgList});     
    })
    .catch((error) => { 
      console.error(error);
    });
  }

  onCloseOverlay =() => {
		this.setState({overlayerVisible:false});
  }
 
  requestTradeSetup =(targetPerson) => {
    if(this.props.validPost === "0") {
      this.setState({modalVisible: true, targetPerson: targetPerson})
    } else {
      Alert.alert(
        'Terror Cards',
        'Sorry, your account is suspended and not allowed to trade',
        [{text: 'OK', onPress: () => console.log('OK Pressed')},],
        {cancelable: false},
      ); 
    }
  }  


  requestAddFriend =(params) => {
    let sendParam = {friend: params};
    let result =  callServer("addFriend", sendParam, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      if(json === "success") {
        Alert.alert(
          'Terror Cards',
          'New friend (' + params + ') has been added',
          [{text: 'OK'}],
          { cancelable: false }
        );  
      } else {
        Alert.alert(
          'Terror Cards',
          'Sorry, failed to add person',
          [{text: 'OK'}],
          { cancelable: false }
        );          
      }   
    })
    .catch((error) => { 
      Alert.alert(
        'Terror Cards',
        'Sorry, an error occurred.',
        [{text: 'OK'}],
        { cancelable: false }
      );       
      console.error(error);
    });   
  }

  requestBlockUser =(user) => {
    let sendParam = {block: user};
    let result =  callServer("insertBlockPlayer", sendParam, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      //console.log(json);
      if(json === "success") {
        Alert.alert(
          'Terror Cards',
          'No longer seeing message from ' + user,
          [{text: 'OK'}],
          { cancelable: false }
        );
        this.requestMessages({"task":"messagesFull", "count": "5", "type":this.props.type, "userId":this.props.userId});  
      } else {
        Alert.alert(
          'Terror Cards',
          'Sorry, unable to block person, try again',
          [{text: 'OK'}],
          { cancelable: false }
        );         
      }     
    })
    .catch((error) => { 
      Alert.alert(
        'Terror Cards',
        'Sorry, an error occurred.',
        [{text: 'OK'}],
        { cancelable: false }
      );       
      console.error(error);
    });   
  }

  requestFlagComment =(user, message) => {
    let content = {"area":message, "id":user}
    let result =  callServer("flagComment", content, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      //console.log(json);
      if(json) {
        Alert.alert(
          'Terror Cards',
          'Message has been flagged',
          [{text: 'OK'}],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'Terror Cards',
          'Sorry, unable to flag message, try again',
          [{text: 'OK'}],
          { cancelable: false }
        );       
      }     
    })
    .catch((error) => { 
      console.error(error);
    });   
  }

  closeModal =() => {
    this.setState({modalVisible: false});
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
  msgContainer: {
    backgroundColor: "#aaa",
    borderBottomWidth: 0
  },
  msgBlock: {
    backgroundColor: "#aaa",
    borderBottomWidth: 0,    
    flex: 1,
    flexDirection: "row"
  },
  imgHolder: {
    width: 60,
    height: 60
  },
  avatarImg: {
    width: 50,
    height: 50
  },
  msgTextHolder: {
    width: Dimensions.get('window').width - 60,
    paddingRight: 5
  },
  bottomPadder: {
    paddingBottom: 5
  },
  msgActionHolder: {
    flex: 1,
    flexDirection: "row"
  },
  actionSpacer: {
    width: Dimensions.get('window').width / 4,
    height: 35
  },
  closeIcon: {
    left:5
	},

});

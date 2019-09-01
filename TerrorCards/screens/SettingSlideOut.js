import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
  AsyncStorage,
  CameraRoll,
  PermissionsAndroid,
  Modal,
  Alert,
  Button,
  TextInput,
  FlatList
} from 'react-native';
//import { WebBrowser } from 'expo';
import Icon from "react-native-vector-icons/Ionicons";
import DeviceInfo from 'react-native-device-info';
import HTML from 'react-native-render-html';
import { MonoText } from '../components/StyledText';
import { Overlay } from 'react-native-elements';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import { ImagePicker , Permissions, Constants} from 'expo';
import TradeSetupScreen from './TradeSetupScreen';
import HuntingGroundsScreen from './HuntingGroundsScreen';

export default class SettingSlideOut extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultImage: "http://gisgames.com/CardTemplate/images/skull_default.png",
      photos: [],
      registerModal: false,
      settingsOverlay: false,
      contactusModal: false,
      newsModal: false,
      friendsModal: false,
      huntingGroundsModal:false,
      userNameInput: "",
      userPasswordInput: "",
      userEmailInput: "",
      messageTextInput: "",
      news: [],
      userListType: "friends",
      userList: [],
      searchText: "",
      deviceId: null,
      friendsButton: "#000000",
      searchUserButton: "#c1c1c1",
      blockSearchButton: "#c1c1c1",
      tradeModal: false,
      tradeTarget: "",
      avatar: null
    };
  }

  componentWillMount() {
    let id = DeviceInfo.getUniqueID();
    if(id) {
      this.setState({deviceId: id});
    }       
  }

  componentDidMount(){  
  }

  componentWillUpdate() {
  }

  render() {

console.log(this.state.avatar);

    return (
        <View style={styles.headerContainerAndroid}>
                <View style={{height:10}}></View>
                {(parseInt(this.props.profile.Registered) === 0) &&
                  <TouchableWithoutFeedback onPress={() => {this.setState({registerModal:true, userNameInput:"", userPasswordInput:"",userEmailInput:""})}}> 
                  <View style={styles.rowStyle}>
                      <Icon
                      name={Platform.OS === "ios" ? "ios-alert" : "md-alert"}
                      color="#000"
                      size={35}
                      />
                      <Text style={styles.textStyle}>{"Register"}</Text>
                  </View>
                  </TouchableWithoutFeedback>
                }
                <TouchableWithoutFeedback onPress={() => {this._pickImage()}}> 
                <View style={styles.rowStyle}>
                    <Icon
                    name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
                    color="#000"
                    size={35}
                    />
                    <Text style={styles.textStyle}>{"Profile Image"}</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {
                  this._requestNews().then(()=>{
                    this.setState({newsModal:true});
                  })}}>   
                <View style={styles.rowStyle}>
                    <Icon
                    name={Platform.OS === "ios" ? "ios-paper" : "md-paper"}
                    color="#000"
                    size={35}
                    />
                    <Text style={styles.textStyle}>{"News"}</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {this.setState({friendsModal:true},()=>{
                  this.requestCommunityUsers("friends")
                })}}>   
                <View style={styles.rowStyle}>
                    <Icon
                    name={Platform.OS === "ios" ? "ios-people" : "md-people"}
                    color="#000"
                    size={35}
                    />
                    <Text style={styles.textStyle}>{"Friends"}</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {this.showHuntingGrounds()}}> 
                <View style={styles.rowStyle}>
                    <Icon
                    name={Platform.OS === "ios" ? "ios-ribbon" : "md-ribbon"}
                    color="#000"
                    size={35}
                    />
                    <Text style={styles.textStyle}>{"Hunting Grounds"}</Text>
                </View> 
                </TouchableWithoutFeedback> 
                <TouchableWithoutFeedback onPress={() => {this.setState({contactusModal:true, messageTextInput:""})}}>               
                <View style={styles.rowStyle}>               
                    <Icon
                    name={Platform.OS === "ios" ? "ios-mail" : "md-mail"}
                    color="#000"
                    size={35}
                    />
                    <Text style={styles.textStyle}>{"Contact Support"}</Text>                    
                </View> 
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {this.showSignOutPrompt()}}>               
                <View style={styles.rowStyle}>               
                    <Icon
                    name={Platform.OS === "ios" ? "ios-log-out" : "md-log-out"}
                    color="#000"
                    size={35}
                    />
                    <Text style={styles.textStyle}>{"Log Out"}</Text>                    
                </View> 
                </TouchableWithoutFeedback>

                <Modal
                  animationType="slide"
                  transparent={false}
                  backdropOpacity={0.1}
                  visible={this.state.registerModal}
                  swipeToClose={true}
                  onRequestClose={() => {
                    //this._retrieveData();
                  }}>
                  <View style={{marginTop: 0, marginLeft:0, flex:1}}>
                    <View style={styles.overlayContainer}>
                    <TouchableWithoutFeedback onPress={() => {this.setState({registerModal:false, messageTextInput:""})}}>
                    <Icon
                      name={Platform.OS === "ios" ? "ios-close" : "md-close"}
                      color="#ccc"
                      size={35}
                      style={styles.closeIcon}
                      />  
                    </TouchableWithoutFeedback>  					
                    <TextInput
                        style={{height: 30, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1, backgroundColor:"rgba(255,255,255,0.9)", color:"#000000"}}
                        onChangeText={(text) => this.setState({userNameInput:text})}
                        value={this.state.userNameInput} maxLength = {25} placeholder = "Type a fan name"
                      />
                    <TextInput
                        style={{height: 30, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1, backgroundColor:"rgba(255,255,255,0.9)", color:"#000000"}}
                        onChangeText={(text) => this.setState({userPasswordInput:text})}
                        value={this.state.userPasswordInput} maxLength = {25} placeholder = "Type a password"
                      />   
                    <TextInput
                        style={{height: 30, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1, backgroundColor:"rgba(255,255,255,0.9)", color:"#000000"}}
                        onChangeText={(text) => this.setState({userEmailInput:text})}
                        value={this.state.userEmailInput} maxLength = {25} placeholder = "Enter your email"
                      />                                          
                      <View style={{width: Dimensions.get('window').width - 20, paddingTop:5}}>
                        <Button
                          style={{flex:1}}
                          onPress={() => {this.tryRegister()}}
                          title={"Register Account"}
                          color="#c1c1c1"
                        />
                      </View> 
                    </View> 
                  </View>
                </Modal> 

                <Modal
                  animationType="slide"
                  transparent={false}
                  backdropOpacity={0.1}
                  visible={this.state.newsModal}
                  swipeToClose={true}
                  onRequestClose={() => {
                    //this._retrieveData();
                  }}>
                  <View style={{marginTop: 0, marginLeft:0, flex:1}}>
                  <ImageBackground
                    style={{flex: 1}}
                    source={require('../assets/images/tc_app_bg.jpg') } >                 
                    <View style={styles.overlayContainer}>
                      <TouchableWithoutFeedback onPress={() => {this.setState({newsModal:false})}}>
                      <Icon
                        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
                        color="#ccc"
                        size={35}
                        style={styles.closeIcon}
                        />  
                      </TouchableWithoutFeedback>  					 
                    </View>
                    <View style={{flex:1, paddingLeft:5, paddingRight:5, backgroundColor:"rgba(255,255,255,0.5)"}}>
                      <ScrollView style={{flex:1}} contentContainerStyle={{paddingTop:10}}>
                      {this.pullNews()}
                      </ScrollView>
                    </View>
                    </ImageBackground>
                  </View>
                </Modal>

               <Modal
                  animationType="slide"
                  transparent={false}
                  backdropOpacity={0.1}
                  visible={this.state.huntingGroundsModal}
                  swipeToClose={true}
                  onRequestClose={() => {
                    //this._retrieveData();
                  }}>
                  <View style={{marginTop: 0, marginLeft:0, flex:1}}>
                  <ImageBackground
                    style={{flex: 1}}
                    source={require('../assets/images/tc_app_bg.jpg') } >                 
                    <View style={styles.overlayContainer}>
                      <TouchableWithoutFeedback onPress={() => {this.setState({huntingGroundsModal:false})}}>
                      <Icon
                        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
                        color="#ccc"
                        size={35}
                        style={styles.closeIcon}
                        />  
                      </TouchableWithoutFeedback>  					 
                    </View>
                    <HuntingGroundsScreen userId={this.props.userId} />
                    </ImageBackground>
                  </View>
                </Modal>

                <Modal
                  animationType="slide"
                  transparent={false}
                  backdropOpacity={0.1}
                  visible={this.state.contactusModal}
                  swipeToClose={true}
                  onRequestClose={() => {
                    //this._retrieveData();
                  }}>
                  <View style={{marginTop: 0, marginLeft:0, flex:1}}>
                    <View style={styles.overlayContainer}>
                    <TouchableWithoutFeedback onPress={() => {this.setState({contactusModal:false, messageTextInput:""})}}>
                    <Icon
                      name={Platform.OS === "ios" ? "ios-close" : "md-close"}
                      color="#ccc"
                      size={35}
                      style={styles.closeIcon}
                      />  
                    </TouchableWithoutFeedback>  					
                    <TextInput
                        style={{height: 100, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1, backgroundColor:"rgba(255,255,255,0.9)", color:"#000000"}}
                        onChangeText={(text) => this.setState({messageTextInput:text})}
                        value={this.state.messageTextInput}
                        maxLength = {255}
                        multiline = {true}
                        numberOfLines = {5}
                        placeholder = "Message to send to Support"
                      />
                      <View style={{width: Dimensions.get('window').width - 20, paddingTop:5}}>
                        <Button
                          style={{flex:1}}
                          onPress={() => {this.postMessage()}}
                          title={"Submit Ticket"}
                          color="#c1c1c1"
                        />
                      </View> 
                    </View> 
                  </View>
                </Modal> 

                <Modal
                  animationType="slide"
                  transparent={false}
                  backdropOpacity={0.1}
                  visible={this.state.friendsModal}
                  swipeToClose={true}
                  onRequestClose={() => {
                    //this._retrieveData();
                  }}>
                  <View style={{marginTop: 0, marginLeft:0, flex:1}}>
                  <ImageBackground
                    style={{flex: 1}}
                    source={require('../assets/images/tc_app_bg.jpg') } >                 
                    <View style={{paddingBottom:5}}>
                      <TouchableWithoutFeedback onPress={() => {this.setState({friendsModal:false})}}>
                      <Icon
                        name={Platform.OS === "ios" ? "ios-close" : "md-close"}
                        color="#ccc"
                        size={35}
                        style={styles.closeIcon}
                        />  
                      </TouchableWithoutFeedback>  					 
                    </View>
                    <View style={{flex:1, backgroundColor:"rgba(255,255,255,0.5)"}}>
                      <View style={{flexDirection:"row"}}> 
                        <View style={{flex:1}}>
                          <Button
                          onPress={() => {
                            this.setState({userListType:"friends", userList:[], searchText:"", friendsButton:"#000000", searchUserButton:"#c1c1c1", blockSearchButton:"#c1c1c1"},()=> {
                              this.requestCommunityUsers(this.state.userListType);
                            })
                          }}
                          title={"Your Friends"}
                          color={this.state.friendsButton}
                          accessibilityLabel={"Your Friends"}
                          />                        
                        </View> 
                        <View style={{flex:1}}>
                          <Button
                          onPress={() => {
                            this.setState({userListType:"search", userList:[], searchText:"", friendsButton:"#c1c1c1", searchUserButton:"#000000", blockSearchButton:"#c1c1c1"},()=> {
                              //this.requestCommunityUsers(this.state.userListType);
                            })
                          }}
                          title={"Search Fans"}
                          color={this.state.searchUserButton}
                          accessibilityLabel={"Search Fans"}
                          />                       
                        </View>
                        <View style={{flex:1}}>
                          <Button
                          onPress={() => {
                            this.setState({userListType:"blocked", userList:[], searchText:"", friendsButton:"#c1c1c1", searchUserButton:"#c1c1c1", blockSearchButton:"#000000"},()=> {
                              this.requestCommunityUsers(this.state.userListType);
                            })
                          }}
                          title={"Blocked"}
                          color={this.state.blockSearchButton}
                          accessibilityLabel={"Blocked"}
                          />                         
                        </View>                                                 
                      </View>
                      <View>
                        <TextInput
                          style={{height: 40, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, backgroundColor:"rgba(255,255,255,0.9)", color:"#000000"}}
                          onChangeText={(text) => {
                            this.setState({searchText:text},() => {
                              this.requestCommunityUsers(this.state.userListType);
                            });
                          }}
                          value={this.state.searchText}
                          maxLength = {25}
                          multiline = {false}
                          numberOfLines = {1}
                          placeholder = "Search for users"
                        />
                      </View>
                      {this.pullUserList()}
                    </View>
                    </ImageBackground>
                  </View>
                </Modal>

                <Modal
                  animationType="slide"
                  transparent={false}
                  backdropOpacity={0.1}
                  visible={this.state.tradeModal}
                  swipeToClose={false}
                  onRequestClose={() => {
                    this.setState({tradeModal:false});
                  }}>
                  <View style={{marginTop: 0, marginLeft:0, flex:1}}>
                    <ImageBackground
                    style={{flex: 1}}
                    source={require('../assets/images/tc_app_bg.jpg') }
                    >
                    <View style={{flex:1}}>
                      <TradeSetupScreen closeCallBack={this.closeModal} partner={this.state.tradeTarget} userId={this.props.userId} />
                    </View>
                    </ImageBackground>
                  </View>
                </Modal>

        </View>            
    );
  }

  toggleSettings =() => {
    console.log("here");
    if(this.state.settingsOverlay) {
      this.setState({settingsOverlay:false});
    } else {
      this.setState({settingsOverlay:true});
    }
  }


  tryRegister =async() => {
    //let userData = {user:this.state.userNameInput, password:this.state.userPasswordInput, email:this.state.userEmailInput, device:this.setState.deviceId};
    let userData = {user:this.state.userNameInput, password:this.state.userPasswordInput, email:this.state.userEmailInput, device:123};
    await callServer("registerUser", userData, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      console.log(json);
      if(json.Response !== "Fail") {
        //valid user update async storage and close modal (refresh before close)
        this._storeData(json.Name);
      } else {
        //no user in DB
        Alert.alert(
          'Terror Cards',
          json.Message,
          [{text: 'OK', onPress: () => console.log('OK Pressed')},],
          {cancelable: false},
        );      
      }
    })
    .catch((error) => { 
      console.error(error);
    }); 
  }

  _storeData = async (userId) => {
    try {
      await AsyncStorage.setItem('UserId', userId);
      this.props.callbackRegister();
    } catch (error) {
      // Error saving data
    }
  }

  clearStorage = async() => {
    try {
      await AsyncStorage.removeItem('UserId');
      this.props.callbackRegister();
    } catch (error) {
      // Error saving data
    }    
  }

  showSignOutPrompt =() => {
    Alert.alert(
      'Terror Cards',
      "Are you sure you want to log off?",
      [{text: 'Yes', onPress: () => this.clearStorage()},
      {text: 'No', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );     
  }

  showHuntingGrounds =() => {
    this.setState({huntingGroundsModal:true});
    /*
    Alert.alert(
      'Terror Cards',
      "COMING SOON!",
      [{text: 'OK'}],
      {cancelable: false},
    );
    */     
  }

  _requestNews = async() => {
    await callServer("fetchNews", "", this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      console.log(json);
      if(json) {
        //valid user
        this.setState({news: json});   
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

  pullNews =() => {
    //<View key={i} style={{paddingBottom:15}}><Text>{n.Text}</Text><Text>{n.Timestamp}</Text></View>
    let items = [];
    this.state.news.map((n,i) => {
      items.push(
        <HTML key={i} html={n.Text} imagesMaxWidth={Dimensions.get('window').width} />
      );
    });
    return items;
  }

  requestCommunityUsers = async(type) => {
    let listType="pullFriendsList";
    switch(type) {
      case "search":
        listType = "pullSearchList";
        break;
      case "blocked":
        listType = "pullBlockList";
        break;
      default:
        listType= "pullFriendsList";
        break;
    }
    await callServer(listType, {friend:this.state.searchText}, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      if(json) {
        //valid user
        this.setState({userList: json});   
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

  requestTradeSetup =(targetPerson) => {
    if(this.props.profile.Suspended === "0") {
      if(targetPerson !== this.props.userId) {
        this.setState({tradeModal: true, tradeTarget: targetPerson});
      } else {
        Alert.alert(
          'Terror Cards',
          'Cannot trade to yourself.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')},],
          {cancelable: false},
        );         
      }      
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
        this.requestCommunityUsers("fiends");
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

  requestRemoveFriend=(params) => {
    let sendParam = {friend: params};
    let result =  callServer("deleteFriend", sendParam, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      if(json === "success") {
        Alert.alert(
          'Terror Cards',
          '(' + params + ') has been removed',
          [{text: 'OK'}],
          { cancelable: false }
        );  
        this.requestCommunityUsers("fiends");
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


  requestRemoveBlock=(params) => {
    let sendParam = {block: params};
    let result =  callServer("removeBlockPlayer", sendParam, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      if(json === "success") {
        Alert.alert(
          'Terror Cards',
          '(' + params + ') has been removed',
          [{text: 'OK'}],
          { cancelable: false }
        );  
        this.requestCommunityUsers("blocked");
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

  closeModal =() => {
    this.setState({tradeModal: false});
  }

  _pickImage = async () => {
    let res = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (res.status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: false,
        base64: true,
        quality: 0.5
      });

      if (!result.cancelled) {
        this._requestSaveAvatar(result.base64);
        //this.setState({ avatar: result.uri });
      }
    }
  };

  _requestSaveAvatar = async(img) => {
    let formData = {newImage:img};
    await callServer("updateUserPic", formData, this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      if(json) {
        //valid user
        //this.setState({news: json});  
        Alert.alert(
          'Terror Cards',
          'Avatar upload and image will update shortly',
          [{text: 'OK', onPress: () => console.log('OK Pressed')},],
          {cancelable: false},
        );          
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


}

const styles = StyleSheet.create({
  headerContainerAndroid: {
      height: Dimensions.get('window').height - 135
  },  
  rowStyle: {
      flexDirection: "row",
      height: 50,
      paddingLeft:5
  },
  textStyle: {
      paddingLeft: 5
  },
  imgHolder: {
    width: 60,
    height: 60
  },  
  msgBlock: {
    borderBottomWidth: 0,    
    flex: 1,
    flexDirection: "row"
  },  
  msgActionHolder: {
    flex: 1,
    flexDirection: "row"
  }, 
  avatarImg: {
    width: 50,
    height: 50
  },   
});



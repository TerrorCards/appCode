import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  SafeAreaView,
  Dimensions,
  AsyncStorage,  
  Alert,
  Button,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { WebBrowser } from 'expo';
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import Carousel from 'react-native-snap-carousel';
import { Overlay } from 'react-native-elements';
import HeaderController from './Header';
import LoginScreen from './LoginScreen';
import MessageBoardScreen from './MessageBoardScreen';
import SettingSlideOut from './SettingSlideOut';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';

const CopilotView = walkthroughable(View);

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      settingsOverlay: false,
      messageModal: false,
      messageTextInput: "",
      messageType: "Trade",
      messageTradeButton: "#000",
      messageGeneralButton: "#c1c1c1",
      messageReady:false,
      userId: null,
      userProfile: null,
      sliderWidth: Dimensions.get('window').width,
      itemWidth: Dimensions.get('window').width - 10,
      offset: 9,
      slider: [       
        {
          title: 'Beautiful and dramatic Antelope Canyon',
          subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
          illustration: 'http://gisgames.com/terrorcards/news/news_111518_test.jpg'
      },
      {
          title: 'Earlier this morning, NYC',
          subtitle: 'Lorem ipsum dolor sit amet',
          illustration: 'http://gisgames.com/terrorcards/news/news_111918_test.jpg'
      },
      {
        title: 'White Pocket Sunset2',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: 'http://gisgames.com/terrorcards/news/news_112218_test.jpg'
    }        
      ]
    };
  }

  componentWillMount() {
    this._retrieveData();
  }

  componentDidMount() {
    //this.props.start();
    const {navigation} = this.props;
    navigation.addListener ('willFocus', () => {
      if(this.state.userProfile !== null) {
        this._requestProfile(); 
        this.setState({settingsOverlay:false});
      }
    });    
  }

  _renderItem ({item, index}) {
    return (
        <View style={styles.slide}>
          <Image
          key={(new Date()).getTime()}
          style={{width: Dimensions.get('window').width, height: 150}}
          source={{uri: item.illustration + '?time=' + new Date() }}
            />          
        </View>
    );
  }

  render() {
    return (

      <View style={styles.container}>
        <ImageBackground
          style={{flex: 1}}
          source={require('../assets/images/tc_app_bg.jpg') }
          >
          <CopilotStep text="This shows your avatar, rating, and your available credit to spend" order={1} name="header">
          <CopilotView><HeaderController userId={this.state.userId} userProfile={this.state.userProfile} callback={this.toggleSettings} /></CopilotView> 
          </CopilotStep>
          
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

              <CopilotStep text="These are the newest card releases" order={2} name="newReleases">
              <CopilotView>
              <Carousel layout={'default'}
                ref={(c) => { this._carousel = c; }}
                data={this.state.slider}
                renderItem={this._renderItem}
                sliderWidth={Dimensions.get('window').width}
                sliderHeight={150}
                itemWidth={(Dimensions.get('window').width)}
                firstItem={0}
                loop={true}
                autoplay={true}
              />
              </CopilotView>
              </CopilotStep>

              <CopilotStep text="This is a preview of the community chat. Use this to offer trades" order={3} name="messageBoard">
              <CopilotView>
              <View style={{width: Dimensions.get('window').width}}>
                <View style={styles.messageBoardType}>
                  <View style={{flex:1}}>
                    <Button
                      onPress={() => {
                        this.setState({messageReady:false},() => {
                          this.setState({messageReady:true, messageType:"Trade", messageTradeButton:"#000", messageGeneralButton:"#c1c1c1"});  
                        });                       
                      }}
                      title={"Trade chat"}
                      color={this.state.messageTradeButton}
                    />                     
                  </View>
                  <View style={{flex:1}}>
                    <Button
                      onPress={() => {
                        this.setState({messageReady:false},() => {
                          this.setState({messageReady:true, messageType:"General", messageTradeButton:"#c1c1c1", messageGeneralButton:"#000"});
                        });
                      }}
                        title={"General chat"}
                        color={this.state.messageGeneralButton}
                    />                  
                  </View> 
                  <View style={{flex:1, alignContent:"center"}}>
                    <View style={{flex:1, flexDirection: "row-reverse", backgroundColor:"#c1c1c1", paddingRight:2}}>
                      <TouchableWithoutFeedback onPress={() => {this.canPost()}}>
                        <Icon
                          name={Platform.OS === "ios" ? "ios-chatboxes" : "md-chatboxes"}
                          color="#fff"
                          size={32}
                        />                    
                      </TouchableWithoutFeedback> 
                    </View>                                       
                  </View>                                                    
                </View>
                <View style={styles.smallMessageBoard}>
                  {this.state.messageReady && <MessageBoardScreen userId={this.state.userId} type={this.state.messageType} validPost={this.state.userProfile.Suspended} />}
                </View>               
              </View>
              </CopilotView>
              </CopilotStep>

          </ScrollView>
        </ImageBackground>

        <Modal
          animationType="slide"
          transparent={false}
          backdropOpacity={0.1}
          visible={this.state.modalVisible}
          swipeToClose={false}
          onRequestClose={() => {
            this._retrieveData();
          }}>
          <View style={{marginTop: 0, marginLeft:0, flex:1}}>
            <ImageBackground
            style={{flex: 1}}
            source={require('../assets/images/tc_app_bg.jpg') }
            >
            <View style={{flex:1}}>
              <LoginScreen closeCallBack={this._retrieveData} />
            </View>
            </ImageBackground>
          </View>
        </Modal> 

				<Overlay isVisible={this.state.messageModal} fullScreen={true} onBackdropPress={() => {}} >
          <ImageBackground
            style={{flex: 1}}
            source={require('../assets/images/tc_app_bg.jpg') }
            >
					<View style={styles.overlayContainer}>
						<TouchableWithoutFeedback onPress={() => {this.setState({messageModal:false, messageTextInput:""})}}>
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
								placeholder = "Post a message to the board"
							/>
              <View style={{width: Dimensions.get('window').width - 20, paddingTop:5}}>
                <Button
                  style={{flex:1}}
                  onPress={() => {this.postMessage()}}
                  title={"Submit Post"}
                  color="#c1c1c1"
                />
              </View>  
					</View>
          </ImageBackground>
				</Overlay>

        <Modal
          animationType="slide"
          visible={this.state.settingsOverlay}
          hasBackdrop={true}
          backdropColor={"#000"}
          backdropOpacity={0.70}
          swipeThreshold={100}
          swipeDirection={['left']}
          onBackdropPress ={() => {this.toggleSettings()}}  
          onSwipeComplete={() => {this.toggleSettings()}}          
          onRequestClose={() => {
            this.toggleSettings();
          }}>
            <View style={{width:250, height:Dimensions.get('window').height - 75, backgroundColor:"rgba(255,255,255,0.9)", top:5}}>
            <SettingSlideOut profile={this.state.userProfile} userId={this.state.userId} callback={this.closeSettingsOverlay} callbackRegister={this.closeFromRegister} />
            </View>
        </Modal>


      </View>

    );
  }
/*
          <Overlay isVisible={this.state.settingsOverlay} fullScreen={true} onBackdropPress={() => {alert("here");this.toggleSettings();}} windowBackgroundColor="rgba(0, 0, 0, .5)" overlayBackgroundColor="rgba(0, 0, 0, .5)">
            <View style={{width:250, height:Dimensions.get('window').height - 100, backgroundColor:"rgba(255,255,255,0.8)", top:35}}>
            <SettingSlideOut profile={this.state.userProfile} userId={this.state.userId} callback={this.closeSettingsOverlay} callbackRegister={this.closeFromRegister} />
            </View>
          </Overlay>
*/


  //md-flask
  //nuclear
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('UserId');
      if (value !== null) {
        // We have data!!
        this.setState({"userId":value, "modalVisible":false});
        this._requestProfile();
      } else {
        //show log in popup.
        this.setState({"modalVisible":true});
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
        this.setState({userProfile: json, messageReady:false},()=> {
          this.setState({messageReady:true});
        });   
        this._checkDailyLogin();  
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

  canPost =() => {
    if(this.state.userProfile.Suspended === "0") {
      this.setState({messageModal:true, messageTextInput:""})   
    } else {
      Alert.alert(
        'Terror Cards',
        'Sorry, your account is suspended and not allowed to post',
        [{text: 'OK', onPress: () => console.log('OK Pressed')},],
        {cancelable: false},
      );
    }      
  }

  postMessage = async() => {
    let messageData = {type:this.state.messageType, message:this.state.messageTextInput};
    await callServer("appendBoardMessages", messageData, this.state.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      console.log(json);
      if(json === "{success}") {
        //valid user
        this.setState({messageReady:false, messageModal:false}, () => {
          this.setState({messageReady:true});
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


  _checkDailyLogin =() => {
    if(this.state.userProfile !== null) {
      if(this.state.userProfile.DailyMessage !== "") {
        Alert.alert(
          'Terror Cards',
          this.state.userProfile.DailyMessage,
          [{text: 'OK', onPress: () => console.log('OK Pressed')},],
          {cancelable: false},
        );
      }
    }   
  }

  toggleSettings =() => {
    if(this.state.settingsOverlay) {
      this.setState({settingsOverlay:false});
    } else {
      this.setState({settingsOverlay:true});
    }
  }

  closeSettingsOverlay =() => {
    this.setState({settingsOverlay:false},()=>{
      this._requestProfile();
    });    
  }

  closeFromRegister =() => {
    this.setState({settingsOverlay:false},()=>{
      this._retrieveData();
    });     
  }

  /*
  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
  */
  //Login


  //end
}
export default copilot()(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
  },
  slide: {
    borderWidth: 2
  },
  smallMessageBoard: {
    flex: 1,
    flexDirection: "row",
    height: Dimensions.get('window').height - 325
  },
  additionalTools: {
    flex: 1,
    flexDirection: "row",
    height: 75,
    paddingTop: 5,
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  additionalToolsItem: {
    flex: 1,
    flexDirection: "column", 
    alignItems: 'center'
  },
  textDecor: {
    color: "#fff"
  },
  messageBoardType: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 5
  },
	halfWidth: {
		flex: 1
  },
	overlayContainer: {
    flex: 1,
    paddingTop: 30,
		alignItems: "center"
  } 

});

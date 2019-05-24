import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  AsyncStorage,
  Alert,
  ImageBackground,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import { WebBrowser } from 'expo';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props); 
    this.state = { 
      userId: null,
      UserNameInput: "",
      passwordInput: "",
      forgotInput: "",
      loginState: "login",
      disclaimer: "lutions to avoid this ieColorAndroid to transparent",
      deviceId: null
    };
  }

  componentWillMount() {
    //this._retrieveData();
    let id = DeviceInfo.getUniqueID();
    if(id) {
      this.setState({deviceId: id});
    }
  }

  componentDidMount() {
 
  }


  render() {

    let initialView = () => {
        switch(this.state.loginState) {
          case "new": 
            return(
            <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
              <Text style={styles.fontSize}>{"Disclaimer"}</Text>
              <View style={styles.disclaimerSize}>
              <TextInput
                style={{height: 300, borderColor: 'gray', borderWidth: 1, backgroundColor:"#fff"}}
                multiline = {true}
                value={this.state.disclaimer}
              />   
              </View>            
            </ScrollView>
            <View style={styles.spacer}></View>
            <View style={styles.inputSize}>
              <Button
                  onPress={this.createNewAccount}
                  title="Accept Terms"
                  color="#ff0000"
                /> 
            </View>
            <View style={styles.spacer}></View>
            <View style={styles.inputSize}>
              <Button
                  onPress={this.cancelTerms}
                  title="Cancel"
                  color="#000000"
                /> 
            </View>                         
            </View>
            );
          case "login":
            return(
              <View style={styles.container}>
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.fontSize}>{"Log in or create a new account"}</Text>
                <Text style={styles.fontSize}>{"Fan Name"}</Text>
                <View style={styles.inputSize}>
                  <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor:"#fff"}}
                    onChangeText={(text) => this.setState({"UserNameInput":text})}
                    placeholder={" Enter your Fan Name"}
                    value={this.state.UserNameInput}
                  /> 
                </View>
                <Text style={styles.fontSize}>{"Password"}</Text>
                <View style={styles.inputSize}>
                  <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor:"#fff"}}
                    textContentType={" Password"}
                    onChangeText={(password) => this.setState({"passwordInput":password})}
                    value={this.state.passwordInput}
                  />
                </View>

                <View style={styles.spacer}></View> 
                <View style={styles.inputSize}>
                  <Button
                    onPress={this.checkLogIn}
                    title="Sign In"
                    color="#ff0000"
                  />
                </View> 
                <Text style={styles.fontSize}>{"OR"}</Text>
                <View style={styles.inputSize}>
                  <Button
                    onPress={this.newAccount}
                    title="Create New Account"
                    color="#000000"
                  />  
                </View> 
                <View style={styles.spacer50}>
                <TouchableWithoutFeedback onPress={this.showForgotLogin}>
                  <Text style={styles.fontSize}>{"Forgot Your Login?"}</Text>
                </TouchableWithoutFeedback>
                </View>                               
              </ScrollView>
              </View>
            ); 
          case "forgot":    
            return(
              <View style={styles.container}>
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.fontSize}>{"Enter your Email"}</Text>
                <View style={styles.inputSize}>
                  <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor:"#000"}}
                    onChangeText={(text) => this.setState({"forgotInput":text})}
                    placeholder={"Enter your Email"}
                    value={this.state.forgotInput}
                  />
                </View>            
                <View style={styles.spacer}></View> 
                <View style={styles.inputSize}> 
                  <Button
                    onPress={this._forgotRequest}
                    title="Send login info"
                    color="#ff0000"
                  /> 
                </View>
                <View style={styles.spacer}></View> 
                <View style={styles.inputSize}>
                  <Button
                    onPress={this.cancelTerms}
                    title="Cancel"
                    color="#000000"
                  /> 
                </View>
              </ScrollView>                                                                      
              </View>
            );                
        }
    }



    return (
      <View style={styles.container}>
        <ImageBackground
          style={{flex: 1}}
          source={require('../assets/images/tc_app_bg.jpg') }
          >      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>{initialView()}</ScrollView>
      </ImageBackground>
      </View>
    );
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('UserId');
      if (value !== null) {
        // We have data!!
        this.setState({"userId":value});
      } else {
        this.setState({"userId":null});
      }
    } catch (error) {
       // Error retrieving data
    }
  }

  _storeData = async (userId) => {
    try {
      await AsyncStorage.setItem('UserId', userId);
    } catch (error) {
      // Error saving data
    }
  }

  _clearStorage = async() => {
    try {
      await AsyncStorage.removeItem('UserId');
      this.setState({"userId":null});
      this._retrieveData();
      this.cancelTerms();
    } catch (error) {
      // Error saving data
    }    
  }

  checkLogIn =() => {
    if(this.state.UserNameInput !== "" || this.state.passwordInput !== "") {
      this._requestRemoteCheck();
    } else {
      Alert.alert(
        'Terror Cards',
        'Please provide a fan name or password',
        [{text: 'OK', onPress: () => console.log('OK Pressed')},],
        {cancelable: false},
      );
    }
  }

  _requestRemoteCheck =() => {
    callServer("loginCheck", this.state.passwordInput, this.state.UserNameInput)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      console.log(json);
      if(json.Response !== "Failed") {
        //valid user
        this._storeData(this.state.UserNameInput);
        this.props.closeCallBack();      
      } else {
        //no user in DB
        Alert.alert(
          'Terror Cards',
          'No user found or wrong password',
          [{text: 'OK', onPress: () => console.log('OK Pressed')},],
          {cancelable: false},
        );      
      }
    })
    .catch((error) => { 
      console.error(error);
    }); 
  }

  _forgotRequest =() => {
    if(this.state.forgotInput !== "") {

      callServer("forgotPassword", {email:this.state.forgotInput}, "")
      .then((resp)=>{ return resp.json(); })
      .then((json)=>{ 
        console.log(json);
        if(json.Status !== "Fail") {
          //valid user
          Alert.alert(
            'Terror Cards',
            'Email with password sent to ' + this.state.forgotInput,
            [{text: 'OK', onPress: () => console.log('OK Pressed')},],
            {cancelable: false},
          );
          this.props.closeCallBack();      
        } else {
          //no user in DB
          Alert.alert(
            'Terror Cards',
            'Sorry, no matching Fan name or Email found in our system',
            [{text: 'OK', onPress: () => console.log('OK Pressed')},],
            {cancelable: false},
          );      
        }
      })
      .catch((error) => { 
        console.error(error);
      }); 
    } else {
      Alert.alert(
        'Terror Cards',
        'Please provide a Fan name or Email',
        [{text: 'OK', onPress: () => console.log('OK Pressed')},],
        {cancelable: false},
      );        
    }
  }

  newAccount =() => {
    this.setState({"loginState":"new"});
  }

  showForgotLogin =() => {
    this.setState({"loginState":"forgot"});
  }  

  createNewAccount =() => {
    //callServer("defaultAccount", {device:this.setState.deviceId}, "")
    callServer("defaultAccount", {device:1234}, "")
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      console.log(json);
      if(json.Response !== "Fail") {
        //valid user
        this._storeData(json.Name);
        this.props.closeCallBack();      
      } else {
        //no user in DB
        Alert.alert(
          'Terror Cards',
          'Sorry, device already registered.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')},],
          {cancelable: false},
        );      
      }
    })
    .catch((error) => { 
      console.error(error);
    }); 
  }

  cancelTerms =() => {
    this.setState({"loginState":"login"});
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center"
  },
  spacer: {
    height: 25
  },
  spacer50: {
    paddingTop: 50,
    width: Dimensions.get('window').width,
    alignContent: "center",
    alignItems: "center"    
  },  
  inputSize: {
    height:40,
    width: Dimensions.get('window').width - 20, 
    flex:1   
  },
  disclaimerSize: {
    height:300,
    width: Dimensions.get('window').width - 20, 
    flex:1   
  },  
  fontSize: {
    fontWeight:"bold",
    fontSize:18
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
    alignContent: "center",
    alignItems: "center"
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});


/*
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
      */
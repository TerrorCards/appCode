import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
  AsyncStorage,
  CameraRoll,
  PermissionsAndroid
} from 'react-native';
//import { WebBrowser } from 'expo';
import Icon from "react-native-vector-icons/Ionicons";
import { MonoText } from '../components/StyledText';
import { Overlay } from 'react-native-elements';
import { Permissions } from 'expo';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';

export default class HeaderController extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultImage: "http://gisgames.com/CardTemplate/images/skull_default.png",
      photos: [],
      settingsOverlay: false
    };
  }

  componentWillMount() {   
  }

  componentDidMount(){  
  }

  componentWillUpdate() {
  }

  render() {
    return (
        <View style={styles.headerContainerAndroid}>
        <TouchableWithoutFeedback onPress={() => {this.toggleSettings()}}>
            <Image
                style={styles.playerAvatar}
                source={{uri: (this.props.userProfile!==null)? this.props.userProfile.Image: this.state.defaultImage }}
            />         
        </TouchableWithoutFeedback>
            <View>
              <Text style={styles.tabBarInfoText}>{(this.props.userProfile !== null)?this.props.userProfile.Name:""} 
              ({(this.props.userProfile!==null)?this.props.userProfile.Rating: "0"})</Text>
              <MonoText style={styles.codeHighlightText}>Credit: {(this.props.userProfile!==null)?this.props.userProfile.Credit:"0"}</MonoText>
            </View>
        </View>            
    );
  }

  toggleSettings =() => {
    this.props.callback();
  }

  clearStorage = async() => {
    try {
      await AsyncStorage.removeItem('UserId');
    } catch (error) {
      // Error saving data
    }    
  }

  requestCameraPermission = async() => {

    //const { Permissions } = Expo;
    //const { status, expires, permissions } = await Permissions.getAsync(Permissions.CALENDAR, Permissions.CONTACTS)
    //if (status !== 'granted') {
      //alert('Hey! You heve not enabled selected permissions');
    //}

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'TerrorCards Camera Permission',
          message:'TerrorCards needs access to your camera and photos to select your profile picture',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        this.getPhotos();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
      })
      .then(r => {
        console.log(r.edges);
        this.setState({ photos: r.edges });
      })
      .catch((err) => {
        console.log(err);
         //Error Loading Images
      });
    };

}

const styles = StyleSheet.create({
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(255,255,255, 1)',
    textAlign: 'left',
    textAlignVertical: 'top',
    left: 5
  },
  codeHighlightText: {
    color: 'rgba(255,255,255, 1)',
    textAlign: 'left',
    left: 5 
  },  
  // Header CSS
  playerAvatar: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'rgba(96,100,109, 1)'
  },
  headerContainerAndroid: {
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.50)',
    top: 25,
    flexDirection: 'row'
  }, 
  headerContainer: {
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.50)',
    flexDirection: 'row'
  },  
  overlayContainer: {
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(255,255,255,1)'   
  },
  overlayStyle: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex:999
  }
});



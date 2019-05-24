import React from 'react';
import { ScrollView, StyleSheet, FlatList, View, Image, Text, Dimensions, Alert, TouchableOpacity, ImageBackground, Button,
  AsyncStorage, TouchableWithoutFeedback, Platform
} from 'react-native';
//import { Button } from "react-native-elements";
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';
import Icon from "react-native-vector-icons/Ionicons";
import { SearchBar, Overlay } from 'react-native-elements';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import HeaderController from './Header';

const CopilotText = walkthroughable(View);

class FactoryScreen extends React.Component {

	static navigationOptions = {
		header: null
	};

  constructor(props) {
    super(props); 
    this.state = {
      userId: null,
      userProfile: null,
      meldList:[],
      overlayerVisible: false,
      overlayImage: ""
    };
  }

  componentWillMount() {
    this._retrieveData();
  }

  componentDidMount() {
    this.props.start();
    const {navigation} = this.props;
    navigation.addListener ('willFocus', () => {
      if(this.state.userProfile !== null) {
        this._requestProfile(); 
      }
    }); 
    navigation.addListener ('willBlur', () => {
      this.onCloseOverlay(); 
    });       
  }

  render() {

    let meldblock =() => {
      return(this.state.meldList.map((item, index) => {
        return(
          <View key={item.meldCardNumber} style={styles.fullWidth}>
            <View>
              <View>
                <Text style={styles.fontStyle}>{"Obtain this card"}</Text>
                <Image source={{uri: item.meldCardImage}} style={{width: 180, height: 252, borderWidth:1, borderColor:'#000' }} />
              </View>
              <View style={{paddingBottom:5}}>
                <Text style={styles.fontStyle}>{"Chance of success " + item.meldChance + "%"}</Text>
              </View>
              <View>
                <Button
                onPress={()=> this._canMerge(item.meldRequirements, item.meldCardNumber, item.meldMet)}
                title="Combine"
                color={this._buttonColor(item.meldMet)}
                /> 
              </View>
            </View>
            <View>
              <Text style={styles.fontStyle}>{"By Combining these cards"}</Text>
              {reqBlock(item.meldRequirements)}
            </View>
          </View>
        );
      }));
    }

    let reqBlock =(node) => {
      return(node.map((item, index) => {
        return(
          <View key={item.cardNumber} style={{flex:1, flexDirection:"row", paddingBottom:5}}>
            <View style={{paddingLeft:5}}>
              <Image source={{uri: item.cardImage}}  style={{width: 50, height: 75, borderWidth:1, borderColor:'#000' }} />
            </View>
            <View style={{paddingLeft:5, flexDirection:"column"}}>
              <View style={{flexDirection:"row"}}>
                <Text style={styles.HaveNeeds}>{"Own"}</Text>
                <Text>{" / "}</Text>
                <Text style={styles.HaveNeeds}>{"Need"}</Text>
              </View>            
              <View style={{flexDirection:"row"}}>
                <Text style={styles.HaveNeeds}>{item.cardHave}</Text>
                <Text>{"/"}</Text>
                <Text style={styles.HaveNeeds}>{item.cardNeed}</Text>
              </View>            
            </View>
          </View>          
        );
      }));
    }
    
    return (
        <View style={styles.container}>
          <ImageBackground
          style={{flex: 1}}
          source={require('../assets/images/tc_app_bg.jpg') }
          >  
            <HeaderController userId={this.state.userId} userProfile={this.state.userProfile} />  
            <View style={styles.spacer}></View>       
            <ScrollView style={styles.container}>{meldblock()}</ScrollView>  

				<Overlay isVisible={this.state.overlayerVisible} fullScreen={true} onBackdropPress={() => this.setState({overlayerVisible: false})} >
          <ImageBackground
            style={{flex: 1}}
            source={require('../assets/images/tc_app_bg.jpg') }
          >					
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
          </ImageBackground> 
				</Overlay>


          </ImageBackground>     
        </View>
    );
  }

  requestFactory = async () => {
		let result =  await callServer("pullFactoryList", "", this.state.userId)
		.then((resp)=>{ return resp.json(); })
		.then((json)=>{
      console.log(json);
      this._processData(json);		
		})
		.catch((error) => { 
		console.error(error);
		});
	}

  requestMeldAttempt = (meldID) => {
    let result =  callServer("meldFactoryItem", {MeldID: meldID}, this.state.userId)
		.then((resp)=>{ return resp.json(); })
		.then((json)=>{
      console.log(json);
      this.setState({overlayerVisible: true, overlayImage:json[0].Image});	
		})
		.catch((error) => { 
		console.error(error);
		});   
  }

  onCloseOverlay =() => {
    this.requestFactory().then(() => {
      this.setState({overlayerVisible: false, overlayImage:""});
    });
  }

  _processData =(json) => {
    let meldList =[];
    if(json.length > 0) {
      json.map((data) => {
        let reqList = [];
        if(data.CardImage1 !== null) {
          reqList.push({
            cardNumber: data.MeldRequirement1,
            cardImage: data.CardImage1,
            cardHave: data.UserCountNeed1,
            cardNeed: data.MeldCountNeed1            
          });
        }
        if(data.CardImage2 !== null) {
          reqList.push({
            cardNumber: data.MeldRequirement2,
            cardImage: data.CardImage2,
            cardHave: data.UserCountNeed2,
            cardNeed: data.MeldCountNeed2           
          });
        } 
        if(data.CardImage3 !== null) {
          reqList.push({
            cardNumber: data.MeldRequirement3,
            cardImage: data.CardImage3,
            cardHave: data.UserCountNeed3,
            cardNeed: data.MeldCountNeed3           
          });
        } 
        if(data.CardImage4 !== null) {
          reqList.push({
            cardNumber: data.MeldRequirement4,
            cardImage: data.CardImage4,
            cardHave: data.UserCountNeed4,
            cardNeed: data.MeldCountNeed4           
          });
        }                        
        meldList.push(
          {
            meldCardNumber: data.MeldID,
            meldCardImage: data.MeldImage,
            meldChance: data.MeldChance,
            meldMet: data.MeldMet,
            meldRequirements: reqList
          } 
        ); 
      })    
    } 
    this.setState({meldList:meldList});  
  }

  _buttonColor =(met) => {
    if(met) {
      return("#00ff00");
    } else {
      return("#ff0000");
    }
  }

  _canMerge =(node, meldID, meldMet) => {
    if(meldMet) {
      this._showConfirmation("Owned cards disappear on attempt, proceed?", meldID);
    } else {
      this._showAlert("Sorry, requirements not met to meld");
    }
  }  


  _showAlert =(msg) => {
    Alert.alert(
        'Terror Cards',
        msg,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );

    }

    _showConfirmation =(msg, meldID) => {
      Alert.alert(
          'Terror Cards',
          msg,
          [
            {text: 'YES', onPress: () => this.requestMeldAttempt(meldID)},
            {text: 'NO', onPress: () => console.log('Cancel')},
          ],
          { cancelable: false }
        );
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
          this.requestFactory(); 	
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

export default copilot()(FactoryScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  }, 
  spacer: {
    paddingTop: 30
  },  
  fullWidth: {
    flex: 1,
    flexDirection: "row",
    paddingBottom:15,
    backgroundColor:"rgba(255,255,255,0.3)"
  },
  HaveNeeds: {
    width: 50,
    fontWeight: "bold"
  },
  fontStyle: {
    fontWeight: "bold"
  },
	overlayContainer: {
		flex: 1,
		alignItems: "center"
  },
	fullImage: {
		width: Dimensions.get('window').width - 50,
		height: Dimensions.get('window').height - 50
  },
  closeIcon: {
    left:5,
    paddingTop:15
	} 
});

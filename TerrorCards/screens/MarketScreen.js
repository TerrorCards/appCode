import React from 'react';
import { ScrollView, StyleSheet, FlatList, View, Image, Text, ImageBackground, Button, Dimensions, Alert, 
  TouchableWithoutFeedback, Platform, AsyncStorage } from 'react-native';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import Carousel from 'react-native-snap-carousel';
import { Overlay } from 'react-native-elements';
//import Overlay from 'react-native-modal-overlay';
import Icon from "react-native-vector-icons/Ionicons";
import HeaderController from './Header';
import InAppPurchase from './InAppPurchase';
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';

const CopilotView = walkthroughable(View);

class MarketScreen extends React.Component {
    static navigationOptions = {
        header: null
         };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      storeItems: [],
      resultCards: [],
      overlayerVisible: false,
      userId: null,
      userProfile: null,
      InAppOverlay: false
    };
  }

  componentWillMount() {
    this._retrieveData();      
  }

  componentDidMount() {
    //this.props.start();
  }

  render() {
    let viewToShow = () => {
      if(this.state.overlayerVisible) {
        return(<View style={styles.packResultContainer}>
        <Carousel layout={'stack'} layoutCardOffset={15}
        ref={(c) => { this._carousel = c; }}
        data={this.state.resultCards}
        renderItem={this._renderItem}
        sliderWidth={(Dimensions.get('window').width)}
        sliderHeight={(Dimensions.get('window').height) - ((Dimensions.get('window').height) * 0.15)}
        itemWidth={(Dimensions.get('window').width) - ((Dimensions.get('window').width) * 0.15)}
        firstItem={2}
        loop={false}
        autoplay={false}
        />
        <TouchableWithoutFeedback onPress={() => {this.onCloseOverlay()}}>
        <Icon
                    name={Platform.OS === "ios" ? "ios-close" : "md-close"}
                    color="#ccc"
                    size={35}
                    style={styles.closeIcon}
                  />  
        </TouchableWithoutFeedback>        
        </View>);
      } else {
        return (
        <View style={styles.flatListContainer}> 
                         <Button
                        onPress={() => {
                          Alert.alert(
                            'Terror Cards',
                            'Purchase Credit?',
                            [
                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                              {text: 'OK', onPress: () => this.setState({InAppOverlay:true})},
                            ],
                            { cancelable: false }
                          )}}
                        title={"Credit Purchase"}
                        color="#000000"
                        accessibilityLabel={"Credit Purchase"}
                        />              
          <FlatList
          data={this.state.storeItems}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
              <View style={{flex: 1, flexDirection: "row", height:275}}>
              <CopilotStep text="These are the packs currently available to open" order={1} name="packImage">
              <CopilotView>
              <View style={styles.packView}>
                  <Image
                  style={styles.packImage}
                  source={{uri: item.image}}
                  resizeMode={'contain'}
                  />
              </View>
              </CopilotView>
              </CopilotStep>
              <View style={styles.descriptionView}>
                  <View style={styles.textView}>
                      <Text style={styles.packHeader}>{item.name}</Text>
                      <Text style={styles.textDecor}>{item.description}</Text>
                      <Text style={styles.textDecor}>{item.perPack + " cards per pack"}</Text>
                      <Text style={styles.textDecor}>{"1 in " + item.ratio + " pack"}</Text>
                      <CopilotStep text="If you have enough credit, tap the button to buy a pack" order={2} name="buyButton">
                      <CopilotView>
                      <View style={styles.buttonView}>
                        <Button
                        onPress={() => {
                          Alert.alert(
                            'Terror Cards',
                            'Purchase pack?',
                            [
                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                              {text: 'OK', onPress: () => this.purchasePack(item)},
                            ],
                            { cancelable: false }
                          )}}
                        title={item.cost}
                        color="#000000"
                        accessibilityLabel={item.name}
                        />                    
                      </View> 
                      </CopilotView>
                      </CopilotStep>                        
                  </View>             
              </View>                            
              </View>
          )}
          />
          </View> );
      }
    }

    return (
        <View style={styles.container}>
        <ImageBackground
            style={{flex: 1}}
            source={require('../assets/images/tc_app_bg.jpg') }
            >  
            <HeaderController userId={this.state.userId} userProfile={this.state.userProfile} />
            {viewToShow()}

            <Overlay isVisible={this.state.InAppOverlay} fullScreen={true} onBackdropPress={() => this.setState({overlayerVisible: false})} >
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
                  <InAppPurchase />
                </View>
              </ImageBackground> 
            </Overlay>

        </ImageBackground>
        </View> 
    );

  }


//<Overlay isVisible={this.state.overlayerVisible} fullScreen={true} onBackdropPress={() => this.setState({overlayerVisible: false})} >
//</Overlay>

  onCloseOverlay =() => {
    this.setState({resultCards:[], overlayerVisible:false});
  }

  requestPacks = async (params) => {
    let result =  callServer(params.task, params.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      let sets = [];
      json.forEach(element => {
        console.log(element);
        sets.push({ 
            "name": element.Name, 
            "image": element.Image, 
            "description": element.Desc,
            "cost": element.Cost,
            "id": element.ID,
            "perPack": element.PerPack,
            "ratio": element.Ratio
         });
      });
      this.setState({storeItems:sets});
    })
    .catch((error) => { 
      console.error(error);
    });
  } 

  purchasePack = (params) => {
    console.log(this.state.userProfile);
    if(this.state.userProfile.Suspended === "0") {
      if(parseInt(this.state.userProfile.Credit) >= parseInt(params.cost)) {
        let packOrder = {
          'packID':params.id,
          'packName':params.name,
          'userID':this.state.userId,
          'packCost': params.cost,
          'packPer': params.perPack
        };
        let result =  callServer("packsOrder", packOrder, this.state.userId)
        .then((resp)=>{ return resp.json(); })
        .then((json)=>{     
          let cards = [];
          json.forEach(element => {
            console.log(element);
            cards.push({ 
              "count": element.Count, 
              "image": element.Image, 
              "description": element.Description,
              "name": element.Name,
              "id": element.ID,
              "setName": element.SetName,
              "type": element.Type
           });        
          });
          this.setState({resultCards:cards, overlayerVisible:true}, () => {
            this._requestProfile();  
          });       
        })
        .catch((error) => { 
          console.error(error);
        });
      } else {
        //not enough credit
        Alert.alert(
          'Terror Cards',
          'Sorry, not enough credit to purchase the pack.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')},],
          {cancelable: false},
        );       
      }
    } else {
      Alert.alert(
        'Terror Cards',
        'Sorry, your account is suspended and not allowed to purchase',
        [{text: 'OK', onPress: () => console.log('OK Pressed')},],
        {cancelable: false},
      ); 
    }
  }

  _renderItem ({item, index}) {
    return (
        <View style={styles.slide}>
          <Image
          key={(new Date()).getTime()}
          resizeMode={'contain'}
          style={{width: (Dimensions.get('window').width) - ((Dimensions.get('window').width) * 0.15),
                  height: (Dimensions.get('window').height) - ((Dimensions.get('window').height) * 0.15)}}
          source={{uri: item.image + '?time=' + new Date() }}
            />          
        </View>
    );
  }

  showCardsInPack =() => {
    return(
      <Carousel layout={'stack'} layoutCardOffset={'18'}
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
        this.setState({userProfile: json}); 
        this.requestPacks({"task":"packs", "userId":this.state.userId});     
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
export default copilot()(MarketScreen);
 

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#aaa"
  },

  packResultContainer: {
    flex: 1,
    alignContent: "center"
  },

  flatListContainer: {
    flex: 0,
    paddingTop: 30
    
  },

  packImage: {
    width: 180,
    height: 252
  },

  packView: {
    width: 200,
  }, 

  packHeader: {
    fontWeight: "bold" ,
    fontSize:20,
    color: "#fff"
  },

  textDecor: {
    color: "#fff"
  },

  descriptionView: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',   
  },

  buttonView: {
    flex: 0,
    flexDirection: "column",
    paddingTop: 10
  }, 

  buttonItem: {
    backgroundColor: "#000",
    width: 100,
    height: 50,
    borderColor: "#000",
    borderWidth: 0,
    borderRadius: 5,
    bottom: +25  
  },  

  slide: {
    alignContent: 'center'
  },

  closeIcon: {
    position: "absolute",
    top: 30,
    right: 10
  }

});
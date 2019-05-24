import React from 'react';
import { ScrollView, StyleSheet, FlatList, View, Image, Text, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Button } from "react-native-elements";
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';

const CopilotText = walkthroughable(View);

class TradeScreen extends React.Component {
  constructor(props) {
    super(props); 
    this.state = { 
      meldList:[],
    };
  }

  componentWillMount() {
    this._getData();
  }

  componentDidMount() {
    this.props.start();
  }

  render() {

    let meldblock =() => {
      return(this.state.meldList.map((item, index) => {
        return(
          <View key={item.meldCardNumber} style={styles.fullWidth}>
            <View>
              <View>
                <Image source={{uri: item.meldCardImage}} style={{width: 180, height: 252, borderWidth:1, borderColor:'#000' }} />
              </View>
              <View>
                <Text>{"Chance to meld "}</Text>
                <Text>{item.meldChance}</Text>
              </View>
              <View>
                <Button
                onPress={()=> this._canMerge(item.meldRequirements)}
                title="Combine"
                color={this._buttonColor(item.meldRequirements)}
                /> 
              </View>
            </View>
            <View>{reqBlock(item.meldRequirements)}</View>
          </View>
        );
      }));
    }

    let reqBlock =(node) => {
      return(node.map((item, index) => {
        return(
          <View key={item.cardNumber}>
            <View>
              <Image source={{uri: item.cardImage}}  style={{width: 50, height: 75, borderWidth:1, borderColor:'#000' }} />
            </View>
            <View>
              <Text>{item.cardHave}</Text>
              <Text>{"/"}</Text>
              <Text>{item.cardNeed}</Text>
            </View>
          </View>          
        );
      }));
    }
    
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container}>{meldblock()}</ScrollView>       
        </View>
    );
  }

  _getData =() => {
    this.state.meldList = [
      {
        meldCardNumber: 111,
        meldCardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
        meldChance: '90',
        meldRequirements: [
          {
            cardNumber: 270,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 22,
            cardNeed: 10
          },
          {
            cardNumber: 300,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 10,
            cardNeed: 10
          },
          {
            cardNumber: 155,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 21,
            cardNeed: 20
          },
          {
            cardNumber: 185,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 30,
            cardNeed: 24
          } 
        ]
      },
      {
        meldCardNumber: 123,
        meldCardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
        meldChance: '86',
        meldRequirements: [
          {
            cardNumber: 270,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 22,
            cardNeed: 50
          },
          {
            cardNumber: 300,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 10,
            cardNeed: 40
          },
          {
            cardNumber: 155,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 21,
            cardNeed: 35
          },
          {
            cardNumber: 185,
            cardImage: 'http://sslweb.solidstatelogic.com.s3.amazonaws.com/user-icon.png',
            cardHave: 30,
            cardNeed: 24
          }
        ] 
      }                                 
    ];   
  }

  _buttonColor =(node) => {
    let shortList = node.filter((cardSet) => {
      return (cardSet.cardNeed > cardSet.cardHave);
    });
    if(shortList.length > 0) {
      return("#00ff00");
    } else {
      return("#ff0000");
    }
  }

  _canMerge =(node) => {
    let shortList = node.filter((cardSet) => {
      return (cardSet.cardNeed > cardSet.cardHave);
    });
    if(shortList.length > 0) {
      this._showAlert("Sorry, requirements not met to meld");
    } else {
      this._showConfirmation("Are you sure you want to meld?");
    }
  }  


  _showAlert =(msg) => {
    Alert.alert(
        'Trade Error',
        msg,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );

    }

    _showConfirmation =(msg) => {
      Alert.alert(
          'Trade Error',
          msg,
          [
            {text: 'YES', onPress: () => console.log('OK Pressed')},
            {text: 'NO', onPress: () => console.log('Cancel')},
          ],
          { cancelable: false }
        );
  
      }

    //end
}

export default copilot()(TradeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff'
  },
  fullWidth: {
    flex: 1,
    flexDirection: "row"
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
  }   
});

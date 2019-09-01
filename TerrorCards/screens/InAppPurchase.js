import React from 'react';
import { ScrollView, StyleSheet, FlatList, View, Image, Text, Dimensions, Alert, TouchableOpacity, Platform } from 'react-native';
import { Button } from "react-native-elements";
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';
import * as RNIap from 'react-native-iap';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';

/*
const itemSkus = Platform.select({
  ios: [
    'tc_25k'
  ],
  android: [
	'tc_25k',
  'tc_750k'
  ]
});
*/

const CopilotText = walkthroughable(View);

class InAppPurchase extends React.Component {
  constructor(props) {
    super(props); 
    this.state = { 
      productList:[],
      itemSkus: null,
    };
  }

  componentWillMount() {
    this.requestIAPItems();
  }

  async componentDidMount() {
	//this.props.start();
    try {
      RNIap.initConnection();
      const products = await RNIap.getProducts(itemSkus);
      console.log(products);
      this.setState({productList:products});
    } catch(err) {
      alert(err);
      console.warn(err); // standardized err.code and err.message available
    }
  } 
  
  componentWillUnmount() {
	RNIap.endConnection();
  }

  render() {
    let productList =() => {
      let list = [];
      this.state.productList.map((p,i) => {
        list.push(
          <View key={i}>
            <View style={{height:100, width:200, backgroundColor:"#fff"}}><Text>{p.price}</Text></View>
          </View>
        )
      });
    }
    
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container}>{productList()}</ScrollView>       
        </View>
    );
  }

  requestIAPItems = async() => {
    await callServer("loadInAppItems", "", this.props.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      console.log(json);
      if(json.length > 0) {
          let items = [];
          json.map((iap) => {
            items.push(iap.ID);
          });
          let list = Platform.select({
            ios: items,
            android: items
          });         
          this.setState({itemSkus: list});
      }
    })
    .catch((error) => { 
      console.error(error);
    });		
  }


    //end
}

export default copilot()(InAppPurchase);

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

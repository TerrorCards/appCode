import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, ImageBackground, Picker, 
  AsyncStorage,  
  TouchableWithoutFeedback, Dimensions, Platform  } from 'react-native';
import { SuperGridSectionList } from 'react-native-super-grid';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';
import { SearchBar, Overlay } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import HeaderController from './Header';

export default class GalleryScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [
        {
          title: 'Base',
          data: []
        }
      ],
      setList: [],
      setListControl: [],
      imageControl: [],
      initYear: new Date().getFullYear(),
      initSet: "All",
      yearPickList: [],
      initOption: "own",
      optionPickList: ["own","all"],
      overlayerVisible: false,
      overlayImage: "",
      userId: null,
      userProfile: null
    }
  }

  componentWillMount() {
    this._retrieveData();
    //this.setState({yearPickList: this.populatePickerYear()});
    //this.requestSets({"task":"sets", "filter": "", "userId":"TerrorCards"});
    //this.requestCards({"task":"cards", "filter": {"year": this.state.initYear, "category": "All"}, "userId":"TerrorCards"});
  }

  componentDidMount(){
    const {navigation} = this.props;
    navigation.addListener ('willFocus', () => {
      if(this.state.userProfile !== null) {
        this._requestProfile(); 
      }
    });   
  }

  render() {
    return (
    <View style={styles.container}>
        <ImageBackground
          style={{flex: 1}}
          source={require('../assets/images/tc_app_bg.jpg') }
          >  
      <HeaderController userId={this.state.userId} userProfile={this.state.userProfile} /> 
      <View style={styles.spacer}></View> 
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={this.state.initOption}
          style={{ height: 50, width: 75 }}
          onValueChange={(itemValue, itemIndex) => {
            this.changeOption(itemValue);
          }}>
          {this.state.optionPickList.map((op) => {
           return <Picker.Item label={op} value={op} key={op}/>
          })
          }
        </Picker>                 
        <Picker
          selectedValue={this.state.initYear}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue, itemIndex) => {
            this.changeYear(itemValue);
          }}>
          {this.state.yearPickList.map((year) => {
           return <Picker.Item label={year.toString()} value={year} key={year}/>
          })
          }
        </Picker>       
        <Picker
          selectedValue={this.state.initSet}
          style={{ height: 50, flex:1}}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({initSet: itemValue},() => {
              this.fitlerCards(itemValue);  
            })           
            //this.requestCards({"task":"cards", "filter": {"year": this.state.initYear, "category": itemValue}, "userId":"TerrorCards"});
          }}>
          <Picker.Item label="All" value="All" key="All" />          
          {this.state.setList.map((sets) => { 
           return <Picker.Item label={sets.setName} value={sets.setName} key={sets.setName}/>
          })
          }       
        </Picker>           
      </View>       
      <SearchBar
        clearIcon={{ color: 'red' }}
        searchIcon={false} // You could have passed `null` too
        onChangeText={this.fitlerCards}
        onClear={this.clearCardsFilter}
        placeholder='Type Here...' />        
      <ScrollView style={styles.scrollContainer}>      
        <SuperGridSectionList
          itemDimension={100}
          fixed={true}
          sections={this.state.images}
          style={styles.gridView}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableWithoutFeedback onPress={() => {this._getFullCard(item.url);}}>
                <Image source={{uri: item.url }} style={[styles.itemImage, {opacity:item.visual}]}/>
              </TouchableWithoutFeedback>
              {item.count > 1 && <View style={{position: 'absolute', top: 10, left: 0, alignContent:"center", alignItems:"flex-start"}}>
								<Text style={styles.tempCardCount}>{item.count}</Text>
              </View>}              
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={{ color: 'green' }}>{section.title}</Text>  
            </View>            
          )}
        />
      </ScrollView>

				<Overlay isVisible={this.state.overlayerVisible} fullScreen={true} onBackdropPress={() => this.setState({overlayerVisible: false})} >
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
				</Overlay>

      </ImageBackground>
    </View>  
    );
  }

  requestCards = async (params) => {
    let result =  callServer(params.task, params.filter, params.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      //console.log(json);
      let baseList = [];
      let insertList = [];
      json.forEach(element => {
        let thumbImg = (element.Image).replace("full", "thumbs");
        if(element.Type === "Insert") {
          insertList.push({ name: element.Name, url: thumbImg, setName: element.SetName, id: element.ID, count:element.Count, visual: ((element.Count !== null) ? 1 : 0.4)});
        } else {
          baseList.push({ name: element.Name, url: thumbImg, setName: element.SetName, id: element.ID, count:element.Count, visual: ((element.Count !== null) ? 1 : 0.4)});
        }
      });
      let cardList = [
        {title: "Insert", data: insertList},
        {title: "Base", data: baseList}
      ];
      this.state.imageControl = cardList;
      this.setState({images:cardList});
    })
    .catch((error) => { 
      console.error(error);
    });
  }

  requestSets = async (params) => {
    let result =  callServer(params.task, params.filter, params.userId)
    .then((resp)=>{ return resp.json(); })
    .then((json)=>{ 
      let sets = [];
      json.forEach(element => {
        sets.push({ "setName": element.SetName, "year": element.Year });
      });
      this.state.setListControl = sets;
      this.state.setList = sets;
      //this.setState({setList:sets});
      this.filterSets(this.state.initYear);
    })
    .catch((error) => { 
      console.error(error);
    });
  }

  populatePickerYear =() => {
    let currentYear = new Date().getFullYear();
    let firstYear = 2017;
    let listOfYears = [];
    while(currentYear >= firstYear) {
      listOfYears.push(currentYear);
      currentYear--;
    }
    return (listOfYears);
  }

  //filtering of cards
  fitlerCards =(searchVal) => {
    if(searchVal !== "All") {
      let newCardList = []; 
      this.state.images = this.state.imageControl;
      (this.state.images).forEach((category) =>{
        let dataList = (category.data).filter(function (item) {
          return(item.name.includes(searchVal) || item.setName.includes(searchVal));
        });
        newCardList.push({title: category.title, data: dataList});
      });
      this.setState({images: newCardList});
    } else {
      this.setState({images: this.state.imageControl});      
    }
  }

  clearCardsFilter =() => {
    this.setState({images: this.state.imageControl});
  }

  // filtering of sets by year
  filterSets =(searchVal) => {
    let setList = [...this.state.setListControl];
    let dataList = [];
    dataList = (setList).filter(function (item) {
      return(item.year === searchVal);
    });
    this.setState({setList:dataList, initYear: searchVal});
  }

  //changing year or sets
  changeYear =(val) => {
    this.setState({initYear:val, initSet:"All"},() => {
      this.filterSets(val);
      this.requestCards({"task":"cards", "filter": {"year": val, "category": this.state.initSet, "view":this.state.initOption}, "userId":this.state.userId});
    });
  }

  changeOption =(val) => {
    this.setState({initOption:val}, () => {
      this.filterSets(this.state.initYear);
      this.requestCards({"task":"cards", "filter": {"year": this.state.initYear, "category": this.state.initSet, "view":val}, "userId":this.state.userId});
    });

  }

  //Show card in detail
  _getFullCard =(img) => {
    let fullImg = img.replace("thumbs", "full");
    this.setState({overlayImage: fullImg, overlayerVisible: true});
  }

	onCloseOverlay =() => {
		this.setState({overlayImage:"", overlayerVisible:false});
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
        this.setState({userProfile: json, yearPickList:this.populatePickerYear()}); 
        this.requestSets({"task":"sets", "filter": "", "userId":this.state.userId});
        this.requestCards({"task":"cards", "filter": {"year": this.state.initYear, "category": "All", "view":this.state.initOption}, "userId":this.state.userId});             
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
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#aaa"
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#aaa"
  },  
  filterContainer: {
    flexDirection: "row",
    backgroundColor: '#aaa',
  },
  spacer: {
    paddingTop: 30
  },
  sectionHeader: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: '#000',
    padding: 1
  },  
  gridView: {
    paddingTop: 0,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 0,
    height: 140,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  }, 
  itemImage: {
    flex: 1,
    top: 10
  },
  itemOpaque: {
    opacity: 1
  },
  itemHalfTone: {
    opacity: 0.5   
  },
	fullImage: {
		width: Dimensions.get('window').width - 50,
		height: Dimensions.get('window').height - 50
	},
	overlayContainer: {
		flex: 1,
		alignItems: "center"
  },
  tempCardCount: {
    backgroundColor: '#fff',
    borderRadius: 2,
    paddingLeft:2,
    paddingRight:2
  }  
});

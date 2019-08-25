import React from 'react';
import {
	ScrollView, StyleSheet, FlatList, View, Image, Text, Dimensions, Alert, ImageBackground,
	Picker, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, Platform, TextInput
} from 'react-native';
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import GridView, { SuperGridSectionList } from 'react-native-super-grid';
import { callServer, prepData, serverpath } from '../assets/supportjs/ajaxcalls';

export default class TradeSetupScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			yourTradeList: [],
			yourCards: [],
			otherTradeList: [],
			otherCards: [],
			tradeListPool: [],
			cardPool: [],
			messageTextInput: "",
			initYear: new Date().getFullYear(),
			initSet: "All",
			yearPickList: [],
			needsOptionList: [{ value: 'N', label: "All" }, { value: 'Y', label: "Needs" }],
			initNeedsOption: "N",
			setList: [],
			setListControl: [],
			showBack: false,
			showNext: true,
			progress: 1,
			progressText: "I Will Give " + this.props.partner
		};
	}

	componentWillMount() {
		//pull your card list
		//pull other card list
		this.clickTimeout = null;
		let years = this.populatePickerYear();
		this.setState({ yearPickList: years });
		this.requestSets({ "task": "sets", "filter": "", "userId": this.props.userId });
		this.requestCards({
			"task": "tradeSetup", "filter": {
				"year": this.state.initYear,
				"category": "All",
				"receiver": this.props.partner,
				"needs": "N"
			}, "userId": this.props.userId, "owner": "You", "action": "initial", "progress": this.state.progress
		}).then(() => {
			this.requestCards({
				"task": "tradeSetup", "filter": {
					"year": this.state.initYear,
					"category": "All",
					"receiver": this.props.userId,
					"needs": "N"
				}, "userId": this.props.partner, "owner": "Other", "action": "initial", "progress": this.state.progress
			}).then(() => {
				this.setState({ cardPool: this.state.yourCards })
			});
		});
	}

	componentDidMount() {
	}

	render() {
		let TempList = () => {
			return (this.state.tradeListPool.map((item, index) => {
				return (<View key={item.id} style={styles.tempThumbnailView}>
					<TouchableOpacity onPress={() => { this.handleRemoveClick(item.id, item.count) }}>
						<Image source={{ uri: item.url }} style={{ width: 65, height: 85, borderWidth: 1, borderColor: '#000' }} resizeMode={'contain'} />
						<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: 30, height: 20 }}>
							<Text style={styles.tempCardCount}>{item.count}</Text>
						</View>
					</TouchableOpacity>
				</View>);
			}));
		};

		let showProgress = () => {
			if (this.state.progress == 1 || this.state.progress == 2) {
				return (<View style={{ flex:1 }}>
					<View style={{ flex: 1, flexDirection: "row", height: 40, backgroundColor: "rgba(255,255,255,0.6)" }}>
						<View style={{ width: 50, height: 40 }}>
							<TouchableWithoutFeedback
								onPress={() => {
									this.props.closeCallBack();
								}}><Icon
									name={Platform.OS === "ios" ? "ios-close" : "md-close"}
									color="#000"
									size={35}
								/>
							</TouchableWithoutFeedback>
						</View>
						<View style={{ width: Dimensions.get('window').width - 50 }}>
							<View style={{ flex: 1, flexDirection: "row" }}>
								<View style={{ flex: 1 }}><Text>{this.state.progressText}</Text></View>
								{this.state.showBack &&
									<View style={{ paddingLeft: 10, paddingRight: 10 }}>
										<TouchableWithoutFeedback onPress={() => { this.decreaseProgress(); }}>
											<Text>{"Back"}</Text>
										</TouchableWithoutFeedback>
									</View>}
								{this.state.showNext && <View style={{ paddingLeft: 10, paddingRight: 10 }}>
									<TouchableWithoutFeedback onPress={() => { this.advanceProgress(); }}>
										<Text>{"Next"}</Text>
									</TouchableWithoutFeedback>
								</View>}
							</View>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: "row", height: 40, backgroundColor: "rgba(255,255,255,0.7)" }}>
						<Picker
							selectedValue={this.state.initNeedsOption}
							style={{ height: 35, width: 100 }}
							onValueChange={(itemValue, itemIndex) => {
								this.setState({ initNeedsOption: itemValue }, () => {
									this.updateCardRequest();
								});
							}}>
							{this.state.needsOptionList.map((needs) => {
								return <Picker.Item label={needs.label} value={needs.value} key={needs.value} />
							})
							}
						</Picker>
						<Picker
							selectedValue={this.state.initYear}
							style={{ height: 35, width: 100 }}
							onValueChange={(itemValue, itemIndex) => {
								let sets = [...this.state.setListControl];
								let filtered = sets.filter((s) => {
									return (s.year === parseInt(itemValue));
								});
								this.setState({ initYear: itemValue, initSet: "All", setList: filtered }, () => {
									this.updateCardRequest();
								});
							}}>
							{this.state.yearPickList.map((year) => {
								return <Picker.Item label={year.toString()} value={year} key={year} />
							})
							}
						</Picker>
						<Picker
							selectedValue={this.state.initSet}
							style={{ height: 35, flex: 1 }}
							onValueChange={(itemValue, itemIndex) => {
								this.setState({ initSet: itemValue }, () => {
									this.updateCardRequest();
								});
								//this.requestCards({"task":"cards", "filter": {"year": this.state.initYear, "category": itemValue}, "userId":"TerrorCards"});
							}}>
							<Picker.Item label="All" value="All" key="All" />
							{this.state.setList.map((sets) => {
								return <Picker.Item label={sets.setName} value={sets.setName} key={sets.setName} />
							})
							}
						</Picker>
					</View>
					<View style={{ height: 100, backgroundColor: "rgba(155,155,155,0.7)" }}>
						<ScrollView horizontal={true} style={{ height: 100 }}>{TempList()}</ScrollView>
					</View>
					<View style={{ height: Dimensions.get('window').height - 185 }}>
						<GridView
							itemDimension={100}
							items={this.state.cardPool}
							renderItem={item => (
								<TouchableOpacity onPress={() => { this.handleAddClick(item.id, item.count, item) }}>
									<Image source={{ uri: item.url }} style={{ width: 100, height: 140, borderWidth: 1, borderColor: '#000' }} resizeMode={'contain'} />
									<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: 30, height: 20, alignContent: "center" }}>
										<Text style={styles.tempCardCount}>{item.count}</Text>
									</View>
								</TouchableOpacity>
							)}
						/>
					</View>
				</View>);
			} else {
				return (
					<View style={{ flex:1 }}>
						<View style={{ flex: 1, flexDirection: "row", height: 40, backgroundColor: "rgba(255,255,255,0.6)" }}>
							<View style={{ width: 50, height: 40 }}>
								<TouchableWithoutFeedback
									style={{ zIndex: 999 }}
									onPress={() => {
										this.props.closeCallBack();
									}}><Icon
										name={Platform.OS === "ios" ? "ios-close" : "md-close"}
										color="#000"
										size={35}
										style={{ zIndex: 998 }}
									/>
								</TouchableWithoutFeedback>
							</View>
							<View style={{ width: Dimensions.get('window').width - 50 }}>
								<View style={{ flex: 1, flexDirection: "row" }}>
									<View style={{ flex: 1 }}><Text>{this.state.progressText}</Text></View>
									{this.state.showBack &&
										<View style={{ paddingLeft: 10, paddingRight: 10 }}>
											<TouchableWithoutFeedback onPress={() => { this.decreaseProgress(); }}>
												<Text>{"Back"}</Text>
											</TouchableWithoutFeedback>
										</View>}
									{this.state.showNext && <View style={{ paddingLeft: 10, paddingRight: 10 }}>
										<TouchableWithoutFeedback onPress={() => { this.advanceProgress(); }}>
											<Text>{"Next"}</Text>
										</TouchableWithoutFeedback>
									</View>}
								</View>
							</View>
						</View>
						<View style={{ flex: 1, flexDirection: "row", height: 75, backgroundColor: "rgba(0,0,0,0.7)" }}>
							<TextInput
								style={{ height: 75, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, color:'#ffffff' }}
								onChangeText={(text) => this.setState({ messageTextInput: text })}
								value={this.state.messageTextInput}
								maxLength={255}
								multiline={true}
								numberOfLines={4}
								placeholder="Optional message to send along with the trade."
							/>
						</View>
						<View style={{ height: Dimensions.get('window').height - 200 }}>
							<View style={styles.tradeRow}>
								<View style={styles.halfRow1}>
									<Text>{"You will give up"}</Text>
									<GridView
										itemDimension={65}
										items={this.state.yourTradeList}
										renderItem={item => (
											<View>
												<TouchableWithoutFeedback onPress={() => { this._getFullCard(item.url); }}>
													<Image key={item.id} source={{ uri: item.url }} style={styles.imageSize} resizeMode={'contain'} />
												</TouchableWithoutFeedback>
												<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: 30, height: 20, alignContent: "center" }}>
													<Text style={styles.tempCardCount}>{item.count}</Text>
												</View>
											</View>
										)}
									/>
								</View>
								<View style={styles.halfRow2}>
									<Text>{"You will receive"}</Text>
									<GridView
										itemDimension={65}
										items={this.state.otherTradeList}
										renderItem={item => (
											<View>
												<TouchableWithoutFeedback onPress={() => { this._getFullCard(item.url); }}>
													<Image key={item.id} source={{ uri: item.url }} style={styles.imageSize} resizeMode={'contain'} />
												</TouchableWithoutFeedback>
												<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: 30, height: 20, alignContent: "center" }}>
													<Text style={styles.tempCardCount}>{item.count}</Text>
												</View>
											</View>
										)}
									/>
								</View>
							</View>
						</View>
						<View>
							<Button
								style={styles.fullWidth}
								onPress={() => { this.postTrade() }}
								title={"Submit Trade"}
								color="#228B22"
							/>
						</View>
					</View>);
			}
		}

		return (<View style={{ flex: 1 }}>
			{showProgress()}
		</View>);
	}


	requestCards = async (params) => {
		let result = callServer(params.task, params.filter, params.userId)
			.then((resp) => { return resp.json(); })
			.then((json) => {
				console.log(params);
				let baseList = [];
				let insertList = [];
				let awardList = [];
				json.forEach(element => {
					let thumbImg = (element.Image).replace("full", "thumbs");
					if (element.Type === "Insert") {
						insertList.push({ name: element.Name, url: thumbImg, setName: element.SetName, id: element.ID, count: element.Count, year: element.Card_Year, visual: ((element.Count !== null) ? 1 : 0.4) });
					} else if (element.Type === "Award") {
						awardList.push({ name: element.Name, url: thumbImg, setName: element.SetName, id: element.ID, count: element.Count, year: element.Card_Year, visual: ((element.Count !== null) ? 1 : 0.4) });
					} else {
						baseList.push({ name: element.Name, url: thumbImg, setName: element.SetName, id: element.ID, count: element.Count, year: element.Card_Year, visual: ((element.Count !== null) ? 1 : 0.4) });
					}
				});
				let cardList = [
					{ title: "Award", data: awardList },
					{ title: "Insert", data: insertList },
					{ title: "Base", data: baseList }
				];
				cardList = [...awardList, ...insertList, ...baseList];
				if (params.owner === "You") {
					if (this.state.yourTradeList.length > 0) {
						cardList.map((c) => {
							this.state.yourTradeList.map((tl) => {
								if (tl.id === c.id) {
									c.count = c.count - tl.count;
								}
							});
						});
					}
					if (params.progress === 1) {
						this.setState({ yourCards: cardList, cardPool: cardList });
					} else {
						this.setState({ yourCards: cardList });
					}
				} else {
					if (this.state.otherTradeList.length > 0) {
						cardList.map((c) => {
							this.state.otherTradeList.map((tl) => {
								if (tl.id === c.id) {
									c.count = c.count - tl.count;
								}
							});
						});
					}
					if (params.progress === 2) {
						this.setState({ otherCards: cardList, cardPool: cardList });
					} else {
						this.setState({ otherCards: cardList });
					}
				}

			})
			.catch((error) => {
				console.error(error);
			});
	}


	requestSets = async (params) => {
		let result = callServer(params.task, params.filter, params.userId)
			.then((resp) => { return resp.json(); })
			.then((json) => {
				let sets = [];
				console.log(json);
				json.forEach(element => {
					sets.push({ "setName": element.SetName, "year": element.Year });
				});
				this.setState({ setList: sets, setListControl: sets });
				//this.setState({setList:sets});
				//this.filterSets(this.state.initYear);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	populatePickerYear = () => {
		let currentYear = new Date().getFullYear();
		let firstYear = 2017;
		let listOfYears = [];
		while (currentYear >= firstYear) {
			listOfYears.push(currentYear);
			currentYear--;
		}
		return (listOfYears);
	}

	_showAlert = (msg) => {
		Alert.alert(
			'Trade Message',
			msg,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false }
		);

	}

	handleRemoveClick = (itemNum, itemCount) => {
		if (this.clickTimeout !== null) {
			console.log('double click executes');
			clearTimeout(this.clickTimeout);
			this.clickTimeout = null;

			let foundRowIndex = -1;
			let tempTradeList = [...this.state.tradeListPool];
			let cardPool = [...this.state.cardPool];
			tempTradeList.forEach((item, index) => {
				if (itemNum == parseInt(item.id)) {
					if (item.count > 1) {
						item.count = item.count - 1;

						//add back to card list
						cardPool.forEach((card, indx) => {
							if (itemNum == parseInt(card.id)) {
								card.count = card.count + 1;
							}
						});

						if (this.state.progress === 1) {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, yourTradeList: tempTradeList });
						} else if (this.state.progress === 2) {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, otherTradeList: tempTradeList });
						} else {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList });
						}
					} else {
						foundRowIndex = index;
						//pop it from array.               
					}
				}
			});
			if (foundRowIndex != -1) {
				let tempTradeList = [...this.state.tradeListPool];
				let cardPool = [...this.state.cardPool];
				tempTradeList.splice(foundRowIndex, 1);
				cardPool.forEach((card, indx) => {
					if (itemNum == parseInt(card.id)) {
						card.count = card.count + 1;
					}
				});
				if (this.state.progress === 1) {
					this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, yourTradeList: tempTradeList });
				} else if (this.state.progress === 2) {
					this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, otherTradeList: tempTradeList });
				} else {
					this.setState({ cardPool: cardPool, tradeListPool: tempTradeList });
				}
			}

		} else {
			console.log('single click');
			this.clickTimeout = setTimeout(() => {
				console.log('first click executes ');
				clearTimeout(this.clickTimeout);
				this.clickTimeout = null;
			}, 300);
		}
	}

	handleAddClick = (itemNum, itemCount, itemObj) => {
		if (this.clickTimeout !== null) {
			console.log('double click executes');
			clearTimeout(this.clickTimeout);
			this.clickTimeout = null;

			if (this.state.tradeListPool.length >= 9) {
				this._showAlert("Sorry, can only trade 9 different cards at a time");
			} else {
				if (itemCount > 0) {
					let tempTradeList = [...this.state.tradeListPool];
					let foundRow = tempTradeList.find((item) => {
						if (itemNum == parseInt(item.id)) {
							item.count = item.count + 1;
							return true;
						}
					});

					if (!foundRow) {
						let newItem = { ...itemObj };
						newItem.count = 1;
						tempTradeList.push(newItem);
						//decrease to card list
						let cardPool = [...this.state.cardPool];
						cardPool.find((item) => {
							if (itemNum == parseInt(item.id)) {
								item.count = item.count - 1;
								return true;
							}
						});
						if (this.state.progress === 1) {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, yourTradeList: tempTradeList });
						} else if (this.state.progress === 2) {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, otherTradeList: tempTradeList });
						} else {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList });
						}
					} else {
						let cardPool = [...this.state.cardPool];
						cardPool.find((item) => {
							if (itemNum == parseInt(item.id)) {
								item.count = item.count - 1;
								return true;
							}
						});
						if (this.state.progress === 1) {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, yourTradeList: tempTradeList });
						} else if (this.state.progress === 2) {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList, otherTradeList: tempTradeList });
						} else {
							this.setState({ cardPool: cardPool, tradeListPool: tempTradeList });
						}
					}
				} else {
					this._showAlert("Sorry, no more of this card to trade");
				}
			}

		} else {
			console.log('single click');
			this.clickTimeout = setTimeout(() => {
				console.log('first click executes ');
				clearTimeout(this.clickTimeout);
				this.clickTimeout = null;
			}, 300);
		}

	}

	advanceProgress = () => {
		let currentStep = this.state.progress + 1;
		let message = "";
		if (currentStep >= 3) {
			if (this.state.tradeListPool.length > 0) {
				this.setState({ otherTradeList: this.state.tradeListPool }, () => {
					this.setState({ showNext: false, progress: 3, progressText: "Trade Summary" });
				});
			} else {
				this._showAlert("Sorry, please select atleast 1 card to trade");
			}
		} else {
			if (currentStep === 2) {
				if (this.state.tradeListPool.length > 0) {
					message = "I want from " + this.props.partner;
					this.setState({ yourTradeList: this.state.tradeListPool }, () => {
						let oc = [...this.state.otherCards];
						this.setState({
							showNext: true, showBack: true, progress: currentStep, progressText: message,
							cardPool: oc, tradeListPool: this.state.otherTradeList
						});
					});
				} else {
					this._showAlert("Sorry, please select atleast 1 card to trade");
				}

			} else {
				message = "I will give " + this.props.partner;
				this.setState({
					showNext: true, showBack: false, progress: currentStep, progressText: message,
					cardPool: this.state.yourCards, tradeListPool: this.state.yourTradeList
				});
			}
		}

	}

	decreaseProgress = () => {
		let currentStep = this.state.progress - 1;
		let message = "";
		if (currentStep <= 1) {
			message = "I will give " + this.props.partner;
			this.setState({ otherTradeList: this.state.tradeListPool }, () => {
				let yc = [...this.state.yourCards];
				this.setState({
					showBack: false, showNext: true, progress: 1, progressText: message,
					cardPool: yc, tradeListPool: this.state.yourTradeList
				});
			});

		} else {
			message = "I want from " + this.props.partner;
			this.setState({
				showBack: true, showNext: true, progress: currentStep, progressText: message,
				cardPool: this.state.otherCards, tradeListPool: this.state.otherTradeList
			});
		}

	}

	updateCardRequest = () => {
		this.requestCards({
			"task": "tradeSetup", "filter": {
				"year": this.state.initYear,
				"category": this.state.initSet,
				"receiver": this.props.partner,
				"needs": this.state.initNeedsOption
			}, "userId": this.props.userId, "owner": "You", "action": "update", "progress": this.state.progress
		}).then(() => {
			this.requestCards({
				"task": "tradeSetup", "filter": {
					"year": this.state.initYear,
					"category": this.state.initSet,
					"receiver": this.props.userId,
					"needs": this.state.initNeedsOption
				}, "userId": this.props.partner, "owner": "Other", "action": "update", "progress": this.state.progress
			}).then(() => {

			});
		});
	}

	_getFullCard = () => {
	}

	changeYear = () => {

	}

	fitlerCards = () => {
	}

	postTrade = () => {
		if (this.state.yourTradeList.length > 0 && this.state.otherTradeList.length > 0) {
			this.SaveTrade();
		} else {
			this._showAlert("Sorry, not a valid trade");
		}
	}

	SaveTrade = () => {
		let user1Param = { cards: null, userId: null };
		let user2Param = { cards: null, userId: null };
		let user1Cards = [];
		let user2Cards = [];

		user1Param.userId = this.props.userId;
		this.state.yourTradeList.map((card) => {
			user1Cards.push(
				card.id + "_" + card.year + "_" + card.count
			);
		});

		user2Param.userId = this.props.partner;
		this.state.otherTradeList.map((card) => {
			user2Cards.push(
				card.id + "_" + card.year + "_" + card.count
			);
		});

		user1Param.cards = user1Cards.join(",");
		user2Param.cards = user2Cards.join(",");
		callServer("saveTrade", { uContent1: user1Param, uContent2: user2Param, msg: this.state.messageTextInput }, this.props.userId)
			.then((resp) => { return resp.json(); })
			.then((json) => {
				console.log(json);
				this._showAlert("Trade has been submitted");
				this.props.closeCallBack();
			})
			.catch((error) => {
				this._showAlert("Sorry, an error occurred");
				console.error(error);
			});
	}

	TradeCardCount = (pName, pSet, pYear, pNode) => {
		//callServer("getCardCount", {name:pName, 'set':pSet, 'year':pYear, 'node':pNode}, gUser.ID, updateTradeCardCount);
	}

	//end
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		backgroundColor: '#fff',
		alignItems: 'center'
	},
	pickerContainer: {
		flex: 1,
		height: 50,
		flexDirection: "row",
		backgroundColor: "#f00"
	},
	progressContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#00f"
	},
	progressWant: {
		width: Dimensions.get('window').width / 3,
		height: 35,
		backgroundColor: "#0f0"
	},
	progressGive: {
		width: Dimensions.get('window').width / 3,
		height: 35,
		backgroundColor: "#ccc"
	},
	progressSum: {
		width: Dimensions.get('window').width / 3,
		height: 35,
		backgroundColor: "#ccc"
	},
	horizontalScrollContainer: {
		height: 75,
		width: Dimensions.get('window').width
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
	fullWidth: {
		width: Dimensions.get('window').width
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
	},
	imageSize: {
		width: 65,
		height: 90
	},

	tradeRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: 'center'
	},

	halfRow1: {
		width: Dimensions.get('window').width / 2,
		backgroundColor: "#aaa",
		flex: 1
	},
	halfRow2: {
		width: Dimensions.get('window').width / 2,
		backgroundColor: "#fff",
		flex: 1
	},

});


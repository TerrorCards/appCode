import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import FactoryScreen from '../screens/FactoryScreen';
import TradeScreen from '../screens/TradeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import MarketScreen from '../screens/MarketScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

const GalleryStack = createStackNavigator({
  Gallery: GalleryScreen,
});

GalleryStack.navigationOptions = {
  tabBarLabel: 'Gallery',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-images' : 'md-images'}
    />
  ),
};

const TradeStack = createStackNavigator({
  Trade: TradeScreen,
});

TradeStack.navigationOptions = {
  tabBarLabel: 'Trades',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-repeat' : 'md-repeat'}
    />
  ),
};

const MarketStack = createStackNavigator({
  Market: MarketScreen,
});

MarketStack.navigationOptions = {
  tabBarLabel: 'Store',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
    />
  ),
};

const FactoryStack = createStackNavigator({
  Factory: FactoryScreen,
});

FactoryStack.navigationOptions = {
  tabBarLabel: 'Factory',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-flask' : 'md-flask'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  GalleryStack,
  TradeStack,
  MarketStack,
  FactoryStack
});

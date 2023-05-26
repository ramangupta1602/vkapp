/** @format */
import "es6-symbol/implement";
//import "react-native-get-random-values";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
//import { Client } from 'bugsnag-react-native';

//const bugsnag = new Client('1e6ae535f70dc78d96ffcbdb69b52d32');

AppRegistry.registerComponent(appName, () => App);

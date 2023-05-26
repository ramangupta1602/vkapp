import { Dimensions } from "react-native";

//Width of Your MObile Screen.
const { width } = Dimensions.get("window");

//Standard width of mobile screen.
const STANDARD_WIDTH = 414; //(width of 10 iPhone phone used for mockup)

//Width of your mobile screen.
const CURRENT_WIDTH = width;

//Ratio of  YOUR MOBILE SCREEN/STANDARD WIDTH SCREEN.
const K = CURRENT_WIDTH / STANDARD_WIDTH;

const USE_FOR_BIGGER_SIZE = true;

//So,dynamicSize is used to set width,Height of Card,Block,Images,etc.
export function dynamicSize(size) {
  return K * size;
}

//And getFontSize is used for fontSize of the Text.
export function getFontSize(size) {
  if (USE_FOR_BIGGER_SIZE || CURRENT_WIDTH < STANDARD_WIDTH) {
    const newSize = dynamicSize(size);
    return newSize;
  }
  return size;
}

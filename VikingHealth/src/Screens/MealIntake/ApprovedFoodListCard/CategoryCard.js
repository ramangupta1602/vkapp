import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  NativeModules,
} from "react-native";
import SubCategoryCard from "./SubCategoryCard";
import { styles } from "../styles";
import Triangle from "../../../Resources/ImageFromCode/Triangle";
import LinearGradient from "react-native-linear-gradient";
import SpannableText from "../../../Components/SpannableText";
import { R } from "../../../Resources/R";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class CategoryCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubCategoryVisible: this.props.category.category.isExpanded,
      category: this.props.category,
    };
  }

  changeSubCategoryVisibility = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState((previousState) => {
      return {
        isSubCategoryVisible: !previousState.isSubCategoryVisible,
      };
    });
  };

  render() {
    const category = this.props.category.category;
    const categoryName = category.categoryName;
    const imagePath = category.imagePath;
    const localImagePath = category.localImagePath;
    const quote = category.quote;
    const protip = category.protip;
    const categoryColor = category.colorCode;
    const servingSize = category.servingSize;

    // const quote = '';
    // const protip = '';
    const subcategories = category.subcategories;

    const triangleRotation = this.state.isSubCategoryVisible
      ? "0deg"
      : "180deg";
    const marginBottom = this.state.isSubCategoryVisible ? 24 : 16;
    const height = this.state.isSubCategoryVisible ? null : 0;

    return (
      <View key={JSON.stringify(category)}>
        <View style={[styles.categoryContainerStyle, { marginBottom }]}>
          {/* Category Header .. */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.categoryTitleContainerStyle,
              { borderRadius: this.state.isSubCategoryVisible ? 0 : 5 },
            ]}
            onPress={() => {
              this.changeSubCategoryVisibility();
            }}
          >
            <Image
              source={
                localImagePath ? R.Images[localImagePath] : { uri: imagePath }
              }
              style={styles.categoryImage}
            />

            {/* <Text style={styles.categoryTitleStyle}>{categoryName} </Text> */}
            <View style={styles.categoryTitleContainerStyleForView}>
              <SpannableText
                style={[styles.categoryTitleStyle, { color: categoryColor }]}
                text={categoryName}
                searchString={this.props.searchKeyword}
              >
                {categoryName}{" "}
              </SpannableText>
              {servingSize && <Text>({servingSize})</Text>}
            </View>

            <Triangle
              style={{
                marginRight: 14,
                transform: [{ rotate: triangleRotation }],
              }}
            />
          </TouchableOpacity>

          {/* Collasable View  */}
          <View
            style={[
              {
                height,
              },
              styles.collapsableContainerStyle,
            ]}
          >
            <View style={styles.collapsableView}>
              <SubCategoryCard
                categoryColor={categoryColor}
                subcategories={subcategories}
                searchKeyword={this.props.searchKeyword}
              />

              {/* Quote  */}
              {quote.length > 0 && (
                <View style={styles.quoteContainer}>
                  <Text style={styles.quoteTextStyle}>{quote}</Text>
                </View>
              )}
            </View>

            {/* Protip   show protip only if it available*/}
            {protip.length > 0 && (
              <LinearGradient
                colors={["#86A8E7", "#47AEE0", "#91EAE4"]}
                useAngle
                angle={137}
                locations={[0, 0.46, 1]}
                style={styles.protipContainer}
              >
                <Text style={[styles.proTipTextStyle]}>TIP</Text>

                <Text style={styles.proTipStyle}>{protip}</Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </View>
    );
  }
}

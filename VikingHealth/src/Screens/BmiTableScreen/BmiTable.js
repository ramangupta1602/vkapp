import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { FeetScale, CMScale } from "./BmiData";
import { strings } from "../../utility/locales/i18n";
import { R } from "../../Resources/R";
import Style from "./Styles";
import BmiCard from "./BmiCard";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";

const { height } = Dimensions.get("screen");

export default class BmiTable extends Component {
  handleScroll = (event) => {
    console.log(event.nativeEvent.contentOffset.y);
  };

  handleTableDataHorizontalScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    this.tableHeaderScrollRef.scrollTo({ x: offset, animated: false });
  };

  handleTableDataVerticalScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    this.tableColumnScrollRef.scrollTo({ x: 0, y: offset, animated: false });
  };

  constructor(props) {
    super(props);
    this.state = {
      isComponentMounted: false,
      tableAnimation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isComponentMounted: true });
    }, 550);
  }

  startTableAnimation = () => {};

  render() {
    const {
      index,
      data,
      animatedValue,
      onCardClicked,
      heightUnit,
      weightUnit,
      bmi,
    } = this.props;

    const heightList =
      heightUnit === HeightWeightUtil.HEIGHT_CM ? CMScale : FeetScale;
    const heightUnitText =
      heightUnit === HeightWeightUtil.HEIGHT_CM ? "cms" : "ft";
    const weightUnitText = HeightWeightUtil.weightUnit(weightUnit);

    const sharedElementTransitionStyle = getSharedElementOpacityStyle(
      animatedValue
    );
    const translationStyle = getScrollViewStyle(animatedValue);

    const { isComponentMounted } = this.state;

    return (
      <Animated.View style={[Style.containerStyle, { opacity: animatedValue }]}>
        <Animated.Text style={[Style.seeMore, sharedElementTransitionStyle]}>
          {strings("bmiTable.seeMore")}
        </Animated.Text>
        <Animated.Text
          style={[Style.seeMoreMessageStyle, sharedElementTransitionStyle]}
          numberOfLines={2}
        >
          {strings("bmiTable.seeMoreMessage")}
        </Animated.Text>

        <View style={Style.tableContainer}>
          <Animated.View style={sharedElementTransitionStyle}>
            <BmiCard
              index={index}
              data={data}
              bmi={bmi}
              isOpen
              style={{ marginTop: 0 }}
              onCardClicked={() => {
                if (onCardClicked) {
                  onCardClicked();
                }
              }}
            />
          </Animated.View>

          {isComponentMounted && (
            <Animated.View style={[translationStyle, { flex: 1 }]}>
              {/* Table header view */}
              <View
                style={[
                  {
                    flexDirection: "row",
                    backgroundColor: "white",
                    zIndex: 30,
                  },
                  Style.shadowStyle,
                ]}
              >
                <View style={Style.staticCellContainer}>
                  <View style={Style.staticCellStyle}>
                    <Text style={Style.bmiTextStyle}>
                      {strings("cycleSummary.bmi")}
                    </Text>
                    <Image
                      source={R.Images.arrowLeft}
                      style={Style.bmiRightArrowStyle}
                    />
                  </View>
                  <Text style={Style.staticCellUnitTextStyle}>
                    {heightUnitText}/{weightUnitText}
                  </Text>
                </View>

                <ScrollView
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  ref={(ref) => {
                    this.tableHeaderScrollRef = ref;
                  }}
                  contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TableHeader data={data} />
                </ScrollView>
              </View>

              <View style={{ flexDirection: "row", flex: 1 }}>
                {/* Table Right height column */}
                <View
                  style={[Style.heightColumnContainerStyle, Style.shadowStyle]}
                >
                  <ScrollView
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => {
                      this.tableColumnScrollRef = ref;
                    }}
                  >
                    <TableHeightColumn
                      heightRange={heightList}
                      unit={heightUnit}
                    />
                  </ScrollView>
                </View>

                {/* Table  data*/}

                <ScrollView
                  style={{ zIndex: 10 }}
                  bounces={false}
                  scrollEventThrottle={16}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={(ref) => {
                    this.tableDataHorizontalScrollRef = ref;
                  }}
                  onScroll={this.handleTableDataHorizontalScroll}
                >
                  <ScrollView
                    bounces={false}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => {
                      this.tableDataVerticalScrollRef = ref;
                    }}
                    onScroll={this.handleTableDataVerticalScroll}
                  >
                    {heightList.map((item, rowIndex) => {
                      return (
                        <TableRow
                          data={data}
                          index={rowIndex}
                          height={item}
                          heightUnit={heightUnit}
                          weightUnit={weightUnit}
                        />
                      );
                    })}
                  </ScrollView>
                </ScrollView>
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    );
  }
}

function getSharedElementOpacityStyle(animatedValue) {
  const opacityInterpolation = animatedValue.interpolate({
    inputRange: [0, 0.995, 1],
    outputRange: [0, 0, 1],
  });
  return { opacity: opacityInterpolation, zIndex: 30 };
}

function getScrollViewStyle(animatedValue) {
  const translationInterpolation = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [height, height, 0],
  });
  return { transform: [{ translateY: translationInterpolation }] };
}

const TableHeader = ({ data }) => {
  const bmiRange = data.range;
  return (
    <>
      {bmiRange.map((item) => {
        return <Text style={[Style.headerCellStyle]}>{item}</Text>;
      })}
    </>
  );
};

// converting height to cm

function calculateWeight(height, bmi, heightUnit, weightUnit) {
  const heightCm = HeightWeightUtil.convertToCM(height, heightUnit);
  const weight = bmi * (heightCm / 100) * (heightCm / 100); // computed weight is in KG
  const weightInUnit = HeightWeightUtil.convertWeightToUnit(
    { weight, weightUnit: HeightWeightUtil.WEIGHT_KG },
    weightUnit
  );

  return weightInUnit.toFixed(1);
}

const TableRow = ({ data, index, height, heightUnit, weightUnit }) => {
  const bmiRange = data.range;
  const { colorDark, colorLight } = data;
  const backgroundColor = index % 2 === 0 ? colorLight : colorDark;

  return (
    <View
      style={{
        flexDirection: "row",

        flex: 0,
        backgroundColor: "blue",
      }}
    >
      {bmiRange.map((item) => {
        const weight = calculateWeight(height, item, heightUnit, weightUnit);

        return (
          <View style={[Style.cellStyle, { backgroundColor }]}>
            <Text style={[Style.cellTextStyle, { flex: 1 }]}>{weight}</Text>
            <View
              style={{
                width: 1,
                height: "100%",
                backgroundColor: "white",
                opacity: 0.26,
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

function getCmHeightString(height) {
  return (
    <Text>
      {height}
      <Text style={{ fontSize: 8 }} />
    </Text>
  );
}

const TableHeightColumn = ({ heightRange, unit }) => {
  return (
    <React.Fragment>
      {heightRange.map((item) => {
        const height =
          unit === HeightWeightUtil.HEIGHT_CM
            ? getCmHeightString(item)
            : HeightWeightUtil.getFeetHeightString(item);
        return (
          <View style={Style.heightColumnStyle}>
            <Text style={Style.headerCellStyle}>{height}</Text>
          </View>
        );
      })}
    </React.Fragment>
  );
};

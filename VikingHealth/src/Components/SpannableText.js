import React from "react";
import { Text } from "react-native";

const SpannableText = ({ text, searchString, style, servingText }) => {
  if (!text) {
    return null;
  }

  if (!searchString || searchString.length < 1) {
    return <Text style={style}>{text} </Text>;
  }

  const index = text.toLowerCase().indexOf(searchString);

  if (index < 0) {
    return <Text style={style}>{text} </Text>;
  }

  // now beaking text into 3 parts...
  // part 1 -- before search text
  // Part 2 -- Search Text
  // Part 3 -- after search Text
  const subStringPart1 = text.substring(0, index);
  const subStringPart2 = text.substring(index, index + searchString.length);
  const subStringPart3 = text.substring(
    index + searchString.length,
    text.length
  );

  return (
    <Text style={style}>
      <Text>{subStringPart1}</Text>
      <Text style={{ backgroundColor: "#ff0" }}>{subStringPart2}</Text>
      <Text>{subStringPart3}</Text>
      <Text>{servingText} </Text>
    </Text>
  );
};

export default SpannableText;

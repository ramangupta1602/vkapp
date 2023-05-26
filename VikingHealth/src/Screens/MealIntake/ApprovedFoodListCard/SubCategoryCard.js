import React, { Component } from 'react';
import { View, Text } from 'react-native';
import FoodCard from './FoodCard';
import { styles } from '../styles';
import SpannableText from '../../../Components/SpannableText';

export default class SubCategoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getSubcategoryCards = subcategories => {
    const subCategoriesView = subcategories.map(item => {
      const subCategoryName = item.subCategoryname;
      const foodItems = item.items;
      const servingSize = item.servingSize;

      return (
        <View>
          {subCategoryName.length > 0 && (
            <View style={[styles.subCategoryTitleContainerStyle]}>
              <SpannableText
                style={[
                  styles.subCategoryTextStyle,
                  { color: this.props.categoryColor }
                ]}
                searchString={this.props.searchKeyword}
                text={subCategoryName}
                servingText={servingSize}
              />

              {servingSize && <Text>({servingSize})</Text>}
            </View>
          )}
          <FoodCard items={foodItems} searchString={this.props.searchKeyword} />
        </View>
      );
    });
    return subCategoriesView;
  };

  render() {
    const { subcategories } = this.props;

    return (
      <View
        key={JSON.stringify(subcategories)}
        style={{
          backgroundColor: 'transparent'
        }}
      >
        {this.getSubcategoryCards(subcategories)}
      </View>
    );
  }
}

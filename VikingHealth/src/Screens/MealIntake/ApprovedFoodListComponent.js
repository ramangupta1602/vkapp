import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CategoryCard from "./ApprovedFoodListCard/CategoryCard";
import { styles } from "./styles";
import SearchIcon from "../../Resources/ImageFromCode/SearchIcon";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

export default class ApprovedFoodListComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { searchKeyword: "" };
    this.searchInputRef = null;
  }

  filterFoodList = (allCategories) => {
    const filteredCategory = [];

    allCategories.forEach((category) => {
      const filterCategory = this.filterCategory(category);

      if (filterCategory) {
        filteredCategory.push(filterCategory);
      }
    });

    if (filteredCategory.length > 0) {
      return {
        categories: filteredCategory,
      };
    }

    return {};
  };

  filterCategory = (category) => {
    const categoryNode = category.category;
    const categoryName = categoryNode.categoryName.toLowerCase();
    const searchKeyword = this.state.searchKeyword.toLowerCase().trim();

    if (searchKeyword.length < 1) {
      return {
        category: {
          ...categoryNode,
          isExpanded: false,
        },
      };
    }

    if (categoryName.indexOf(searchKeyword) > -1) {
      return {
        category: {
          ...categoryNode,
          isExpanded: true,
        },
      };
    }

    const filterSubCategory = this.filterAllSubCategory(
      categoryNode.subcategories
    );

    if (filterSubCategory) {
      return {
        category: {
          ...categoryNode,
          subcategories: filterSubCategory,
          isExpanded: true,
        },
      };
    }

    return null;
  };

  filterAllSubCategory = (allSubcategories) => {
    const filteredSubCategoryList = [];

    allSubcategories.forEach((subCategory) => {
      const filterSubCategory = this.filterSubCategory(subCategory);

      if (filterSubCategory) {
        filteredSubCategoryList.push(filterSubCategory);
      }
    });

    if (filteredSubCategoryList.length > 0) {
      return filteredSubCategoryList;
    }

    return null;
  };

  filterSubCategory = (subCategory) => {
    const subCategoryName = subCategory.subCategoryname.toLowerCase();
    const searchKeyword = this.state.searchKeyword.toLowerCase().trim();

    if (subCategoryName.indexOf(searchKeyword) > -1) {
      return subCategory;
    }

    const filterItems = this.filterAllItems(subCategory.items);
    if (filterItems) {
      return {
        items: filterItems,
        subCategoryname: subCategory.subCategoryname,
      };
    }

    return null;
  };

  filterAllItems = (allItems) => {
    const filterItems = [];

    allItems.forEach((item) => {
      const filterItem = this.filterItem(item);
      if (filterItem) {
        filterItems.push(filterItem);
      }
    });

    if (filterItems.length > 0) {
      return filterItems;
    }

    return null;
  };

  filterItem = (item) => {
    const itemName = item.toLowerCase();
    const searchKeyword = this.state.searchKeyword.toLowerCase().trim();

    if (itemName.indexOf(searchKeyword) > -1) {
      return item;
    }

    return null;
  };

  parseCategoryData = () => {
    const searchKeyword = this.state.searchKeyword.toLowerCase().trim();
    const filterList = this.filterFoodList(this.props.data);
    const stringCategory = filterList;

    if (!stringCategory) {
      return null;
    }

    const category = stringCategory.categories;

    if (!category) {
      return null;
    }

    const categoryList = category.map((item) => {
      return (
        <CategoryCard
          key={JSON.stringify(item) + nanoid()}
          searchKeyword={searchKeyword}
          category={item}
        />
      );
    });

    return categoryList;
  };

  render() {
    return (
      <View
        style={[
          styles.containerStyle,
          { backgroundColor: "transparent", flex: 1 },
        ]}
      >
        <View
          style={[
            {
              backgroundColor: "transparent",
              paddingLeft: 16,
              paddingRight: 16,
            },
          ]}
        >
          {/* Search Bar */}
          <TouchableOpacity
            onPress={() => {
              this.searchInputRef.focus();
            }}
            style={styles.searchBarContainer}
          >
            <SearchIcon style={styles.serachIconStyle} />
            <TextInput
              ref={(ref) => {
                this.searchInputRef = ref;
              }}
              style={styles.serachTextStyle}
              value={this.state.searchKeyword}
              placeholder={"Try searching fat, sauces names...."}
              onChangeText={(text) => this.setState({ searchKeyword: text })}
            />
          </TouchableOpacity>

          <View
            key={this.filterFoodList}
            style={[
              {
                backgroundColor: "transparent",
                flex: 1,
              },
            ]}
          >
            {this.props.loading && (
              <View style={styles.loadingIndicatorContainerStyle}>
                <ActivityIndicator />
              </View>
            )}
            {!this.props.loading && this.parseCategoryData()}
          </View>
        </View>
      </View>
    );
  }
}

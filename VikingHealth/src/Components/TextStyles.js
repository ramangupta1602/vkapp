import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { R } from 'Resources';
export const PageTitle = ({ title, style = {} }) => (
  <Text style={[styles.headerText, { ...style }]}>{title}</Text>
);

export const SubTitle = ({ subTitle }) => (
  <Text style={styles.subTitleStyle}>{subTitle}</Text>
);

export const PageInfo = ({ info, style = {} }) => (
  <Text style={[styles.infoStyle, { ...style }]}>{info}</Text>
);

const styles = StyleSheet.create({
  headerText: {
    fontSize: 28,
    marginLeft: 8,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.22,
    lineHeight: 34,
    color: R.Colors.COLOR_TEXT
  },
  subTitleStyle: {
    marginTop: 8,
    marginLeft: 8,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'Lato-Regular',
    lineHeight: 18,
    color: R.Colors.COLOR_TEXT
  },
  infoStyle: {
    fontSize: 14,
    marginLeft: 10,
    color: R.Colors.COLOR_TEXT_LIGHT,
    fontFamily: 'Lato-Regular',
    fontWeight: '500'
  }
});

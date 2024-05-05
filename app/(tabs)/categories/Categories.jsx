import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";

const Categories = () => {
  const { expenseGroupList, getExpenseGroupList, categoryList, getDefaultCategoryList } = useUser();

  useEffect(() => {
    getExpenseGroupList();
  }, []);
  console.log(expenseGroupList);

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>CATEGORIES</Text>
      </View>
      {expenseGroupList.map((group) => (
        <ScrollView key={group.id} style={styles.groupContainer}>
          <Text style={styles.groupHeading}>{group.name}</Text>
          <View style={styles.horizontalLine} />
        </ScrollView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LICORICE,
    opacity: 0.7,
  },
  headingContainer: {
    margin: "15%",
  },
  heading: {
    textAlign: "center",
    fontSize: 16,
    color: colors.WHITE,
  },
  groupContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  groupHeading: {
    marginBottom: 20,
    fontSize: 18,
    color: colors.WHITE,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.WHITE,
    opacity: 0.2,
  },
});

export default Categories;

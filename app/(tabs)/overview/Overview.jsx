import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Button } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import OverviewHeader from "../../../components/headers/OverviewHeader";
import PieGraph from "../../../components/graphs/PieGraph";

import { Ionicons } from "@expo/vector-icons";

const Overview = () => {
  const { loading, session, categoryList, getCategoryList } = useUser();

  useEffect(() => {
    if (session?.user) {
      getCategoryList();
    }
  }, [session]);

  return (
    <View style={styles.container}>
      {/* <ScrollView refrefreshControl={<RefreshControl onRefresh={() => getCategoriesList()} refreshing={loading} />}> */}

      <OverviewHeader session={session} />

      <View style={styles.graphContainer}>
        <PieGraph categoryList={categoryList} />
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // subContainer: {
  // 	flex: 1,
  // },
  graphContainer: {
    marginTop: -75,
    padding: 20,
  },
});

export default Overview;

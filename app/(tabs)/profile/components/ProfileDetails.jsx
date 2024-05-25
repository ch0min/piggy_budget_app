import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../../../context/UserContext";
import colors from "../../../../constants/colors";
import { FontAwesome5, Feather, Fontisto, Entypo } from "@expo/vector-icons";

const ProfileDetails = () => {
  const { user, userProfile } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.profileDetailsContainer}>
        <TouchableOpacity style={styles.valutaBtn}>
          <FontAwesome5 name="money-bill-wave-alt" size={24} color="black" />
          <Text>Valuta</Text>
          <Entypo name="chevron-small-right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyBtn}>
          <Feather name="user-check" size={24} color="black" />
          <Text>Verificering</Text>
          <Entypo name="chevron-small-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.passwordBtn}>
          <Fontisto name="locked" size={24} color="black" />
          <Text>Skift kodeord</Text>
          <Entypo name="chevron-small-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutBtn}>
          <Entypo name="log-out" size={24} color="black" />
          <Text>Log ud</Text>
          <Entypo name="chevron-small-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileDetailsContainer: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#FFF",
  },
  valutaBtn: {
    flexDirection: "row",
  },
  verifyBtn: {
    flexDirection: "row",
  },
  passwordBtn: {
    flexDirection: "row",
  },
  signOutBtn: {
    flexDirection: "row",
  },
});

export default ProfileDetails;

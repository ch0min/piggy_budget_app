import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TextInput, Button } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
import PrimaryExecBtn from "../../../components/Buttons/primaryExecBtn";

const CompleteProfile = ({ navigation }) => {
  const { loading, profileCompleted, updateProfile } = useUser();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleUpdateProfile = async () => {
    if (!avatarUrl || !firstName || !lastName) {
      Alert.alert("Please fill out all fields.");
      return;
    }

    const updates = {
      avatar_url: avatarUrl,
      first_name: firstName,
      last_name: lastName,
      profile_completed: true,
    };

    await updateProfile(updates);
    if (profileCompleted) {
      navigation.navigate("HomeTabs");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.textInputContainer}>
          <Text style={styles.headingInput}>First name</Text>
          <View style={styles.textInput}>
            <TextInput
              label="FirstName"
              onChangeText={(text) => setFirstName(text)}
              value={firstName || ""}
            />
          </View>

          <Text style={styles.headingInput}>Last name</Text>
          <View style={styles.textInput}>
            <TextInput
              label="LastName"
              onChangeText={(text) => setLastName(text)}
              value={lastName || ""}
            />
          </View>

          <Text style={styles.headingInput}>Avatar</Text>
          <View style={styles.textInput}>
            <TextInput
              label="Avatar"
              onChangeText={(text) => setAvatarUrl(text)}
              value={avatarUrl || ""}
            />
          </View>
        </View>

        <PrimaryExecBtn
          loading={loading}
          execFunction={handleUpdateProfile}
          btnText={loading ? "Loading.." : "Update"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.WHITE,
  },
  subcontainer: {
    width: "100%",
    height: "100%",
    marginTop: 100,
  },
  textInputContainer: {
    marginTop: 30,
  },
  headingInput: {
    margin: 5,
    fontSize: 14,
  },
  textInput: {
    width: "100%",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.PRIMARY,
  },
});

export default CompleteProfile;

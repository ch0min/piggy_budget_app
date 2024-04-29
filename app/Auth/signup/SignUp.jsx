import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { supabase } from "../../../utils/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../utils/colors";

const SignUp = () => {
   const [loading, setLoading] = useState(false);

   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [avatarUrl, setAvatarUrl] = useState("");

   const signUpWithEmail = async () => {
      setLoading(true);
      const {
         data: { session },
         error,
      } = await supabase.auth.signUp({
         // firstName: firstName,
         // lastName: lastName,
         email: email,
         password: password,
         // avatarUrl: avatarUrl,
      });

      if (error) Alert.alert(error.message);
      if (!session) Alert.alert("Please check your inbox for email verification.");
      setLoading(false);
   };

   return (
      <View style={styles.container}>
         <View style={styles.subContainer}>
            <View style={styles.textInputContainer}>
               {/* <Text>First Name</Text>
               <View style={styles.textInput}>
                  <TextInput
                     label="FirstName"
                     placeholder="ex. first name"
                     onChangeText={(text) => setFirstName(text)}
                     value={firstName}
                     autoCapitalize={"words"}
                  />
               </View>

               <Text>Last Name</Text>
               <View style={styles.textInput}>
                  <TextInput
                     label="LastName"
                     placeholder="ex .last name"
                     onChangeText={(text) => setLastName(text)}
                     value={lastName}
                     autoCapitalize={"words"}
                  />
               </View> */}

               <Text>Email</Text>
               <View style={styles.textInput}>
                  <TextInput label="Email" placeholder="ex. email@address.com" onChangeText={(text) => setEmail(text)} value={email} autoCapitalize={"none"} />
               </View>

               <Text>Password</Text>
               <View style={styles.textInput}>
                  <TextInput label="Password" placeholder="**********" onChangeText={(text) => setPassword(text)} value={password} autoCapitalize={"none"} />
               </View>
            </View>
            <View style={styles.signUpBtn}>
               <TouchableOpacity disabled={loading} onPress={() => signUpWithEmail()}>
                  <Text style={styles.btnText}>Sign Up</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
   },
   subContainer: {
      width: "100%",
      height: "100%",
      padding: 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: colors.WHITE,
   },
   textInputContainer: {
      marginTop: 30,
   },
   textInput: {
      width: "100%",
      marginBottom: 20,
      padding: 15,
      borderRadius: 10,
      backgroundColor: colors.LIGHT,
   },
   signUpBtn: {
      padding: 20,
      borderRadius: 99,
      backgroundColor: colors.SECONDARY,
   },
   btnText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: colors.WHITE,
   },
});

export default SignUp;

// re_Yur1GXq6_PHbcs82zR4yv1Zt9scNdsm1V

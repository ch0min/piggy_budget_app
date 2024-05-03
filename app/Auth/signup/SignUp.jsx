import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { useUser } from "../../../context/UserContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isValidEmail, isPasswordStrongEnough } from "../../../utils/customValidationHelpers";

import colors from "../../../utils/colors";
import logo from "../../../assets/images/logo.png";
import arrowLeft from "../../../assets/images/arrowLeft.png";
import PrimaryExecBtn from "../../../components/Buttons/primaryExecBtn";
import TextBtn from "../../../components/Auth/textBtn";

const Signup = ({ navigation }) => {
	const { loading, signUp } = useUser();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSignUp = async () => {
		setMessage("");

		// Validation
		if (!isValidEmail(email)) {
			setMessage("Please enter a valid email address.");
			return;
		}
		if (password !== confirmPassword) {
			setMessage("The passwords do not match. Please try again.");
			return;
		}
		if (!isPasswordStrongEnough(password)) {
			setMessage("Password must be atleast 6 characters long.");
			return;
		}

		const { error } = await signUp(email, password);

		if (error) {
			setMessage(error.message);
		} else {
			navigation.navigate("VerifyEmail", { email });
		}
	};

	return (
		<KeyboardAwareScrollView contentContainerStyle={styles.container}>
			<View style={styles.headerContainer}>
				<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
					<Image style={styles.arrowLeft} source={arrowLeft} />
				</TouchableOpacity>
				<Image style={styles.logo} source={logo} />
			</View>
			<Text style={styles.heading}>Create Account</Text>

			<View style={styles.subContainer}>
				<View style={styles.textInputContainer}>
					<Text style={styles.headingInput}>Email</Text>
					<View style={styles.textInput}>
						<TextInput
							label="Email"
							placeholder="ex. email@address.com"
							onChangeText={(text) => setEmail(text)}
							value={email}
							autoCapitalize={"none"}
						/>
					</View>

					<Text style={styles.headingInput}>Password</Text>
					<View style={styles.textInput}>
						<TextInput
							label="Password"
							placeholder="**********"
							onChangeText={(text) => setPassword(text)}
							value={password}
							secureTextEntry={true}
						/>
					</View>

					<Text style={styles.headingInput}>Confirm Password</Text>
					<View style={styles.textInput}>
						<TextInput
							label="Password"
							placeholder="**********"
							onChangeText={(text) => setConfirmPassword(text)}
							value={confirmPassword}
							secureTextEntry={true}
						/>
					</View>
				</View>

				{message ? <Text style={styles.message}>{message}</Text> : null}
				<View style={styles.btnContainer}>
					<PrimaryExecBtn
						loading={loading}
						execFunction={handleSignUp}
						btnText={loading ? "Loading.." : "Sign up"}
					/>
					<TextBtn
						loading={loading}
						navigation={navigation}
						navigateTo={"Login"}
						text={"Already a Member?"}
						colorText={colors.BLACK}
						btnText={"SIGN IN"}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.WHITE,
	},
	headerContainer: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		margin: "15%",
	},
	arrowLeft: {
		width: 30,
		height: 30,
		marginLeft: "25%",
	},
	logo: {
		width: 35,
		height: 35,
		marginRight: "7%",
	},
	heading: {
		fontSize: 28,
		fontWeight: "bold",
		color: colors.BLACK,
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
	headingInput: {
		margin: 5,
		fontSize: 14,
	},
	textInput: {
		width: "100%",
		marginBottom: 20,
		padding: 15,
		borderRadius: 10,
		backgroundColor: colors.LIGHT,
	},
	message: {
		textAlign: "left",
		fontSize: 14,
		color: colors.RED,
	},
	btnContainer: {
		marginTop: "10%",
	},
});

export default Signup;

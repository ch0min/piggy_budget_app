import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../constants/colors";
import logo2 from "../../../assets/images/logo2.png";
import arrowLeft from "../../../assets/images/arrowLeft.png";

import PrimaryExecBtn from "../../../components/buttons/primaryExecBtn";
import TextBtn from "../../../components/buttons/textBtn";

const Login = ({ navigation }) => {
	const { loading, signIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSignIn = async () => {
		if (!email || !password) {
			setMessage("Venligst indtast email og password");
			return;
		}
		const result = await signIn(email, password);

		if (result && result.error) {
			setMessage("Forkert email eller password");
		}
	};

	return (
		<KeyboardAwareScrollView style={{ backgroundColor: colors.WHITE }} enableOnAndroid={true} extraScrollHeight={10}>
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
						<Image style={styles.arrowLeft} source={arrowLeft} />
					</TouchableOpacity>
				</View>

				<Image source={logo2} style={styles.bgImage} />

				<View style={styles.subContainer}>
					<Text style={styles.heading}>Velkommen tilbage</Text>
					<Text style={styles.subheading}>Lad os komme igang!</Text>

					<View style={styles.textInputContainer}>
						<Text style={styles.headingInput}>Email</Text>
						<View style={styles.textInput}>
							<TextInput
								label="Email"
								placeholder="piggy@adresse.dk"
								onChangeText={(text) => setEmail(text)}
								value={email}
								autoCapitalize={"none"}
							/>
						</View>

						<Text style={styles.headingInput}>Kodeord</Text>
						<View style={styles.textInput}>
							<TextInput
								label="Password"
								placeholder="**********"
								onChangeText={(text) => setPassword(text)}
								value={password}
								secureTextEntry={true}
							/>
						</View>
					</View>

					{message ? <Text style={styles.message}>{message}</Text> : null}

					<View style={styles.btnContainer}>
						<PrimaryExecBtn execFunction={handleSignIn} btnText={"Login"} />
						<TextBtn
							navigation={navigation}
							navigateTo={"Signup"}
							text={"Ikke et medlem endnu?"}
							colorText={colors.BLACK}
							btnText={"Registrer her"}
						/>
					</View>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.SECONDARY,
	},
	headerContainer: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: "15%",
	},
	arrowLeft: {
		width: 30,
		height: 30,
		marginLeft: "25%",
	},
	bgImage: {
		width: "75%",
		height: "75%",
	},
	heading: {
		marginTop: "5%",
		textAlign: "center",
		fontSize: 28,
		fontWeight: "bold",
	},
	subheading: {
		marginTop: 5,
		textAlign: "center",
		fontSize: 16,
	},
	subContainer: {
		width: "100%",
		height: "100%",
		marginTop: -120,
		padding: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: colors.WHITE,
	},
	headingInput: {
		margin: 5,
		fontSize: 14,
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
	message: {
		textAlign: "left",
		fontSize: 14,
		color: colors.RED,
	},
});

export default Login;

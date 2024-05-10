import { UserProvider } from "./context/UserContext";
import RootNavigator from "./app/RootNavigator";
import "react-native-reanimated";

const App = () => {
	return (
		<UserProvider>
			<RootNavigator />
		</UserProvider>
	);
};

export default App;

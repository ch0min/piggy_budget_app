import { UserProvider } from "./context/UserContext";
import RootNavigator from "./app/RootNavigator";

const App = () => {
	return (
		<UserProvider>
			<RootNavigator />
		</UserProvider>
	);
};

export default App;

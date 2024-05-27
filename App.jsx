import { AuthProvider } from "./contexts/AuthContext";
import { MonthlyProvider } from "./contexts/MonthlyContext";
import { ExpenseAreasProvider } from "./contexts/ExpenseAreasContext";
import { ExpensesProvider } from "./contexts/ExpensesContext";
import { TransactionsProvider } from "./contexts/TransactionsContext";

import RootNavigator from "./app/RootNavigator";
import "react-native-reanimated";

const App = () => {
	return (
		<AuthProvider>
			<MonthlyProvider>
				<ExpenseAreasProvider>
					<ExpensesProvider>
						<TransactionsProvider>
							<RootNavigator />
						</TransactionsProvider>
					</ExpensesProvider>
				</ExpenseAreasProvider>
			</MonthlyProvider>
		</AuthProvider>
	);
};

export default App;

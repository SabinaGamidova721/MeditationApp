import AppNavigator from "./src/navigation";
import { AppProvider } from "./src/context/AppContext";
import AuthGate from "./src/auth/AuthGate";

export default function App() {
  return (
    <AppProvider>
      <AuthGate>
        <AppNavigator />
      </AuthGate>
    </AppProvider>
  );
}

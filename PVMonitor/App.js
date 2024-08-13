import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import PanelDashboard from "./components/PanelDashboard";
import ChoosePanel from "./components/ChoosePanel";
import PanelDetails from "./components/PanelDetails";

const Stack = createNativeStackNavigator();

const App = () => {
    enableScreens();
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Choosepanel"
            screenOptions={{
              animation: "none",
            }}
          >
            <Stack.Screen
              component={PanelDashboard}
              name="Paneldashboard"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={ChoosePanel}
              name="Choosepanel"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={PanelDetails}
              name="Paneldetails"
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  };
export default App

import React from "react";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SCREENS } from "./app/_shared/constants";
import LoginScreen from "./app/screens/login";
import Verification from "./app/screens/verification";
import MenuScreen from "./app/screens/menu";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={SCREENS.LOGIN}>
        <Stack.Screen
          name={SCREENS.LOGIN}
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREENS.MENU}
          component={MenuScreen}
          options={{ title: "Menu" }}
        />
        {/* menu option screens */}
        <Stack.Screen
          name={SCREENS.VERIFICATION}
          component={Verification}
          options={{ headerShown: false,  }} 

        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// npx expo install react-native-screens react-native-safe-area-context

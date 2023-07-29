import React from "react";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SCREENS } from "./app/_shared/constants";
import LoginScreen from "./app/screens/login";
import Verification from "./app/screens/verification";
import MenuScreen from "./app/screens/menu";
import Attendance from "./app/screens/attendance";
// import HeadCount from "./app/screens/headcount";
import HeaderComponent from "./app/components/header";
import Enrollment from "./app/screens/enrollment.test_feature";
import NoAuthHeaderComponent from "./app/components/no_auth_header";
import No_Auth_Menu from "./app/screens/no_auth_menu";

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
          options={{
            headerTitle: HeaderComponent,
            headerBackVisible: false,
          }}
        />
        {/* auth menu option screens */}
        <Stack.Screen
          name={SCREENS.VERIFICATION}
          component={Verification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREENS.ATTENDANCE}
          component={Attendance}
          options={{ headerShown: false }}
        />

        {/*no  auth menu option screens */}
        <Stack.Screen
          name={SCREENS.NO_AUTH_MENU}
          component={No_Auth_Menu}
          options={{
            headerTitle: NoAuthHeaderComponent,
            headerBackVisible: false,
          }}
        />
        
        {/* test features */}
        <Stack.Screen
          name={SCREENS.ENROLLMENT}
          component={Enrollment}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// npx expo install react-native-screens react-native-safe-area-context

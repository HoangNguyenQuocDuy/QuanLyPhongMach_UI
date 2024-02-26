import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Login/Login'
import Register from "../Register/Register";

const Stack = createStackNavigator()
function Auth() {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        title: 'Login',
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{
                        title: 'Register',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Auth;
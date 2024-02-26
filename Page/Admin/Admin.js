import { useState } from "react";
import { Button, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useSelector } from "react-redux";
import Staff from "../Staff/Staff";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LogoutScreen from "../../components/LogoutScreen/LogoutScreen";
import Medicine from "../Medicine/Medicine";
import Schedule from "../Schedule/Schedule";
import DrawerHeader from "../../components/DrawerHeader/DrawerHeader";

const Drawer = createDrawerNavigator();

function Admin() {
    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={(props) => <DrawerHeader props={props} />}>
                <Drawer.Screen name="Staff" component={Staff}
                    options={{
                        //   drawerLabel: "Admin", 
                        title: "Staff",
                        //   drawerIcon: () => (

                        //   )
                    }}
                />
                <Drawer.Screen name="Schedule" component={Schedule}
                    options={{
                        //   drawerLabel: "Admin", 
                        title: "Schedule",
                        //   drawerIcon: () => (

                        //   )
                    }}
                />
                <Drawer.Screen name="Medicine" component={Medicine}
                    options={{
                        //   drawerLabel: "Admin", 
                        title: "Medicine",
                        //   drawerIcon: () => (

                        //   )
                    }}
                />

                <Drawer.Screen
                    name="Logout"
                    component={LogoutScreen}
                    options={{ title: "Logout" }}
                />
            </Drawer.Navigator>
        </NavigationContainer>

    );
}

export default Admin;
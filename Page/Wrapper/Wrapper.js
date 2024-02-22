import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Login from '../Login/Login'
import Register from '../Register/Register'
import DrawerHeader from "../../components/DrawerHeader/DrawerHeader";
import UserInfo from "../../components/UserInfo/UserInfo";
import AddUserBox from "../../components/AddUserBox/AddUserBox";
import ManageStaff from "../Admin/Admin";
import Schedule from "../Schedule/Schedule";
import LogoutScreen from "../../components/LogoutScreen/LogoutScreen";
import ScheduleInfo from "../../components/ScheduleInfo/ScheduleInfo";
import AddScheduleBox from "../../components/AddScheduleBox/AddScheduleBox";


const Drawer = createDrawerNavigator();

function Wrapper() {
  const user = useSelector(state => state.user)
  const account = useSelector(state => state.account)
  const { isOpenUserInfoTag, isOpenAddUserBox, isOpenScheduleInfo,
    isOpenAddScheduleBox }
    = useSelector(state => state.app)

  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator drawerContent={(props) => <DrawerHeader props={props} />}>
          {!account.username || account.username === '' ?
            <>
              <Drawer.Screen name="Login" component={Login} />
              <Drawer.Screen name="Register" component={Register} />
            </> :
            <>
              <Drawer.Screen name="ManageStaff" component={ManageStaff}
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

              <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{ title: "Logout" }}
              />
            </>
          }
        </Drawer.Navigator>
      </NavigationContainer>
      {/* } */}

      {isOpenUserInfoTag && <UserInfo />}
      {isOpenAddUserBox && <AddUserBox />}
      {isOpenScheduleInfo && <ScheduleInfo />}
      {isOpenAddScheduleBox && <AddScheduleBox />}
    </>
  );
}

export default Wrapper;
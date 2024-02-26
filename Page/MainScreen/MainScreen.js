import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MyAppointment from '../MyAppointment/MyAppointment';
import Icons from 'react-native-vector-icons/AntDesign'
import Icons2 from 'react-native-vector-icons/Ionicons'
import { StyleSheet, Text } from 'react-native';
import AddAppointmentBox from '../../components/AddAppointmentBox/AddAppointmentBox';
import Home from '../Home/Home'
import Personal from '../Personal/Personal';
import { useSelector } from 'react-redux';
import ManageAppointment from '../ManageAppointment/ManageAppointment';

const Tab = createBottomTabNavigator();

function MainScreen() {
    const { role } = useSelector(state => state.user)

    return (
        <NavigationContainer>
            <Tab.Navigator >
                {
                    role === 'Patient' ?
                        <>
                            <Tab.Screen name='Home' component={Home}
                                options={{
                                    tabBarLabel: ({ focused }) => (
                                        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>Home</Text>
                                    ),
                                    tabBarIcon: ({ focused }) => (
                                        <Icons color={focused ? '#387ADF' : 'gray'} name='home' size={26} />
                                    )
                                }} />
                            <Tab.Screen name='Appointments' component={MyAppointment}
                                options={{
                                    tabBarLabel: ({ focused }) => (
                                        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>Appointments</Text>
                                    ),
                                    tabBarIcon: ({ focused }) => (
                                        <Icons color={focused ? '#387ADF' : 'gray'} name='calendar' size={26} />
                                    )
                                }} />
                            <Tab.Screen name='Booking' component={AddAppointmentBox}
                                options={{
                                    tabBarLabel: ({ focused }) => (
                                        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>Booking</Text>
                                    ),
                                    tabBarIcon: ({ focused }) => (
                                        <Icons2 color={focused ? '#387ADF' : 'gray'} name='create-outline' size={26} />
                                    )
                                }} />
                        </> :
                        role === 'Nurse' ?
                            <>
                                <Tab.Screen name='Manage appointment' component={ManageAppointment}
                                    options={{
                                        tabBarLabel: ({ focused }) => (
                                            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>Manage appointments</Text>
                                        ),
                                        tabBarIcon: ({ focused }) => (
                                            <Icons color={focused ? '#387ADF' : 'gray'} name='calendar' size={26} />
                                        )
                                    }} />
                            </> : <></>
                }
                <Tab.Screen name='Myprofile' component={Personal}
                    options={{
                        tabBarLabel: ({ focused }) => (
                            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>My profile</Text>
                        ),
                        tabBarIcon: ({ focused }) => (
                            <Icons2 color={focused ? '#387ADF' : 'gray'} name='person-outline' size={26} />
                        )
                    }} />


            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
    },
    tabLabelFocused: {
        color: '#387ADF',
    },
});

export default MainScreen;
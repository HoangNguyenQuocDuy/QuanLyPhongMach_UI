import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Shadow } from "react-native-shadow-2";
import Icons from 'react-native-vector-icons/AntDesign'
import Icons2 from 'react-native-vector-icons/Ionicons'
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";

function Home({ navigation }) {
    const { username, first_name, last_name, gender, avatar, birth, email }
        = useSelector(state => state.user)

    return (
        <GestureHandlerRootView>
            <View style={[styles.wrapper]}>
                <View style={[styles.container, { backgroundColor: '#fff', height: '100%', width: '100%' }]}>

                    <View style={styles.bannerBox}>
                        <Image
                            source={require('../../assets/images/banner.png')}
                            style={styles.banner}
                        />
                    </View>

                    <View style={[styles.flex, styles.head, {
                        justifyContent: 'flex-start',
                        paddingVertical: 20, width: '86%', marginLeft: 20
                    }]}>
                        <Shadow distance={10} offset={[-2, 3]} startColor="#f0f2f5" style={styles.shadow}>
                            <Image
                                source={avatar ? { uri: avatar } : require('../../assets/images/nonAvatar.jpg')}
                                style={styles.img}
                            />
                        </Shadow>
                        <Text style={[styles.text, { marginLeft: 20 }]}>{`${username}`}</Text>
                    </View>

                    <View style={[styles.flex, { justifyContent: 'space-between', height: 300, paddingHorizontal: 20 }]}>
                        <TouchableOpacity style={styles.navigaBox} onPress={() => {
                            navigation.navigate('Appointments')
                        }}>
                            <View style={[styles.flex, { marginBottom: 12 }]}>
                                <Icons color={'#fff'} name='calendar' size={40} />
                            </View>
                            <View>
                                <Text style={[styles.textBox]}>Appointment</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.navigaBox, { marginRight: 12 }]} onPress={() => {
                            navigation.navigate('Booking')
                        }}>
                            <View style={[styles.flex, { marginBottom: 12 }]}>
                                <Icons2 color={'#fff'} name='create-outline' size={40} />
                            </View>
                            <View>
                                <Text style={[styles.textBox]}>Booking</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    flex: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'
    },
    img: {
        width: 70,
        height: 70,
        borderRadius: 100
    },
    banner: {
        width: '100%',
        height: 190
    },
    bannerBox: {
        marginTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E1D9'
    },
    head: {
        borderBottomWidth: 1,
        borderColor: '#E3E1D9',
    },
    patientBox: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    scrollView: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#E3E1D9'
    },
    wrapper: {
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 8
    },
    container: {
        // width: '86%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    appointmentBox: {
        borderWidth: 1, width: '80%', paddingHorizontal: 20,
        borderColor: '#E3E1D9',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 20
    },
    text: {
        fontSize: 18
    },
    textBox: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },

    navigaBox: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#387ADF',
        width: 160,
        paddingHorizontal: 20,
        paddingVertical: 20
    }
})

export default Home;
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slice/accountSlice";
import moment from "moment";
import { Shadow } from "react-native-shadow-2";

function Personal() {
    const dispatch = useDispatch()
    const { username, first_name, last_name, gender, avatar, birth, email }
        = useSelector(state => state.user)

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <View style={styles.flex}>
            <View>
                <View style={[{ display: 'flex', alignItems: 'center' }]}>
                    <Image
                        source={avatar ? { uri: avatar } : require('../../assets/images/nonAvatar.jpg')}
                        style={styles.img}
                    />
                    <Text style={[styles.text, { marginTop: 20 }]}>{`${username}`}</Text>
                </View>
                <View style={[{ marginTop: 60 }]}>
                    <Shadow distance={14} startColor="#f0f2f5" style={styles.shadow}>
                        <View style={[styles.infoBox]}>
                            <View style={[{ display: 'flex', alignItems: 'flex-start' }]}>
                                <View style={[{ display: 'flex', flexDirection: 'row' }]}>
                                    <Text style={[styles.text, styles.title, { marginTop: 20 }]}>{`First name: `}</Text>
                                    <Text style={[styles.text, { marginTop: 20 }]}>{`${first_name}`}</Text>
                                </View>
                                <View style={[{ display: 'flex', flexDirection: 'row' }]}>
                                    <Text style={[styles.text, styles.title, { marginTop: 20 }]}>{`Last name: `}</Text>
                                    <Text style={[styles.text, { marginTop: 20 }]}>{`${last_name}`}</Text>
                                </View>
                                <View style={[{ display: 'flex', flexDirection: 'row' }]}>
                                    <Text style={[styles.text, styles.title, { marginTop: 20 }]}>{`Gender: `}</Text>
                                    <Text style={[styles.text, { marginTop: 20 }]}>{`${gender}`}</Text>
                                </View>
                                <View style={[{ display: 'flex', flexDirection: 'row' }]}>
                                    <Text style={[styles.text, styles.title, { marginTop: 20 }]}>{`Birth: `}</Text>
                                    <Text style={[styles.text, { marginTop: 20 }]}>{`${moment.utc(birth).format('DD/MM/yyyy')}`}</Text>
                                </View>
                                <View style={[{ display: 'flex', flexDirection: 'row' }]}>
                                    <Text style={[styles.text, styles.title, { marginTop: 20 }]}>{`Email: `}</Text>
                                    <Text style={[styles.text, { marginTop: 20 }]}>{`${email}`}</Text>
                                </View>
                            </View>
                        </View>
                    </Shadow>
                </View>
            </View>
            <TouchableOpacity onPress={handleLogout} style={[styles.button]}>
                <Text style={[styles.buttonText]}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    img: {
        width: 150,
        height: 150,
        borderRadius:100
    },
    flex: {
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        width: 356,
        backgroundColor: '#3787eb',
        height: 46,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'center',
    },
    title: {
        fontWeight: 'bold'
    },
    infoBox: {
        width: 320,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderRadius: 20
    }
})

export default Personal;
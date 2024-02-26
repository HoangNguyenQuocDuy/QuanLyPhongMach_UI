import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slice/accountSlice";

function Personal() {
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <View style={styles.flex}>
            <TouchableOpacity onPress={handleLogout} style={[styles.button]}>
                <Text style={[styles.buttonText]}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        backgroundColor: '#fff',
        height:'100%',
        width:'100%',
        display:'flex',
        justifyContent: 'center',
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
})

export default Personal;
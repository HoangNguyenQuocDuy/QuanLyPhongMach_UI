import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { setShowConfirmation } from "../../store/slice/appSlice";

function ConfirmBox({ handleAction, title }) {
    const dispatch = useDispatch(state => state.app)

    return (
        <View style={styles.confirmBox}>
            <View style={[{
                backgroundColor: '#fff',
                paddingHorizontal: 16,
                paddingVertical: 20,
                borderRadius: 10,
                shadowColor: '#171717',
                shadowOffset: { width: -2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 5,
            }]}>
                <Text style={[{ fontSize: 16 }]}>{ title }</Text>
                <View style={[{
                    display: 'flex', justifyContent: 'space-around',
                    flexDirection: 'row', marginTop: 20, marginBottom: 4,
                }]}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2' }]} onPress={handleAction}>
                        <Text style={[{ fontSize: 16, color: '#fff' }]}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { dispatch(setShowConfirmation(false)) }}>
                        <Text style={[{ fontSize: 16, color: '#fff' }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    confirmBox: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: '100%'
    },
    button: {
        width: '40%',
        backgroundColor: '#fa6a67',
        height: 42,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default ConfirmBox;
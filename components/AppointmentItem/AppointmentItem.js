import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icons from 'react-native-vector-icons/Feather'
import { useSelector } from "react-redux";
import { format } from "date-fns"
import TruncatedText from "../TruncatedText/TruncatedText";
import moment from "moment";

function AppointmentItem({ id, scheduled_time, confirmed, reason }) {
    const date = moment.utc(scheduled_time).format('DD/MM/yyyy-HH:mm:ss')
    const { role } = useSelector(state => state.user)

    return (
        <View
            style={[{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexDirection: 'row', marginBottom: 20
            }]}
        >
                <Text style={[styles.text, {}]}>{date}</Text>

            <View style={[{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                flexDirection: 'row'
            }]}>
                {
                    confirmed ? <Text style={[styles.text, { color: '#9BCF53' }]}>Confirmed</Text> :
                        <TruncatedText maxLength={14} text={'Wait for confirmation...'} styles={{ color: '#FFD23F' }} fontSize={16} />
                }
            </View>
            {
                role === 'Patient' && <Icons name='trash-2' size={26} color={'#ff6666'} />
            }
            {
                role === 'Nurse' &&
                <TouchableOpacity style={[{
                    backgroundColor: '#fa6a67',
                    height: 38,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10
                }]}>
                    <Text style={[styles.text]}>Confirm</Text>
                </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    }
})

export default AppointmentItem;
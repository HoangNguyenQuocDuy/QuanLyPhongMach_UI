import { useState } from "react";
import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icons2 from 'react-native-vector-icons/AntDesign'
import { useDispatch } from "react-redux";
import { setMedicineIdActive, toggleIsOpenUpdateMedicineBox } from "../../store/slice/appSlice";
import TruncatedText from '../TruncatedText/TruncatedText'
import { TextInput } from "react-native-gesture-handler";

function MedicinePresItem({
    name, active_substances, quantity, days,
    image, usage_instructions, instructions
}) {
    const [isMedicineIconRotated, setIsMedicineIconRotated] = useState('false')
    const [isAdd, setIsAdd] = useState(false)
    // const [days, setDays] = useState('')
    const [_quantity, set_Quantity] = useState('')
    return (
        <View style={[{ backgroundColor: '#fff' }]}>
            <View style={[{
                display: 'flex', justifyContent: 'space-between', marginTop: 10,
                flexDirection: 'row', width: '100%', alignItems: 'center'
            }]}>
                <View style={[{
                    display: 'flex', alignItems: 'center', flexDirection: 'row',
                    justifyContent: 'space-between'
                }]}>
                    <Image
                        source={{ uri: image }} style={{ width: 60, height: 60, marginRight: 20, borderRadius: 8 }}
                    />
                    <View>
                        <Text style={styles.text}>
                            <Text style={[{ fontWeight: 'bold' }]}>Name: </Text>
                            {name}
                        </Text>
                        <Text style={styles.text}>
                            <Text style={[{ fontWeight: 'bold' }]}>Active subtances: </Text>
                            <TruncatedText text={`${active_substances}`} maxLength={6} />
                        </Text>
                    </View>
                </View>

            </View>
            {
                isMedicineIconRotated &&
                <View style={[{ marginLeft: 10, marginTop: 4 }]}>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Days: </Text>
                        {days}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Quantity: </Text>
                        {quantity}</Text>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Usage instruction: </Text>
                        {usage_instructions}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Instruction: </Text>
                        {instructions}
                    </Text>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    },
    flex: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    input: {
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 16,
        borderRadius: 10,
        width: '74%',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ececec'
    },
    inputActive: {
        borderColor: '#444'
    },
    button: {
        width: 80,
        backgroundColor: '#3787eb',
        height: 40,
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

export default MedicinePresItem;
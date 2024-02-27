import { useState } from "react";
import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icons2 from 'react-native-vector-icons/AntDesign'
import { useDispatch } from "react-redux";
import { setMedicineIdActive, toggleIsOpenUpdateMedicineBox } from "../../store/slice/appSlice";
import TruncatedText from '../TruncatedText/TruncatedText'
import { TextInput } from "react-native-gesture-handler";

function MedicineItem({
    id, name, active_substances, price, unit, quantity, description,
    image, check, handleSet, usage_instructions, instructions
}) {
    const dispatch = useDispatch()
    const [isMedicineIconRotated, setIsMedicineIconRotated] = useState('false')
    const [isAdd, setIsAdd] = useState(false)
    const [days, setDays] = useState('')
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
                            <Text style={[{ fontWeight: 'bold' }]}>Price: </Text>
                            {price}
                        </Text>
                    </View>
                    {
                        !check && <TouchableOpacity onPress={() => {
                            dispatch(toggleIsOpenUpdateMedicineBox())
                            dispatch(setMedicineIdActive(id))
                        }}>
                            <Icons style={[{ marginLeft: 20 }]} name='square-edit-outline' size={26} color={'#EBF400'} />
                        </TouchableOpacity>
                    }
                </View>

            </View>
            {
                isMedicineIconRotated &&
                <View style={[{ marginLeft: 10, marginTop: 4 }]}>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Active substances: </Text>
                        {active_substances}
                    </Text>
                    <Text style={styles.text}>
                        <Text >
                            <Text style={[{ fontWeight: 'bold' }]}>{`- Description: `}</Text>
                            <TruncatedText text={description} fontSize={16} maxLength={22} />
                        </Text>
                    </Text>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Quantity: </Text>
                        {quantity}</Text>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Unit: </Text>
                        {unit}
                    </Text>
                </View>
            }
            {
                check &&
                <TouchableOpacity onPress={() => { setIsAdd(true) }}>
                    <View style={[styles.flex]}>
                        <Icons2 name="pluscircleo" size={30} color={'#74E291'} />
                    </View>
                </TouchableOpacity>
            }
            {
                isAdd &&
                <View>
                    <View style={[styles.flex, { justifyContent: 'flex-start', marginTop: 10 }]}>
                        <Text style={[styles.text, { minWidth: 74 }]}>Days</Text>
                        <TextInput
                            style={[styles.input, days !== '' && styles.inputActive]}
                            placeholder="days..."
                            name='days'
                            keyboardType="numeric"
                            value={days}
                            onChangeText={(text) => { setDays(text) }}
                        />
                    </View>
                    <View style={[styles.flex, { justifyContent: 'flex-start', marginTop: 10 }]}>
                        <Text style={[styles.text, { minWidth: 74 }]}>Quantity</Text>
                        <TextInput
                            style={[styles.input, days !== '' && styles.inputActive]}
                            placeholder="quantity..."
                            name='quantity'
                            keyboardType="numeric"
                            value={_quantity}
                            onChangeText={(text) => { set_Quantity(text) }}
                        />
                    </View>

                    <View style={[styles.flex, { marginTop: 10 }]}>
                        <TouchableOpacity onPress={() => {
                            if (days !== '' && _quantity!=='') {
                                handleSet(state => [...state, {
                                    id, name, price, quantity, days, _quantity,
                                    image, usage_instructions, instructions
                                }])
                            }
                        }} style={[styles.button]}>
                            <Text style={[styles.buttonText]}>
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
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

export default MedicineItem;
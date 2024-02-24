import { useState } from "react";
import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from "react-redux";
import { setMedicineIdActive, toggleIsOpenUpdateMedicineBox } from "../../store/slice/appSlice";

function MedicineItem({
    id, name, active_substances, price, unit, quantity, description, image
}) {
    const dispatch = useDispatch()
    const [isMedicineIconRotated, setIsMedicineIconRotated] = useState('false')
    return (
        <View style={[{}]}>
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
                    <TouchableOpacity onPress={() => {
                        dispatch(toggleIsOpenUpdateMedicineBox())
                        dispatch(setMedicineIdActive(id))
                    }}>
                        <Icons style={[{ marginLeft: 20 }]} name='square-edit-outline' size={26} color={'#EBF400'} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { setIsMedicineIconRotated(!isMedicineIconRotated) }}>
                    <Icons name={!isMedicineIconRotated ? 'arrow-up-drop-circle-outline' : 'arrow-down-drop-circle-outline'}
                        size={26} color={'#74E291'}
                    />
                </TouchableOpacity>
            </View>
            {
                isMedicineIconRotated &&
                <View style={[{ marginLeft: 10, marginTop: 4 }]}>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Active substances: </Text>
                        {active_substances}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={[{ fontWeight: 'bold' }]}>- Description: </Text>
                        {description}
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
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    }
})

export default MedicineItem;
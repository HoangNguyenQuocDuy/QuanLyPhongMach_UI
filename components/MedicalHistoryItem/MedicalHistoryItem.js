import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import MedicineItem from "../MedicineItem/MedicineItem";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMedicineById } from "../../store/slice/medicineSlice";
import MedicinePresItem from "../MedicinePresItem/MedicinePresItem";

function MedicalHistoryItem({ doctor, prescribed_medicines, symptoms, conclusion, created_at }) {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [medicinesPres, setMedicinesPres] = useState([])

    useEffect(() => {
        prescribed_medicines.map(medicine => {
            dispatch(getMedicineById({ access_token, id: medicine.id }))
                .then(data => {
                    setMedicinesPres(state => [...state, {
                        name: data.payload.name,
                        active_substances: data.payload.active_substances,
                        instructions: medicine.instructions,
                        usage_instructions: medicine.usage_instructions,
                        image: data.payload.image,
                        quantity: medicine.quantity,
                        days: medicine.days
                    }])
                })
                .catch(err => {
                    console.log('err when get medicine by id: ', err)
                })
        })
    }, [])

    return (
        <View style={styles.wrapper}>
            {
                medicinesPres &&
                <View style={styles.container}>
                    <View style={[{ width: '86%' }]}>
                        <View>
                            <Text style={styles.text}>
                                <Text style={[{ fontWeight: 'bold' }]}>Date: </Text>
                                {`${moment.utc(created_at).format('DD/MM/yyyy')}`}
                            </Text>
                            <Text style={styles.text}>
                                <Text style={[{ fontWeight: 'bold' }]}>Symptoms: </Text>
                                {`${symptoms}`}
                            </Text>
                            <Text style={styles.text}>
                                <Text style={[{ fontWeight: 'bold' }]}>Conclusion: </Text>
                                {`${conclusion}`}
                            </Text>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>Doctor information:</Text>
                            <Text style={styles.text}>
                                <Text style={[{ fontWeight: 'bold' }]}> - Name: </Text>
                                {`${doctor.user.first_name} ${doctor.user.last_name}`}
                            </Text>
                            <Text style={styles.text}>
                                <Text style={[{ fontWeight: 'bold' }]}> - Gender: </Text>
                                {`${doctor.gender}`}
                            </Text>
                            <Text style={styles.text}>
                                <Text style={[{ fontWeight: 'bold' }]}> - Speciality: </Text>
                                {`${doctor.speciality}`}
                            </Text>
                            <Text style={[styles.text, { fontWeight:'bold' }]}>List of medication:</Text>
                            {
                                medicinesPres.map(medicine => {
                                    const { id, name, active_substances, days, quantity,
                                        image, usage_instructions, instructions } = medicine
                                    const imageUri = image && image.substring(image.indexOf('image/upload/') + 'image/upload/'.length)

                                    return (
                                        <MedicinePresItem
                                            key={id} name={name} active_substances={active_substances}
                                            quantity={quantity} days={days} image={imageUri} usage_instructions={usage_instructions}
                                            instructions={instructions}
                                        />
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'
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
    },
    container: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectedDate: {
        marginTop: 20,
        fontSize: 18,
    },
    input: {
        fontSize: 16,
        paddingTop: 10,
        paddingLeft: 46,
        height: 42,
        paddingHorizontal: 10,
        width: '100%',
        marginBottom: 20,
        borderRadius: 10,
    },
    textInput: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 46,
        height: 42,
        width: '100%',
        borderRadius: 10,
    },
    inputActive: {
        borderColor: '#444'
    },
    appointmentBox: {
        borderWidth: 1, width: '80%', paddingHorizontal: 20,
        borderColor: '#E3E1D9',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 20
    },
    text: {
        fontSize: 16
    }
})

export default MedicalHistoryItem;
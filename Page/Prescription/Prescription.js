import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns"
import Icons2 from 'react-native-vector-icons/AntDesign'
import Icons from 'react-native-vector-icons/Feather'
import Icons3 from 'react-native-vector-icons/FontAwesome'
import Icons4 from 'react-native-vector-icons/Ionicons'
import Icons5 from 'react-native-vector-icons/Fontisto'
import Icons6 from 'react-native-vector-icons/Entypo'
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker'
import { createAppointment } from "../../store/slice/appointmentsSlice";
import { setIsReloadAppointment, setSelectedAppointment, toggleIsOpenAddAppointmentBox } from "../../store/slice/appSlice";
import SearchMedicines from "../../components/SearchMedicines/SearchMedicines";
import newRequest from "../../ultils/request";

function Prescription({ navigation }) {
    const { access_token } = useSelector(state => state.account)
    const [symptoms, setSymptoms] = useState('')
    const [conclusion, setConclusion] = useState('')
    const dispatch = useDispatch()
    const { selectedAppointment } = useSelector(state => state.app)
    const [medicinesPres, setMedicinesPres] = useState([])
    const [isCreated, setIsCreated] = useState(false)
    const [isCreateSuccessful, setIsCreateSuccessful] = useState(false)

    const handleCreatePrescription = async () => {
        if (symptoms !== '' && conclusion !== '' && medicinesPres.length > 0) {
            const data = {
                patient: selectedAppointment.patient_id,
                symptoms,
                conclusion,
                appointment: selectedAppointment.id,
                prescribed_medicines: medicinesPres.map(medicinePres => ({
                    medicine: medicinePres.id,
                    quantity: parseInt(medicinePres._quantity),
                    days: parseInt(medicinePres.days)
                }))
            }
            await newRequest.post('/prescriptions/', data, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": 'application/json'
                }
            }).then(data => {
                dispatch(setSelectedAppointment(null))
                setIsCreateSuccessful(true)
                setMedicinesPres()
                setConclusion('')
                setSymptoms('')
                dispatch(setIsReloadAppointment(true))
                console.log('create prescription successful: ', data.data)
            }).catch(err => {
                console.log('err when create prescription: ', err)
            })
            console.log('data update: ', data)
        }
    }

    useEffect(() => {
        let timer
        if (isCreateSuccessful) {
            timer = setTimeout(() => {
                setIsCreateSuccessful(false)
            }, 3000)
        }

        console.log('selectedAppointment: ', selectedAppointment)
    }, [isCreateSuccessful])

    return (
        <GestureHandlerRootView>

            <View style={[styles.wrapper]}>
                <View style={[styles.container]}>
                    {
                        !selectedAppointment ? <View style={[styles.flex, { alignItems:'center' }]}>
                            <Text style={styles.success}>Please</Text>
                            <TouchableOpacity onPress={() => {navigation.navigate('Appointment')}}>
                                <Text style={[styles.success, { marginHorizontal:4, textDecorationLine:'underline' }]}>choose an appointment</Text>
                            </TouchableOpacity>
                            <Text style={styles.success}>to handle this action</Text>
                        </View> :

                            <>
                                <View style={[{ width: '100%' }]}>
                                    <View style={[{ width: '100%' }]}>
                                        <Text style={[styles.title, { marginTop: 20, marginLeft: 20 }]}>Appointment infomation</Text>
                                        <View>
                                            <View style={[styles.flex, { width: '100%', position: 'relative' }]}>
                                                <TextInput
                                                    style={[styles.input, styles.inputActive]}
                                                    placeholder="Fullname..."
                                                    name='fullname'
                                                    value={selectedAppointment.name}
                                                    editable={false}
                                                />
                                                <View style={[{
                                                    position: 'absolute', left: 40,
                                                    top: '12%'
                                                }]}>
                                                    <Icons4 name="person-outline" size={26} color={'#444'} />
                                                </View>
                                            </View>
                                            <View style={[styles.flex, { width: '100%', position: 'relative' }]}>
                                                <TextInput
                                                    style={[styles.input, selectedAppointment.email !== '' && styles.inputActive]}
                                                    placeholder="Email..."
                                                    name='email'
                                                    value={selectedAppointment.email}
                                                    editable={false}
                                                />
                                                <View style={[{
                                                    position: 'absolute', left: 40,
                                                    top: '12%',

                                                },]}>
                                                    <Icons5 name="email" size={26} color={selectedAppointment.email === '' ? '#999' : '#444'} />
                                                </View>
                                            </View>
                                            <View style={[styles.flex, { width: '100%', position: 'relative' }]}>
                                                <TextInput
                                                    style={[styles.input, selectedAppointment.email !== '' && styles.inputActive]}
                                                    placeholder="Email..."
                                                    name='email'
                                                    value={selectedAppointment.date}
                                                    editable={false}
                                                />
                                                <View style={[{
                                                    position: 'absolute', left: 40,
                                                    top: '12%',

                                                },]}>
                                                    <Icons3 name="calendar-o" size={26} color={selectedAppointment.date === '' ? '#999' : '#444'} />
                                                </View>
                                            </View>
                                            <View style={[styles.flex, { width: '100%', position: 'relative' }]}>
                                                <TextInput
                                                    style={[styles.input, selectedAppointment.hour !== '' && styles.inputActive]}
                                                    placeholder="Hour..."
                                                    name='hour'
                                                    value={selectedAppointment.hour}
                                                    editable={false}
                                                />
                                                <View style={[{
                                                    position: 'absolute', left: 40,
                                                    top: '12%',

                                                },]}>
                                                    <Icons2 name="clockcircleo" size={26} color={selectedAppointment.hour === '' ? '#999' : '#444'} />
                                                </View>
                                            </View>
                                            <View style={[styles.flex, { width: '100%', position: 'relative' }]}>
                                                <TextInput
                                                    style={[styles.input, selectedAppointment.reason !== '' && styles.inputActive]}
                                                    placeholder="Email..."
                                                    name='text'
                                                    value={selectedAppointment.reason}
                                                    editable={false}
                                                />
                                                <View style={[{
                                                    position: 'absolute', left: 40,
                                                    top: '12%',

                                                },]}>
                                                    <Icons6 name="text" size={26} color={selectedAppointment.reason === '' ? '#999' : '#444'} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <ScrollView style={[{ width: '100%' }]}>
                                    <View style={[{ width: '100%' }]}>
                                        {/* <View> */}
                                        <Text style={[styles.title, styles.marginTitle, { marginTop: 20, textAlign: 'left' }]}>Symptoms</Text>
                                        <View style={[styles.flex]}>
                                            <View style={[styles.flex, { width: '100%', position: 'relative' }]}>
                                                <TextInput
                                                    style={[styles.input, symptoms !== '' && styles.inputActive]}
                                                    placeholder="Systoms..."
                                                    name='systom'
                                                    value={symptoms}
                                                    onChangeText={text => { setSymptoms(text) }}
                                                />
                                                <View style={[{
                                                    position: 'absolute', left: 38,
                                                    top: '12%'
                                                }]}>
                                                    <Icons name="edit-3" size={26} color={symptoms === '' ? '#E3E1D9' : '#444'} />
                                                </View>
                                            </View>
                                        </View>
                                        <Text style={[styles.title, styles.marginTitle, { marginTop: 10, textAlign: 'left' }]}>Conclusion</Text>
                                        <View style={[styles.flex]}>
                                            <View style={[styles.flex, { width: '100%', position: 'relative' }]}>
                                                <TextInput
                                                    style={[styles.input, conclusion !== '' && styles.inputActive]}
                                                    placeholder="Conclusion..."
                                                    name='conclusion'
                                                    value={conclusion}
                                                    onChangeText={text => { setConclusion(text) }}
                                                />
                                                <View style={[{
                                                    position: 'absolute', left: 38,
                                                    top: '12%'
                                                }]}>
                                                    <Icons name="edit-3" size={26} color={conclusion === '' ? '#E3E1D9' : '#444'} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* </View> */}


                                        <View style={[{ width: '100%' }]}>
                                            <Text style={[styles.title, styles.marginTitle, { marginTop: 20 }]}>Medicines</Text>
                                        </View>
                                        <SearchMedicines medicinesPres={medicinesPres} setMedicinesPres={setMedicinesPres} />



                                        {/* <View style={[{ width: '100%', position: 'relative' }]}>
                                <Text style={[styles.title, { marginTop: 36 }]}>Medical examination reason</Text>
                            </View> */}
                                    </View>
                                </ScrollView>

                                <TouchableOpacity onPress={handleCreatePrescription} style={[styles.button]}>
                                    <Text style={[styles.buttonText]}>
                                        Create prescription
                                    </Text>
                                </TouchableOpacity>
                            </>
                    }
                </View>
            </View>

        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    flex: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'
    },
    success: {
        color: '#74E291',
        fontSize: 16
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
        justifyContent: 'center',
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
        paddingBottom: 10,
        paddingLeft: 46,
        height: 42,
        borderRadius: 10,
        width: '86%',
        marginBottom: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ececec'
    },
    inputActive: {
        borderColor: '#444'
    },
    hourItem: {
        borderWidth: 1,
        width: 80,
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#bfc0c5',
        marginRight: 20
    },
    hourItemActive: {
        backgroundColor: '#e8f0fd',
    },
    hourItemTextActive: {
        color: '#2377f5',
        fontWeight: 'bold'
    },
    shadow: {
        shadowColor: 'red',
        shadowOffset: { width: -2, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
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
    marginTitle: {
        marginLeft: 20
    }
})

export default Prescription;
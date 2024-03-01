import { StyleSheet, Text, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icons from 'react-native-vector-icons/Feather'
import Icons2 from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns"
import TruncatedText from "../TruncatedText/TruncatedText";
import moment from "moment";
import { Shadow } from "react-native-shadow-2";
import { useEffect, useState } from "react";
import newRequest from "../../ultils/request";
import { useDebounce } from "use-debounce";
import { fetchDoctorsData } from "../../store/slice/doctorsSlice";
import UserTag from "../UserTag/UserTag";
import { deleteAppointment, updateAppointments } from "../../store/slice/appointmentsSlice";
import { setIsReloadAppointment, setSelectedAppointment } from "../../store/slice/appSlice";

function UpdateAppointmentItem({ id, scheduled_time, confirmed, patient, 
    reason, get, navigation, patient_id }) {
    const { access_token } = useSelector(state => state.account)
    const dispatch = useDispatch()
    const date = moment.utc(scheduled_time).format('DD/MM/yyyy')
    const hour = moment.utc(scheduled_time).format('HH:mm:ss')
    const { role } = useSelector(state => state.user)
    const [_patient, set_Patient] = useState()
    const [searchDoctorsValue, setSearchDoctorsValue] = useState('')
    const [debounceSearchValue] = useDebounce(searchDoctorsValue, 2000)
    const [doctors, setDoctors] = useState([])
    const [doctorsSearched, setDoctorsSeached] = useState([])
    const [isFetchDoctors, setIsFetchDoctors] = useState(true)
    const [isFetchPatient, setIsFetchPatient] = useState(false)
    const [selecteddDoctor, setSelectedDoctor] = useState()

    const handleConfirmAppointment = async () => {
        const data = {
            doctor: selecteddDoctor.id,
            confirmed: true
        }

        dispatch(updateAppointments({ access_token, appointmentId: id, updateData: data }))
            .then(data => {
                console.log('data from update appointment: ', data.payload)
                dispatch(setIsReloadAppointment(true))
            })
            .catch(err => {
                console.log('err when update appointment: ', err)
            })
    }

    const handleGetDoctors = async () => {
        let dateFormat = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
        await newRequest.get(`/schedules/?date=${dateFormat}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(data => {
                let schedules = data.data.results
                dispatch(fetchDoctorsData({ access_token }))
                    .then(data => {
                        let doctorIds = schedules.map(schedule => schedule.doctors).flat()
                        // console.log(doctorIds)
                        let doctorsSchedule = data.payload.filter(doctor => doctorIds.includes(doctor.id))
                        setDoctors(doctorsSchedule)
                        // console.log('doctorsSchedule: ', doctorsSchedule)
                    }).catch(err => {
                        console.log('Err from nurse fetch doctors: ', err)
                    })
            })
            .catch(err => {
                console.log('Err when get schedule from nurse: ', err)
            })
    }

    const handleDeleteAppointment = () => {
        dispatch(deleteAppointment({ access_token, appointmentId:id }))
        .then(data => {
            console.log('delete appointment successfull - id: ', data.payload)
            dispatch(setIsReloadAppointment(true))
        })
        .catch(err => {
            console.log('err when delete appointment: ', err)
        })
    }

    useEffect(() => {
        const handleGetPatient = async () => {
            await newRequest.get(`/patients/${patient}/`)
                .then(data => {
                    set_Patient(data.data)
                    setIsFetchPatient(true)
                })
                .catch(err => {
                    console.log('err when get patient by id: ', err)
                })
        }
        handleGetPatient()

        if (isFetchDoctors) {
            handleGetDoctors()
            console.log(1)
        }
        if (debounceSearchValue !== '') {
            let _doctorSearched = doctors.filter(doctor => {
                return doctor.user.first_name.toLowerCase().includes(debounceSearchValue.toLowerCase()) ||
                    doctor.user.last_name.toLowerCase().includes(debounceSearchValue.toLowerCase())
            }
            )
            setDoctorsSeached(_doctorSearched)
        } else if (debounceSearchValue === '') {
            setDoctors([])
        }

    }, [debounceSearchValue, isFetchDoctors, isFetchPatient, date, selecteddDoctor])

    return (
        <View style={styles.wrapper}>
            <Shadow distance={14} startColor="#f0f2f5" style={styles.shadow}>
                <View style={styles.container}>
                    <View style={styles.flex}>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Date: `} </Text>
                        <Text style={[styles.text]}>{date}</Text>
                    </View>
                    <View style={[styles.flex, { marginVertical: 10 }]}>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Hour: `} </Text>
                        <Text style={[styles.text]}>{hour}</Text>
                    </View>

                    <View style={[{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        flexDirection: 'row'
                    }]}>
                    </View>
                    <View style={[styles.flex]}>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>{`State: `} </Text>
                        {
                            confirmed ? <Text style={[styles.text, { color: '#9BCF53' }]}>Confirmed</Text> :
                                <TruncatedText maxLength={24} text={'Wait for confirmation...'} styles={{ color: '#FFD23F' }} fontSize={18} />
                        }
                    </View>
                    {
                        role === 'Patient' &&
                        <View style={[styles.flex, { justifyContent:'center', marginTop:10 }]}>
                            <TouchableOpacity onPress={handleDeleteAppointment} style={[styles.button, { width: '100%', backgroundColor:'#FF6868' }]}>
                                <Text style={[styles.buttonText]}>
                                    Delete appointment
                                </Text>
                            </TouchableOpacity>
                        </View>
                        // <Icons name='trash-2' size={26} color={'#ff6666'} />
                    }
                    {
                        _patient &&
                        <>
                            <View style={[styles.flex, { marginVertical: 10 }]}>
                                <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Name: `} </Text>
                                <Text style={[styles.text]}>{`${_patient.user.first_name} ${_patient.user.last_name}`}</Text>
                            </View>
                            <View style={[styles.flex]}>
                                <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Email: `} </Text>
                                <Text style={[styles.text]}>{`${_patient.user.email}`}</Text>
                            </View>
                            <View style={[styles.flex, { marginVertical: 10 }]}>
                                <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Reason: `} </Text>
                                <Text style={[styles.text]}>{`${reason}`}</Text>
                            </View>
                        </>
                    }

                    {
                        get &&
                        <View style={[styles.flex, { width: '100%', justifyContent: 'center' }]}>
                            <TouchableOpacity onPress={() => {
                                dispatch(setSelectedAppointment({
                                    patient_id, id, date, hour, name: `${_patient.user.first_name} ${_patient.user.last_name}`,
                                    email: _patient.user.email, reason
                                }))
                                navigation.navigate('Prescriptions')

                            }} style={[styles.button]}>
                                <Text style={[styles.buttonText]}>
                                    View to make presciption
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {
                        role !== 'Patient' && !get && <TouchableOpacity onPress={() => { setIsFetchDoctors(!isFetchDoctors) }} style={[{ marginVertical: 4 }]}>
                            <View style={[styles.flex, { alignItems: 'center' }]}>
                                <Icons2 name="pluscircleo" size={30} color={'#A5DD9B'} />
                                <Text style={[styles.text, { color: '#A5DD9B', fontWeight: '500', marginLeft: 10 }]}>Doctor</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    {
                        selecteddDoctor &&
                        <View style={[{ position: 'relative' }]}>
                            <UserTag
                                key={selecteddDoctor.id}
                                first_name={selecteddDoctor.first_name}
                                last_name={selecteddDoctor.last_name}
                                avatar={selecteddDoctor.avatar}
                                speciality={selecteddDoctor.speciality}
                                username={selecteddDoctor.username}
                                id={selecteddDoctor.id}
                            />
                        </View>
                    }

                    {
                        role !== 'Patient' && isFetchDoctors && !get ?
                            <Shadow distance={2} startColor="#F6F5F5" offset={[-2, 22]}
                                style={[styles.shadow, styles.shadowRadius, {
                                    width: '100%', marginTop: 20, marginBottom: 10
                                }]}>
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Doctor name..."
                                        name='name'
                                        value={searchDoctorsValue}
                                        onChangeText={(text) => { setSearchDoctorsValue(text) }}
                                    />
                                </View>

                                {
                                    searchDoctorsValue !== '' && doctorsSearched.length > 0 && doctorsSearched.map(doctor => {
                                        if (doctor) {
                                            return <UserTag
                                                key={doctor.id}
                                                first_name={doctor.user.first_name}
                                                last_name={doctor.user.last_name}
                                                avatar={doctor.user.avatar}
                                                speciality={doctor.speciality}
                                                username={doctor.user.username}
                                                id={doctor.id}
                                                check={true}
                                                handle={setSelectedDoctor}
                                            />
                                        }
                                    })
                                }
                            </Shadow> : <></>
                    }

                    {
                        role === 'Nurse' &&
                        <Shadow distance={6} startColor="#E3E1D9" offset={[3, 22]} style={[styles.shadow, {
                            width: '100%', marginTop: 20, marginBottom: 10
                        }]}>
                            <TouchableOpacity onPress={handleConfirmAppointment} style={[{
                                backgroundColor: '#387ADF',
                                height: 38,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%'
                            }]}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold' }]}>Confirm</Text>
                            </TouchableOpacity>
                        </Shadow>
                    }
                </View>
            </Shadow>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18
    },
    shadow: {
        width: 320,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    wrapper: {
        marginTop: 10,
        width: '100%',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 10
    },
    flex: {
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'row'
    },
    input: {
        fontSize: 16,
        paddingLeft: 16,
        height: 42,
        borderRadius: 100,
        width: '100%',
        fontSize: 16
    },
    shadowRadius: {
        borderRadius: 20
    },
    button: {
        width: '100%',
        backgroundColor: '#3787eb',
        height: 46,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        paddingHorizontal: 16
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
})

export default UpdateAppointmentItem;
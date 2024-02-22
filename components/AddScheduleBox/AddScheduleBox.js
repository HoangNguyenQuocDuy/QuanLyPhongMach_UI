import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { StyleSheet, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import newRequest from "../../ultils/request";
import TruncatedText from "../TruncatedText/TruncatedText";
import Icons from 'react-native-vector-icons/Feather'
import Icons2 from 'react-native-vector-icons/FontAwesome'
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from "react-native";
import { useDebounce } from "use-debounce";
import { setIsLoadSchedulesSearched, setShowConfirmation, toggleIsOpenAddScheduleBox, toggleIsOpenScheduleInfo } from "../../store/slice/appSlice";
import { createSchedule, deleteSchedule, updateSchedules } from "../../store/slice/scheduleSlice";
import ConfirmBox from "../ConfirmBox/ConfirmBox";

function AddScheduleBox() {
    const dispatch = useDispatch()
    const { scheduleIdActive, showConfirmation } = useSelector(state => state.app)
    const [schedule, setSchedule] = useState()
    const doctors = useSelector(state => state.doctors)
    const nurses = useSelector(state => state.nurses)
    const [scheduleDoctors, setScheduleDoctors] = useState([])
    const [scheduleNurses, setScheduleNurses] = useState([])
    const { access_token } = useSelector(state => state.account)
    const shifts = ['06:00:00', '14:00:00', '22:00:00']
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [date, setDate] = useState()
    const [searchDoctorsValue, setSearchDoctorsValue] = useState()
    const [searchNursesValue, setSearchNursesValue] = useState()
    const [debouncedSearchDoctorsValue] = useDebounce(searchDoctorsValue, 1000)
    const [isFetchedSchedule, setIsFetchedSchedule] = useState(false)
    const [debouncedSearchNursesValue] = useDebounce(searchNursesValue, 1000)
    const [searchedDoctos, setSearchedDoctors] = useState([])
    const [searchedNurses, setSearchedNurses] = useState([])
    const [hours, setHours] = useState(shifts[0])
    const [description, setDescription] = useState(schedule && schedule.description ? schedule.description : '')

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        if (selectedDate) {
            setDate(currentDate);
        } else {
            const localDate = new Date(currentDate);
            setDate(localDate);
        }
        setShowDatePicker(Platform.OS === 'ios');
    }

    const handleGetDoctorsById = ({ ids }) => {
        setScheduleDoctors(doctors.filter(doctor => ids.includes(doctor.id)))
    }

    const handleGetNursesById = ({ ids }) => {
        setScheduleNurses(nurses.filter(nurse => ids.includes(nurse.id)))
    }

    const handleDeleteSchedule = () => {
        dispatch(deleteSchedule({ access_token, scheduleId: scheduleIdActive }))
            .then(data => {
                console.log('delete successful: ', data)
                dispatch(setShowConfirmation(false))
                dispatch(toggleIsOpenScheduleInfo())
                dispatch(setIsLoadSchedulesSearched(true))
            })
            .catch(err => {
                console.log('Error when delete schedule: ', err)
            })
    }

    useEffect(() => {
        if (debouncedSearchDoctorsValue !== '') {
            const handleSearchDoctor = async () => {
                await newRequest.get(`/doctors/?name=${debouncedSearchDoctorsValue}`, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                    .then(data => {
                        const exitedIds = scheduleDoctors.map(doctor => doctor.id)
                        const _data = data.data.filter(doctor => !exitedIds.includes(doctor.id))
                        setSearchedDoctors(_data)
                    })
                    .catch(err => {
                        console.log('Error when get search doctor: ', err)
                    })
            }
            handleSearchDoctor()
        } else {
            setSearchedDoctors([])
            setScheduleDoctors(scheduleDoctors)
        }

        if (debouncedSearchNursesValue !== '') {
            const handleSearchNurse = async () => {
                await newRequest.get(`/nurses/?name=${debouncedSearchNursesValue}`, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                    .then(data => {
                        const exitedIds = scheduleNurses.map(nurses => nurses.id)
                        const _data = data.data.filter(nurse => !exitedIds.includes(nurse.id))
                        setSearchedNurses(_data)
                    })
                    .catch(err => {
                        console.log('Error when get search nurse: ', err)
                    })
            }
            handleSearchNurse()
        } else {
            setSearchedNurses([])
        }
    }, [debouncedSearchDoctorsValue, debouncedSearchNursesValue])

    const handleExceptStaff = ({ id, role }) => {
        if (role === 'Doctor') {
            setScheduleDoctors(state => state.filter(doctor => doctor.id !== id))
        } else {
            setScheduleNurses(state => state.filter(nurse => nurse.id !== id))
        }
    }

    const handleCheckStaffsSearch = ({ id, role }) => {
        if (role === 'Doctor') {
            const pickedDoctor = doctors.find(doctor => doctor.id === id)
            console.log(pickedDoctor)
            setScheduleDoctors(state => [...state, pickedDoctor])
            setSearchedDoctors(state => state.filter(doctor => doctor.id !== id))
        } else {
            const pickedNurse = nurses.find(nurse => nurse.id === id)
            setSearchedNurses(state => state.filter(nurse => nurse.id !== id))
            setScheduleNurses(state => [...state, pickedNurse])
        }
    }

    const handleUpdateSchedule = () => {
        const schedule_time = `${moment.utc(date).format("yyyy-MM-DD")}T${hours}`
        const doctorIds = scheduleDoctors.map(doctor => doctor.id)
        const nurseIds = scheduleNurses.map(nurse => nurse.id)
        const data = {
            schedule_time,
            description,
            doctors: doctorIds,
            nurses: nurseIds
        }
        console.log(data)
        dispatch(createSchedule({ access_token, data }))
            .then(data => {
                console.log('create schedule ', data.payload)
                dispatch(toggleIsOpenAddScheduleBox())
                dispatch(setIsLoadSchedulesSearched(true))
            })
            .catch(err => {
                console.log('Error when creating schedule: ', err)
            })
    }

    return (
        <GestureHandlerRootView style={styles.wrapper}>
            <View style={[{ width: '100%' }]}>
                <ScrollView style={[{ width: '100%', marginTop: 80 }]}>
                    <View style={[{
                        display: 'flex', justifyContent: 'space-between',
                        flexDirection: 'row', alignItems: 'center',
                        marginBottom: 20
                    }]}>
                        <Text style={[styles.title, { marginLeft: 25, textAlign: 'center' }]}>
                            SCHEDULE
                        </Text>
                        <TouchableOpacity style={[{ marginRight: 40 }]} onPress={() => { dispatch(toggleIsOpenScheduleInfo()) }}>
                            <Icons2 name="close" size={50} color={'black'} />
                        </TouchableOpacity>
                    </View>


                    <View style={[styles.flex, { justifyContent: 'space-between', alignItems: 'center', marginLeft: 25 }]}>
                        <Text style={[styles.title, { marginBottom: 6, marginTop: 4 }]}>Schedule time</Text>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.picker}>
                            <Picker
                                style={[styles.input, { width: '100%' }]}
                                selectedValue={hours}
                                onValueChange={(itemValue) => {
                                    setHours(itemValue)
                                }}>
                                {shifts.map((shift) => (
                                    <Picker.Item key={shift} label={shift} value={shift} />
                                ))}
                            </Picker>
                        </View>

                        <View style={[styles.input, { marginTop: 10, paddingLeft: 12 }]}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <Text style={[{ fontSize: 16 }]}>{date ? moment.utc(date).format("DD/MM/yyyy") : 'Select the time...'}</Text>
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date || new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                    </View>
                    <View style={[styles.flex, { justifyContent: 'space-between', alignItems: 'center', marginLeft: 25 }]}>
                        <Text style={[styles.title, { marginBottom: 6, marginTop: 4 }]}>Description</Text>
                    </View>
                    <View style={[styles.container]}>
                        <TextInput
                            style={styles.input}
                            name="description"
                            value={description}
                            onChangeText={(text) => { setDescription(text) }}
                            placeholder="Description..."
                        />
                    </View>

                    <View style={[{ marginLeft: 25 }]}>
                        <View style={[styles.flex, { justifyContent: 'space-between', alignItems: 'center' }]}>
                            <Text style={[styles.title, { marginBottom: 6, marginTop: 4 }]}>Doctors</Text>
                        </View>

                        {/* search box */}
                        <View style={[{
                            position: 'relative'
                        }]}>
                            <View style={[{
                                display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                alignItems: 'center'
                            }]}>
                                <TextInput
                                    style={[styles.input, { marginLeft: -25, width: '85%' }]}
                                    name="searchDoctorsValue"
                                    value={searchDoctorsValue}
                                    onChangeText={(text) => { setSearchDoctorsValue(text) }}
                                    placeholder="Search doctors..."
                                />
                            </View>
                            {
                                searchedDoctos.length > 0 &&
                                <View style={[{
                                    position: 'absolute', zIndex: 10, top: 44,
                                    marginLeft: 10, width: '86%',
                                    backgroundColor: '#fff',
                                    paddingHorizontal: 16,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    borderRadius: 10,
                                    shadowColor: '#171717',
                                    shadowOffset: { width: -2, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 3,
                                    elevation: 5,
                                }]}>
                                    {
                                        searchedDoctos.map(doctor => (
                                            <View key={doctor.id} style={[styles.flex, { alignItems: 'center', marginBottom: 6, justifyContent: 'space-between' }]}>
                                                <View style={[styles.flex, { alignItems: 'center', marginBottom: 6 }]}>
                                                    <View>
                                                        <Image
                                                            source={doctor.user.avatar ? doctor.user.avatar : require('../../assets/images/nonAvatar.jpg')}
                                                            style={styles.img}
                                                        />
                                                    </View>
                                                    <View style={[{ marginLeft: 12 }]}>
                                                        <View style={styles.flex}>
                                                            <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{doctor.user.first_name}</Text>
                                                            <Text style={[{ fontSize: 16, fontWeight: 'bold', marginLeft: 4 }]}>{doctor.user.last_name}</Text>
                                                        </View>
                                                        <TruncatedText text={`Speciality: ${doctor.speciality}`} maxLength={24} />
                                                    </View>
                                                </View>
                                                <TouchableOpacity onPress={() => { handleCheckStaffsSearch({ id: doctor.id, role: 'Doctor' }) }}>
                                                    <Icons name='plus' size={28} color={'#74E291'} />
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    }

                                </View>
                            }

                            <View style={[{ marginLeft: 10, width: '86%', }]}>
                                {
                                    scheduleDoctors.length > 0 && scheduleDoctors.map(doctor => (
                                        <View key={doctor.id} style={[styles.flex, { alignItems: 'center', marginBottom: 6, justifyContent: 'space-between' }]}>
                                            <View style={[styles.flex, { alignItems: 'center', marginBottom: 6 }]}>
                                                <View>
                                                    <Image
                                                        source={doctor.user.avatar ? doctor.user.avatar : require('../../assets/images/nonAvatar.jpg')}
                                                        style={styles.img}
                                                    />
                                                </View>
                                                <View style={[{ marginLeft: 12 }]}>
                                                    <View style={styles.flex}>
                                                        <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{doctor.user.first_name}</Text>
                                                        <Text style={[{ fontSize: 16, fontWeight: 'bold', marginLeft: 4 }]}>{doctor.user.last_name}</Text>
                                                    </View>
                                                    <TruncatedText text={`Speciality: ${doctor.speciality}`} maxLength={40} />
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={() => { handleExceptStaff({ id: doctor.id, role: 'Doctor' }) }}>
                                                <Icons name='trash-2' size={26} color={'#ff6666'} />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }

                            </View>
                        </View>


                        <View style={[styles.flex, { justifyContent: 'space-between', alignItems: 'center' }]}>
                            <Text style={[styles.title, { marginBottom: 6, marginTop: 20 }]}>Nurses</Text>
                        </View>
                        <View style={[{ marginTop: 4, position: 'relative', paddingBottom: 120 }]}>
                            <View style={[{
                                display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                alignItems: 'center'
                            }]}>
                                <TextInput
                                    style={[styles.input, { marginLeft: -25, width: '85%' }]}
                                    name="searchNursesValue"
                                    value={searchNursesValue}
                                    onChangeText={(text) => { setSearchNursesValue(text) }}
                                    placeholder="Search doctors..."
                                />
                            </View>
                            {
                                searchedNurses.length > 0 &&
                                <View style={[{
                                    position: 'absolute', zIndex: 10, top: 44,
                                    marginLeft: 10, width: '86%',
                                    backgroundColor: '#fff',
                                    paddingHorizontal: 16,
                                    paddingTop: 10,
                                    borderRadius: 10,
                                    shadowColor: '#171717',
                                    shadowOffset: { width: -2, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 3,
                                    elevation: 5,
                                }]}>
                                    {
                                        searchedNurses.map(nurse => (
                                            <View key={nurse.id} style={[styles.flex, { alignItems: 'center', marginBottom: 6, justifyContent: 'space-between' }]}>
                                                <View style={[styles.flex, { alignItems: 'center', marginBottom: 6 }]}>
                                                    <View>
                                                        <Image
                                                            source={nurse.user.avatar ? nurse.user.avatar : require('../../assets/images/nonAvatar.jpg')}
                                                            style={styles.img}
                                                        />
                                                    </View>
                                                    <View style={[{ marginLeft: 12 }]}>
                                                        <View style={styles.flex}>
                                                            <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{nurse.user.first_name}</Text>
                                                            <Text style={[{ fontSize: 16, fontWeight: 'bold', marginLeft: 4 }]}>{nurse.user.last_name}</Text>
                                                        </View>
                                                        <TruncatedText text={`Faculty: ${nurse.faculty}`} maxLength={24} />
                                                    </View>
                                                </View>
                                                <TouchableOpacity onPress={() => { handleCheckStaffsSearch({ id: nurse.id, role: 'Nurse' }) }}>
                                                    <Icons name='plus' size={28} color={'#74E291'} />
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    }

                                </View>
                            }
                            <View style={[{ marginLeft: 10, width: '86%', }]}>
                                {
                                    scheduleNurses.length > 0 && scheduleNurses.map(nurse => (
                                        <View key={nurse.id} style={[styles.flex, { alignItems: 'center', marginBottom: 6, justifyContent: 'space-between' }]}>
                                            <View style={[styles.flex, { marginBottom: 6 }]}>
                                                <View>
                                                    <Image
                                                        source={nurse.user.avatar ? nurse.user.avatar : require('../../assets/images/nonAvatar.jpg')}
                                                        style={styles.img}
                                                    />
                                                </View>
                                                <View style={[{ marginLeft: 12 }]}>
                                                    <View style={styles.flex}>
                                                        <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{nurse.user.first_name}</Text>
                                                        <Text style={[{ fontSize: 16, fontWeight: 'bold', marginLeft: 4 }]}>{nurse.user.last_name}</Text>
                                                    </View>
                                                    <TruncatedText text={`Faculty: ${nurse.faculty}`} maxLength={24} />
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={() => { handleExceptStaff({ id: nurse.id, role: 'Nurse' }) }}>
                                                <Icons name='trash-2' size={26} color={'#ff6666'} />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>

                </ScrollView >
                <View style={[{
                    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                    flexDirection: 'row', width: '100%', marginBottom: 20,
                }]}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2', width: 160 }]} onPress={handleUpdateSchedule}>
                        <Text style={styles.buttonText}>Create schedule</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {showConfirmation &&
                <ConfirmBox handleAction={handleDeleteSchedule}
                    title={'Do you want to delete this schedule?'}
                />}
            {/* </View> */}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        height: 42,
        borderRadius: 8,
        paddingHorizontal: 10,
        width: '80%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9'
    },
    button: {
        width: '30%',
        backgroundColor: '#fa6a67',
        height: 38,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    picker: {
        borderRadius: 9,
        width: '80%',
        overflow: 'hidden',
    },
    img: {
        width: 50,
        height: 50
    },
    flex: {
        display: 'flex',
        flexDirection: 'row'
    }
})

export default AddScheduleBox;
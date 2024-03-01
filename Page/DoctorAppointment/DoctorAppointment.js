import moment from "moment";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, ScrollView, TextInput } from "react-native-gesture-handler";
import { useDebounce } from "use-debounce";
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchAppointmentsData } from "../../store/slice/appointmentsSlice";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from "react-native";
import { Shadow } from "react-native-shadow-2";
import AppointmentItem from "../../components/AppointmentItem/AppointmentItem";
import UpdateAppointmentItem from "../../components/UpdateAppointmentItem/UpdateAppointmentItem";
import { setIsReloadAppointment } from "../../store/slice/appSlice";

function DoctorAppointment({ navigation }) {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [searchPatientValue, setSearchPatientValue] = useState('')
    const [date, setDate] = useState(new Date())
    const [debounceSearchSchValue] = useDebounce(moment(date).format('yyyy-MM-DD'), 2000)
    const [isLoading, setIsLoading] = useState(false)
    const [dateAppointment, setDateAppointment] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [searchedAppointments, setSearchedAppointments] = useState([])
    const [isNext, setIsNext] = useState(true)
    const { isReloadAppointment } = useSelector(state => state.app)

    const findAppointments = async () => {
        const handleGetSearchAppointments = async () => {
            setIsLoading(true)
            dispatch(fetchAppointmentsData({
                access_token, date: debounceSearchSchValue, page: 1
            }))
                .then(data => {
                    console.log('data.data ', data.payload)
                    setSearchedAppointments([...data.payload.results])
                    setIsLoading(false)
                    // setIsFetch(true)
                    if (data.payload.next) {
                        setPage(2)
                        setIsNext(true)
                    } else {
                        setIsNext(false)
                    }
                })
                .catch(err => {
                    setIsLoading(false)
                    console.log('Error when get appointments from page number: ', err)
                })
        }
        handleGetSearchAppointments()
    }

    const loadNewAppointments = async () => {
        if (debounceSearchSchValue !== '') {
            if (isNext) {
                setIsLoading(true)
                const handleGetSearchAppointments = async () => {
                    dispatch(fetchAppointmentsData({
                        access_token, date: debounceSearchSchValue, page
                    }))
                        .then(data => {
                            setSearchedAppointments(state => {
                                const exitingIds = state.map(appointment => appointment.id)
                                const newAppointments = data.payload.results.filter(
                                    appointment => {
                                        return !exitingIds.includes(appointment.id)
                                    }
                                )
                                return [
                                    ...state,
                                    ...newAppointments
                                ]
                            })
                            setIsLoading(false)
                            if (data.payload.next) {
                                setPage(page + 1)
                                setIsNext(true)
                            } else {
                                setIsNext(false)
                            }
                        })
                        .catch(err => {
                            setIsLoading(false)
                            setIsNext(false)
                            console.log('Error when get appointments from page number: ', err)
                        })
                }
                handleGetSearchAppointments()
            } else {
                setIsLoading(false)
            }
        }
    }

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;

        if (layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom) {
            loadNewAppointments()
        }
    }

    useEffect(() => {
        if (debounceSearchSchValue !== '' || isReloadAppointment
        ) {
            if (isReloadAppointment) dispatch(setIsReloadAppointment(false))
            console.log('debouncedSearchScheduleValue ', debounceSearchSchValue)
            findAppointments()
        }

    }, [debounceSearchSchValue, isReloadAppointment])

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

    return (
        <GestureHandlerRootView>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <View style={[{ width: '86%' }]}>
                        <View style={[{ width: '100%' }]}>
                            <Text style={[styles.title, { marginTop: 20 }]}>Time appointment</Text>

                            <View style={[{ width: '100%', position: 'relative', marginTop: 8 }]}>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <Shadow distance={16} startColor="#f0eff3">
                                        <Text style={[styles.input, styles.inputActive]}>
                                            {date ? moment.utc(date).format('DD/MM/yyyy') : "Select the time..."}
                                        </Text>
                                    </Shadow>
                                    <View style={[{
                                        position: 'absolute', left: 14,
                                        top: '12%',

                                    },]}>
                                        <Icons2 name="calendar-month-outline" size={26} color={'#888'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {
                                isLoading &&
                                <ActivityIndicator size="large" color="#0000ff" />
                            }
                            <View>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                )}
                            </View>
                        </View>
                    </View>

                    {/* <View style={[{ width: '86%' }]}>

                    </View> */}
                    <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                        <View style={[{ marginLeft: 10, marginRight: 10 }]}>
                            {
                                searchedAppointments.length > 0 &&
                                searchedAppointments.map(appointment => {
                                    const { id, scheduled_time, confirmed, patient, reason } = appointment

                                    return (
                                        <UpdateAppointmentItem key={id}
                                            id={id}
                                            scheduled_time={scheduled_time}
                                            confirmed={confirmed}
                                            patient={patient}
                                            reason={reason}
                                            get={true}
                                            navigation={navigation}
                                            patient_id={appointment.patient}
                                        />
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                    {
                        isLoading &&
                        <ActivityIndicator size="large" color="#0000ff" />
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
        paddingHorizontal: 10,
        width: '100%',
        marginBottom: 20,
        borderRadius: 10,
        fontSize: 16,
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
    }
})

export default DoctorAppointment;
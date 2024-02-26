import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { Shadow } from 'react-native-shadow-2'
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { useDebounce } from "use-debounce";
import moment from "moment";
import { fetchAppointmentsData } from "../../store/slice/appointmentsSlice";
import UpdateAppointmentItem from "../../components/UpdateAppointmentItem/UpdateAppointmentItem";
import { setIsReloadAppointment } from "../../store/slice/appSlice";

function ManageAppointment() {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [date, setDate] = useState(new Date())
    const [debounceSearchSchValue] = useDebounce(moment(date).format('yyyy-MM-DD'), 2000)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [isFetch, setIsFetch] = useState()
    const [searchedAppointments, setSearchedAppointments] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isNext, setIsNext] = useState(false)
    const [page, setPage] = useState(1)
    const { isReloadAppointment } = useSelector(state => state.app)

    const findAppointments = async () => {
        // if (!isFetch) {
        const handleGetSearchAppointments = async () => {
            setIsLoading(true)
            dispatch(fetchAppointmentsData({
                access_token, date: debounceSearchSchValue, page: 1
            }))
                .then(data => {
                    setSearchedAppointments([...data.payload.results])
                    setIsLoading(false)
                    setIsFetch(true)
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
        // }
    }

    const loadNewAppointments = async () => {
        if (debounceSearchSchValue !== '') {
            console.log('page ', page)
            if (isNext) {
                setIsLoading(true)
                const handleGetSearchAppointments = async () => {
                    dispatch(fetchAppointmentsData({
                        access_token, date: debounceSearchSchValue, page
                    }))
                        .then(data => {
                            // dispatch(addNewAppointments(data.data))
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

    const appointments = useSelector(state => state.appointments)

    useEffect(() => {
        if (debounceSearchSchValue !== '' || isReloadAppointment
            // && !isOpenUpdateMedicineBox && !isLoadAppointmentsSearched
            // && !isOpenAddMedicineBox
        ) {
            console.log('debouncedSearchScheduleValue ', debounceSearchSchValue)
            console.log('dasfdh fa')
            findAppointments()
            if (isReloadAppointment) dispatch(setIsReloadAppointment(false))
        }
        // else if (debounceSearchSchValue !== '' && !showConfirmation
        //     // && !isOpenUpdateMedicineBox && isLoadAppointmentsSearched
        // ) {
        //     const exitIds = searchedAppointments.map(appointment => appointment.id)
        //     const loadAppointments = appointments && appointments.results.filter(appointment => exitIds.includes(appointment.id))
        //     console.log('loadAppointments ', loadAppointments)
        //     setSearchedAppointments([...loadAppointments])
        //     dispatch(setIsLoadAppointmentsSearched(false))
        // }

    }, [debounceSearchSchValue, isReloadAppointment])

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birth;
        if (selectedDate) {
            setDate(currentDate);
        } else {
            const localDate = new Date(currentDate);
            setDate(localDate);
        }
        setShowDatePicker(Platform.OS === 'ios');
        // setShowDatePicker(false);
    }



    return (
        <GestureHandlerRootView>
            <View style={styles.wrapper}>
                <View style={styles.container}>

                    <View style={[{ width: '100%' }]}>
                        <Text style={[styles.title, { marginTop: 20 }]}>Time appointment</Text>

                        <View style={[{ width: '100%', position: 'relative', marginTop: 8 }]}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <Shadow distance={16} startColor="#f0eff3">
                                    <Text style={[styles.input, styles.inputActive]}>
                                        {date ? format(date, 'dd/MM/yyyy') : "Select the time..."}
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
                        <ScrollView style={[{ height: '82%' }]}
                            onScroll={handleScroll} scrollEventThrottle={16}
                        >
                            {
                                searchedAppointments && searchedAppointments.map(appointment => {
                                    const { id, scheduled_time, confirmed, patient, reason } = appointment

                                    return (
                                        <UpdateAppointmentItem key={id}
                                            id={id}
                                            scheduled_time={scheduled_time}
                                            confirmed={confirmed}
                                            patient={patient}
                                            reason={reason}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '86%',
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
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
        width: '100%'
        // borderWidth: 1,
        // borderColor: '#666',
        // color: '#666',
    },
    shadow: {

    },
    inputActive: {
        // borderColor: '#444'
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
})

export default ManageAppointment;
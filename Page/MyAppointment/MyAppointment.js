import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icons from 'react-native-vector-icons/Entypo'
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import AppointmentItem from "../../components/AppointmentItem/AppointmentItem";
import { fetchAppointmentsData } from "../../store/slice/appointmentsSlice";
import { format } from "date-fns";
import UpdateAppointmentItem from "../../components/UpdateAppointmentItem/UpdateAppointmentItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setIsReloadAppointment } from "../../store/slice/appSlice";

function MyAppointment() {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [searchAppointmentValue, setSearchAppointmentValue] = useState('')
    const [debounceSearchSchValue] = useDebounce(searchAppointmentValue, 2000)
    const [isFetch, setIsFetch] = useState(false)
    const [isNext, setIsNext] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [searchedAppointments, setSearchedAppointments] = useState([])
    const { showConfirmation, isReloadAppointment } = useSelector(state => state.app)

    const findAppointments = async () => {
        if (!isFetch) {
            const handleGetSearchAppointments = async () => {
                // if (isNext) {
                setIsLoading(true)
                let timeArr = debounceSearchSchValue.split('/')
                if (timeArr[timeArr.length - 1] === '') timeArr.pop()
                const timeSearchFormat = timeArr.join('-')
                dispatch(fetchAppointmentsData({
                    access_token, date: timeSearchFormat, page: 1
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
                // }
            }
            handleGetSearchAppointments()
        }
    }

    const loadNewAppointments = async () => {
        if (debounceSearchSchValue !== '') {
            console.log('page ', page)
            if (isNext) {
                setIsLoading(true)
                const handleGetSearchAppointments = async () => {
                    let timeArr = debounceSearchSchValue.split('/')
                    if (timeArr[timeArr.length - 1] === '') timeArr.pop()
                    const timeSearchFormat = timeArr.join('-')
                    dispatch(fetchAppointmentsData({
                        access_token, date: timeSearchFormat, page
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
        ) {
            dispatch(setIsReloadAppointment(false))
            findAppointments()
        }
        else if (debounceSearchSchValue !== '' && !showConfirmation
        ) {
            const exitIds = searchedAppointments.map(appointment => appointment.id)
            const loadAppointments = appointments && appointments.results.filter(appointment => exitIds.includes(appointment.id))
            setSearchedAppointments([...loadAppointments])
            dispatch(setIsLoadAppointmentsSearched(false))
        }
        else if (debounceSearchSchValue === '') {
            setIsFetch(false)
            setIsLoading(true)
            let date = new Date()

            dispatch(fetchAppointmentsData({
                access_token, date: format(date, 'yyyy-MM-dd'), page: 1
            }))
                .then(data => {
                    setSearchedAppointments([...data.payload.results])
                    setIsLoading(false)
                })
                .catch(err => {
                    setIsLoading(false)
                    console.log('Error when get appointments from page number: ', err)
                })
        }
        console.log('appointments ', appointments)

    }, [debounceSearchSchValue, showConfirmation, isReloadAppointment
    ])

    return (
        <GestureHandlerRootView>
            <ScrollView style={[{
                height: '100%', backgroundColor: '#fff',
            }]}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={[{
                    display: 'flex', justifyContent: 'center',
                    alignContent: 'flex-start', width: '100%', flexDirection: 'row', height: '100%'
                }]}>
                    <View style={styles.container}>
                        <View style={[{
                            display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                            width: '100%', alignItems: 'center', marginTop: 16, height: 60
                        }]}>
                            <Text style={[styles.title, { marginTop: 10 }]}>Appointments</Text>
                        </View>

                        <View style={[{
                            display: 'flex', justifyContent: 'center', flexDirection: 'row',
                            marginTop: 10
                        }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Search appointments(yyyy/MM/dd)..."
                                value={searchAppointmentValue}
                                onChangeText={(text) => { setSearchAppointmentValue(text) }}
                            />
                        </View>

                        {searchAppointmentValue !== '' ?
                            <Text style={[{ fontSize: 18, marginBottom: 10 }]}>
                                <Text style={[{ fontWeight: 'bold', fontSize: 20 }]}>Results for: </Text>
                                {searchAppointmentValue}
                            </Text> :
                            <Text style={[{ fontSize: 18, marginBottom: 4 }]}>
                                <Text style={[{ fontWeight: 'bold', fontSize: 20 }]}>Today: </Text>
                                {format(new Date(), 'dd/MM/yyyy')}
                            </Text>
                        }

                        <View style={[{ marginLeft: 10, marginRight: 10 }]}>
                            {
                                searchedAppointments.length > 0 &&
                                searchedAppointments.map(appointment => {
                                    const { id, scheduled_time, confirmed, reason } = appointment
                                    return (
                                        <UpdateAppointmentItem key={id} scheduled_time={scheduled_time} id={id}
                                            confirmed={confirmed} reason={reason} 
                                        />
                                    )
                                })
                            }
                        </View>
                        {
                            isLoading &&
                            <ActivityIndicator size="large" color="#0000ff" />
                        }
                    </View>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '86%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    selectedDate: {
        marginTop: 20,
        fontSize: 18,
    },
    input: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        height: 42,
        borderRadius: 100,
        paddingHorizontal: 10,
        width: '90%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9',
        fontSize: 16
    },
})
export default MyAppointment;
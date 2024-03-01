import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Shadow } from "react-native-shadow-2";
import moment from "moment";
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDebounce } from "use-debounce";
import { Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../store/slice/paymentsSlice";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import PaymentItem from "../../components/PaymentItem/PaymentItem";

function Payment() {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [date, setDate] = useState(new Date())
    const [debounceSearchValue] = useDebounce(moment(date).format('yyyy-MM-DD'), 2000)
    const [isLoading, setIsLoading] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [isNext, setIsNext] = useState(false)
    const [page, setPage] = useState(1)
    const [payments, setPayments] = useState([])
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)

    const findPayments = async () => {
        const handleGetSearchPayments = async () => {
            setIsLoading(true)
            dispatch(fetchPayments({
                access_token, date: debounceSearchValue, page: 1
            }))
                .then(data => {
                    console.log('payments: ', data.payload)
                    setPayments([...data.payload.results])
                    setIsLoading(false)
                    if (data.payload.next) {
                        setPage(2)
                        setIsNext(true)
                    } else {
                        setIsNext(false)
                    }
                })
                .catch(err => {
                    setIsLoading(false)
                    console.log('Error when get payments from page number: ', err)
                })
        }
        handleGetSearchPayments()
    }

    const loadNewPayments = async () => {
        if (debounceSearchValue !== '') {
            console.log('page ', page)
            if (isNext) {
                setIsLoading(true)
                const handleGetSearchPayments = async () => {
                    dispatch(fetchPayments({
                        access_token, date: debounceSearchValue, page
                    }))
                        .then(data => {
                            console.log('payment ', data.payload)
                            payments(state => {
                                const exitingIds = state.map(payment => payment.id)
                                const newPayments = data.payload.results.filter(
                                    payment => {
                                        return !exitingIds.includes(payment.id)
                                    }
                                )
                                return [
                                    ...state,
                                    ...newPayments
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
                            console.log('Error when get payments from page number: ', err)
                        })
                }
                handleGetSearchPayments()
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
            loadNewPayments()
        }
    }

    useEffect(() => {
        if (isUpdateSuccess) {
            setIsUpdateSuccess(false)
        }
        findPayments()
    }, [debounceSearchValue, isUpdateSuccess])

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birth;
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
                    <View style={[{ width: '100%' }]}>
                        <Text style={[styles.title, { marginTop: 20 }]}>Time payment</Text>

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

                        <ScrollView style={[{ height: '90%' }]}
                            onScroll={handleScroll} scrollEventThrottle={16}
                        >
                            <View>
                                {
                                    payments.length > 0 &&
                                    payments.map(payment => (
                                        <PaymentItem
                                            created_at={payment.created_at} id={payment.id}
                                            patient={payment.patient} key={payment.id} reload={setIsUpdateSuccess} />
                                    ))
                                }
                            </View>
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

export default Payment;
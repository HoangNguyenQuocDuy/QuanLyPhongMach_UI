import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, ScrollView, TextInput } from "react-native-gesture-handler";
import { Shadow } from "react-native-shadow-2";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import moment from "moment";
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icons from 'react-native-vector-icons/AntDesign'
import { fetchPatientsData } from "../../store/slice/patientsSlice";
import DateTimePicker from '@react-native-community/datetimepicker'
import UserTag from "../../components/UserTag/UserTag";
import { fetchMedicalHistories } from "../../store/slice/medicalHistories";
import { setIsLoadMedicinesSearched } from "../../store/slice/appSlice";
import MedicalHistoryItem from "../../components/MedicalHistoryItem/MedicalHistoryItem";

function ExaminationHistory() {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [debounceStartDateValue] = useDebounce(moment(startDate).format('yyyy-MM-DD'), 2000)
    const [debounceEndDateValue] = useDebounce(moment(endDate).format('yyyy-MM-DD'), 2000)
    const [isLoadingPatients, setIsLoadingPatients] = useState(false)
    const [isLoadingMedicalHistories, setIsLoadingMedicalHistories] = useState(false)
    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState(false)
    const [searchedMedicalHistories, setSearchedMedicalHistories] = useState([])
    const [searchedPatients, setSearchedPatients] = useState([])
    const [isNextPatient, setIsNextPatient] = useState(true)
    const [isNextMedicalHistory, setIsNextMedicalHistory] = useState(true)
    const [searchPatientValue, setSearchPatientValue] = useState('')
    const [patientActive, setPatientActive] = useState()
    const [debouncePatientValue] = useDebounce(searchPatientValue, 2000)
    const [pageHistory, setPageHistory] = useState(1)
    const [pagePatient, setPagePatient] = useState(1)

    const findPatients = () => {
        const handleGetSearchPatients = () => {
            setIsLoadingPatients(true)
            dispatch(fetchPatientsData({
                access_token, name: debouncePatientValue, page: 1
            }))
                .then(data => {
                    console.log('data.data ', data.payload)
                    setSearchedPatients([...data.payload.results])
                    setIsLoadingPatients(false)
                    if (data.payload.next) {
                        setPagePatient(2)
                        setIsNextPatient(true)
                    } else {
                        setIsNextPatient(false)
                    }
                })
                .catch(err => {
                    setIsLoadingPatients(false)
                    console.log('Error when get patients from page number: ', err)
                })
        }
        handleGetSearchPatients()
    }

    const loadNewPatients = () => {
        if (debouncePatientValue !== '') {
            if (isNextPatient) {
                setIsLoadingPatients(true)
                const handleGetSearchPatients = () => {
                    dispatch(fetchPatientsData({
                        access_token, name: debouncePatientValue, page: pagePatient
                    }))
                        .then(data => {
                            console.log('load data ', data.payload)
                            setSearchedPatients(state => {
                                const exitingIds = state.map(patient => patient.id)
                                const newPatients = data.payload.results.filter(
                                    patient => {
                                        return !exitingIds.includes(patient.id)
                                    }
                                )
                                return [
                                    ...state,
                                    ...newPatients
                                ]
                            })
                            setIsLoadingPatients(false)
                            if (data.payload.next) {
                                setPagePatient(pagePatient + 1)
                                setIsNextPatient(true)
                            } else {
                                setIsNextPatient(false)
                            }
                        })
                        .catch(err => {
                            setIsLoadingPatients(false)
                            setIsNextPatient(false)
                            console.log('Error when get patients from page number: ', err)
                        })
                }
                handleGetSearchPatients()
            } else {
                setIsLoadingPatients(false)
            }
        }
    }

    const findMedicalHistories = () => {
        const handleGetSearchMedicalHistories = () => {
            if (patientActive) {
                setIsLoadingMedicalHistories(true)
                dispatch(fetchMedicalHistories({
                    access_token, start_date: moment.utc(startDate).format('yyyy-MM-DD'), end_date: moment.utc(endDate).format('yyyy-MM-DD'), page: 1, p_id: patientActive.id
                }))
                    .then(data => {
                        console.log('medicalHistories data ', data.payload.results)
                        setSearchedMedicalHistories([...data.payload.results])
                        setIsLoadingMedicalHistories(false)
                        if (data.payload.next) {
                            setPageHistory(2)
                            setIsNextMedicalHistory(true)
                        } else {
                            setIsNextMedicalHistory(false)
                        }
                    })
                    .catch(err => {
                        setIsLoadingMedicalHistories(false)
                        console.log('Error when get patients from page number: ', err)
                    })
            }
        }
        handleGetSearchMedicalHistories()
    }

    const loadNewMedicalHistories = async () => {
        if (patientActive) {
            if (isNextMedicalHistory) {
                setIsLoadingPatients(true)
                const handleGetSearchMedicalHistories = async () => {
                    dispatch(fetchMedicalHistories({
                        access_token, start_date: moment.utc(startDate).format('yyyy-MM-DD'),
                        end_date: moment.utc(endDate).format('yyyy-MM-DD'),
                        page: pageHistory, p_id: patientActive.id
                    }))
                        .then(data => {
                            setSearchedMedicalHistories(state => {
                                const exitingIds = state.map(medicalHistories => medicalHistories.id)
                                const newMedicalHistories = data.payload.results.filter(
                                    medicalHistories => {
                                        return !exitingIds.includes(medicalHistories.id)
                                    }
                                )
                                return [
                                    ...state,
                                    ...newMedicalHistories
                                ]
                            })
                            setIsLoadingPatients(false)
                            if (data.payload.next) {
                                setPageHistory(pageHistory + 1)
                                setIsNextMedicalHistory(true)
                            } else {
                                setIsNextMedicalHistory(false)
                            }
                        })
                        .catch(err => {
                            setIsLoadMedicinesSearched(false)
                            setIsNextMedicalHistory(false)
                            console.log('Error when get medicalHistories from page number: ', err)
                        })
                }
                handleGetSearchMedicalHistories()
            } else {
                setIsLoadMedicinesSearched(false)
            }
        }
    }

    const handleScrollMedicalHistories = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;

        if (layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom) {
            loadNewMedicalHistories()
        }
    }

    const handleScrollPatients = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;

        if (layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom) {
            loadNewPatients()
        }
    }

    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        if (selectedDate) {
            setStartDate(currentDate);
        } else {
            const localDate = new Date(currentDate);
            setStartDate(localDate);
        }
        setShowStartDatePicker(Platform.OS === 'ios');
    }

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        if (selectedDate) {
            setEndDate(currentDate);
        } else {
            const localDate = new Date(currentDate);
            setEndDate(localDate);
        }
        setShowEndDatePicker(Platform.OS === 'ios');
    }

    useEffect(() => {

        if (debouncePatientValue !== '') {
            findPatients()
        } else if (debouncePatientValue === '') {
            setSearchedPatients([])
        }
        if (debounceStartDateValue < debounceEndDateValue) {
            console.log('get medicalHistories')
            findMedicalHistories()
        }
    }, [debouncePatientValue, debounceEndDateValue, debounceStartDateValue, patientActive])

    console.log('searchedMedicalHistories: ', searchedMedicalHistories)
    return (
        <GestureHandlerRootView>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <View style={[{ width: '86%' }]}>
                        <View style={[{ width: '100%' }]}>
                            <Text style={[styles.title, { marginTop: 20 }]}>Patient</Text>
                            {
                                patientActive &&
                                <View style={[{ position: 'relative' }]}>
                                    <UserTag
                                        first_name={patientActive.first_name}
                                        last_name={patientActive.last_name}
                                        avatar={patientActive.avatar}
                                        major={patientActive.major}
                                        username={patientActive.username}
                                        id={patientActive.id}
                                    />
                                </View>
                            }

                            <View style={[{ position: 'relative' }]}>
                                <Shadow distance={16} startColor="#f0eff3">
                                    <TextInput
                                        style={[styles.textInput]}
                                        placeholder="Search patient..."
                                        value={searchPatientValue}
                                        onChangeText={setSearchPatientValue}
                                    />
                                </Shadow>
                                <View style={[{
                                    position: 'absolute', left: 14,
                                    top: '12%',

                                },]}>
                                    <Icons name="search1" size={26} color={searchPatientValue.trim() === '' ? '#E3E1D9' : '#444'} />
                                </View>
                            </View>

                            <ScrollView
                                onScroll={handleScrollPatients}
                                style={[styles.scrollView, { maxHeight: 160 }]}
                                scrollEventThrottle={16}
                            >
                                {searchedPatients.length > 0 &&
                                    <View style={styles.patientBox}>
                                        {
                                            searchedPatients.length > 0 && searchedPatients.map(patient => (
                                                <UserTag key={patient.id} username={patient.user.username}
                                                    first_name={patient.user.first_name}
                                                    last_name={patient.user.last_name}
                                                    avatar={patient.user.avatar}
                                                    major={patient.major}
                                                    id={patient.id}
                                                    check={true}
                                                    handle={setPatientActive}
                                                />
                                            ))
                                        }
                                    </View>
                                }
                                {
                                    isLoadingPatients &&
                                    <ActivityIndicator size="large" color="#0000ff" />
                                }
                            </ScrollView>

                            <Text style={[styles.title, { marginTop: 20 }]}>Range time</Text>

                            <Text style={[styles.text, { marginBottom: 6 }]}>Start date</Text>
                            <View style={[{ width: '100%', position: 'relative', marginTop: 8 }]}>
                                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                                    <Shadow distance={16} startColor="#f0eff3">
                                        <Text style={[styles.input, styles.inputActive]}>
                                            {startDate ? moment.utc(startDate).format('DD/MM/yyyy') : "Select the time..."}
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
                            <View>
                                {showStartDatePicker && (
                                    <DateTimePicker
                                        value={startDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleStartDateChange}
                                    />
                                )}
                            </View>

                            <Text style={[styles.text, { marginBottom: 6 }]}>End date</Text>
                            <View style={[{ width: '100%', position: 'relative' }]}>
                                <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                                    <Shadow distance={16} startColor="#f0eff3">
                                        <Text style={[styles.input, styles.inputActive]}>
                                            {endDate ? moment.utc(endDate).format('DD/MM/yyyy') : "Select the time..."}
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
                            <View>
                                {showEndDatePicker && (
                                    <DateTimePicker
                                        value={endDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleEndDateChange}
                                    />
                                )}
                            </View>
                            <ScrollView
                                onScroll={handleScrollMedicalHistories}
                                style={[{ maxHeight: 250 }]}
                                scrollEventThrottle={16}
                            >
                                {searchedMedicalHistories.length > 0 &&

                                    searchedMedicalHistories.map(medicalHistory => (
                                        <View style={[styles.wrapper, { marginTop: 10 }]}>
                                            <Shadow distance={14} startColor="#f0f2f5" style={styles.shadow}>
                                                <View style={[styles.patientBox, { borderRadius: 20 }]}>
                                                    <MedicalHistoryItem key={medicalHistory.id}
                                                        doctor={medicalHistory.doctor} prescribed_medicines={medicalHistory.prescribed_medicines}
                                                        symptoms={medicalHistory.symptoms} conclusion={medicalHistory.conclusion}
                                                        created_at={medicalHistory.created_at}
                                                    />
                                                </View>
                                            </Shadow>
                                        </View>
                                    ))

                                }
                                {
                                    isLoadingMedicalHistories &&
                                    <ActivityIndicator size="large" color="#0000ff" />
                                }
                            </ScrollView>

                        </View>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        width: 320,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
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

export default ExaminationHistory;
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorsData } from "../../store/slice/doctorsSlice";
import UserTag from "../../components/UserTag/UserTag";
import Icons from 'react-native-vector-icons/Entypo'
import { useDebounce } from 'use-debounce';
import newRequest from "../../ultils/request";
import { setIsOpenAddUserBox, setTitleAddUserBox } from "../../store/slice/appSlice";
import { fetchNursesData } from "../../store/slice/nurseSlice";

function Staff() {
    const dispatch = useDispatch()

    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [searchDoctorValue, setSearchDoctorValue] = useState('')
    const [searchNurseValue, setSearchNurseValue] = useState('')
    const { isOpenUserInfoTag, isOpenAddUserBox } = useSelector(state => state.app)
    const { access_token } = useSelector(state => state.account)
    const [debouncedSearchDoctorValue] = useDebounce(searchDoctorValue, 1000);
    const [debouncedSearchNurseValue] = useDebounce(searchNurseValue, 1000);
    const [fetchedDoctor, setFetchedDoctor] = useState(true)
    const [fetchedNurse, setFetchedNurse] = useState(true)
    const [doctorsSearch, setDoctorsSearch] = useState([])
    const [nursesSearch, setNursesSearch] = useState([])

    useEffect(() => {
        // if (fetchedDoctor) {
        //     dispatch(fetchDoctorsData({ access_token }))
        //         .then(data => {
        //             setFetchedDoctor(false)
        //         })
        //         .catch(err => {
        //             console.log('Error when trying get doctor: ', err)
        //         })
        // }
        // if (fetchedNurse) {
        //     dispatch(fetchNursesData({ access_token }))
        //         .then(data => {
        //             setFetchedNurse(false)
        //         })
        //         .catch(err => {
        //             console.log('Error when trying get doctor: ', err)
        //         })

        // }

        if (searchDoctorValue !== '') {
            const handleSearchDoctor = async () => {
                await newRequest.get(`/doctors/?name=${debouncedSearchDoctorValue}`, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                    .then(data => {
                        setDoctorsSearch(data.data)
                    })
                    .catch(err => {
                        console.log('Error when get search doctor: ', err)
                    })
            }
            handleSearchDoctor()
        } else {
            setDoctorsSearch([])
        }

        if (searchNurseValue !== '') {
            const handleSearchNurse = async () => {
                await newRequest.get(`/nurses/?name=${debouncedSearchNurseValue}`, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                    .then(data => {
                        setNursesSearch(data.data)
                    })
                    .catch(err => {
                        console.log('Error when get search nurse: ', err)
                    })
            }
            handleSearchNurse()
        } else {
            setNursesSearch([])
        }
    }, [debouncedSearchDoctorValue, debouncedSearchNurseValue, isOpenUserInfoTag, isOpenAddUserBox]);

    const doctors = useSelector(state => state.doctors)
    const nurses = useSelector(state => state.nurses)

    return (
        <View style={[{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100%', backgroundColor: '#fff', flexDirection: 'row'
        }]}>
            <View style={[{
                backgroundColor: '#fff', height: '100%', width: '90%',
                display: 'flex', justifyContent: 'space-between', paddingVertical: 20
            }]}>
                <View style={[{
                    display: 'flex', justifyContent: 'center',
                    alignContent: 'flex-start', width: '100%', flexDirection: 'row', height: '48%',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    shadowColor: '#171717',
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 5,
                }]}>
                    <View style={styles.container}>
                        <View style={[{
                            display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                            width: '100%', alignItems: 'center', marginTop: 8, height: 60
                        }]}>
                            <Text style={[styles.title, { marginTop: 10 }]}>DOCTORS</Text>
                            <TouchableOpacity style={[{
                                backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
                                display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                                borderRadius: 8
                            }]}
                                onPress={() => {
                                    dispatch(setTitleAddUserBox(0))
                                    dispatch(setIsOpenAddUserBox(true))
                                }}
                            >
                                <Icons name='plus' size={20} color={'white'} />
                                <Text style={[{ fontSize: 16, color: '#fff', marginLeft: 6 }]}>Add new</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[{
                            display: 'flex', justifyContent: 'center', flexDirection: 'row',
                        }]}>
                            <View style={[{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Search doctors..."
                                    value={searchDoctorValue}
                                    onChangeText={setSearchDoctorValue}
                                />
                            </View>
                        </View>

                        <ScrollView style={[{ maxHeight: 200 }]}>
                            <View style={{ overflow: 'scroll' }}>
                                {debouncedSearchDoctorValue !== '' && doctorsSearch.length > 0 ?
                                    doctorsSearch && doctorsSearch.map(doctor => (
                                        <UserTag
                                            key={doctor.id}
                                            first_name={doctor.user.first_name}
                                            last_name={doctor.user.last_name}
                                            avatar={doctor.user.avatar}
                                            speciality={doctor.speciality}
                                            username={doctor.user.username}
                                            id={doctor.id}
                                        />
                                    ))
                                    : doctors.length > 0 && doctors && doctors.map(doctor => {
                                        if (doctor) {
                                            return <UserTag
                                                key={doctor.id}
                                                first_name={doctor.user.first_name}
                                                last_name={doctor.user.last_name}
                                                avatar={doctor.user.avatar}
                                                speciality={doctor.speciality}
                                                username={doctor.user.username}
                                                id={doctor.id}
                                            />
                                        }
                                    })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={[{
                    display: 'flex', justifyContent: 'center',
                    alignContent: 'flex-start', width: '100%', flexDirection: 'row', height: '48%',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    shadowColor: '#171717',
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 5,
                }]}>
                    <View style={styles.container}>
                        <View style={[{
                            display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                            width: '100%', alignItems: 'center', height: 80
                        }]}>
                            <Text style={[styles.title, { marginTop: 10 }]}>NURSES</Text>
                            <TouchableOpacity style={[{
                                backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
                                display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                                borderRadius: 8
                            }]}
                                onPress={() => {
                                    dispatch(setTitleAddUserBox(1))
                                    dispatch(setIsOpenAddUserBox(true))
                                }}
                            >
                                <Icons name='plus' size={20} color={'white'} />
                                <Text style={[{ fontSize: 16, color: '#fff', marginLeft: 6 }]}>Add new</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[{
                            display: 'flex', justifyContent: 'center', flexDirection: 'row',
                        }]}>
                            <View style={[{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Search doctors..."
                                    value={searchNurseValue}
                                    onChangeText={setSearchNurseValue}
                                />
                            </View>
                        </View>

                        <ScrollView style={[{ maxHeight: 190 }]}>
                            <View style={{ overflow: 'scroll' }}>
                                {debouncedSearchNurseValue !== '' && nursesSearch.length > 0 ?
                                    nursesSearch && nursesSearch.map(nurse => (
                                        <UserTag
                                            key={nurse.id}
                                            first_name={nurse.user.first_name}
                                            last_name={nurse.user.last_name}
                                            avatar={nurse.user.avatar}
                                            faculty={nurse.faculty}
                                            username={nurse.user.username}
                                            id={nurse.id}
                                        />
                                    ))
                                    : nurses.length > 0 && nurses && nurses.map(nurse => {
                                        if (nurse) {
                                            return <UserTag
                                                key={nurse.id}
                                                first_name={nurse.user.first_name}
                                                last_name={nurse.user.last_name}
                                                avatar={nurse.user.avatar}
                                                faculty={nurse.faculty}
                                                username={nurse.user.username}
                                                id={nurse.id}
                                            />
                                        }
                                    })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
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
        paddingLeft: 16,
        height: 42,
        borderRadius: 100,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9',
        fontSize: 16
    },
})

export default Staff;
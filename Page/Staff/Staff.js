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
        if (fetchedDoctor) {
            dispatch(fetchDoctorsData({ access_token }))
                .then(data => {
                    setFetchedDoctor(false)
                })
                .catch(err => {
                    console.log('Error when trying get doctor: ', err)
                })
        }
        if (fetchedNurse) {
            dispatch(fetchNursesData({ access_token }))
                .then(data => {
                    setFetchedNurse(false)
                })
                .catch(err => {
                    console.log('Error when trying get doctor: ', err)
                })

        }

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
        }
    }, [debouncedSearchDoctorValue, debouncedSearchNurseValue, isOpenUserInfoTag, isOpenAddUserBox]);

    const doctors = useSelector(state => state.doctors)
    const nurses = useSelector(state => state.nurses)
    // const loadMoreDoctors = () => {
    //     if (!isLoadingMore) {
    //         setIsLoadingMore(true)

    //         const maxPages = doctors.count % 2 === 0 ? doctors.count / 2 : doctors.count / 2 + 1

    //         if (page < maxPages) {
    //             setPage(page + 1)
    //         }
    //     }
    // };

    const renderItem = ({ item }) => {
        return (
            <UserTag
                first_name={item.user.first_name}
                last_name={item.user.last_name}
                avatar={item.user.avatar}
                speciality={item.speciality}
                username={item.user.username}
                id={item.id}
            />
        );
    }

    // console.log(doctors)

    return (
        <>
            <View style={[{
                display: 'flex', justifyContent: 'center',
                alignContent: 'center', width: '100%', flexDirection: 'row'
            }]}>
                <View style={[{
                    width: '86%', padding: 10, borderRadius: 10, marginTop: 20,
                    backgroundColor: '#fff',
                }]}>
                    <Text style={[{
                        fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center'
                    }]}>
                        Doctors
                    </Text>

                    <View style={[{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search doctors..."
                            value={searchDoctorValue}
                            onChangeText={setSearchDoctorValue}
                        />
                    </View>

                    <ScrollView style={[{ maxHeight: 140 }]}>
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

                    <View style={[{
                        display: 'flex', alignItems: 'center', marginBottom: 10,
                        paddingTop: 16,
                        justifyContent: 'center'
                    }]}>
                        <TouchableOpacity
                            style={[{
                                backgroundColor: '#6895D2', borderRadius: 100,
                                paddingHorizontal: 16, paddingVertical: 10,
                                display: 'flex', justifyContent: 'center', flexDirection: 'row'
                            }]}
                            onPress={() => { 
                                dispatch(setTitleAddUserBox(0))
                                dispatch(setIsOpenAddUserBox(true)) 
                                }}>
                            <Icons name="plus" size={20} color={'white'} />

                            <Text style={[{ fontSize: 16, color: '#fff', paddingLeft: 4 }]}>
                                Add new Doctor
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* NURSE */}
            <View style={[{
                display: 'flex', justifyContent: 'center',
                alignContent: 'center', width: '100%', flexDirection: 'row'
            }]}>
                <View style={[{
                    width: '86%', padding: 10, borderRadius: 10, marginTop: 20,
                    backgroundColor: '#fff',
                }]}>
                    <Text style={[{
                        fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center'
                    }]}>
                        Nurses
                    </Text>

                    <View style={[{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search nurses..."
                            value={searchNurseValue}
                            onChangeText={setSearchNurseValue}
                        />
                    </View>

                    <ScrollView style={[{ maxHeight: 140 }]}>
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

                    <View style={[{
                        display: 'flex', alignItems: 'center', marginBottom: 10,
                        paddingTop: 16,
                        justifyContent: 'center'
                    }]}>
                        <TouchableOpacity
                            style={[{
                                backgroundColor: '#6895D2', borderRadius: 100,
                                paddingHorizontal: 16, paddingVertical: 10,
                                display: 'flex', justifyContent: 'center', flexDirection: 'row'
                            }]}
                            onPress={() => { 
                                dispatch(setTitleAddUserBox(1))
                                dispatch(setIsOpenAddUserBox(true)) 
                                }}>
                            <Icons name="plus" size={20} color={'white'} />

                            <Text style={[{ fontSize: 16, color: '#fff', paddingLeft: 4 }]}>
                                Add new Nurse
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
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

export default Staff;
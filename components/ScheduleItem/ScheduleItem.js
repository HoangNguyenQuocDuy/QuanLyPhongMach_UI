import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import TruncatedText from '../TruncatedText/TruncatedText';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { setScheduleIdActive, toggleIsOpenScheduleInfo } from '../../store/slice/appSlice';

function ScheduleItem({ schedule_time, nurseIds, doctorIds, date, scheduleId }) {
    const dispatch = useDispatch()
    const doctors = useSelector(state => state.doctors)
    const nurses = useSelector(state => state.nurses)
    const [scheduleDoctors, setScheduleDoctors] = useState([])
    const [scheduleNurses, setScheduleNurses] = useState([])
    const [isShowScheduleDoctors, setIsShowScheduleDoctors] = useState(false)
    const [isShowScheduleNurses, setIsShowScheduleNurses] = useState(false)
    const [isDoctorIconRotated, setIsDoctorIconRotated] = useState(false);
    const [isNurseIconRotated, setIsNurseIconRotated] = useState(false);

    useEffect(() => {
        handleGetDoctorById({ ids: doctorIds, type: 'Doctors' })
        handleGetDoctorById({ ids: nurseIds, type: 'Nurses' })
    }, [])
    const handleGetDoctorById = ({ ids, type }) => {
        if (type === 'Doctors') {
            setScheduleDoctors(doctors.filter(doctor => ids.includes(doctor.id)))
        } else {
            setScheduleNurses(nurses.filter(nurse => ids.includes(nurse.id)))
        }
    }

    const handleToggleList = (name) => {
        if (name === 'Doctors') {
            setIsShowScheduleDoctors(!isShowScheduleDoctors)
            setIsDoctorIconRotated(!isDoctorIconRotated);
        } else {
            setIsShowScheduleNurses(!isShowScheduleNurses)
            setIsNurseIconRotated(!isNurseIconRotated);
        }
    }

    return (
        <View style={[{ marginLeft: 10 }]}>
            <View style={[{
                display: 'flex', alignItems: 'center', flexDirection: 'row',
                justifyContent: 'flex-start'
            }]}>
                <Text style={[{
                    fontSize: 18
                }]}>Shift: {date ? `${moment.utc(schedule_time).format("DD/MM/yyyy")} - ${moment.utc(schedule_time).format("HH:mm:ss")}` :
                    moment.utc(schedule_time).format("HH:mm:ss")}
                </Text>
                <TouchableOpacity onPress={() => { 
                    dispatch(setScheduleIdActive(scheduleId))
                    dispatch(toggleIsOpenScheduleInfo())
                 }}>
                    <Icons style={[{ marginLeft: 20 }]} name='square-edit-outline' size={26} color={'#EBF400'} />
                </TouchableOpacity>
            </View>
            <View style={[{ marginLeft: 14 }]}>
                <View style={[{ marginLeft: 10 }]}>
                    <View style={[{ marginLeft: 10 }]}>
                        <View style={[styles.flex, { justifyContent: 'space-between', alignItems: 'center' }]}>
                            <Text style={[styles.title, { marginBottom: 6, marginTop: 4 }]}>Doctors</Text>
                            <TouchableOpacity onPress={() => { handleToggleList('Doctors') }}>
                                <Icons name={!isDoctorIconRotated ? 'arrow-up-drop-circle-outline' : 'arrow-down-drop-circle-outline'}
                                    size={26} color={'#74E291'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[{ marginLeft: 10 }]}>
                            {
                                isDoctorIconRotated && scheduleDoctors.length > 0 && scheduleDoctors.map(doctor => (
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
                                ))
                            }

                        </View>
                        <View style={[{ marginTop: 4 }]}>
                            <View style={[styles.flex, { justifyContent: 'space-between', alignItems: 'center' }]}>
                                <Text style={[styles.title, { marginBottom: 6 }]}>Nurses</Text>
                                <TouchableOpacity onPress={() => { handleToggleList('Nurses') }}>
                                    <Icons name={!isNurseIconRotated ? 'arrow-up-drop-circle-outline' : 'arrow-down-drop-circle-outline'}
                                        size={26} color={'#74E291'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[{ marginLeft: 10 }]}>
                                {
                                    isNurseIconRotated && scheduleNurses.length > 0 && scheduleNurses.map(nurse => (
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
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    img: {
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16
    },
    title: {
        fontSize: 18
    },
    scroll: {
        maxHeight: 80
    }
})

export default ScheduleItem;
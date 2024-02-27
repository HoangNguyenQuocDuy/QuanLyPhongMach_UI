import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns"
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icons from 'react-native-vector-icons/AntDesign'
import Icons3 from 'react-native-vector-icons/FontAwesome'
import Icons4 from 'react-native-vector-icons/Ionicons'
import Icons5 from 'react-native-vector-icons/Fontisto'
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker'
import { createAppointment } from "../../store/slice/appointmentsSlice";
import { toggleIsOpenAddAppointmentBox } from "../../store/slice/appSlice";

function AddAppointmentBox() {
    const user = useSelector(state => state.user)
    const { access_token } = useSelector(state => state.account)
    const dispatch = useDispatch()
    const email = useState(user.email)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [birth, setBirth] = useState(new Date(user.birth))
    const [dateAppointment, setDateAppointment] = useState(new Date())
    const [showDateAppointmentPicker, setShowDateAppointmentPicker] = useState(false)
    const [selectedHour, setSelectedHour] = useState();
    const [activeIndex, setActiveIndex] = useState();
    const hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
    const [reason, setReason] = useState('')

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birth;
        if (selectedDate) {
            setBirth(currentDate);
        } else {
            const localDate = new Date(currentDate);
            setBirth(localDate);
        }
        setShowDatePicker(Platform.OS === 'ios');
    }

    const handleDateAppointmentChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateAppointment;
        if (selectedDate) {
            setDateAppointment(currentDate)
        } else {
            const localDate = new Date(currentDate);
            setDateAppointment(localDate)
        }
        setShowDateAppointmentPicker(Platform.OS === 'ios');
    }

    const handleCreateAppointment = () => {
        if (selectedHour && reason !== '') {
            const data = {
                scheduled_time: `${format(dateAppointment, 'yyyy-MM-dd')} ${selectedHour}:00`,
                reason
            }
            // console.log(data)
            dispatch(createAppointment({ access_token, data }))
                .then(data => {
                    console.log('create appointment successful: ', data.payload)
                    dispatch(toggleIsOpenAddAppointmentBox())
                })
                .catch(err => {
                    console.log('err when create appointment: ', err)
                })
        }
    }

    return (
        <GestureHandlerRootView>
            <View style={[styles.wrapper]}>
                <View style={[styles.container]}>
                    <ScrollView>
                        <View style={[{ width: '100%' }]}>
                            <View>
                                <Text style={[styles.title, { marginTop: 20, textAlign: 'left' }]}>Personal infomation</Text>
                                <View style={[styles.flex,{ width: '100%', position: 'relative' }]}>
                                    <TextInput
                                        style={[styles.input, styles.inputActive]}
                                        placeholder="Fullname..."
                                        name='fullname'
                                        value={`${user.last_name} ${user.first_name}`}
                                        editable={false}
                                    />
                                    <View style={[{
                                        position: 'absolute', left: 14,
                                        top: '12%'
                                    }]}>
                                        <Icons4 name="person-outline" size={26} color={'#999'} />
                                    </View>
                                </View>
                                <View style={[styles.flex,{ width: '100%', position: 'relative' }]}>
                                    <TextInput
                                        style={[styles.input, email !== '' && styles.inputActive]}
                                        placeholder="Email..."
                                        name='email'
                                        value={email}
                                        editable={false}
                                    />
                                    <View style={[{
                                        position: 'absolute', left: 14,
                                        top: '12%',

                                    },]}>
                                        <Icons5 name="email" size={26} color={email === '' ? '#999' : '#444'} />
                                    </View>
                                </View>
                                <View style={[{ width: '100%', position: 'relative', paddingLeft:6, }]}>
                                    <View >
                                        <TextInput
                                            style={[styles.input, email !== '' && styles.inputActive, {width:'97%'}]}
                                            placeholder="Email..."
                                            name='email'
                                            value={format(birth, 'dd/MM/yyyy')}
                                            editable={false}
                                        />
                                        <View style={[{
                                            position: 'absolute', left: 14,
                                            top: '12%',

                                        },]}>
                                            <Icons3 name="birthday-cake" size={26} color={birth === '' ? '#999' : '#444'} />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={[{ width: '100%' }]}>
                                <Text style={[styles.title, { marginTop: 20 }]}>Time appointment</Text>

                                <View style={[{ width: '100%', position: 'relative', paddingLeft:6 }]}>
                                    <TouchableOpacity style={[{ width:'100%' }]} onPress={() => setShowDateAppointmentPicker(true)}>
                                        <Text style={[styles.input, dateAppointment && styles.inputActive]}>
                                            {dateAppointment ? format(dateAppointment, 'dd/MM/yyyy') : "Select the time..."}
                                        </Text>
                                        <View style={[{
                                            position: 'absolute', left: 14,
                                            top: '12%',

                                        },]}>
                                            <Icons2 name="calendar-month-outline" size={26} color={dateAppointment === '' ? '#999' : '#444'} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    {showDateAppointmentPicker && (
                                        <DateTimePicker
                                            value={dateAppointment || new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={handleDateAppointmentChange}
                                        />
                                    )}
                                </View>

                                <ScrollView horizontal={true} style={[{ flexDirection: 'row' }]}>
                                    {
                                        hours.map((hour, idx) => (
                                            <TouchableOpacity key={idx} style={[styles.hourItem, activeIndex === idx && styles.hourItemActive]}
                                                onPress={() => {
                                                    setActiveIndex(idx)
                                                    setSelectedHour(hour)
                                                }}
                                            >
                                                <Text style={[{
                                                    fontSize: 18, textAlign: 'center', fontWeight: 'bold', color: '#666'
                                                },
                                                activeIndex === idx && styles.hourItemTextActive]}>
                                                    {hour}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                            </View>

                            <View style={[{ width: '100%', position: 'relative' }]}>
                                <Text style={[styles.title, { marginTop: 36 }]}>Medical examination reason</Text>

                                <View style={[styles.flex]}>
                                    <TextInput
                                        style={[styles.input, reason !== '' && styles.inputActive, { marginRight:10 }]}
                                        placeholder="Reason..."
                                        name='reason'
                                        value={reason}
                                        onChangeText={(text) => { setReason(text) }}
                                    />
                                    <View style={[{
                                        position: 'absolute', left: 14,
                                        top: '12%',

                                    },]}>
                                        <Icons name="edit" size={26} color={reason === '' ? '#E3E1D9' : '#444'} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity onPress={handleCreateAppointment} style={[styles.button]}>
                        <Text style={[styles.buttonText]}>
                            Booking
                        </Text>
                    </TouchableOpacity>
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
        width: '96%',
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ececec'
    },
    inputActive: {
        borderColor: '#444'
    },
    hourItem: {
        borderWidth: 1,
        width: 80,
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#bfc0c5',
        marginRight: 20
    },
    hourItemActive: {
        backgroundColor: '#e8f0fd',
        borderColor: '#2377f5'
    },
    hourItemTextActive: {
        color: '#2377f5',
        fontWeight: 'bold'
    },
    shadow: {
        shadowColor: 'red',
        shadowOffset: { width: -2, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
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
    flex: {
        display:'flex',
        justifyContent:'center',
        alignItems: 'center',
        flexDirection:'row'
    }
})

export default AddAppointmentBox;
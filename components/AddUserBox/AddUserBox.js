import { useDispatch, useSelector } from "react-redux";
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from "date-fns";
import { setIsOpenAddUserBox, setTitleAddUserBox } from "../../store/slice/appSlice";
import AvatarPicker from "../AvatarPicker/AvatarPicker";
import { createDoctor, getDoctorById } from "../../store/slice/doctorsSlice";
import newRequest from "../../ultils/request";
import Icons from 'react-native-vector-icons/FontAwesome'
import { createNurse } from "../../store/slice/nurseSlice";
// import moment from 'moment'

function AddUserBox() {
    const genders = ['male', 'female']
    const [birth, setBirth] = useState();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dispatch = useDispatch()
    const [avatar, setAvatar] = useState(null)
    const { access_token } = useSelector(state => state.account)

    const handleAvatarSelected = (avatarUri) => {
        setAvatar(avatarUri);
        console.log('avatar: ', avatar)
    };
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birth;
        setShowDatePicker(Platform.OS === 'ios');
        setBirth(currentDate);
    };
    const { titleAddUserBox } = useSelector(state => state.app)

    const handleCreateDoctor = async ({
        username, email, password, first_name, last_name, gender,
        speciality, address
    }) => {
        const formData = new FormData
        formData.append('username', username.trim())
        formData.append('email', email.trim())
        formData.append('password', password.trim())
        formData.append('first_name', first_name.trim())
        formData.append('last_name', last_name.trim())
        formData.append('gender', gender.trim())
        formData.append('speciality', speciality.trim())
        formData.append('address', address.trim());
        formData.append('birth', format(birth, 'yyyy-MM-dd'))
        if (avatar) {
            formData.append('avatar', {
                uri: avatar,
                name: 'image.jpg',
                type: 'image/jpg',
            })
        }

        dispatch(createDoctor({ access_token, data: formData }))
            .then(data => {
                console.log('data create doctor: ', data.payload)
                // dispatch(getDoctorById({ access_token, doctorId: data.payload.id }))
                //     .then(data => {
                //         console.log('data get doctor: ', data.payload)
                dispatch(setIsOpenAddUserBox(false))
                // })
                // .catch(err => {
                //     console.log('Error when get doctor by id: ', err)
                // })
            })
            .catch(err => {
                console.log('err when creat doctor: ', err)
            })
    }

    const handleCreateNurse = async ({
        username, email, password, first_name, last_name, gender,
        faculty, address
    }) => {
        const formData = new FormData;
        formData.append('username', username.trim());
        formData.append('email', email.trim());
        formData.append('password', password.trim());
        formData.append('first_name', first_name.trim());
        formData.append('last_name', last_name.trim());
        formData.append('gender', gender.trim());
        formData.append('faculty', faculty.trim());
        formData.append('address', address.trim());
        formData.append('birth', format(birth, 'yyyy-MM-dd'))
        if (avatar) {
            formData.append('avatar', {
                uri: avatar,
                name: 'image.jpg',
                type: 'image/jpg',
            })
        }
        dispatch(createNurse({ access_token, data: formData }))
        .then(data => {
            console.log('data create nurse: ', data.payload)
            dispatch(setIsOpenAddUserBox(false))
        })
        .catch(err => {
            console.log('err when creat nurse: ', err)
        })
    }
    return (
        <View style={styles.wrapper}>
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    gender: genders[0],
                    speciality: '',
                    faculty: '',
                    address: '',
                    birth: '',
                }}
                onSubmit={(values, actions) => {
                    // console.log(values)
                    if (titleAddUserBox === 0) {
                        handleCreateDoctor(values)
                    } else {
                        handleCreateNurse(values)
                    }
                    // dispatch(setIsOpenAddUserBox(false))
                }}
            >
                {({
                    values,
                    handleChange,
                    errors,
                    touched,
                    handleBlur,
                    isValid,
                    isSubmitting,
                    handleSubmit,
                }) => (
                    <View style={styles.container}>
                        <View style={[{
                            display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                            width: '100%', alignItems: 'center', marginTop: 16, height: 60, marginBottom: 16
                        }]}>
                            <Text style={[styles.title, { marginTop: 10 }]}>{titleAddUserBox === 0 ?
                                'DOCTOR' : 'NURSE'}</Text>
                            <TouchableOpacity style={[{
                                backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
                                display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                                borderRadius: 8
                            }]}
                                onPress={() => {
                                    dispatch(setIsOpenAddUserBox(false))
                                }}
                            >
                                <Icons name='close' size={26} color={'white'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={[{ maxHeight: '80%' }]}>
                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>First name</Text>
                            <View style={[{
                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                marginTop: 4
                            }]}>
                                <TextInput
                                    style={styles.input}
                                    name="first_name"
                                    value={values.first_name}
                                    onChangeText={handleChange('first_name')}
                                    onBlur={handleBlur('first_name')}
                                    placeholder="First name"
                                />
                                {touched.first_name && errors.first_name && (
                                    <Text style={{ color: 'red' }}>{errors.first_name}</Text>
                                )}
                            </View>

                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Last name</Text>
                            <View style={[{
                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                marginTop: 4
                            }]}>
                                <TextInput
                                    style={styles.input}

                                    name="last_name"
                                    value={values.last_name}
                                    onChangeText={handleChange('last_name')}
                                    onBlur={handleBlur('last_name')}
                                    placeholder="Last name"
                                />
                                {touched.last_name && errors.last_name && (
                                    <Text style={{ color: 'red' }}>{errors.last_name}</Text>
                                )}
                            </View>

                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Username</Text>
                            <View style={[{
                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                marginTop: 4
                            }]}>
                                <TextInput
                                    style={styles.input}
                                    name="username"
                                    value={values.username}
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    placeholder="Username"
                                />
                                {touched.username && errors.username && (
                                    <Text style={{ color: 'red' }}>{errors.username}</Text>
                                )}
                            </View>

                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Email</Text>
                            <View style={[{
                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                marginTop: 4
                            }]}>
                                <TextInput
                                    style={styles.input}
                                    name="email"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    placeholder="Email"
                                />
                                {touched.email && errors.email && (
                                    <Text style={{ color: 'red' }}>{errors.email}</Text>
                                )}
                            </View>

                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Password</Text>
                            <View style={[{
                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                marginTop: 4
                            }]}>
                                <TextInput
                                    style={styles.input}
                                    name="password"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    placeholder="Password"
                                    secureTextEntry
                                />
                                {touched.password && errors.password && (
                                    <Text style={{ color: 'red' }}>{errors.password}</Text>
                                )}
                            </View>


                            {
                                titleAddUserBox === 0 &&
                                <View>
                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Speciality</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            name="speciality"
                                            value={values.speciality}
                                            onChangeText={handleChange('speciality')}
                                            onBlur={handleBlur('speciality')}
                                            placeholder="Speciality"
                                        />
                                    </View>
                                </View>
                                // {
                                //     touched.speciality && errors.speciality && (
                                //     <Text style={{ color: 'red' }}>{errors.speciality}</Text>
                                // )}
                            }

                            {
                                titleAddUserBox === 1 &&
                                <View>
                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Faculty</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            name="faculty"
                                            value={values.faculty}
                                            onChangeText={handleChange('faculty')}
                                            onBlur={handleBlur('faculty')}
                                            placeholder="Falcuty"
                                        />
                                    </View>
                                </View>
                                // {
                                //     touched.faculty && errors.faculty && (
                                //     <Text style={{ color: 'red' }}>{errors.faculty}</Text>
                                // )}
                            }
                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Address</Text>
                            <View style={[{
                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                marginTop: 4
                            }]}>
                                <TextInput
                                    style={styles.input}
                                    name="address"
                                    value={values.address}
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    placeholder="Address"
                                />
                                {touched.address && errors.address && (
                                    <Text style={{ color: 'red' }}>{errors.address}</Text>
                                )}
                            </View>

                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Gender</Text>
                            <View style={[{
                                marginTop: 4
                            }]}>
                                <View style={styles.picker}>
                                    <View
                                        style={[{
                                            fontSize: 16,
                                            // paddingTop: 10,
                                            // paddingBottom: 10,
                                            // paddingLeft: 16,
                                            // height: 42,
                                            borderRadius: 100,
                                            // paddingHorizontal: 10,
                                            width: '96%',
                                            marginBottom: 20,
                                            backgroundColor: '#f4f7f9',
                                        }]}
                                    >
                                        <Picker
                                            selectedValue={values.gender}
                                            onValueChange={(itemValue) => handleChange('gender')(itemValue)}>
                                            {genders.map((gender) => (
                                                <Picker.Item key={gender} label={gender} value={gender} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>


                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Birth</Text>
                            <View style={[{
                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                marginTop: 4
                            }]}>
                                <View style={[styles.input, { paddingLeft: 12 }]}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                        <Text style={[{ fontSize: 16 }]}>{!birth ? 'Select your birthday' : birth && format(birth, 'yyyy-MM-dd')}</Text>
                                    </TouchableOpacity>
                                </View>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={birth || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                )}
                            </View>

                            <View style={[{
                                display: 'flex', flexDirection: 'row', paddingBottom: 20
                            }]}>
                                <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Avatar</Text>
                                <View style={[{
                                    display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                    marginTop: 4
                                }]}></View>
                                <View style={[{ marginLeft: 120 }]}>
                                    <AvatarPicker onAvatarSelected={handleAvatarSelected} />
                                </View>
                            </View>
                        </ScrollView>

                        <View style={[{
                            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                            flexDirection: 'row', width: '100%', marginBottom: 20,
                        }]}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2', width: 160 }]} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Create medicine</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '86%',
        marginTop: 60
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
        width: '96%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9',
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
})

export default AddUserBox;
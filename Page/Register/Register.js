import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import newRequest from '../../ultils/request';
import AvatarPicker from '../../components/AvatarPicker/AvatarPicker';
import { ScrollView } from 'react-native-gesture-handler';
import { format } from 'date-fns'
import { useDispatch } from 'react-redux';
import { createPatient } from '../../store/slice/patientsSlice';
import { setIsAlreadyRegister } from '../../store/slice/appSlice';
import { setNewPasswordRegister, setNewUsernameRegister } from '../../store/slice/registerSlice';

const Register = ({ navigation }) => {
    const dispatch = useDispatch()
    const genders = ['male', 'female']
    const [birth, setBirth] = useState();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [avatar, setAvatar] = useState()
    const [isChangeToUpdate, setIsChangeToUpdate] = useState(false)

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birth;
        setShowDatePicker(Platform.OS === 'ios');
        setBirth(currentDate);
    }

    const handleAvatarSelected = (avatarUri) => {
        setAvatar(avatarUri);
        // console.log('avatar: ', avatar)
    }

    const gotoLogin = () => {
        navigation.navigate('Login')
    }

    const validateData = (formData, values) => {
        if (values.username.trim() !== '') {
            formData.append('username', values.username)
        }
        if (values.email.trim() !== '') {
            formData.append('email', values.email)
        }
        if (values.password.trim() !== '') {
            formData.append('password', values.password)
        }
        if (values.first_name.trim() !== '') {
            formData.append('first_name', values.first_name)
        }
        if (values.last_name.trim() !== '') {
            formData.append('last_name', values.last_name)
        }
        if (values.gender !== '') {
            formData.append('gender', values.gender)
        }
        if (values.major.trim() !== '') {
            formData.append('major', values.major)
        }
        if (values.address.trim() !== '') {
            formData.append('address', values.address)
        }
        if (birth !== '') {
            formData.append('birth', format(birth, 'yyyy-MM-dd'))
        }
        formData.append('avatar', {
            uri: avatar,
            name: 'avatar.jpg',
            type: 'avatar/jpg',
        })
    }

    const handleRegister = async (values) => {
        const formData = new FormData
        validateData(formData, values)

        if (formData._parts.length > 8) {
            setIsChangeToUpdate(false)
            console.log(formData)
            dispatch(createPatient({ data:formData }))
            .then(data => {
                console.log('Data from register: ', data.payload)
                gotoLogin()
            })
            .catch(err => {
                console.log('Error when creat user')
            })
            // await newRequest.post('/patients/', formData,
            //     {
            //         headers: {
            //             "Content-Type": 'multipart/form-data'
            //         }
            //     })
            //     .then(data => {
            //         console.log('data from create user: ', data)
            //     })
            //     .catch(err => {
            //         console.log('Error when trying create patient: ', err)
            //     })
        } else {
            setIsChangeToUpdate(true)
        }
    }

    return (
        <View style={[styles.wrapper, { backgroundColor: '#fff' }]}>
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    gender: genders[0],
                    major: '',
                    address: '',
                    birth: '',
                }}
                onSubmit={(values, { resetForm }) => {
                    console.log(values);
                    handleRegister(values)
                    resetForm()
                    // actions.setSubmitting(false);
                    // navigation.navigate('Dashboard');
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
                    <View style={[styles.container, { marginTop: 20 }]}>

                        <Text style={styles.title}>CREATE AN ACCOUNT</Text>

                        <ScrollView>
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


                            <TextInput
                                style={styles.input}
                                name="major"
                                value={values.major}
                                onChangeText={handleChange('major')}
                                onBlur={handleBlur('major')}
                                placeholder="Major"
                            />
                            {touched.major && errors.major && (
                                <Text style={{ color: 'red' }}>{errors.major}</Text>
                            )}
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

                            <View style={[{
                                borderRadius: 100,
                                width: '100%',
                                paddingHorizontal: 0,
                                marginBottom: 10, overflow: 'hidden'
                            }]}>
                                <Picker
                                    style={[{
                                        width: '100%', backgroundColor: '#f4f7f9',
                                        fontSize: 16,
                                    }]}
                                    selectedValue={values.gender}
                                    // style={{ height: 50, width: '100%' }}
                                    onValueChange={(itemValue) => handleChange('gender')(itemValue)}>
                                    {genders.map((gender) => (
                                        <Picker.Item key={gender} label={gender} value={gender} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={[styles.input, { marginTop: 10, paddingLeft: 12 }]}>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <Text style={[{ fontSize: 16 }]}>{!birth ? 'Select your birthday' : birth && format(birth, 'dd/MM/yyyy')}</Text>
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
                            <View style={[{
                                display: 'flex', flexDirection: 'row',
                            }]}>
                                <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Avatar</Text>
                                <View style={[{ marginLeft: 120 }]}>
                                    <AvatarPicker onAvatarSelected={handleAvatarSelected} />
                                </View>
                            </View>
                        </ScrollView>
                        {isChangeToUpdate &&
                            <Text style={[{ color: '#fa6a67', fontSize: 16, paddingTop: 10 }]}>
                                No fields changed. No update needed.
                            </Text>}
                        <View style={[{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            flexDirection: 'row', paddingTop: 10
                        }]}>
                            <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                                <Text style={[styles.buttonText]}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[{
                            display: 'flex', justifyContent: 'center', flexDirection: 'row',
                            alignContent: 'center', paddingBottom: 20, paddingTop: 12
                        }]}>
                            <Text style={[{ fontSize: 16 }]}>
                                Already have an account?
                            </Text>
                            <TouchableOpacity onPress={gotoLogin}>
                                <Text style={[{ fontSize: 16, color: '#50C4ED', marginLeft: 4 }]}
                                >Log in
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    )
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
        width: '100%',
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
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9',
        fontSize: 16
    },
    button: {
        width: '70%',
        backgroundColor: '#387ADF',
        height: 38,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight:'500'
    },
    picker: {
        borderRadius: 100,
        width: '100%',
        paddingHorizontal: 0,
        height: 42,
        overflow: 'hidden',
    },
})

export default Register;

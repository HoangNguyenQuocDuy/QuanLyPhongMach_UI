import { useDispatch, useSelector } from "react-redux";
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from "date-fns";
import { setIsOpenAddUserBox, setTitleAddUserBox } from "../../store/slice/appSlice";
import AvatarPicker from "../AvatarPicker/AvatarPicker";
import { createDoctor } from "../../store/slice/doctorsSlice";
import newRequest from "../../ultils/request";

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
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('gender', gender);
        formData.append('speciality', speciality);
        formData.append('address', address);
        formData.append('birth', birth);

        await newRequest.post('/doctors/', formData,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": 'multipart/form-data',
                }
            })
            .then(data => {
                console.log('data.payload create doctor: ', data.payload)
            })
            .catch(err => {
                console.log("Error when create doctor: ", err)
            })
    }

    const handleCreateNurse = async ({
        username, email, password, first_name, last_name, gender,
        faculty, address
    }) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('gender', gender);
        formData.append('faculty', faculty);
        formData.append('address', address);
        formData.append('birth', birth);

        await newRequest.post('/nurses/', formData,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": 'multipart/form-data',
                }
            })
            .then(data => {
                console.log('data.payload create doctor: ', data.payload)
            })
            .catch(err => {
                console.log("Error when create doctor: ", err)
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
                    falcuty: '',
                    address: '',
                    birth: '',
                }}
                onSubmit={(values, actions) => {
                    console.log(values)
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
                        <Text style={styles.title}>{titleAddUserBox === 0 ?
                            'CREATE A DOCTOR' : 'CREATE A NURSE'}
                        </Text>
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


                        {
                            titleAddUserBox === 0 &&
                            <TextInput
                                style={styles.input}
                                name="speciality"
                                value={values.speciality}
                                onChangeText={handleChange('speciality')}
                                onBlur={handleBlur('speciality')}
                                placeholder="Speciality"
                            />
                            // {
                            //     touched.speciality && errors.speciality && (
                            //     <Text style={{ color: 'red' }}>{errors.speciality}</Text>
                            // )}
                        }

                        {
                            titleAddUserBox === 1 &&
                            <TextInput
                                style={styles.input}
                                name="falcuty"
                                value={values.falcuty}
                                onChangeText={handleChange('falcuty')}
                                onBlur={handleBlur('falcuty')}
                                placeholder="Falcuty"
                            />
                            // {
                            //     touched.falcuty && errors.falcuty && (
                            //     <Text style={{ color: 'red' }}>{errors.falcuty}</Text>
                            // )}
                        }
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

                        <View style={styles.picker}>
                            <Picker
                                style={[styles.input, { width: '100%' }]}
                                selectedValue={values.gender}
                                onValueChange={(itemValue) => handleChange('gender')(itemValue)}>
                                {genders.map((gender) => (
                                    <Picker.Item key={gender} label={gender} value={gender} />
                                ))}
                            </Picker>
                        </View>

                        <View style={[styles.input, { marginTop: 10, paddingLeft: 12 }]}>
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

                        <View style={[{
                            display: 'flex', flexDirection: 'row',
                        }]}>
                            <Text style={[{ fontSize: 16 }]}>Avatar</Text>
                            <View style={[{ marginLeft: 120 }]}>
                                <AvatarPicker onAvatarSelected={handleAvatarSelected} />
                            </View>
                        </View>

                        <View style={[{
                            display: 'flex', justifyContent: 'space-between',
                            flexDirection: 'row'
                        }]}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2' }]} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { marginLeft: 40 }]}
                                onPress={() => {
                                    dispatch(setIsOpenAddUserBox(false))
                                }}>
                                <Text style={styles.buttonText}>Cancel</Text>
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
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        height: 42,
        borderRadius: 8,
        paddingHorizontal: 10,
        width: '80%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9'
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
    picker: {
        borderRadius: 9,
        width: '80%',
        overflow: 'hidden',
    },
    register: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    registerTitle: {
        fontSize: 14
    },
    registerText: {
        fontSize: 16,
        paddingLeft: 4,
        color: '#fa6a67'
    },
})

export default AddUserBox;
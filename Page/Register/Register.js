import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import newRequest from '../../ultils/request';
import AvatarPicker from '../../components/AvatarPicker/AvatarPicker';


const Register = ({ navigation }) => {
    const genders = ['male', 'female']
    const [birth, setBirth] = useState();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [avatar, setAvatar] = useState()

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

    const handleRegister = async (values) => {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('gender', values.gender);
        formData.append('major', values.major);
        formData.append('address', values.address);
        formData.append('birth', birth);
        formData.append('avatar', avatar);
        console.log(formData)

        await newRequest.post('/patients/', formData,
            {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            .then(data => {
                console.log('data from create user: ', data)
            })
            .catch(err => {
                console.log('Error when trying create patient: ', err)
            })
    }

    return <Formik
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
        onSubmit={(values, actions) => {
            // console.log(values);
            handleRegister(values)
            actions.setSubmitting(false);
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
            <View style={styles.container}>
                <Text style={styles.title}>CREATE AN ACCOUNT</Text>
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
                    placeholder="password"
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

                <View style={styles.picker}>
                    <Picker
                        style={[styles.input, { width: '100%' }]}
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
                        <Text style={[{ fontSize: 16 }]}>{!birth ? 'Select your birthday' : birth && birth.toLocaleDateString()}</Text>
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

                <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <View style={styles.register}>
                    <Text style={styles.registerTitle}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity onPress={gotoLogin}><Text style={styles.registerText}>Log in</Text></TouchableOpacity>
                </View>
            </View>
        )}
    </Formik>
}


const styles = StyleSheet.create({
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
        width: '60%',
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

export default Register;

import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin, login } from "../../store/slice/accountSlice";
import { fetchUserData } from "../../store/slice/userSlice";
import { setIsAlreadyRegister } from "../../store/slice/appSlice";
import { setNewPasswordRegister, setNewUsernameRegister } from "../../store/slice/registerSlice";
import { Shadow } from "react-native-shadow-2";

function Login({ navigation }) {
    const dispatch = useDispatch()
    const { isAlreadyRegister } = useSelector(state => state.app)
    const { newUsernameRegister, newPasswordRegister } = useSelector(state => state.register)

    const gotoRegister = () => {
        navigation.navigate('Register')
    }

    const handleLogin = async ({ username, password }) => {
        dispatch(fetchLogin({ username, password }))
            .then(data => {
                dispatch(login({ ...data.payload, username }))
                dispatch(fetchUserData(username))
                    .then(data => {
                        console.log('Data user login: ', data.payload)
                        dispatch(setIsAlreadyRegister(false))
                        dispatch(setNewUsernameRegister(''))
                        dispatch(setNewPasswordRegister(''))
                    })
                    .catch(err => {
                        console.log('Error when get user login data: ', err)
                    })

                // if (role === 'Admin') {
                //     navigation.navigate('Admin')s
                // } else if (role === 'Doctor') {
                //     navigation.navigate('Doctor')
                // } else if (role === 'Nurse') {
                //     navigation.navigate('Nurse')
                // }
            })

            .catch(err => {
                console.log('Error when trying login: ', err)
            })
    }

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }

    const { role } = useSelector(state => state.user)

    useEffect(() => {
        if (role != '') {
            if (role === 'Admin') {
                navigation.navigate('Admin')
            } else if (role === 'Doctor') {
                navigation.navigate('Appointment')
            } else if (role === 'Nurse') {
                navigation.navigate('Manage appointment')
            }
        }
    }, [role]);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: '#50C4ED' }]}>QD CLINIC</Text>
            <Text style={[styles.subtitle, { color: '#50C4ED' }]}>Wellcome back you've been missed!</Text>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.image}
            />

            <Formik
                initialValues={{
                    username: isAlreadyRegister ? newUsernameRegister : '',
                    password: isAlreadyRegister ? newPasswordRegister : ''
                }}
                onSubmit={(values, { resetForm }) => {
                    handleLogin(values)
                    resetForm()
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={[{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>

                        <Shadow distance={16} startColor="#f0eff3">
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={values.username}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                        />
                        </Shadow>
                        <Shadow distance={16} startColor="#f0eff3">
                        <TextInput
                            style={[styles.input, { marginBottom: 30 }]}
                            placeholder="Password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            secureTextEntry
                        />
                        </Shadow>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>

            <View style={styles.forgotPassword}>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot password</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.register}>
                <Text style={styles.registerTitle}>
                    Do not have an account?
                </Text>
                <TouchableOpacity onPress={gotoRegister}><Text style={styles.registerText}>Register</Text></TouchableOpacity>
            </View>
        </View>
    );
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
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        height: 42,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: 300,
        marginBottom: 20,
    },
    forgotPassword: {
        marginTop: 26,
        marginBottom: 26,
    },
    forgotPasswordText: {
        color: '#666',
        fontSize: 16,
        color: '#50C4ED',
    },
    button: {
        width: '60%',
        backgroundColor: '#387ADF',
        height: 38,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    },
    register: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    registerTitle: {
        fontSize: 16
    },
    registerText: {
        fontSize: 16,
        paddingLeft: 4,
        color: '#50C4ED'
    },
    image: {
        width: 140,
        height: 140,
        marginBottom: 20,
        borderRadius: 100
    },
});

export default Login;
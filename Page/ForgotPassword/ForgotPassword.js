import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Shadow } from "react-native-shadow-2";
import newRequest from "../../ultils/request";
import { useDispatch } from "react-redux";
import { setEmailForgotPWActive } from "../../store/slice/appSlice";

function ForgotPassword({ navigation }) {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [isFail, setIsFail] = useState(false)
    const handleForgotpassword = async () => {
        if (email.trim() !== '') {
            await newRequest.post(`/forgot-password/`, {
                email
            }, {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
                .then(data => {
                    setIsFail(false)
                    dispatch(setEmailForgotPWActive(email))
                    navigation.navigate('ResetPassword')
                })
                .catch(err => {
                    setIsFail(true)
                    console.log('err when reset password: ', err)
                })
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Type your email</Text>
            <Shadow distance={16} startColor="#f0eff3">
                <TextInput
                    style={[styles.input, { marginBottom: 20 }]}
                    placeholder="Email..."
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
            </Shadow>
            {
                isFail && <Text style={[styles.errText]}>Your email is not valid</Text>
            }
            <View style={styles.sendBtn}>
                <TouchableOpacity style={styles.button} onPress={handleForgotpassword}>
                    <Text style={styles.buttonText}>Send Token</Text>
                </TouchableOpacity>
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
    input: {
        height: 42,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: 300,
        marginBottom: 20,
    },
    errText: {
        fontSize:16,
        color:'red',
        marginBottom:20
    },
    button: {
        width: '100%',
        backgroundColor: '#387ADF',
        height: 42,
        borderRadius: 8,
        paddingHorizontal: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
});

export default ForgotPassword;
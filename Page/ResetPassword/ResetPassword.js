import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Shadow } from "react-native-shadow-2";
import newRequest from "../../ultils/request";
import { useSelector } from "react-redux";

function ResetPassword({ navigation }) {
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isFail, setIsFail] = useState(false)
    const { emailForgotPWActive } = useSelector(state => state.app)

    const handleResetPassword = async () => {
        if (newPassword.trim() !== '' && token.trim() !== '') {
            console.log(token)
            console.log(newPassword)
            await newRequest.post('/reset-password/', {
                email: emailForgotPWActive,
                token,
                new_password: newPassword
            }, {
                headers: {
                    "Content-Type": 'application/json'
                }
            })
                .then(data => {
                    setIsFail(false)
                    navigation.navigate('Login')
                })
                .catch(err => {
                    setIsFail(true)
                    console.log('err when reset password: ', err.message)
                })
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Token</Text>
                <Shadow distance={16} startColor="#f0eff3">
                    <TextInput
                        style={[styles.input, { marginBottom: 20 }]}
                        placeholder="Email..."
                        value={token}
                        onChangeText={text => setToken(text)}
                    />
                </Shadow>
            </View>

            <View>
                <Text style={styles.title}>New password</Text>
                <Shadow distance={16} startColor="#f0eff3">
                    <TextInput
                        style={[styles.input, { marginBottom: 20 }]}
                        placeholder="Password..."
                        value={newPassword}
                        onChangeText={text => setNewPassword(text)}
                        secureTextEntry
                    />
                </Shadow>
            </View>
            <View style={styles.sendBtn}>
                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Update</Text>
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
        fontSize: 16,
        color: 'red',
        marginBottom: 20
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

export default ResetPassword;
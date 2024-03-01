import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { Shadow } from 'react-native-shadow-2'
import { TextInput } from "react-native-gesture-handler";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { updatePayment } from "../../store/slice/paymentsSlice";

function PaymentItem({ created_at, id, patient, reload }) {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [fee, setFee] = useState('')
    const pmMethod = ['Cash', 'Momo']
    const [paymentMethod, setPaymentMethod] = useState(pmMethod[0])
    const [errMess, setErrMess] = useState('')
    const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false)

    const handleConfirmPayment = () => {
        if (fee.trim() !== '') {
            setErrMess('')

            const data = {
                fee: parseFloat(fee),
                payment_method: paymentMethod
            }

            dispatch(updatePayment({ access_token, data, id }))
                .then(data => {
                    console.log('update bill successful: ', data.data)
                    reload(true)
                })
                .catch(err => {
                    console.log('err when update bill: ', err)
                })
        } else {
            setErrMess('Fee blank!')
        }
    }

    useEffect(() => {
        let timer
        if (isUpdateSuccessful) {
            timer = setTimeout(() => {
                setIsUpdateSuccessful(false)
            }, 3000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [isUpdateSuccessful])

    return (
        <View style={[styles.wrapper, { marginTop: 10 }]}>
            {
                isUpdateSuccessful ?
                    <View>
                        <Text style={[styles.text, styles.success]} >Pay this bill sucessful!</Text>
                    </View>
                    :
                    <Shadow distance={14} startColor="#f0f2f5" style={styles.shadow}>
                        <View style={[styles.container, { borderRadius: 20 }]}>
                            <View style={[{ paddingHorizontal: 10, paddingVertical: 10 }]}>
                                <View style={styles.flex}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Date: `} </Text>
                                    <Text style={[styles.text]}>{moment.utc(created_at).format('DD/MM/yyyy')}</Text>
                                </View>
                                <View style={[styles.flex, { marginVertical: 10 }]}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Patient name: `} </Text>
                                    <Text style={[styles.text]}>{`${patient.user.first_name} ${patient.user.last_name}`}</Text>
                                </View>
                                <View style={[styles.flex, { marginBottom: 10 }]}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Email: `} </Text>
                                    <Text style={[styles.text]}>{`${patient.user.email}`}</Text>
                                </View>
                                {/* <View style={[styles.flex, { marginBottom: 10 }]}>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Medical costs: `} </Text>
                            <Text style={[styles.text]}>{`${patient.user.mail}`}</Text>
                        </View> */}
                                <View style={[styles.flex, { marginVertical: 10, alignItems: 'center' }]}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Fee: `} </Text>
                                    <TextInput
                                        placeholder="fee..."
                                        keyboardType="numeric"
                                        value={fee} onChangeText={text => { setFee(text) }}
                                        style={styles.input}
                                    />
                                </View>
                                {errMess!=='' && <Text style={[styles.text, styles.err, { marginBottom:10 }]} >{errMess}</Text>}
                                <View style={styles.picker}>
                                    <View
                                        style={[{
                                            borderRadius: 100,
                                            marginBottom: 20,
                                            // width: 90,
                                            backgroundColor: '#f4f7f9',
                                            // height:40
                                        }]}
                                    >
                                        <Picker
                                            selectedValue={paymentMethod}
                                            onValueChange={(itemValue) => { setPaymentMethod(itemValue) }}>
                                            {pmMethod.map((method) => (
                                                <Picker.Item key={method} label={method} value={method} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>

                                <View style={[styles.flex, { justifyContent: 'center' }]}>
                                    <TouchableOpacity onPress={handleConfirmPayment} style={[styles.button]}>
                                        <Text style={[styles.buttonText]}>
                                            Confirm payment
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Shadow>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    },
    err: {
        color: '#FF004D'
    },
    success: {
        color:'#74E291'
    },
    wrapper: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    container: {
        width: '100%',
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
        height: 42,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        paddingLeft: 20,
        width: 280,
        borderWidth: 1,
        borderColor: '#B4B4B8'
    },
    button: {
        width: '90%',
        backgroundColor: '#3787eb',
        height: 46,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    picker: {
        borderRadius: 9,
        // width: '80%',
        overflow: 'hidden',
    },
    img: {
        width: 50,
        height: 50
    },
    flex: {
        display: 'flex',
        flexDirection: 'row'
    }
})

export default PaymentItem;
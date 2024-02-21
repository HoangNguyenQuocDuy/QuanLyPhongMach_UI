import { Formik } from "formik";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import newRequest from "../../ultils/request";
import { useDispatch, useSelector } from "react-redux";
import Icons from 'react-native-vector-icons/FontAwesome'
import { setShowConfirmation, setTitleAddUserBox, toggleIsOpenUserInfoTag } from "../../store/slice/appSlice";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns';
import { deleteDoctor, updateDoctor, updateDoctors } from "../../store/slice/doctorsSlice";
import ConfirmBox from "../ConfirmBox/ConfirmBox";
import { deleteNurse, updateNurse } from "../../store/slice/nurseSlice";

function UserInfo() {
    const dispatch = useDispatch()
    const genders = ['male', 'female']
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [user, setUser] = useState()
    const { usernameTagActive, optionUserTagActive,
        userRoleIdTagActive, showConfirmation }
        = useSelector(state => state.app)
    const { access_token } = useSelector(state => state.account)
    const [isChangeToUpdate, setIsChangeToUpdate] = useState(false)

    const { titleAddUserBox } = useSelector(state => state.app)

    useEffect(() => {
        async function fetchUserByUsername() {
            const response = await newRequest.get(`/users/${usernameTagActive}/`)
            setUser(response.data)
        }
        fetchUserByUsername()
    }, [usernameTagActive])

    const [birth, setBirth] = useState();
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birth;
        setShowDatePicker(Platform.OS === 'ios');
        setBirth(currentDate);
    };

    const handleUpdate = async (values) => {
        const changedFields = new FormData;

        if (values.first_name !== user.first_name) {
            changedFields.append('first_name', values.first_name);
        }
        if (values.last_name !== user.last_name) {
            changedFields.append('last_name', values.last_name);
        }
        if (values.address !== user.address) {
            changedFields.append('address', values.address);
        }
        if (values.gender !== user.gender) {
            changedFields.append('gender', values.gender);
        }
        if (user.group_name === 'Doctor' && values.speciality !== optionUserTagActive) {
            changedFields.append('speciality', values.speciality);
        }
        if (user.group_name === 'Nurse' && values.faculty !== optionUserTagActive) {
            changedFields.append('faculty', values.faculty);
        }
        if (birth) {
            let _birth = format(birth, 'yyyy-MM-dd')
            if (_birth !== user.birth) {
                changedFields.append('birth', _birth);
            }
        }

        if (changedFields._parts.length === 0) {
            setIsChangeToUpdate(true)
        } else {
            setIsChangeToUpdate(false)
            user.group_name === 'Doctor' && dispatch(updateDoctors({ access_token, doctorId: userRoleIdTagActive, updateData: changedFields }))
                .then(data => {
                    dispatch(toggleIsOpenUserInfoTag())
                })
                .catch(error => {
                    console.error('Error updating doctor: ', error);
                })

            user.group_name === 'Nurse' && dispatch(updateNurse({ access_token, nurseId: userRoleIdTagActive, updateData: changedFields }))
                .then(data => {
                    dispatch(toggleIsOpenUserInfoTag())
                })
                .catch(error => {
                    console.error('Error updating nurse: ', error);
                })
        }
    };

    const handleDelete = async () => {
        user.group_name === 'Doctor' && dispatch(deleteDoctor({ access_token, doctorId: userRoleIdTagActive }))
            .then(data => {
                console.log('data delete ', data)
                dispatch(setShowConfirmation(false))
                dispatch(toggleIsOpenUserInfoTag())
            })
            .catch(error => {
                console.error('Error delete doctor: ', error);
            })

        user.group_name === 'Nurse' && dispatch(deleteNurse({ access_token, nurseId: userRoleIdTagActive }))
            .then(data => {
                console.log('data delete ', data)
                dispatch(setShowConfirmation(false))
                dispatch(toggleIsOpenUserInfoTag())
            })
            .catch(error => {
                console.error('Error delete nurse: ', error);
            })
    }

    if (!user) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <View style={[{ width: '86%' }]}>
                <View style={[{
                    backgroundColor: '#fff', width: '90%', borderRadius: 10, height: '60%'
                }]}>
                    {
                        user &&
                        <>
                            <View style={[{
                                display: 'flex', justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginTop: 100,
                            }]}>
                                <Image
                                    source={user.avatar ? user.avatar : require('../../assets/images/nonAvatar.jpg')}
                                    style={styles.img}
                                />
                                <TouchableOpacity onPress={() => { dispatch(toggleIsOpenUserInfoTag()) }}>
                                    <Icons name="close" size={58} color={'black'} />
                                </TouchableOpacity>
                            </View>
                            <Formik
                                initialValues={{
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    gender: user.gender,
                                    address: user.address,
                                    speciality: user.group_name === 'Doctor' ? optionUserTagActive : '',
                                    // major: user.group_name==='Patient' ? optionUserTagActive : '',
                                    faculty: user.group_name === 'Nurse' ? optionUserTagActive : ''
                                }}
                                onSubmit={(values, actions) => {
                                    handleUpdate(values)
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
                                    <View>
                                        <View style={styles.info}>
                                            <Text style={styles.label}>Frist name: </Text>
                                            <TextInput
                                                style={styles.input}
                                                name="first_name"
                                                value={values.first_name}
                                                onChangeText={handleChange('first_name')}
                                                onBlur={handleBlur('first_name')}
                                            />
                                        </View>
                                        <View style={styles.info}>
                                            <Text style={styles.label}>Last name: </Text>
                                            <TextInput
                                                style={styles.input}
                                                name="last_name"
                                                value={values.last_name}
                                                onChangeText={handleChange('last_name')}
                                                onBlur={handleBlur('last_name')}
                                            />
                                        </View>
                                        <View style={styles.info}>
                                            <Text style={styles.label}>Address: </Text>
                                            <TextInput
                                                style={styles.input}
                                                name="address"
                                                value={values.address}
                                                onChangeText={handleChange('address')}
                                                onBlur={handleBlur('address')}
                                            />
                                        </View>
                                        <View style={styles.info}>
                                            <Text style={styles.label}>Gender: </Text>
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
                                        </View>
                                        <View style={styles.info}>
                                            <Text style={styles.label}>Birth: </Text>
                                            <View style={[styles.input, { justifyContent: 'center' }]}>
                                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                                    <Text style={[{ fontSize: 16 }]}>{!birth ? user.birth : birth && format(birth, 'yyyy-MM-dd')}</Text>
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
                                        {
                                            values.speciality !== '' && <View style={styles.info}>
                                                <Text style={styles.label}>Speciality: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    name="speciality"
                                                    value={values.speciality}
                                                    onChangeText={handleChange('speciality')}
                                                    onBlur={handleBlur('speciality')}
                                                />
                                            </View>
                                        }
                                        {
                                            values.faculty !== '' && <View style={styles.info}>
                                                <Text style={styles.label}>faculty: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    name="faculty"
                                                    value={values.faculty}
                                                    onChangeText={handleChange('faculty')}
                                                    onBlur={handleBlur('faculty')}
                                                />
                                            </View>
                                        }
                                        {isChangeToUpdate &&
                                            <Text style={[{ color: '#fa6a67', fontSize: 16 }]}>
                                                No fields changed. No update needed.
                                            </Text>}
                                        <View style={[{
                                            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                                            flexDirection: 'row', width: '100%'
                                        }]}>
                                            <TouchableOpacity style={[styles.button]}
                                                onPress={() => {
                                                    dispatch(setTitleAddUserBox(0))
                                                    dispatch(setShowConfirmation(true))
                                                }}>
                                                <Text style={styles.buttonText}>Delete user</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2' }]} onPress={handleSubmit}>
                                                <Text style={styles.buttonText}>Update</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </>
                    }
                </View>
            </View>
            {showConfirmation &&
                <ConfirmBox handleAction={handleDelete}
                    title={user.group_name === 'Doctor' ? 
                    'Do you want to delete this doctor?' : 
                    'Do you want to delete this nurse?'}
                />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    img: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 20
    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        fontSize: 16,
        height: 42,
        borderRadius: 8,
        paddingHorizontal: 10,
        width: '80%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9'
    },
    label: {
        fontSize: 16,
        minWidth: 90,
        paddingBottom: 21
    },
    button: {
        width: '40%',
        backgroundColor: '#fa6a67',
        height: 42,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
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

})

export default UserInfo;
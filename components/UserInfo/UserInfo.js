import { Formik } from "formik";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import newRequest from "../../ultils/request";
import { useDispatch, useSelector } from "react-redux";
import Icons from 'react-native-vector-icons/FontAwesome'
import { setIsOpenAddUserBox, setShowConfirmation, setTitleAddUserBox, toggleIsOpenScheduleInfo, toggleIsOpenUserInfoTag } from "../../store/slice/appSlice";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns';
import { deleteDoctor, updateDoctor, updateDoctors } from "../../store/slice/doctorsSlice";
import ConfirmBox from "../ConfirmBox/ConfirmBox";
import { deleteNurse, updateNurse } from "../../store/slice/nurseSlice";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import AvatarPicker from "../AvatarPicker/AvatarPicker";

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
    const [imageSelected, setImageSelected] = useState()
    const { titleAddUserBox } = useSelector(state => state.app)
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        async function fetchUserByUsername() {
            const response = await newRequest.get(`/users/${usernameTagActive}/`)
            console.log('response.data: ', response.data)
            setImageUrl(response.data.avatar)
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
        if (imageSelected) {
            changedFields.append('avatar', {
                uri: imageSelected,
                name: 'image.jpg',
                type: 'image/jpg',
            })
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

    const handleImageSelected = (avatarUri) => {
        setImageSelected(avatarUri);
        console.log('avatarUri: ', avatarUri)
    }

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
        <GestureHandlerRootView style={styles.wrapper}>
            {
                user &&
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
                    }) =>
                    (
                        <View style={styles.container}>
                            <View style={[{
                                display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                                width: '100%', alignItems: 'center', marginTop: 16, height: 60
                            }]}>
                                <Text style={[styles.title, { marginTop: 10 }]}>{user.group_name}</Text>
                                <TouchableOpacity style={[{
                                    backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
                                    display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                                    borderRadius: 8
                                }]}
                                    onPress={() => {
                                        dispatch(toggleIsOpenUserInfoTag())
                                    }}
                                >
                                    <Icons name='close' size={26} color={'white'} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={[{ maxHeight: '80%' }]}>
                                {
                                    !imageSelected &&
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={[{ width: '100%', height: '16%', objectFit: 'contain' }]}
                                    />
                                }
                                <AvatarPicker onAvatarSelected={handleImageSelected} />
                                <View style={[{ width: '100%', paddingBottom: 20 }]}>
                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>First name</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="First name..."
                                            name='first_name'
                                            value={values.first_name}
                                            onChangeText={handleChange('first_name')}
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
                                            placeholder="Last name..."
                                            name='last_name'
                                            value={values.last_name}
                                            onChangeText={handleChange('last_name')}
                                        />
                                        {touched.last_name && errors.last_name && (
                                            <Text style={{ color: 'red' }}>{errors.last_name}</Text>
                                        )}
                                    </View>

                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Address</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Address..."
                                            name='address'
                                            value={values.address}
                                            onChangeText={handleChange('address')}
                                        />
                                        {touched.address && errors.address && (
                                            <Text style={{ color: 'red' }}>{errors.address}</Text>
                                        )}
                                    </View>

                                    {
                                        values.speciality !== '' &&
                                        <>
                                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Speciality</Text>
                                            <View style={[{
                                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                                marginTop: 4
                                            }]}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Speciality..."
                                                    name='speciality'
                                                    value={values.speciality}
                                                    onChangeText={handleChange('speciality')}
                                                />
                                                {touched.speciality && errors.speciality && (
                                                    <Text style={{ color: 'red' }}>{errors.speciality}</Text>
                                                )}
                                            </View>
                                        </>
                                    }

                                    {
                                        values.faculty !== '' &&
                                        <>
                                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Faculty</Text>
                                            <View style={[{
                                                display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                                marginTop: 4
                                            }]}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Faculty..."
                                                    name='faculty'
                                                    value={values.faculty}
                                                    onChangeText={handleChange('faculty')}
                                                />
                                                {touched.faculty && errors.faculty && (
                                                    <Text style={{ color: 'red' }}>{errors.faculty}</Text>
                                                )}
                                            </View>
                                        </>
                                    }

                                    <View style={styles.info}>
                                        <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Birth</Text>
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
                                </View>
                            </ScrollView>
                            {isChangeToUpdate &&
                                <Text style={[{ color: '#fa6a67', fontSize: 16, paddingTop: 10 }]}>
                                    No fields changed. No update needed.
                                </Text>}
                            <View style={[{
                                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                                flexDirection: 'row', width: '100%', marginBottom: 24, paddingTop: 10
                            }]}>
                                <TouchableOpacity style={[styles.button, { width: 160 }]}
                                    onPress={() => {
                                        dispatch(setShowConfirmation(true))
                                    }}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2', width: 160 }]}
                                    onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>



                // <Formik

                // >
                //     {({
                //         values,
                //         handleChange,
                //         errors,
                //         touched,
                //         handleBlur,
                //         isValid,
                //         isSubmitting,
                //         handleSubmit,
                //     }) => (
                //         <View style={styles.container}>
                //             <View style={[{
                //                 display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                //                 width: '100%', alignItems: 'center', marginTop: 16, height: 60
                //             }]}>
                //                 <Text style={[styles.title, { marginTop: 10 }]}>Medicine</Text>
                //                 <TouchableOpacity style={[{
                //                     backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
                //                     display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                //                     borderRadius: 8
                //                 }]}
                //                     onPress={() => {
                //                         dispatch(toggleIsOpenUpdateMedicineBox())
                //                     }}
                //                 >
                //                     <Icons name='close' size={26} color={'white'} />
                //                 </TouchableOpacity>
                //             </View>

                //             <View style={styles.info}>
                //                 <Text style={styles.label}>Frist name: </Text>
                //                 <TextInput
                //                     style={styles.input}
                //                     name="first_name"
                //                     value={values.first_name}
                //                     onChangeText={handleChange('first_name')}
                //                     onBlur={handleBlur('first_name')}
                //                 />
                //             </View>
                //             <View style={styles.info}>
                //                 <Text style={styles.label}>Last name: </Text>
                //                 <TextInput
                //                     style={styles.input}
                //                     name="last_name"
                //                     value={values.last_name}
                //                     onChangeText={handleChange('last_name')}
                //                     onBlur={handleBlur('last_name')}
                //                 />
                //             </View>
                //             <View style={styles.info}>
                //                 <Text style={styles.label}>Address: </Text>
                //                 <TextInput
                //                     style={styles.input}
                //                     name="address"
                //                     value={values.address}
                //                     onChangeText={handleChange('address')}
                //                     onBlur={handleBlur('address')}
                //                 />
                //             </View>
                //             <View style={styles.info}>
                //                 <Text style={styles.label}>Gender: </Text>
                //                 <View style={styles.picker}>
                //                     <Picker
                //                         style={[styles.input, { width: '100%' }]}
                //                         selectedValue={values.gender}
                //                         onValueChange={(itemValue) => handleChange('gender')(itemValue)}>
                //                         {genders.map((gender) => (
                //                             <Picker.Item key={gender} label={gender} value={gender} />
                //                         ))}
                //                     </Picker>
                //                 </View>
                //             </View>
                //             <View style={styles.info}>
                //                 <Text style={styles.label}>Birth: </Text>
                //                 <View style={[styles.input, { justifyContent: 'center' }]}>
                //                     <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                //                         <Text style={[{ fontSize: 16 }]}>{!birth ? user.birth : birth && format(birth, 'yyyy-MM-dd')}</Text>
                //                     </TouchableOpacity>
                //                 </View>
                //                 {showDatePicker && (
                //                     <DateTimePicker
                //                         value={birth || new Date()}
                //                         mode="date"
                //                         display="default"
                //                         onChange={handleDateChange}
                //                     />
                //                 )}
                //             </View>
                //             {
                //                 values.speciality !== '' && <View style={styles.info}>
                //                     <Text style={styles.label}>Speciality: </Text>
                //                     <TextInput
                //                         style={styles.input}
                //                         name="speciality"
                //                         value={values.speciality}
                //                         onChangeText={handleChange('speciality')}
                //                         onBlur={handleBlur('speciality')}
                //                     />
                //                 </View>
                //             }
                //             {
                //                 values.faculty !== '' && <View style={styles.info}>
                //                     <Text style={styles.label}>faculty: </Text>
                //                     <TextInput
                //                         style={styles.input}
                //                         name="faculty"
                //                         value={values.faculty}
                //                         onChangeText={handleChange('faculty')}
                //                         onBlur={handleBlur('faculty')}
                //                     />
                //                 </View>
                //             }
                //             {isChangeToUpdate &&
                //                 <Text style={[{ color: '#fa6a67', fontSize: 16 }]}>
                //                     No fields changed. No update needed.
                //                 </Text>}
                //             <View style={[{
                //                 display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                //                 flexDirection: 'row', width: '100%'
                //             }]}>
                //                 <TouchableOpacity style={[styles.button]}
                //                     onPress={() => {
                //                         dispatch(setTitleAddUserBox(0))
                //                         dispatch(setShowConfirmation(true))
                //                     }}>
                //                     <Text style={styles.buttonText}>Delete user</Text>
                //                 </TouchableOpacity>
                //                 <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2' }]} onPress={handleSubmit}>
                //                     <Text style={styles.buttonText}>Update</Text>
                //                 </TouchableOpacity>
                //             </View>
                //         </View>
                //     )}
                // </Formik>            
            }
            {
                showConfirmation &&
                <ConfirmBox handleAction={handleDelete}
                    title={user.group_name === 'Doctor' ?
                        'Do you want to delete this doctor?' :
                        'Do you want to delete this nurse?'}
                />
            }
        </GestureHandlerRootView >
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
        fontSize: 16
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

export default UserInfo;
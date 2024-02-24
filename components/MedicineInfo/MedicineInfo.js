import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import newRequest from "../../ultils/request";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Icons from 'react-native-vector-icons/FontAwesome'
import { setIsLoadMedicinesSearched, setShowConfirmation, toggleIsOpenUpdateMedicineBox } from "../../store/slice/appSlice";
import AvatarPicker from "../AvatarPicker/AvatarPicker";
import { deleteMedicine, updateMedicine } from "../../store/slice/medicineSlice";
import ConfirmBox from "../ConfirmBox/ConfirmBox";

function MedicineInfo() {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const { medicineIdActive, showConfirmation } = useSelector(state => state.app)
    const [medicine, setMedicine] = useState()
    const [imageUrl, setImageUrl] = useState('')
    const [isFetchedMedicine, setIsFetchedMedicine] = useState(false)
    const [imageSelected, setImageSelected] = useState()
    const [isChangeToUpdate, setIsChangeToUpdate] = useState(false)

    const handleGetMedicineById = async () => {
        await newRequest.get(`/medicines/${medicineIdActive}/`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(data => {
                // console.log('Medicine: ', data.data)
                setMedicine(data.data)
                setImageUrl(data.data.image.substring(data.data.image.indexOf('image/upload/') + 'image/upload/'.length))
                setIsFetchedMedicine(true)
            })
            .catch(err => {
                console.log('Error when trying get medicine by id: ', err)
            })
    }

    useEffect(() => {
        if (!isFetchedMedicine) {
            handleGetMedicineById()
        }
    }, [])

    const validateData = (formData, values) => {
        if (values.active_substances !== medicine.active_substances) {
            formData.append('active_substances', values.active_substances)
        }
        if (values.description !== medicine.description) {
            formData.append('description', values.description)
        }
        if (values.dosage !== medicine.dosage) {
            formData.append('dosage', values.dosage)

        }
        if (values.unit !== medicine.unit) {
            formData.append('unit', values.unit)
        }
        if (values.name !== medicine.name) {
            formData.append('name', values.name)
        }
        if (values.price !== medicine.price) {
            formData.append('price', values.price)
        }
        if (values.quantity !== medicine.quantity.toString()) {
            formData.append('quantity', values.quantity)
        }
        if (imageSelected) {
            formData.append('image', {
                uri: imageSelected,
                name: 'image.jpg',
                type: 'image/jpg',
            })
        }
    }

    const handleUpdateMedicine = (values) => {
        const formData = new FormData
        validateData(formData, values)
        if (formData._parts.length > 0) {
            setIsChangeToUpdate(false)
            console.log(formData)
            dispatch(updateMedicine({
                access_token, medicineId: medicineIdActive, updateData: formData
            }))
                .then(data => {
                    // console.log('Update successful medicine: ', data.payload)
                    dispatch(setIsLoadMedicinesSearched(true))
                    dispatch(toggleIsOpenUpdateMedicineBox())
                })
                .catch(err => {
                    console.log('Error when trying update Medicine: ', err)
                })
        } else {
            setIsChangeToUpdate(true)
        }
    }

    const handleImageSelected = (avatarUri) => {
        setImageSelected(avatarUri);
        console.log('avatarUri: ', avatarUri)
    }

    const handleDeleteMedicine = () => {
        dispatch(deleteMedicine({ access_token, medicineId: medicineIdActive }))
            .then(data => {
                console.log('delete successful: ', data)
                dispatch(setShowConfirmation(false))
                dispatch(setIsLoadMedicinesSearched(true))
                dispatch(toggleIsOpenUpdateMedicineBox())
            })
            .catch(err => {
                console.log('Error when delete medicine: ', err)
            })
    }

    return (
        <View style={[styles.wrapper]}>
            {
                medicine &&
                <Formik
                    initialValues={{
                        name: medicine.name,
                        active_substances: medicine.active_substances,
                        price: medicine.price,
                        unit: medicine.unit,
                        quantity: medicine.quantity.toString(),
                        description: medicine.description,
                        dosage: medicine.dosage,
                        instructions: medicine.instructions,
                        usage_instructions: medicine.usage_instructions,
                    }}
                    onSubmit={(values, actions) => {
                        console.log(values)
                        handleUpdateMedicine(values)
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
                                <Text style={[styles.title, { marginTop: 10 }]}>Medicine</Text>
                                <TouchableOpacity style={[{
                                    backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
                                    display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                                    borderRadius: 8
                                }]}
                                    onPress={() => {
                                        dispatch(toggleIsOpenUpdateMedicineBox())
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
                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Name</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Name..."
                                            name='name'
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                        />
                                        {touched.name && errors.name && (
                                            <Text style={{ color: 'red' }}>{errors.name}</Text>
                                        )}
                                    </View>

                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Price</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Price..."
                                            name='price'
                                            value={values.price}
                                            onChangeText={handleChange('price')}
                                        />
                                        {touched.price && errors.price && (
                                            <Text style={{ color: 'red' }}>{errors.price}</Text>
                                        )}
                                    </View>

                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Active subtances</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Active substances..."
                                            name='active_substances'
                                            value={values.active_substances}
                                            onChangeText={handleChange('active_substances')}
                                        />
                                        {touched.active_substances && errors.active_substances && (
                                            <Text style={{ color: 'red' }}>{errors.active_substances}</Text>
                                        )}
                                    </View>

                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Unit</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Unit..."
                                            name='unit'
                                            value={values.unit}
                                            onChangeText={handleChange('unit')}
                                        />
                                        {touched.unit && errors.unit && (
                                            <Text style={{ color: 'red' }}>{errors.unit}</Text>
                                        )}
                                    </View>

                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Quantity</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Quantity..."
                                            name='quantity'
                                            value={values.quantity}
                                            onChangeText={handleChange('quantity')}
                                        />
                                        {touched.quantity && errors.quantity && (
                                            <Text style={{ color: 'red' }}>{errors.quantity}</Text>
                                        )}
                                    </View>

                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Description</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Description..."
                                            name='description'
                                            value={values.description}
                                            onChangeText={handleChange('description')}
                                        />
                                        {touched.description && errors.description && (
                                            <Text style={{ color: 'red' }}>{errors.description}</Text>
                                        )}
                                    </View>

                                    <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Dosage</Text>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                        marginTop: 4
                                    }]}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Dosage..."
                                            name='dosage'
                                            value={values.dosage}
                                            onChangeText={handleChange('dosage')}
                                        />
                                        {touched.dosage && errors.dosage && (
                                            <Text style={{ color: 'red' }}>{errors.dosage}</Text>
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
            }
            {showConfirmation &&
                <ConfirmBox handleAction={handleDeleteMedicine}
                    title={'Do you want to delete this medicine?'}
                />}
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

export default MedicineInfo;
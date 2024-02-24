import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import newRequest from "../../ultils/request";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Icons from 'react-native-vector-icons/FontAwesome'
import { setIsLoadMedicinesSearched, toggleIsOpenAddMedicineBox, toggleIsOpenUpdateMedicineBox } from "../../store/slice/appSlice";
import AvatarPicker from "../AvatarPicker/AvatarPicker";
import { createMedicine, updateMedicine } from "../../store/slice/medicineSlice";

function AddMedicineBox() {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const { medicineIdActive } = useSelector(state => state.app)
    const [medicine, setMedicine] = useState()
    const [imageUrl, setImageUrl] = useState('')
    const [isFetchedMedicine, setIsFetchedMedicine] = useState(false)
    const [imageSelected, setImageSelected] = useState()
    const [updateData, setUpdateData] = useState({})
    const [isChangeToUpdate, setIsChangeToUpdate] = useState(false)

    const handleImageSelected = (avatarUri) => {
        setImageSelected(avatarUri);
        console.log('avatarUri: ', avatarUri)
    }

    const validateData = (formData, values) => {
        if (values.active_substances !== '') {
            formData.append('active_substances', values.active_substances)
        }
        if (values.description !== '') {
            formData.append('description', values.description)
        }
        if (values.dosage !== '') {
            formData.append('dosage', values.dosage)
        }
        if (values.unit !== '') {
            formData.append('unit', values.unit)
        }
        if (values.name !== '') {
            formData.append('name', values.name)
        }
        if (values.price !== '') {
            formData.append('price', parseFloat(values.price))
        }
        if (values.quantity !== '') {
            formData.append('quantity', parseInt(values.quantity))
        }
        if (values.usage_instructions !== '') {
            formData.append('usage_instructions', values.usage_instructions)
        }
        if (values.instructions !== '') {
            formData.append('instructions', values.instructions)
        }
        if (imageSelected) {
            formData.append('image', {
                uri: imageSelected,
                name: 'image.jpg',
                type: 'image/jpg',
            })
        }
    }

    const handleCreateMedicine = (values) => {
        const formData = new FormData
        validateData(formData, values)
        console.log('formData ', formData)
        dispatch(createMedicine({ access_token, data:formData }))
            .then(data => {
                console.log('create medicine ', data.payload)
                dispatch(toggleIsOpenAddMedicineBox())
                dispatch(setIsLoadMedicinesSearched(true))
            })
            .catch(err => {
                console.log('Error when creating medicine: ', err)
            })
    }

    return (
        <View style={[styles.wrapper]}>
            <Formik
                initialValues={{
                    name: '',
                    active_substances: '',
                    price: '',
                    unit: '',
                    quantity: '',
                    description: '',
                    dosage: '',
                    instructions: '',
                    usage_instructions: '',
                }}
                onSubmit={(values, actions) => {
                    console.log(values)
                    handleCreateMedicine(values)
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
                            width: '100%', alignItems: 'center', marginTop: 16, height: 60, marginBottom: 16
                        }]}>
                            <Text style={[styles.title, { marginTop: 10 }]}>Medicine</Text>
                            <TouchableOpacity style={[{
                                backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
                                display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
                                borderRadius: 8
                            }]}
                                onPress={() => {
                                    dispatch(toggleIsOpenAddMedicineBox())
                                }}
                            >
                                <Icons name='close' size={26} color={'white'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={[{ maxHeight: '80%' }]}>
                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Image</Text>
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

                                <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Usage instructions</Text>
                                <View style={[{
                                    display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                    marginTop: 4
                                }]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Usage instructions..."
                                        name='usage_instructions'
                                        value={values.usage_instructions}
                                        onChangeText={handleChange('usage_instructions')}
                                    />
                                    {touched.usage_instructions && errors.usage_instructions && (
                                        <Text style={{ color: 'red' }}>{errors.usage_instructions}</Text>
                                    )}
                                </View>

                                <Text style={[{ fontSize: 20, fontWeight: 'bold' }]}>Instructions</Text>
                                <View style={[{
                                    display: 'flex', justifyContent: 'center', flexDirection: 'row',
                                    marginTop: 4
                                }]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Instructions..."
                                        name='instructions'
                                        value={values.instructions}
                                        onChangeText={handleChange('instructions')}
                                    />
                                    {touched.instructions && errors.instructions && (
                                        <Text style={{ color: 'red' }}>{errors.instructions}</Text>
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                        <View style={[{
                            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                            flexDirection: 'row', width: '100%', marginBottom: 20,
                        }]}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2', width: 160 }]} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Create medicine</Text>
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

export default AddMedicineBox;
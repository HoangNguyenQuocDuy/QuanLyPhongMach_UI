import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icons from 'react-native-vector-icons/Entypo'
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { fetchMedicinesData } from '../../store/slice/medicineSlice';
import MedicineItem from '../../components/MedicineItem/MedicineItem';
import { ScrollView } from 'react-native-gesture-handler';
import { setIsLoadMedicinesSearched, toggleIsOpenAddMedicineBox } from '../../store/slice/appSlice';

function Medicine() {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [searchMedicineValue, setSearchMedicineValue] = useState('')
    const [debounceSearchMedicineValue] = useDebounce(searchMedicineValue, 2000)
    const [isFetch, setIsFetch] = useState(false)
    const [isNext, setIsNext] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [searchedMedicines, setSearchedMedicines] = useState([])
    const { isLoadMedicinesSearched, isOpenUpdateMedicineBox, 
        showConfirmation, isOpenAddMedicineBox } = useSelector(state => state.app)

    const findMedicines = async () => {
        if (!isFetch) {
            console.log('dasd')
            const handleGetSearchMedicines = async () => {
                // if (isNext) {
                setIsLoading(true)
                dispatch(fetchMedicinesData({
                    access_token, name: debounceSearchMedicineValue, page: 1
                }))
                    .then(data => {
                        // dispatch(addNewMedicines(data.data))
                        console.log('vo')
                        setSearchedMedicines([...data.payload.results])
                        setIsLoading(false)
                        setIsFetch(true)
                        if (data.payload.next) {
                            setPage(2)
                            setIsNext(true)
                        } else {
                            setIsNext(false)
                        }
                    })
                    .catch(err => {
                        setIsLoading(false)
                        console.log('Error when get medicines from page number: ', err)
                    })
                // }
            }
            handleGetSearchMedicines()
        }
    }

    const loadNewMedicines = async () => {
        if (debounceSearchMedicineValue !== '') {
            console.log('page ', page)
            if (isNext) {
                setIsLoading(true)
                const handleGetSearchMedicines = async () => {
                    dispatch(fetchMedicinesData({
                        access_token, name: debounceSearchMedicineValue, page
                    }))
                        .then(data => {
                            // dispatch(addNewMedicines(data.data))
                            setSearchedMedicines(state => {
                                const exitingIds = state.map(medicine => medicine.id)
                                const newMedicines = data.payload.results.filter(
                                    medicine => {
                                        return !exitingIds.includes(medicine.id)
                                    }
                                )
                                return [
                                    ...state,
                                    ...newMedicines
                                ]
                            })
                            setIsLoading(false)
                            if (data.payload.next) {
                                setPage(page + 1)
                                setIsNext(true)
                            } else {
                                setIsNext(false)
                            }
                        })
                        .catch(err => {
                            setIsLoading(false)
                            setIsNext(false)
                            console.log('Error when get medicines from page number: ', err)
                        })
                    // await newRequest.get(`/medicines/?name=${debounceSearchMedicineValue}&page=${page}`, {
                    //     headers: {
                    //         'Authorization': `Bearer ${access_token}`
                    //     }
                    // })

                }
                handleGetSearchMedicines()
            } else {
                setIsLoading(false)
            }
        }
    }

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;

        if (layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom) {
            loadNewMedicines()
        }
    }

    const medicines = useSelector(state => state.medicines)

    useEffect(() => {
        console.log(isLoadMedicinesSearched)

        if (debounceSearchMedicineValue !== ''
            && !isOpenUpdateMedicineBox && !isLoadMedicinesSearched
            && !isOpenAddMedicineBox
        ) {
            console.log('debouncedSearchScheduleValue ', debounceSearchMedicineValue)
            console.log(1)
            findMedicines()
        }
        else if (debounceSearchMedicineValue !== '' && !isOpenUpdateMedicineBox && isLoadMedicinesSearched && !showConfirmation) {
            const exitIds = searchedMedicines.map(medicine => medicine.id)
            const loadMedicines = medicines && medicines.results.filter(medicine => exitIds.includes(medicine.id))
            console.log('loadMedicines ', loadMedicines)
            setSearchedMedicines([...loadMedicines])
            dispatch(setIsLoadMedicinesSearched(false))
        } 
        else if (debounceSearchMedicineValue === '') {
            setIsFetch(false)
            setSearchedMedicines([])
        }
        console.log('medicines ', medicines)
        
    }, [debounceSearchMedicineValue, isLoadMedicinesSearched,
        isOpenUpdateMedicineBox, showConfirmation, isOpenAddMedicineBox])

    return (
        <ScrollView style={[{
            height: '100%', backgroundColor: '#fff',
        }]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <View style={[{
                display: 'flex', justifyContent: 'center',
                alignContent: 'flex-start', width: '100%', flexDirection: 'row', height: '100%'
            }]}>
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
                                dispatch(toggleIsOpenAddMedicineBox())
                            }}
                        >
                            <Icons name='plus' size={20} color={'white'} />
                            <Text style={[{ fontSize: 16, color: '#fff', marginLeft: 6 }]}>Add new</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[{
                        display: 'flex', justifyContent: 'center', flexDirection: 'row',
                        marginTop: 10
                    }]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search medicine..."
                            value={searchMedicineValue}
                            onChangeText={(text) => { setSearchMedicineValue(text) }}
                        />
                    </View>

                    {
                        searchedMedicines.length > 0 &&
                        searchedMedicines.map(medicine => {
                            const { id, name, active_substances, price, unit,
                                quantity, description, image } = medicine
                            const imageUri = image && image.substring(image.indexOf('image/upload/') + 'image/upload/'.length)
                            return (
                                <MedicineItem key={id} name={name} id={id}
                                    active_substances={active_substances}
                                    price={price} unit={unit} quantity={quantity}
                                    description={description} image={imageUri}
                                />
                            )
                        })
                    }
                    {
                        isLoading &&
                        <ActivityIndicator size="large" color="#0000ff" />
                    }
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '86%'
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
        width: '90%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9',
        fontSize: 16
    },
})

export default Medicine;
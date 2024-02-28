import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDebounce } from "use-debounce";
import MedicineItem from '../MedicineItem/MedicineItem'
import Icons from 'react-native-vector-icons/Feather'
import { fetchMedicinesData } from "../../store/slice/medicineSlice";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Shadow } from "react-native-shadow-2";


function SearchMedicines({ medicinesPres, setMedicinesPres }) {
    const dispatch = useDispatch()
    const { access_token } = useSelector(state => state.account)
    const [searchValue, setSearchValue] = useState('')
    const [debounceSearchValue] = useDebounce(searchValue, 2000)
    const [searchedMedicines, setSearchMedicines] = useState([])
    const [isFetch, setIsFetch] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [isNext, setIsNext] = useState(true)

    const findMedicines = async () => {
        if (!isFetch) {
            console.log('dasd')
            const handleGetSearchMedicines = async () => {
                setIsLoading(true)
                dispatch(fetchMedicinesData({
                    access_token, name: debounceSearchValue, page: 1
                }))
                    .then(data => {
                        if (medicinesPres.length > 0) {
                            let exitingIds = medicinesPres.map(medicine => medicine.id)
                            setSearchMedicines([...data.payload.results.filter(md => !exitingIds.includes(md.id))])
                        } else {
                            setSearchMedicines([...data.payload.results])
                        }
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
            }
            handleGetSearchMedicines()
        }
    }

    const loadNewMedicines = async () => {
        if (debounceSearchValue !== '') {
            console.log('page ', page)
            if (isNext) {
                setIsLoading(true)
                const handleGetSearchMedicines = async () => {
                    dispatch(fetchMedicinesData({
                        access_token, name: debounceSearchValue, page
                    }))
                        .then(data => {
                            // dispatch(addNewMedicines(data.data))
                            setSearchMedicines(state => {
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
        if (debounceSearchValue !== ''
        ) {
            console.log('debouncedSearchScheduleValue ', debounceSearchValue)
            console.log(1)
            findMedicines()
        }
        else if (debounceSearchValue === '') {
            setIsFetch(false)
            setSearchMedicines([])
        }
        if (medicinesPres.length > 0) {
            let exitingIds = medicinesPres.map(medicine => medicine.id)
            setSearchMedicines(state => state.filter(medicine =>
                !exitingIds.includes(medicine.id)))
        }
        console.log('medicines ', medicines)
    }, [debounceSearchValue, medicinesPres])
    return (
        <View>
            <Text style={[styles.title, { marginTop: 10, paddingLeft: 10 }]}>Selected medicines</Text>
            <View style={[{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                <View style={[{ width: '80%' }]}>
                    {
                        medicinesPres.length > 0 &&
                        medicinesPres.map(medicine => {
                            let image = ''
                            if (medicine.image.startsWith('image/upload/')) {
                                image = medicine.image.substring(medicine.image.indexOf('image/upload/') + 'image/upload/'.length)
                            } else {
                                image = medicine.image
                            }
                            return (
                                <View style={[{ backgroundColor: '#fff', marginBottom: 20 }]}>
                                    <View style={[{
                                        display: 'flex', justifyContent: 'space-between', marginTop: 10,
                                        flexDirection: 'row', width: '100%', alignItems: 'center'
                                    }]}>
                                        <View style={[{
                                            display: 'flex', alignItems: 'center', flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }]}>
                                            <Image
                                                source={{ uri: image }} style={{ width: 60, height: 60, marginRight: 20, borderRadius: 8 }}
                                            />
                                            <View>
                                                <Text style={styles.text}>
                                                    <Text style={[{ fontWeight: 'bold' }]}>Name: </Text>
                                                    {medicine.name}
                                                </Text>
                                                <Text style={styles.text}>
                                                    <Text style={[{ fontWeight: 'bold' }]}>Price: </Text>
                                                    {medicine.price}
                                                </Text>
                                                <Text style={styles.text}>
                                                    <Text style={[{ fontWeight: 'bold' }]}>Days: </Text>
                                                    {medicine.days}
                                                </Text>
                                                <Text style={styles.text}>
                                                    <Text style={[{ fontWeight: 'bold' }]}>Quantity: </Text>
                                                    {medicine._quantity}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            setMedicinesPres(state => state.filter(
                                                _medicine => _medicine.id !== medicine.id))
                                            // setSearchMedicines(state => [...state, medicinesPres.find(md => md.id !== medicine.id)])
                                        }}>
                                            <Icons name="trash" size={26} color={'#FF6868'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
            <View style={[styles.flex, { position: 'relative' }]}>
                <TextInput
                    style={[styles.input, searchValue !== '' && styles.inputActive]}
                    placeholder="Search medicines..."
                    name='conclusion'
                    value={searchValue}
                    onChangeText={text => { setSearchValue(text) }}
                />
                <View style={[{
                    position: 'absolute', left: 38,
                    top: '12%'
                }]}>
                    <Icons name="search" size={26} color={searchValue === '' ? '#E3E1D9' : '#444'} />
                </View>
            </View>

            <Text style={[styles.title, { marginLeft: 30 }]}>Searched medicines</Text>
            <ScrollView style={[{ maxHeight: 400, marginBottom: 40 }]}>
                <View style={[styles.flex,]}>
                    <View style={[searchedMedicines.length > 0 && styles.searchBox]}>
                        {
                            searchedMedicines.length > 0 &&
                            searchedMedicines.map(medicine => {
                                const { id, name, active_substances, price, unit,
                                    quantity, description, image, instructions, usage_instructions } = medicine
                                const imageUri = image && image.substring(image.indexOf('image/upload/') + 'image/upload/'.length)
                                return (
                                    <MedicineItem key={id} name={name} id={id}
                                        active_substances={active_substances}
                                        price={price} unit={unit} quantity={quantity}
                                        description={description} image={imageUri}
                                        check={true} handleSet={setMedicinesPres}
                                        instructions={instructions} usage_instructions={usage_instructions}
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
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 20,
        marginLeft: 20
    },
    input: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 46,
        height: 42,
        borderRadius: 10,
        width: '86%',
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ececec'
    },
    inputActive: {
        borderColor: '#444'
    },
    text: {
        fontSize: 16
    },
    shadow: {
        width: 320,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    searchBox: {
        borderWidth: 1, width: '80%', paddingHorizontal: 20,
        borderColor: '#E3E1D9',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 20
    }
})

export default SearchMedicines;
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { StyleSheet, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";
import newRequest from "../../ultils/request";

function ScheduleInfo() {
    const { scheduleIdActive } = useSelector(state => state.app)
    const [schedule, setSchedule] = useState()
    
    useEffect(() => {
        const handleFetchScheduleById = async () => {
            await newRequest.get(`/schedules/${scheduleIdActive}/`)
            .then(data => {
                setSchedule(data)
            })
            .catch(err => {
                console.log('Error when trying get schedule by id: ', err)
            })
        }
        handleFetchScheduleById()
    }, [])

    return (
        <View style={[styles.wrapper]}>
            <Formik
            initialValues={{
                schedule_time: schedule && schedule.schedule_time,
                doctors: '',
                nurses: '',
                description: schedule && schedule.description,
            }}
            onSubmit={(values, actions) => {
                console.log(values)
                // dispatch(setIsOpenAddUserBox(false))
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
                <View style={styles.container}>
                    <Text style={styles.title}>
                        SCHEDULE
                    </Text>
                    <TextInput
                        style={styles.input}
                        name="schedule_time"
                        value={values.schedule_time}
                        onChangeText={handleChange('schedule_time')}
                        onBlur={handleBlur('schedule_time')}
                        placeholder="Schedule time"
                    />
                    {touched.schedule_time && errors.schedule_time && (
                        <Text style={{ color: 'red' }}>{errors.schedule_time}</Text>
                    )}
                    <TextInput
                        style={styles.input}
                        name="description"
                        value={values.description}
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        placeholder="Description"
                    />
                    {touched.description && errors.description && (
                        <Text style={{ color: 'red' }}>{errors.description}</Text>
                    )}

                    {/* <View style={[{
                        display: 'flex', justifyContent: 'space-between',
                        flexDirection: 'row'
                    }]}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#6895D2' }]} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { marginLeft: 40 }]}
                            onPress={() => {
                                dispatch(setIsOpenAddUserBox(false))
                            }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View> */}
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
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        height: 42,
        borderRadius: 8,
        paddingHorizontal: 10,
        width: '80%',
        marginBottom: 20,
        backgroundColor: '#f4f7f9'
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
    picker: {
        borderRadius: 9,
        width: '80%',
        overflow: 'hidden',
    }
})

export default ScheduleInfo;
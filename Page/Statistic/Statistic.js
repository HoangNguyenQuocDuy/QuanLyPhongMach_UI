import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import newRequest from '../../ultils/request';
import { useSelector } from 'react-redux';

const Statistic = () => {
    const { access_token } = useSelector(state => state.account)
    const [startMonth, setStartMonth] = useState('1')
    const [endMonth, setEndMonth] = useState('12')
    const [m_yearStatistic, setM_yearStatistic] = useState(moment.utc(new Date()).format('yyyy'))
    const [q_yearStatistic, setQ_yearStatistic] = useState(moment.utc(new Date()).format('yyyy'))
    const [startYear, setStartYear] = useState(moment.utc(new Date()).format('yyyy'))
    const [endYear, setEndYear] = useState(moment.utc(new Date()).format('yyyy'))

    const [startQuarter, setStartQuarter] = useState('1')
    const [endQuarter, setEndQuarter] = useState('4')

    const [dataMonthly, setDataMonthly] = useState([])
    const [dataQuarterly, setDataQuarterly] = useState([])
    const [dataYearly, setDataYearly] = useState([])

    const chartPatientCountMonthly = {
        labels: dataMonthly.map(item => `${item.month}/${item.year}`),
        datasets: [{
            data: dataMonthly.map(item => item.patient_count),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        }]
    };
    const chartRevenueMonthly = {
        labels: dataMonthly.map(item => `${item.month}/${item.year}`),
        datasets: [{
            data: dataMonthly.map(item => item.revenue),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        }]
    };

    const handleMakeMonthStatistic = async () => {
        await newRequest.get(
            `/statistics/?startMonth=${startMonth}&endMonth=${endMonth}&startYear=${m_yearStatistic}`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(data => {
                setDataMonthly(data.data)
                console.log('statistic from ' + startMonth + ' to ' + endMonth + ': ', data.data)
            })
            .catch(err => {
                console.log('err when make statistic month: ', err)
            })
    }

    const handleMakeQuarterStatistic = async () => {
        await newRequest.get(
            `/statistics/?startQuarter=${startQuarter}&endQuarter=${endQuarter}&startYear=${q_yearStatistic}`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(data => {
                setDataQuarterly(data.data)
                console.log('statistic from ' + startQuarter + ' to ' + endQuarter + ': ', data.data)
            })
            .catch(err => {
                console.log('err when make statistic month: ', err)
            })
    }

    const chartPatientCountQuarterly = {
        labels: dataQuarterly.map(item => `Q${item.quarter}/${item.year}`),
        datasets: [{
            data: dataQuarterly.map(item => item.total_patient_count),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        }]
    };
    const chartRevenueQuarterly = {
        labels: dataQuarterly.map(item => `Q${item.quarter}/${item.year}`),
        datasets: [{
            data: dataQuarterly.map(item => item.total_revenue),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        }]
    };

    const handleMakeYearStatistic = async () => {
        await newRequest.get(
            `/statistics/?startYear=${startYear}&endYear=${endYear}`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(data => {
                setDataYearly(data.data)
                console.log('statistic from ' + startYear + ' to ' + endYear + ': ', data.data)
            })
            .catch(err => {
                console.log('err when make statistic month: ', err)
            })
    }

    const chartPatientCountYearly = {
        labels: dataYearly.map(item => `${item.year}`),
        datasets: [{
            data: dataYearly.map(item => item.total_patient_count),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        }]
    };
    const chartRevenueYearly = {
        labels: dataYearly.map(item => `${item.year}`),
        datasets: [{
            data: dataYearly.map(item => item.total_revenue),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        }]
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.wrapper}>
                    <Text style={[styles.title, {}]}>Statistic by month</Text>
                    <View >
                        <View style={[styles.flex, { marginTop: 20 }]}>
                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>Start month</Text>

                                <TextInput
                                    style={[styles.input]}
                                    placeholder='start month...'
                                    value={startMonth}
                                    onChangeText={text => { setStartMonth(text) }}
                                />
                            </View>

                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>End month</Text>

                                <TextInput
                                    style={[styles.input, { marginHorizontal: 20 }]}
                                    placeholder='end month...'
                                    value={endMonth}
                                    onChangeText={text => { setEndMonth(text) }}
                                />
                            </View>

                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>Year</Text>

                                <TextInput
                                    style={[styles.input]}
                                    placeholder='year...'
                                    value={m_yearStatistic}
                                    onChangeText={text => { setM_yearStatistic(text) }}
                                />
                            </View>
                        </View>

                        <View style={[styles.statisticBtn]}>
                            <TouchableOpacity onPress={handleMakeMonthStatistic} style={[styles.btn]}>
                                <Text style={[styles.btnText]}>Make statistic</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <ScrollView style={[{ maxHeight: 400 }]}> */}

                    <View>
                        {
                            dataMonthly.length > 0 &&
                            <View>
                                <Text style={[styles.title, { marginLeft: 20 }]}>Patient count</Text>
                                <LineChart
                                    data={chartPatientCountMonthly}
                                    width={350}
                                    height={220}
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#ffa726'
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                                <Text style={[styles.title, { marginLeft: 20 }]}>Revenue</Text>

                                <LineChart
                                    data={chartRevenueMonthly}
                                    width={350}
                                    height={220}
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#ffa726'
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            </View>
                        }
                    </View>
                    {/* </ScrollView> */}

                    {/* QUARTER */}
                    <Text style={[styles.title, { marginTop: 30 }]}>Statistic by quarter</Text>
                    <View >
                        <View style={[styles.flex, { marginTop: 10 }]}>
                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>Start quarter</Text>

                                <TextInput
                                    style={[styles.input]}
                                    placeholder='start quarter...'
                                    value={startQuarter}
                                    onChangeText={text => { setStartQuarter(text) }}
                                />
                            </View>

                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>End quarter</Text>

                                <TextInput
                                    style={[styles.input, { marginHorizontal: 20 }]}
                                    placeholder='end quarter...'
                                    value={endQuarter}
                                    onChangeText={text => { setEndQuarter(text) }}
                                />
                            </View>

                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>Year</Text>

                                <TextInput
                                    style={[styles.input]}
                                    placeholder='year...'
                                    value={m_yearStatistic}
                                    onChangeText={text => { setQ_yearStatistic(text) }}
                                />
                            </View>
                        </View>

                        <View style={[styles.statisticBtn]}>
                            <TouchableOpacity onPress={handleMakeQuarterStatistic} style={[styles.btn]}>
                                <Text style={[styles.btnText]}>Make statistic</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <ScrollView style={[{ maxHeight: 400 }]}> */}

                    <View>
                        {
                            dataQuarterly.length > 0 &&
                            <View>
                                <Text style={[styles.title, { marginLeft: 20 }]}>Patient count</Text>
                                <LineChart
                                    data={chartPatientCountQuarterly}
                                    width={350}
                                    height={220}
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#ffa726'
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                                <Text style={[styles.title, { marginLeft: 20 }]}>Revenue</Text>

                                <LineChart
                                    data={chartRevenueQuarterly}
                                    width={350}
                                    height={220}
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#ffa726'
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            </View>
                        }
                    </View>
                    {/* </ScrollView> */}
                    {/* YEAR */}

                    <Text style={[styles.title, { marginTop: 10 }]}>Statistic by year</Text>
                    <View >
                        <View style={[styles.flex, { marginTop: 20 }]}>
                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>Start year</Text>
                                <TextInput
                                    style={[styles.input]}
                                    placeholder='start year...'
                                    value={startYear}
                                    onChangeText={text => { setStartYear(text) }}
                                />
                            </View>

                            <View style={[styles.flex, { flexDirection: 'column' }]}>
                                <Text style={[styles.text, {}]}>End year</Text>

                                <TextInput
                                    style={[styles.input, { marginHorizontal: 20 }]}
                                    placeholder='end year...'
                                    value={endYear}
                                    onChangeText={text => { setEndYear(text) }}
                                />
                            </View>
                        </View>

                        <View style={[styles.statisticBtn]}>
                            <TouchableOpacity onPress={handleMakeYearStatistic} style={[styles.btn]}>
                                <Text style={[styles.btnText]}>Make statistic</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <ScrollView style={[{ maxHeight: 400 }]}> */}

                    <View style={[{ marginBottom: 100 }]}>
                        {
                            dataYearly.length > 0 &&
                            <View>
                                <Text style={[styles.title, { marginLeft: 20 }]}>Patient count</Text>
                                <LineChart
                                    data={chartPatientCountYearly}
                                    width={350}
                                    height={220}
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#ffa726'
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                                <Text style={[styles.title, { marginLeft: 20 }]}>Revenue</Text>

                                <LineChart
                                    data={chartRevenueYearly}
                                    width={350}
                                    height={220}
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#ffa726'
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            </View>
                        }
                    </View>
                    {/* </ScrollView> */}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    flex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    wrapper: {
        height: '100%',
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    text: {
        fontSize: 18
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16
    },
    input: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 12,
        height: 42,
        borderRadius: 10,
        width: 100,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ececec'
    },
    statisticBtn: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    btn: {
        backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
        borderRadius: 8,
    },
    btnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    }
});

export default Statistic;

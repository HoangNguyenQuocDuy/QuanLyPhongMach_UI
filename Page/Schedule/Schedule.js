import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/Entypo'
import { useDispatch, useSelector } from 'react-redux';
import { addNewSchedules, fetchSchedulesData } from '../../store/slice/scheduleSlice';
import ScheduleItem from '../../components/ScheduleItem/ScheduleItem';
import { useDebounce } from 'use-debounce';
import moment from 'moment';
import newRequest from '../../ultils/request';

const Schedule = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchScheduleValue, setSearchScheduleValue] = useState('')
  const [debouncedSearchDoctorValue] = useDebounce(searchScheduleValue, 1000);
  const { access_token } = useSelector(state => state.account)
  const [isFetchedSchedulesToday, setIsFetchedSchedulesToday] = useState(false)
  const [schedulesTodday, setSchedulesToday] = useState([])
  const todayFormat = format((new Date()), 'dd/MM/yyyy')
  const [searchedSchedules, setSearchedSchedules] = useState([])
  const [page, setPage] = useState(1)
  const [isNext, setIsNext] = useState(true)

  const handleFetchSchedule = ({ access_token, date }) => {
    dispatch(fetchSchedulesData({ access_token, date }))
      .then(data => {
        if (!isDatePickerVisible) {
          setSchedulesToday(data.payload.results)
          setIsFetchedSchedulesToday(true)
        }
      })
      .catch(err => {
        console.log('Error when trying get schedule: ', err)
        setIsLoading(false)
      })
  }

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;

    if (layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom) {
      loadNewSchedules()
      console.log('Cuộn đến cuối trang, tải thêm dữ liệu');
      // console.log('schedules.result ', schedules.results)
      // Gọi hàm để tải thêm dữ liệu
      // loadNextPage();
    }
  }

  const loadNewSchedules = async () => {
    if (searchScheduleValue !== '') {
      if (isNext) {
        let timeArr = searchScheduleValue.split('/')
        if (timeArr[timeArr.length - 1] === '') timeArr.pop()
        const timeSearchFormat = timeArr.join('-')
        const handleGetSearchSchedules = async () => {
          console.log(timeSearchFormat)
          await newRequest.get(`/schedules/?date=${timeSearchFormat}&page=${page}`, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          })
            .then(data => {
              console.log('data.data, page: ', page, data.data)
              setSearchedSchedules(state => {
                const exitingIds = state.map(schedule => schedule.id)
                const newSchedules = data.data.results.filter(
                  schedule => {
                    return !exitingIds.includes(schedule.id)
                  }
                )
                return [
                  ...state,
                  ...newSchedules
                ]
              })
              dispatch(addNewSchedules(data.data))
              if (data.data.next) {
                setPage(page + 1)
                setIsNext(true)
              } else {
                setIsNext(false)
              }
            })
            .catch(err => {
              console.log('Error when get schedules from page number: ', err)
            })
        }
        handleGetSearchSchedules()
      }
    }
  }

  useEffect(() => {
    if (!isFetchedSchedulesToday) {
      let todayFetch = format((new Date()), 'yyyy-MM-dd')
      handleFetchSchedule({ access_token, date: todayFetch })
    }
    loadNewSchedules()
  }, [debouncedSearchDoctorValue])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log(date)
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <ScrollView style={[{ height: '100%', backgroundColor: '#fff', }]}
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
            <Text style={[styles.title, { marginTop: 10 }]}>Schedule</Text>
            <TouchableOpacity style={[{
              backgroundColor: '#3787eb', paddingHorizontal: 10, paddingVertical: 6,
              display: 'flex', justifyContent: 'space-between', flexDirection: 'row',
              borderRadius: 8
            }]}>
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
              placeholder="Search schedules(yyyy/MM/dd)..."
              value={searchScheduleValue}
              onChangeText={setSearchScheduleValue}
            />
          </View>

          <View>

            {searchScheduleValue !== '' ?
              <Text style={[{ fontSize: 18, marginBottom: 4 }]}>
                <Text style={[{ fontWeight: 'bold', fontSize: 20 }]}>Results for: </Text>
                {searchScheduleValue}
              </Text> :
              <Text style={[{ fontSize: 18, marginBottom: 4 }]}>
                <Text style={[{ fontWeight: 'bold', fontSize: 20 }]}>Today: </Text>
                {todayFormat}
              </Text>
            }
          </View>

          {
            debouncedSearchDoctorValue === '' && schedulesTodday.length > 0 && schedulesTodday.map(schedule => (
              <ScheduleItem
                key={schedule.id}
                schedule_time={schedule.schedule_time}
                doctorIds={schedule.doctors}
                nurseIds={schedule.nurses}
              />
            ))
          }

          {
            debouncedSearchDoctorValue !== '' &&
            searchedSchedules.length > 0 &&
            searchedSchedules.map(schedule => schedule && (<ScheduleItem
              key={schedule.id}
              schedule_time={schedule.schedule_time}
              doctorIds={schedule.doctors}
              nurseIds={schedule.nurses}
              date={true}
            />
            ))
          }

          {/* <View style={[styles.input, { marginTop: 10, paddingLeft: 12 }]}>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={[{ fontSize: 16 }]}>{!selectedDate ? 'Select the time' : selectedDate && format(selectedDate, "dd/MM/yyyy HH:mm:ss")}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          /> */}
          {
            isLoading &&
            // <View>
            <ActivityIndicator size="large" color="#0000ff" />
            // </View>
          }
        </View>
      </View>

    </ScrollView>
  );
};

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
});

export default Schedule;

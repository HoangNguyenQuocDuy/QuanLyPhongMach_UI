import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Login from '../Login/Login'
import Register from '../Register/Register'
import DrawerHeader from "../../components/DrawerHeader/DrawerHeader";
import UserInfo from "../../components/UserInfo/UserInfo";
import AddUserBox from "../../components/AddUserBox/AddUserBox";
import ManageStaff from "../Admin/Admin";
import Schedule from "../Schedule/Schedule";
import LogoutScreen from "../../components/LogoutScreen/LogoutScreen";
import ScheduleInfo from "../../components/ScheduleInfo/ScheduleInfo";
import AddScheduleBox from "../../components/AddScheduleBox/AddScheduleBox";
import Medicine from '../Medicine/Medicine'
import MedicineInfo from "../../components/MedicineInfo/MedicineInfo";
import AddMedicineBox from "../../components/AddMedicineBox/AddMedicineBox";
import MyAppointment from "../MyAppointment/MyAppointment";
import AddAppointmentBox from "../../components/AddAppointmentBox/AddAppointmentBox";
import Admin from "../Admin/Admin";
import Auth from "../Auth/Auth";
import MainScreen from "../MainScreen/MainScreen";

const Drawer = createDrawerNavigator();

function Wrapper() {
  const { role } = useSelector(state => state.user)
  const account = useSelector(state => state.account)
  const { isOpenUserInfoTag, isOpenAddUserBox, isOpenScheduleInfo, isOpenAddAppointmentBox,
    isOpenAddScheduleBox, isOpenUpdateMedicineBox, isOpenAddMedicineBox }
    = useSelector(state => state.app)

  return (
    <>
      {!account.username || account.username === '' ? <Auth /> :
        (role === 'Patient' || role==='Nurse' || role==='Doctor') ? <MainScreen /> :
          <Admin />
      }

      {isOpenUserInfoTag && <UserInfo />}
      {isOpenAddUserBox && <AddUserBox />}
      {isOpenScheduleInfo && <ScheduleInfo />}
      {isOpenAddScheduleBox && <AddScheduleBox />}
      {isOpenUpdateMedicineBox && <MedicineInfo />}
      {isOpenAddMedicineBox && <AddMedicineBox />}
    </>
  );
}

export default Wrapper;
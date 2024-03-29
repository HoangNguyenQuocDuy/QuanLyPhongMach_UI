import { Image, StyleSheet, Text, Touchable, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { setOptionUserTagActive, setUserRoleIdTagActive, setUsernameTagActive, toggleIsOpenUserInfoTag } from "../../store/slice/appSlice";
import { useDispatch } from "react-redux";
import TruncatedText from "../TruncatedText/TruncatedText";

function UserTag({ username, first_name, last_name, avatar, speciality, faculty, major, id, check, handle }) {

    const dispatch = useDispatch()

    return (
        <TouchableOpacity style={[check && {marginLeft:10}]} onPress={() => {
            if (!check) {
                dispatch(setUsernameTagActive(username))
                dispatch(toggleIsOpenUserInfoTag())
                speciality && dispatch(setOptionUserTagActive(speciality))
                faculty && dispatch(setOptionUserTagActive(faculty))
                dispatch(setUserRoleIdTagActive(id))
            } else {
                speciality && handle({
                    username, first_name, last_name, avatar, speciality, id
                })
                major && handle({
                    username, first_name, last_name, avatar, major, id
                })
            }
        }}>
            <View style={[styles.container]}>
                <View>
                    <Image
                        source={avatar 
                            ? { uri: avatar.substring(avatar.indexOf('image/upload/') + 'image/upload/'.length) }  
                            : require('../../assets/images/nonAvatar.jpg')}
                        style={styles.img}
                    />
                </View>
                <View style={[{ marginLeft: 10 }]}>
                    <View style={[{ display: 'flex', alignContent: 'center', flexDirection: 'row' }]}>
                        <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{first_name}</Text>
                        <Text style={[{ fontSize: 16, fontWeight: 'bold', marginLeft: 4 }]}>{last_name}</Text>
                    </View>
                    {speciality && <TruncatedText text={`Speciality: ${speciality}`} maxLength={check ? 20 : 24} />}
                    {faculty && <TruncatedText text={`Faculty: ${faculty}`} maxLength={check ? 20 : 24} />}
                    {major && <TruncatedText text={`Major: ${major}`} maxLength={check ? 20 : 24} />}
                </View>
                
            </View>
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        position: 'relative'
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    userInfo: {
        backgroundColor: '#fff',
        width: '80%',
        position: 'absolute',
        top: 0
    }
})

export default UserTag;
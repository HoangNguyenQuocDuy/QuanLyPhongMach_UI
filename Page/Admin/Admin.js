import { useState } from "react";
import { Button, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useSelector } from "react-redux";
import Staff from "../Staff/Staff";

function ManageStaff() {
    return (
        <>
            <View>
                <View style={[{ marginTop: 12 }]}>
                    <Staff />
                </View>
            </View>
        </>

    );
}

export default ManageStaff;
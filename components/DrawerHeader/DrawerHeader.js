import { DrawerItemList } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../store/slice/userSlice';

const DrawerHeader = ({ props }) => {
    const dispatch = useDispatch()

    const user = useSelector(state => state.user)

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={[{ marginTop: 50 }]}>
                    <Image
                        source={user.avatar ? { uri: user.avatar } :
                            require('../../assets/images/nonAvatar.jpg')}
                        style={styles.image}
                    />
                </View>
                <Text style={[{ fontSize: 22, fontWeight: 'bold' }]}>{`${user.first_name} ${user.last_name}`}</Text>
            </View>
            <DrawerItemList {...props} />
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    image: {
        width: 120,
        height: 120,
        marginRight: 10,
        borderRadius: 100
    },
});

export default DrawerHeader;

import { DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

const DrawerHeader = ({ props }) => {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={[{ marginTop: 50 }]}>
                    <Image
                        source={require('../../assets/images/nonAvatar.jpg')}
                        style={styles.image}
                    />
                </View>
                <Text style={[{ fontSize: 22, fontWeight: 'bold' }]}>Admin</Text>
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

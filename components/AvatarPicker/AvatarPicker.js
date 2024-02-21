import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/FontAwesome'

function AvatarPicker({ onAvatarSelected }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            console.log(result.assets[0].uri)
            onAvatarSelected(result.assets[0].uri)
        } else {
            alert('You did not select any image.');
        }
    };

    return (
        <GestureHandlerRootView>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {selectedImage && 
                <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />}
                <TouchableOpacity onPress={pickImageAsync} style={[{
                    display: 'flex', justifyContent: 'center', flexDirection: 'row'
                }]}>
                    <Icons name='image' size={26} color={'black'} />
                    <Text style={[{ fontSize: 16, marginLeft: 12 }]}>Choose a photo</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

export default AvatarPicker;

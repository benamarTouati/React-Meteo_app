import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageSelector = ({ onImagePicked }) => {
    const verifyPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant media library permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            onImagePicked(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Select Photo" onPress={pickImage} color="#1e90ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
});

export default ImageSelector;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Weather from './components/Weather';
import ImageSelector from './components/ImageSelector';
import Loader from './components/Loader';

const apiKey = 'e9b99aa5f0e681abeab9e95edb932b81';

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${apiKey}&units=metric`);
      setWeather(response.data);
      setLoading(false);
    })();
  }, []);

  const addImage = (uri) => {
    setImages((currentImages) => [...currentImages, uri]);
  };

  if (loading) {
    return <Loader />;
  }

  return (
      <ImageBackground source={require('./assets/background.jpg')} style={styles.background}>
        <View style={styles.container}>
          {weather && <Weather weather={weather} />}
          <ImageSelector onImagePicked={addImage} />
          <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.image} />
              )}
          />
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground, StatusBar } from "react-native";
import {
  getCurrentPositionAsync,
  LocationObjectCoords,
  reverseGeocodeAsync,
} from "expo-location";
import Icon from "react-native-vector-icons/Foundation";
import LocationIcon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import Forecast from "./Forecast";
import Snow from "./Animations/Snow";
import Rain from "./Animations/Rain";
import Details from "./Details";

interface Props {
  API_KEY: string;
}

const initialLocation: LocationObjectCoords = {
  latitude: 37.4633804,
  longitude: 126.9514962,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
};

const width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;
if(StatusBar.currentHeight) height += StatusBar.currentHeight;

export default function Current(props: Props) {
  const [description, setDescription] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [feelsLike, setFeelsLike] = useState<number>(0);
  const [windSpeed, setWindSpeed] = useState<number>(0);
  const [windDeg, setWindDeg] = useState<number>(0);
  const [sunrise, setSunrise] = useState<number>(0);
  const [sunset, setSunset] = useState<number>(0);
  const [pressure, setPressure] = useState<number>(0);

  const [pm10, setPm10] = useState<number>(0);
  const [pm25, setPm25] = useState<number>(0);

  const [dateToday, setDateToday] = useState<string>("20230101");
  const [dayOfWeek, setDayOfWeek] = useState<number>(0);
  const [location, setLocation] =
    useState<LocationObjectCoords>(initialLocation);
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");

  const getLocation = async () => {
    const location = await getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;

    setLocation(location.coords);

    await reverseGeocodeAsync({ latitude, longitude }).then((response) => {
      const data = response[0];

      if (data.district) setStreet(data.district);
      else if (data.street) setStreet(data.street);
      else setStreet("streetNumber");

      if (data.city) setCity(data.city);
      else if (data.region) setCity(data.region);
      else setCity("ERROR");
    });
  };

  function getDate() {
    const date = moment();
    const format = date.format("YYYYMMDD hh:mm");
    setDateToday(format);
    setDayOfWeek(date.day());
  }

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${props.API_KEY}&units=metric&lang=kr`
      );
      setDescription(response.data.weather[0].main);
      setTemperature(response.data.main.temp);
      setHumidity(response.data.main.humidity);
      setFeelsLike(response.data.main.feels_like);
      setWindSpeed(response.data.wind.speed);
      setSunrise(response.data.sys.sunrise);
      setSunset(response.data.sys.sunset);
      setPressure(response.data.main.pressure);
      setWindDeg(response.data.wind.deg);
    } catch (error) {
      console.log(error);
    }
  };
  const day = () => {
    const month = dateToday.slice(4, 6);
    const day = dateToday.slice(6, 8);
    const time = dateToday.slice(9, 14);

    const days = ["일", "월", "화", "수", "목", "금", "토"];

    return `${month}.${day}\n${days[dayOfWeek]} ${time}`;
  };

  useEffect(() => {
    getData();
    getDate();
    getAirPollution();
  }, [location]);

  useEffect(() => {
    getLocation();
  }, []);

  const iconClickHandler = () => {
    getData();
    getDate();
    getLocation();
  };

  const getAirPollution = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${props.API_KEY}`
      );
      setPm10(response.data.list[0].components.pm10);
      setPm25(response.data.list[0].components.pm2_5);
    } catch (error) {
      console.log(error);
    }
  };

  const render = () => {
    return (
      <View>
        {new Array(100).fill(0).map((_, index) => {
          return <Rain key={index} />;
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/rain.jpg")}
        style={styles.background}
      >
        <View style={styles.cityBox}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.street}>
            {street}
            <LocationIcon name="location-sharp" size={22} />
          </Text>
        </View>
        <Text style={styles.now}>현재</Text>
        <Text style={styles.dateTime}>
          {`${day()} `}
          <Icon name="refresh" size={20} onPress={iconClickHandler} />
        </Text>

        <View style={styles.box}>
          <View style={styles.weatherBox}>
            {render()}
            <Text style={styles.temperature}>{`${temperature}\xB0C`}</Text>
            <Text
              style={styles.feelsLike}
            >{`체감온도: ${feelsLike}\xB0C`}</Text>
          </View>
          <View style={styles.forecast}>
            <Forecast API_KEY={props.API_KEY} location={location} />
          </View>
          <Details
            humidity={humidity}
            windSpeed={windSpeed}
            windDeg={windDeg}
            sunrise={sunrise}
            sunset={sunset}
            pressure={pressure}
            pm10={pm10}
            pm25={pm25}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    width: width,
  },
  background: {
    width: width,
    height: height,
    opacity: 0.9,
  },
  cityBox: {
    flex: 0.25,
    width: width,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: -30,
  },
  city: {
    fontSize: 50,
    fontWeight: "bold",
  },
  street: {
    fontSize: 25,
    fontWeight: "bold",
  },
  box: {
    flex: 1,
  },
  forecast: {
    flex: 0.25,
  },
  now: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  weatherBox: {
    flex: 1,
    width: width,
    marginTop: 20,
  },
  dateTime: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  temperature: {
    fontSize: 50,
    marginLeft: 40,
    marginTop: 20,
  },
  feelsLike: {
    fontSize: 20,
  },
});

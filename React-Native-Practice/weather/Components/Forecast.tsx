import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import axios from "axios";
import { LocationObjectCoords } from "expo-location";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Feather";

interface Props {
  API_KEY: string;
  location: LocationObjectCoords;
}

export default function Forecast(props: Props) {
  const [data, setData] = useState<any>([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${props.location?.latitude}&lon=${props.location?.longitude}&appid=${props.API_KEY}&units=metric`
      );
      setData(response.data.list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [props.location]);

  const getTime = (time: string) => {
    const year = parseInt(time.slice(0, 4));
    const month = parseInt(time.slice(5, 7));
    const day = parseInt(time.slice(8, 10));
    const hour = time.slice(11, 13);

    const monthArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayOfWeek = new Date(
      `${monthArray[month - 1]} ${day} ${year}`
    ).getDay();
    const dayOfWeekArray = ["일", "월", "화", "수", "목", "금", "토"];

    return `${month}/${day} ${dayOfWeekArray[dayOfWeek]} ${hour}:00`;
  };
  const getIcon = (iconId: string) => {
    const imageSource = `http://openweathermap.org/img/wn/${iconId}@2x.png`;

    return (
      <Image source={{ uri: imageSource }} style={{ width: 30, height: 30 }} />
    );
  };

  const render = (item: any) => {
    return (
      <View>
        <Text>{getTime(item.dt_txt)}</Text>
        <Text style={styles.temp}>{`${item.main.temp}\xB0C`}</Text>
        {getIcon(item.weather[0].icon)}
      </View>
    );
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {data.map((item: any, index: number) => {
        return (
          <View key={index} style={styles.box}>
            {render(item)}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: Dimensions.get("window").width / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  temp: {
    fontSize: 20,
  },
});

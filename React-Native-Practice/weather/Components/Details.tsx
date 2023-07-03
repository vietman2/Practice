import { StyleSheet, View, Text } from "react-native";

interface Props {
  humidity: number;
  windSpeed: number;
  windDeg: number;
  sunrise: number;
  sunset: number;
  pressure: number;
  pm10: number;
  pm25: number;
}

export default function Details(props: Props) {
  const windDirection = () => {
    const directions = [
      "북",
      "북동",
      "동",
      "남동",
      "남",
      "남서",
      "서",
      "북서",
      "북",
    ];
    const index = Math.round(props.windDeg / 45);
    return directions[index];
  };

  const pm10_rating = () => {
    if (props.pm10 <= 30) {
      return "좋음";
    } else if (props.pm10 <= 81) {
      return "보통";
    } else if (props.pm10 <= 150) {
      return "나쁨";
    } else {
      return "매우나쁨";
    }
  };

  const pm25_rating = () => {
    if (props.pm25 <= 15) {
      return "좋음";
    } else if (props.pm25 <= 35) {
      return "보통";
    } else if (props.pm25 <= 75) {
      return "나쁨";
    } else {
      return "매우나쁨";
    }
  };
  return (
    <View>
      <View style={styles.detail}>
        <Text style={styles.detailText}>{`습도\n${props.humidity}%`}</Text>
        <Text style={styles.detailText}>{`바람\n${windDirection()} ${
          props.windSpeed
        }m/s`}</Text>
        <Text style={styles.detailText}>{`기압\n${props.pressure}hPa`}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.detailText}>{`일출\n${new Date(props.sunrise * 1000)
          .toLocaleTimeString()
          .slice(0, 5)}`}</Text>
        <Text style={styles.detailText}>{`일몰\n${new Date(props.sunset * 1000)
          .toLocaleTimeString()
          .slice(0, 5)}`}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.detailText}>{`미세먼지 (PM10)\n${pm10_rating()}\n${
          props.pm10
        }\xB5g/m\xB3`}</Text>
        <Text
          style={styles.detailText}
        >{`초미세먼지 (PM2.5)\n${pm25_rating()}\n${
          props.pm25
        }\xB5g/m\xB3`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    flexDirection: "row",
    justifyContent: "space-around",
    textAlign: "center",
  },
  detailText: {
    fontSize: 20,
    textAlign: "center",
  },
});

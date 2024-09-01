import { View, Dimensions } from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";
import BreakingNewsCard from "./BreakingNewsCard";
import { useRouter } from 'expo-router';
var { width } = Dimensions.get("window");

export default function BreakingNews({ data, label }) {
  const router = useRouter();

  const handleClick = (item) => {
    router.push({
      pathname: "/details",
      params: { ...item },
    });
  };

  return (
    <View>
      <Carousel
        data={data}
        renderItem={({ item }) => (
          <BreakingNewsCard item={item} handleClick={handleClick} />
        )}
        firstItem={1}
        inactiveSlideScale={0.86}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.8}
        slideStyle={{ display: "flex", alignItems: "center" }}
      />
    </View>
  );
}

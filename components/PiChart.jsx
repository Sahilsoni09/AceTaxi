import React from "react";
import { View, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "../context/ThemeContext";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const processDataForChart = (data, theme) => {
  let cashJobs = 0;
  let accJobs = 0;
  let rankJobs = 0;

  data.forEach((entry) => {
    cashJobs += entry.cash;
    accJobs += entry.acc;
    rankJobs += entry.rank;
  });

  return [
    {
      name: "Cash Jobs",
      amount: cashJobs,
      color: theme === "dark" ? "#64B5F6" : "#42a5f5",
      legendFontColor: theme === "dark" ? "#E0E0E0" : "#4F4F4F",
      legendFontSize: screenWidth * 0.035,
    },
    {
      name: "Account Jobs",
      amount: accJobs,
      color: theme === "dark" ? "#81C784" : "#66bb6a",
      legendFontColor: theme === "dark" ? "#E0E0E0" : "#4F4F4F",
      legendFontSize: screenWidth * 0.035,
    },
    {
      name: "Rank Jobs",
      amount: rankJobs,
      color: theme === "dark" ? "#FFEB3B" : "#fdd835",
      legendFontColor: theme === "dark" ? "#E0E0E0" : "#4F4F4F",
      legendFontSize: screenWidth * 0.035,
    },
  ];
};

const PieChartComponent = ({ data }) => {
  const { theme } = useTheme();
  const chartData = processDataForChart(data, theme);

  return (
    <View>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={screenHeight * 0.25}
        chartConfig={{
          backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
          backgroundGradientFrom: theme === "dark" ? "#1E1E1E" : "#EFF3FF",
          backgroundGradientTo: theme === "dark" ? "#2C2C2C" : "#EFEFEF",
          color: (opacity = 1) =>
            theme === "dark"
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft={screenWidth * 0.03}
        absolute
      />
    </View>
  );
};

export default PieChartComponent;

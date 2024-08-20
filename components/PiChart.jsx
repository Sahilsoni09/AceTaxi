import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const processDataForChart = (data) => {
  let cashJobs = 0;
  let accJobs = 0;
  let rankJobs = 0;

  data.forEach(entry => {
    cashJobs += entry.cash;
    accJobs += entry.acc;
    rankJobs += entry.rank;
  });

  return [
    { name: 'Cash Jobs', amount: cashJobs, color: '#42a5f5', legendFontColor: '#4F4F4F', legendFontSize: screenWidth * 0.035 },
    { name: 'Account Jobs', amount: accJobs, color: '#66bb6a', legendFontColor: '#4F4F4F', legendFontSize: screenWidth * 0.035 },
    { name: 'Rank Jobs', amount: rankJobs, color: '#fdd835', legendFontColor: '#4F4F4F', legendFontSize: screenWidth * 0.035 },
  ];
};

const PieChartComponent = ({ data }) => {
  const chartData = processDataForChart(data);
  
  
  return (
    <View>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={screenHeight * 0.25}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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

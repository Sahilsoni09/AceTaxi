import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import TextButton from "../components/TextButton";
import PieChartComponent from "../components/PiChart";
import NoJobsFound from "../components/NoJobFound";
import { useTheme } from "../context/ThemeContext";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const earningsData = [
  {
    date: "2024-07-19",
    jobs: 7,
    cash: 78.6,
    acc: 80.0,
    rank: 0.0,
    total: 158.6,
    comms: 11.79,
    takeHome: 146.81,
  },
  {
    date: "2024-07-18",
    jobs: 8,
    cash: 71.0,
    acc: 111.0,
    rank: 0.0,
    total: 182.0,
    comms: 10.65,
    takeHome: 171.35,
  },
  {
    date: "2024-07-02",
    jobs: 7,
    cash: 45.0,
    acc: 146.0,
    rank: 0.0,
    total: 191.0,
    comms: 6.75,
    takeHome: 184.25,
  },
  {
    date: "2024-07-17",
    jobs: 7,
    cash: 21.0,
    acc: 73.0,
    rank: 0.0,
    total: 94.0,
    comms: 3.15,
    takeHome: 90.85,
  },
  {
    date: "2024-07-22",
    jobs: 9,
    cash: 62.0,
    acc: 156.0,
    rank: 0.0,
    total: 218.0,
    comms: 9.3,
    takeHome: 208.7,
  },
  {
    date: "2024-07-03",
    jobs: 6,
    cash: 55.0,
    acc: 49.0,
    rank: 0.0,
    total: 104.0,
    comms: 8.25,
    takeHome: 95.75,
  },
  {
    date: "2024-07-11",
    jobs: 5,
    cash: 38.0,
    acc: 66.0,
    rank: 0.0,
    total: 104.0,
    comms: 5.7,
    takeHome: 98.3,
  },
  {
    date: "2024-07-12",
    jobs: 4,
    cash: 15.0,
    acc: 130.0,
    rank: 0.0,
    total: 145.0,
    comms: 2.25,
    takeHome: 142.75,
  },
  {
    date: "2024-07-01",
    jobs: 5,
    cash: 26.0,
    acc: 118.0,
    rank: 0.0,
    total: 144.0,
    comms: 3.9,
    takeHome: 140.1,
  },
  {
    date: "2024-07-09",
    jobs: 4,
    cash: 30.0,
    acc: 129.0,
    rank: 0.0,
    total: 159.0,
    comms: 4.5,
    takeHome: 154.5,
  },
  // Add more data as needed
];

const EarningsScreen = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true); // help in tracking whether the user is selecting a start date or an end date, ensuring the proper sequence of date range selection.
  const [isPieChartVisible, setIsPieChartVisible] = useState(true);
  const [isDateRangeVisible, setIsDateRangeVisible] = useState(true);

  const { theme } = useTheme();

  const onDateChange = (date, type) => {
    if (type === "END_DATE") {
      // setSelectedEndDate(null);

      setSelectedEndDate(moment(date).format("YYYY-MM-DD")); //moment(date).format('YYYY-MM-DD'): This formats the given date into a specified string format. In this case, the date is formatted as 'YYYY-MM-DD'.
      setIsCalendarVisible(false); // close the modal when end date is selected
    } else {
      // setSelectedEndDate(null);
      setSelectedStartDate(moment(date).format("YYYY-MM-DD"));
      setIsSelectingStartDate(false);
    }
  };

  const handleSearch = () => {
    if (!selectedStartDate || !selectedEndDate) return;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const filtered = earningsData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setFilteredData([]);
  };

  const openCalendar = (inputType) => {
    if (selectedEndDate && selectedStartDate && inputType === "end") {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
    }
    setIsSelectingStartDate(inputType === "start");
    setIsCalendarVisible(true);
  };

  const handleDateRangeSelection = (days) => {
    //takes a parameter days, which represents the number of days to subtract from the current date to set the start date for a date range selection.
    const end = moment().format("YYYY-MM-DD");
    const start = moment().subtract(days, "days").format("YYYY-MM-DD"); // moment().subtract(days, 'days'): This subtracts a specified number of days from the current date.

    setSelectedStartDate(start);
    setSelectedEndDate(end);
    handleSearch();
  };

  const renderItem = ({ item }) => (
    <View
      style={styles.card}
      className={`${theme === "dark" ? "bg-[#2C2C2C]" : "bg-[#f9f9f9]"}`}
    >
      <View style={styles.cardRow}>
        <Text
          style={styles.cardLabel}
          className={`${theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}`}
        >
          Day
        </Text>
        <Text
          style={styles.cardValue}
          className={`${theme === "dark" ? "text-[#B0B0B0]" : "text-[#333]"}`}
        >
          {moment(item.date).format("DD MMM")}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text
          style={styles.cardLabel}
          className={`${theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}`}
        >
          Jobs
        </Text>
        <Text
          style={styles.cardValue}
          className={`${theme === "dark" ? "text-[#B0B0B0]" : "text-[#333]"}`}
        >
          {item.jobs}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text
          style={styles.cardLabel}
          className={`${theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}`}
        >
          Cash
        </Text>
        <Text
          style={styles.cardValue}
          className={`${theme === "dark" ? "text-[#B0B0B0]" : "text-[#333]"}`}
        >
          £{item.cash.toFixed(2)}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text
          style={styles.cardLabel}
          className={`${theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}`}
        >
          Acc
        </Text>
        <Text
          style={styles.cardValue}
          className={`${theme === "dark" ? "text-[#B0B0B0]" : "text-[#333]"}`}
        >
          £{item.acc.toFixed(2)}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text
          style={styles.cardLabel}
          className={`${theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}`}
        >
          Rank
        </Text>
        <Text
          style={styles.cardValue}
          className={`${theme === "dark" ? "text-[#B0B0B0]" : "text-[#333]"}`}
        >
          £{item.rank.toFixed(2)}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text
          style={styles.cardLabel}
          className={`${theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}`}
        >
          Total
        </Text>
        <Text
          style={styles.cardValue}
          className={`${theme === "dark" ? "text-[#B0B0B0]" : "text-[#333]"}`}
        >
          £{item.total.toFixed(2)}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text
          style={styles.cardLabel}
          className={`${theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}`}
        >
          Comms
        </Text>
        <Text
          style={styles.cardValue}
          className={`${theme === "dark" ? "text-[#B0B0B0]" : "text-[#333]"}`}
        >
          £{item.comms.toFixed(2)}
        </Text>
      </View>
      <View
        style={styles.cardRowHighlighted}
        className="bg-[#CD1A21] p-2 rounded-xl "
      >
        <Text style={styles.cardLabelHighlighted}>Take Home</Text>
        <Text style={styles.cardValueHighlighted}>
          £{item.takeHome.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const ListHeader = () => {
    return (
      <View>
        <StatusBar style="auto" />

        {/* <View>
      <TouchableOpacity onPress={() => setIsDateRangeVisible(!isDateRangeVisible)} style ={styles.chartButton}>
        <Text>{isDateRangeVisible ? 'Hide Date Range Filter' : 'Show Date Range'}</Text>
        <AntDesign name ="down" size={24} color="#000"/>
      </TouchableOpacity>
      </View> */}

        {isDateRangeVisible && (
          <View>
            <View style={styles.quickSelectContainer} >
              <TextButton onPress={() => handleDateRangeSelection(7)}>
                Last 7D
              </TextButton>
              <TextButton onPress={() => handleDateRangeSelection(30)}>
                Last 30D
              </TextButton>
              <TextButton onPress={() => handleDateRangeSelection(60)}>
                Last 60D
              </TextButton>
              <TextButton onPress={() => handleDateRangeSelection(90)}>
                Last 90D
              </TextButton>
            </View>

            <View style={styles.dateRangeContainer}>
              <TextButton onPress={() => openCalendar("start")}>
                {selectedStartDate ? selectedStartDate : "Start Date"}
              </TextButton>
              <TextButton onPress={() => openCalendar("end")}>
                {selectedEndDate ? selectedEndDate : "End Date"}
              </TextButton>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                onPress={handleReset}
                style={styles.resetButton}
                className = {theme === 'dark'? "bg-[#4A4A4A]": "bg-[#d3d3d3]"}
              >
                <Text style={styles.resetButtonText} className ={theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}>RESET</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSearch}
                style={styles.searchButton}
              >
                <Text style={styles.searchButtonText}>SEARCH</Text>
              </TouchableOpacity>
            </View>

            <Modal
              visible={isCalendarVisible} // determine whether modal is visible or not
              transparent={true}
              onRequestClose={() => setIsCalendarVisible(false)} //on pressing back button on Android modal close
            >
              <View style={styles.modalContainer}>
                <View style={styles.calendarContainer}>
                  <CalendarPicker
                    onDateChange={onDateChange} // this function is call when user select a date (to set the start and end date state )
                    allowRangeSelection={true}
                    selectedStartDate={
                      selectedStartDate ? new Date(selectedStartDate) : null
                    }
                    selectedEndDate={
                      selectedEndDate ? new Date(selectedEndDate) : null
                    }
                    width={screenWidth * 0.8} // Ensures the calendar fits within the container
                    height={screenHeight * 0.5} // Adjust height as necessary
                  />
                  <TouchableOpacity
                    onPress={() => setIsCalendarVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {filteredData.length > 0 ? (
          <>
            <View style={styles.piecontainer}>
              {isPieChartVisible && (
                <>
                  <Text style={styles.totalText} className ={theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"} >
                    Total Jobs:{" "}
                    {filteredData.reduce(
                      (total, entry) => total + entry.jobs,
                      0
                    )}
                  </Text>
                  <PieChartComponent data={filteredData} />
                </>
              )}

              {/* <TouchableOpacity onPress={() => setIsPieChartVisible(!isPieChartVisible)} style ={styles.chartButton}>
                <Text>{isPieChartVisible ? 'Hide Chart' : 'Show Chart'}</Text>
              </TouchableOpacity> */}
            </View>
          </>
        ) : (
          <View>
            <NoJobsFound message="No Jobs Found" />
            <NoJobsFound message="Nothing to display" />
          </View>
        )}
      </View>
    );
  };
  return (
    <View
      style={styles.container}
      className={`${theme === "dark" ? "bg-[#121212]" : "bg-[#fff]"}`}
    >
      {/* <View>  
          <View style={styles.quickSelectContainer}>
            <TextButton onPress ={()=> handleDateRangeSelection(7)}>Last 7D</TextButton>
            <TextButton onPress ={()=> handleDateRangeSelection(30)}>Last 30D</TextButton>
            <TextButton onPress ={()=> handleDateRangeSelection(60)}>Last 60D</TextButton>
            <TextButton onPress ={()=> handleDateRangeSelection(90)}>Last 90D</TextButton>
          </View>

          <View style={styles.dateRangeContainer}>
            <TextButton onPress ={()=> openCalendar('start')}>{selectedStartDate ? selectedStartDate : 'Start Date'}</TextButton>
            <TextButton onPress ={() => openCalendar('end')}>{selectedEndDate ? selectedEndDate : 'End Date'}</TextButton>
          </View>
    
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>RESET</Text>
            </TouchableOpacity>
              <TouchableOpacity onPress={handleSearch} style={styles.searchButton} >
                <View style={styles.searchButtonWithIcon} >
                <Ionicons name='search' size={21} color="#fff" style ={styles.searchIcon}/>
                <Text style={styles.searchButtonText}>SEARCH</Text>
                </View> 
              </TouchableOpacity>
          </View>
    
          <Modal visible={isCalendarVisible} // determine whether modal is visible or not 
                 transparent={true} 
                 onRequestClose={() => setIsCalendarVisible(false)} //on pressing back button on Android modal close
          >
            <View style={styles.modalContainer}>
              <View style={styles.calendarContainer}>
              <CalendarPicker
                  onDateChange={onDateChange} // this function is call when user select a date (to set the start and end date state )
                  
                  allowRangeSelection={true}
                  selectedStartDate={selectedStartDate ? new Date(selectedStartDate) : null}
                  selectedEndDate={selectedEndDate ? new Date(selectedEndDate) : null}
                  width={screenWidth * 0.8} // Ensures the calendar fits within the container
                  height={screenHeight * 0.5} // Adjust height as necessary
                />
                <TouchableOpacity onPress={() => setIsCalendarVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          
      </View> */}

      <View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.date}
          ListHeaderComponent={ListHeader}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: screenWidth * 0.05,
  },

  quickSelectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: screenHeight * 0.01,
  },

  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: screenHeight * 0.02,
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: screenHeight * 0.01,
  },
  resetButton: {
    flex: 1,
    // backgroundColor: "#d3d3d3",
    paddingVertical: screenHeight * 0.02,
    alignItems: "center",
    borderRadius: 5,
    marginRight: screenWidth * 0.02,
    borderWidth: 0.3,
    borderColor: "#000",
  },
  resetButtonText: {
    // color: "#000",
    fontFamily: "Roboto-Bold",
    fontSize: screenWidth * 0.04,
  },
  searchButtonWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#CD1A21",
    paddingVertical: screenHeight * 0.02,
    alignItems: "center",
    borderRadius: 5,
    marginLeft: screenWidth * 0.02,
  },
  searchIcon: {
    marginRight: screenWidth * 0.02,
  },
  searchButtonText: {
    color: "#fff",
    fontFamily: "Roboto-Bold",
    fontSize: screenWidth * 0.04,
  },
  card: {
    // backgroundColor: '#f9f9f9',
    padding: screenWidth * 0.05,
    borderRadius: 10,
    marginVertical: screenHeight * 0.01,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 0.3,
    borderColor: "#000",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: screenHeight * 0.005,
  },
  cardLabel: {
    fontWeight: "bold",
    // color: '#333',
    fontSize: screenWidth * 0.04,
  },
  cardValue: {
    // color: '#333',
    fontSize: screenWidth * 0.04,
  },
  cardRowHighlighted: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: screenHeight * 0.01,
    paddingVertical: screenHeight * 0.01,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  cardLabelHighlighted: {
    fontWeight: "bold",
    color: "white",
    fontSize: screenWidth * 0.045,
  },
  cardValueHighlighted: {
    color: "white",
    fontSize: screenWidth * 0.045,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarContainer: {
    width: screenWidth * 0.9,
    backgroundColor: "#fff",
    padding: screenWidth * 0.05,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: screenHeight * 0.02,
    backgroundColor: "#CD1A21",
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.1,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: screenWidth * 0.04,
  },
  piecontainer: {
    marginVertical: screenHeight * 0.001, // Vertical margin
    paddingHorizontal: screenWidth * 0.05, // Horizontal padding
    alignItems: "center", // Center items horizontally
    justifyContent: "center", // Center items vertically
  },
  totalText: {
    fontSize: screenWidth * 0.04, // Font size relative to screen width
    fontWeight: "bold", // Font weight
    // color: "#333", // Text color
    marginBottom: screenHeight * 0.02, // Margin below the text
  },
  chartButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: screenHeight * 0.01,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: screenWidth * 0.01,
    borderWidth: 0.3,
    borderColor: "#000",
  },
  filterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: screenHeight * 0.02,
  },
});

export default EarningsScreen;

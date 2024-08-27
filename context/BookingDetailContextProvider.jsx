import React, { useState } from "react";
import BookingDetailContext from "./BookingDetailContext";

const BookingDetailContextProvider = ({ children }) => {
  const [BookingDetails, setBookingDetails] = useState({});
  const [locationData, setLocationData] = useState(null); // State to store location data


  return (
    <BookingDetailContext.Provider
      value={{ BookingDetails, setBookingDetails,locationData,setLocationData}}
    >
      {children}
    </BookingDetailContext.Provider>
  );
};

export default BookingDetailContextProvider;

import React, { useState } from "react";
import BookingDetailContext from "./BookingDetailContext";

const BookingDetailContextProvider = ({ children }) => {
  const [BookingDetails, setBookingDetails] = useState({});
  const [locationData, setLocationData] = useState(null); // State to store location data

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  return (
    <BookingDetailContext.Provider
      value={{
        BookingDetails,
        setBookingDetails,
        locationData,
        setLocationData,
        isPermissionGranted,
        setIsPermissionGranted,
      }}
    >
      {children}
    </BookingDetailContext.Provider>
  );
};

export default BookingDetailContextProvider;

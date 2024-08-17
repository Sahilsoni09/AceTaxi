import React, { useState } from "react";
import BookingDetailContext from "./BookingDetailContext";

const BookingDetailContextProvider = ({ children }) => {
  const [BookingDetails, setBookingDetails] = useState({});

  return (
    <BookingDetailContext.Provider
      value={{ BookingDetails, setBookingDetails }}
    >
      {children}
    </BookingDetailContext.Provider>
  );
};

export default BookingDetailContextProvider;

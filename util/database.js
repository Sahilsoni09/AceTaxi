import * as SQLite from "expo-sqlite/legacy";

const database = SQLite.openDatabase("bookings.db");

export function init() {
  // Setup the base structure with the table creation
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS bookings (
          bookingId INTEGER PRIMARY KEY NOT NULL,
          passenger TEXT NOT NULL,
          pickup TEXT NOT NULL,
          pickupPostCode TEXT NOT NULL,
          destination TEXT NOT NULL,
          destinationPostCode TEXT NOT NULL,
          vias TEXT,
          price INTEGER NOT NULL,
          status TEXT NOT NULL
        )`,
        [], // Parameters for the query, none in this case
        () => {
          console.log("Table created successfully");
          resolve(); // Resolve if table creation is successful
        },
        (_, error) => {
          console.log("initialization of table failed: ", error);
          reject(error); // Reject the promise if there is an error
        }
      );
    });
  });

  return promise;
}

export function insertJobRequestHistory(
  bookingId,
  passengerName,
  pickupAddress,
  pickupPostCode,
  destinationAddress,
  destinationPostCode,
  vias =[],
  price,
  response
) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      console.log(tx);
      tx.executeSql(
        `INSERT INTO bookings (bookingId, passenger, pickup, pickupPostCode, destination, destinationPostCode, vias, price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bookingId,
          passengerName,
          pickupAddress,
          pickupPostCode,
          destinationAddress,
          destinationPostCode,
          JSON.stringify(vias),
          price,
          response,
        ], // Bind values to the SQL query
        (_, result) => {
          console.log("Insert successful");
          resolve(result); // Resolve if the insert is successful
        },
        (_, error) => {
          console.error("Insert failed:", error);
          reject(error); // Reject if there's an error
        }
      );
    });
  });

  return promise;
}

export function fetchJobRequestHistory() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM bookings",
        [], // No parameters for this query
        (_, result) => {
          console.log("Fetch success");
          resolve(result.rows._array); // Fetch the result rows
        },
        (_, error) => {
          console.log("Fetch error: ", error);
          reject(error); // Reject if there's an error
        }
      );
    });
  });

  return promise;
}

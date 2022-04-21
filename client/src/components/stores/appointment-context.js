import React, { useState, useEffect } from 'react';

const AppointmentContext = React.createContext({
  transmitTimeslotId: () => {},
  timeslotId: 0,
  saveTimeslot: () => {},
  transmitHumanDate: () => {},
  transmitHumanTime: () => {},
});

export const AppointmentContextProvider = (props) => {
  const [timeslotId, setTimeslotId] = useState(0);
  const [humanDate, setHumanDate] = useState(null);
  const [humanTime, setHumanTIme] = useState(null);
  function receiveTimeslotId(id) {
    setTimeslotId(id);
  }
  function saveTimeslotDateAndTime() {
    localStorage.setItem('timeslotId', timeslotId);
    localStorage.setItem('humanDate', humanDate);
    localStorage.setItem('humanTime', humanTime);
    console.log('Time, Date & TimeslotId is set on localStorage');
  }
  function receiveHumanDate(humanDate) {
    setHumanDate(humanDate);
  }
  function receiveHumanTime(humanTime) {
    setHumanTIme(humanTime);
  }
  useEffect(() => {}, []);
  return (
    <AppointmentContext.Provider
      value={{
        timeslotId: timeslotId,
        transmitTimeslotId: receiveTimeslotId,
        transmitHumanDate: receiveHumanDate,
        transmitHumanTime: receiveHumanTime,
        saveTimeslot: saveTimeslotDateAndTime,
      }}
    >
      {props.children}
    </AppointmentContext.Provider>
  );
};
export default AppointmentContext;

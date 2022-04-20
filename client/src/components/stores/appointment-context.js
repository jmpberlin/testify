import React, { useState, useEffect } from 'react';

const AppointmentContext = React.createContext({
  transmitTimeslotId: () => {},
});

export const AppointmentContextProvider = (props) => {
  const [timeslotId, setTimeslotId] = useState(0);
  function receiveTimeslotId(id) {
    setTimeslotId(id);
  }
  useEffect(() => {}, []);
  return (
    <AppointmentContext.Provider
      value={{
        transmitTimeslotId: receiveTimeslotId,
        timeslotId: timeslotId,
      }}
    >
      {props.children}
    </AppointmentContext.Provider>
  );
};
export default AppointmentContext;

import React, { useState, useEffect } from 'react';

const AppointmentContext = React.createContext({
  transmitTimeslotId: () => {},
  transmitService: () => {},
  saveTimeslot: () => {},
  transmitHumanDate: () => {},
  transmitHumanTime: () => {},
  transmitAppointmentDetails: () => {},
  timeslotId: 0,
  getAppointmentDetails: () => {},
});
export default AppointmentContext;

export const AppointmentContextProvider = (props) => {
  const [timeslotId, setTimeslotId] = useState(0);
  const [humanDate, setHumanDate] = useState(null);
  const [humanTime, setHumanTIme] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('kostenloser Bürgertest');
  const [duration, setDuration] = useState(5);
  const [addressName, setAddressName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  function receiveTimeslotId(id) {
    setTimeslotId(id);
  }
  function saveTimeslotDateTimeAndService() {
    localStorage.setItem('timeslotId', timeslotId);
    localStorage.setItem('humanDate', humanDate);
    localStorage.setItem('humanTime', humanTime);
    localStorage.setItem('service', service);
    console.log('Time, Date & TimeslotId is set on localStorage');
  }
  function receiveHumanDate(humanDate) {
    setHumanDate(humanDate);
  }
  function receiveHumanTime(humanTime) {
    setHumanTIme(humanTime);
  }
  function receiveAppointmentDetails(name, val) {
    switch (name) {
      case 'firstName':
        setFirstName(val);
        break;
      case 'lastName':
        setLastName(val);
        break;
      case 'email':
        setEmail(val);
        break;
      case 'addressName':
        setAddressName(val);
        break;
      case 'streetName':
        setStreetName(val);
        break;
      case 'streetNumber':
        setStreetNumber(val);
        console.log('streetNumber is set!');
        break;
      case 'zipCode':
        setZipCode(val);
        break;
      case 'country':
        setCountry(val);
        break;
      case 'city':
        setCity(val);
        break;
      default:
        break;
    }
  }
  function returnAppointmentDetails() {
    return {
      first_name: firstName,
      last_name: lastName,
      email: email,
      address_name: addressName,
      street_name: streetName,
      street_number: streetNumber,
      zip_code: zipCode,
      city: city,
      country: country,
      time_slot: timeslotId,
      duration: duration,
      service: service,
    };
  }
  useEffect(() => {}, []);
  return (
    <AppointmentContext.Provider
      value={{
        timeslotId: timeslotId,
        transmitTimeslotId: receiveTimeslotId,
        transmitHumanDate: receiveHumanDate,
        transmitHumanTime: receiveHumanTime,
        saveTimeslot: saveTimeslotDateTimeAndService,
        transmitAppointmentDetails: receiveAppointmentDetails,
        firstName: firstName,
        lastName: lastName,
        email: email,
        service: service,
        addressName: addressName,
        streetName: streetName,
        streetNumber: streetNumber,
        zipCode: zipCode,
        city: city,
        country: country,
        getAppointmentDetails: returnAppointmentDetails,
      }}
    >
      {props.children}
    </AppointmentContext.Provider>
  );
};

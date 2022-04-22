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

export const AppointmentContextProvider = (props) => {
  const [timeslotId, setTimeslotId] = useState(0);
  const [humanDate, setHumanDate] = useState(null);
  const [humanTime, setHumanTIme] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [addressName, setAddressName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  function receiveTimeslotId(id) {
    setTimeslotId(id);
    console.log(timeslotId);
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
        console.log('setFirstName!');
        console.log(firstName);
        break;
      case 'lastName':
        setLastName(val);
        console.log('setLasttName!');
        break;
      case 'email':
        setEmail(val);
        console.log('setEmail!');
        break;
      case 'addressName':
        setAddressName(val);
        console.log('setAddressName!');
        break;
      case 'streetName':
        setStreetName(val);
        console.log('setStreetName!');
        break;
      case 'streetNumber':
        setStreetNumber(val);
        console.log('setStreetNumber!');
        break;
      case 'zipCode':
        setZipCode(val);
        console.log('setZipcode!');
        break;
      case 'country':
        setCountry(val);
        console.log('setCountry!');
        break;
      case 'city':
        setCity(val);
        console.log('setCity!');
        break;
      default:
        break;
    }
  }
  function returnAppointmentDetails() {
    console.log('first name: ', firstName);
    console.log('last name: ', lastName);
    // const appointmentObj = {
    //   firstName: 'firstName',
    //   lastName: lastName,
    //   email: email,
    //   addressName: addressName,
    //   streetName: streetName,
    //   streetNumber: streetNumber,
    //   zipCode: zipCode,
    //   city: city,
    //   country: country,
    //   timeslotId: timeslotId,
    // };
    // return 'appointmentObj;';
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
export default AppointmentContext;

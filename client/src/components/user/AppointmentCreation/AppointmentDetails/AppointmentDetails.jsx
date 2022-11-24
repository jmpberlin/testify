import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonBack from '../../../UI/Buttons/ButtonBack/ButtonBack';
import AppointmentPreview from '../../../UI/Dates/AppointmentPreview/AppointmentPreview';
import AppointmentContext from '../../../stores/appointment-context';
import BackgroundWrapper from '../../../UI/Wrappers/BackgroundWrapper/BackgroundWrapper';
import AppointmentDetailsEditForm from '../../../UI/Appointments/AppointmentDetailsEditForm/AppointmentDetailsEditForm';
import axios from 'axios';
import InputError from '../../../UI/Errors/InputError/InputError';
const AppointmentDetails = () => {
  const appoCtx = useContext(AppointmentContext);
  const navigator = useNavigate();
  function onClickBackHandler() {
    appoCtx.transmitTimeslotId(0);
  }
  const [humanDate, setHumanDate] = useState(null);
  const [humanTime, setHumanTime] = useState(null);
  const [bookingError, setBookingError] = useState(false);
  const [bookingErrorMessage, setBookingErrorMessage] = useState('');

  useEffect(() => {
    setHumanDate(localStorage.getItem('humanDate'));
    setHumanTime(localStorage.getItem('humanTime'));
    appoCtx.transmitTimeslot(localStorage.getItem('timeslot'));
    appoCtx.transmitService(localStorage.getItem('service'));
  }, [appoCtx.timeslotId]);

  function editFormChangeHandler(e) {
    appoCtx.transmitAppointmentDetails(e.target.name, e.target.value);
  }
  function bookAppointmentHandler() {
    const appointment = appoCtx.getAppointmentDetails();

    console.log(appointment.start_time);
    axios
      .post('/api/v1/Appointment/Create', appointment)
      .then((resFromApi) => {
        navigator('/appointments/confirmation');
      })
      .catch((error) => {
        console.log(error.response.data);
        setBookingError(true);
        setBookingErrorMessage(error.response.data.error);
      });
  }
  return (
    <BackgroundWrapper>
      <h2>Appointment Details: </h2>
      <AppointmentPreview
        humanTime={humanTime}
        humanDate={humanDate}
      ></AppointmentPreview>
      <h4>
        Please Provide your personal information to book the selected
        appointment:
      </h4>
      <AppointmentDetailsEditForm
        onChange={editFormChangeHandler}
      ></AppointmentDetailsEditForm>
      {bookingError && (
        <InputError message='an error ocurred while booking your appointment. Please fill out all fields.'></InputError>
      )}
      <button onClick={bookAppointmentHandler}>Book the appointment</button>
      <ButtonBack onClick={onClickBackHandler} to='/appointments/date'>
        Back
      </ButtonBack>
    </BackgroundWrapper>
  );
};

export default AppointmentDetails;

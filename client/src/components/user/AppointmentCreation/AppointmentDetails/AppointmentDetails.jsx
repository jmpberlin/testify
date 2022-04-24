import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonBack from '../../../UI/Buttons/ButtonBack/ButtonBack';
import AppointmentPreview from '../../../UI/Dates/AppointmentPreview/AppointmentPreview';
import AppointmentContext from '../../../stores/appointment-context';
import BackgroundWrapper from '../../../UI/Wrappers/BackgroundWrapper/BackgroundWrapper';
import AppointmentDetailsEditForm from '../../../UI/Appointments/AppointmentDetailsEditForm/AppointmentDetailsEditForm';
import axios from 'axios';
const AppointmentDetails = () => {
  const appoCtx = useContext(AppointmentContext);
  const navigator = useNavigate();
  function onClickBackHandler() {
    appoCtx.transmitTimeslotId(0);
  }
  const [humanDate, setHumanDate] = useState(null);
  const [humanTime, setHumanTime] = useState(null);

  useEffect(() => {
    setHumanDate(localStorage.getItem('humanDate'));
    setHumanTime(localStorage.getItem('humanTime'));
  }, [appoCtx.timeslotId]);

  function editFormChangeHandler(e) {
    appoCtx.transmitAppointmentDetails(e.target.name, e.target.value);
  }
  function bookAppointmentHandler() {
    const appointment = appoCtx.getAppointmentDetails();
    console.log(appointment);
    axios
      .post('/api/v1/Appointment/Create', appointment)
      .then((resFromApi) => {
        
        navigator('/appointments/confirmation');
      })
      .catch((error) => {
        console.log('=======>> There was an error \n', error.response);
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
      <button onClick={bookAppointmentHandler}>Book the appointment</button>
      <ButtonBack onClick={onClickBackHandler} to='/appointments/date'>
        Back
      </ButtonBack>
    </BackgroundWrapper>
  );
};

export default AppointmentDetails;

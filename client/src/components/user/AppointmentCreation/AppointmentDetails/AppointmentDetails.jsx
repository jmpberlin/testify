import React from 'react';
import { useContext, useEffect, useState } from 'react';
import ButtonBack from '../../../UI/Buttons/ButtonBack/ButtonBack';
import AppointmentPreview from '../../../UI/Dates/AppointmentPreview/AppointmentPreview';
import AppointmentContext from '../../../stores/appointment-context';
import BackgroundWrapper from '../../../UI/Wrappers/BackgroundWrapper/BackgroundWrapper';
import AppointmentDetailsEditForm from '../../../UI/Appointments/AppointmentDetailsEditForm/AppointmentDetailsEditForm';
const AppointmentDetails = () => {
  const appoCtx = useContext(AppointmentContext);
  function onClickBackHandler() {
    console.log('you still have to delete the localStorage items!');
    appoCtx.transmitTimeslotId(0);
  }
  const [humanDate, setHumanDate] = useState(null);
  const [humanTime, setHumanTime] = useState(null);

  useEffect(() => {
    setHumanDate(localStorage.getItem('humanDate'));
    setHumanTime(localStorage.getItem('humanTime'));
  }, [appoCtx.timeslotId]);

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
      <AppointmentDetailsEditForm></AppointmentDetailsEditForm>

      <ButtonBack onClick={onClickBackHandler} to='/appointments/date'>
        Back
      </ButtonBack>
    </BackgroundWrapper>
  );
};

export default AppointmentDetails;

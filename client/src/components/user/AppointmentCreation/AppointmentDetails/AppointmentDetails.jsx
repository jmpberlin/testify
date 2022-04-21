import React from 'react';
import { useContext, useEffect, useState } from 'react';
import ButtonBack from '../../../UI/Buttons/ButtonBack/ButtonBack';
import AppointmentPreview from '../../../UI/Dates/AppointmentPreview/AppointmentPreview';
import AppointmentContext from '../../../stores/appointment-context';
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
    <div>
      <h1>Appointment Details! </h1>
      <AppointmentPreview
        humanTime={humanTime}
        humanDate={humanDate}
      ></AppointmentPreview>
      <ButtonBack onClick={onClickBackHandler} to='/appointments/date'>
        Back
      </ButtonBack>
    </div>
  );
};

export default AppointmentDetails;

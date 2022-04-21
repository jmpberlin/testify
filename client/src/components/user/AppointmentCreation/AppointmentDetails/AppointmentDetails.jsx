import React from 'react';
import { useContext, useEffect, useState } from 'react';
import ButtonBack from '../../../UI/Buttons/ButtonBack/ButtonBack';
import AppointmentPreview from '../../../UI/Dates/AppointmentPreview/AppointmentPreview';
import AppointmentContext from '../../../stores/appointment-context';
const AppointmentDetails = () => {
  const [humanDate, setHumanDate] = useState(null);
  const [humanTime, setHumanTime] = useState(null);
  const appoCtx = useContext(AppointmentContext);
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
      <ButtonBack to='/appointments/date'>Back</ButtonBack>
    </div>
  );
};

export default AppointmentDetails;

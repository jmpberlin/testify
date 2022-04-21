import React from 'react';
import styles from './TimeSlot.module.css';
import { useContext } from 'react';
import AppointmentContext from '../../../../stores/appointment-context';
const TimeSlot = (props) => {
  const appoCtx = useContext(AppointmentContext);
  const selectAppointmentHandler = () => {
    appoCtx.transmitTimeslotId(props.id);
    appoCtx.transmitHumanTime(`${hours}:${minutes}`);
    appoCtx.transmitHumanDate(dateObj.toLocaleDateString('de-DE', options));
  };
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  let dateObj = new Date(props.start_time);

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return (
    <div onClick={selectAppointmentHandler} className={styles.time_slot}>
      <p>
        {hours}:{minutes}
      </p>
    </div>
  );
};

export default TimeSlot;

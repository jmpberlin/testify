import React from 'react';
import styles from './TimeSlot.module.css';
import { useContext } from 'react';
import AppointmentContext from '../../../../stores/appointment-context';
const TimeSlot = (props) => {
  const appoCtx = useContext(AppointmentContext);
  const selectAppointmentHandler = () => {
    appoCtx.transmitTimeslotId(props.id);
    appoCtx.transmitTimeslot(props.start_time);
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
  let minutes = dateObj.getMinutes();
  minutes = ('0' + minutes).slice(-2);

  return (
    <div onClick={selectAppointmentHandler} className={styles.time_slot}>
      <p>
        {hours}:{minutes}
      </p>
    </div>
  );
};

export default TimeSlot;

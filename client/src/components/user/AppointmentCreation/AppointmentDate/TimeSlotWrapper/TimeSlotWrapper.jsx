import React from 'react';
import styles from './TimeSlotWrapper.module.css';
import TimeSlot from '../TimeSlot/TimeSlot';
const TimeSlotWrapper = (props) => {
  return (
    <div className={styles.time_slot_wrapper}>
      {props.timeSlotArray.map((slot) => {
        return (
          <TimeSlot
            key={slot.id}
            id={slot.id}
            start_time={slot.start_time}
          ></TimeSlot>
        );
      })}
    </div>
  );
};

export default TimeSlotWrapper;

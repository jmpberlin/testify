import React from 'react';
import styles from './AppointmentPreview.module.css';

const AppointmentPreview = (props) => {
  return (
    <div className={styles.appointment_preview_wrapper}>
      <p>{props.humanDate}</p>
      <br />
      <p>{props.humanTime}</p>
      <br />
    </div>
  );
};

export default AppointmentPreview;

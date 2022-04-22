import React from 'react';
import styles from './AppointmentDetailsEditForm.module.css';

const AppointmentDetailsEditForm = (props) => {
  return (
    <div className={styles.appointment_details_edit_form_wrapper}>
      <label className='' htmlFor='firstName'>
        First Name:
      </label>
      <input
        onChange={props.onChange}
        type='text'
        name='firstName'
        id='firstName'
      />

      <label htmlFor='lastName'>Last Name: </label>
      <input
        onChange={props.onChange}
        type='text'
        name='lastName'
        id='lastName'
      />
      <label htmlFor='email'>Email: </label>
      <input onChange={props.onChange} type='email' name='email' id='email' />

      <label htmlFor='addressName'>Address name:</label>
      <input
        onChange={props.onChange}
        type='text'
        name='addressName'
        id='addressName'
      />

      <label htmlFor='streetName'>Street name:</label>

      <input
        onChange={props.onChange}
        type='text'
        name='streetName'
        id='streetName'
      />

      <label htmlFor='streetNumber'>Street number:</label>

      <input
        onChange={props.onChange}
        type='text'
        name='streetNumber'
        id='streetNumber'
      />

      <label htmlFor='zipCode'>Zip Code:</label>
      <input
        onChange={props.onChange}
        type='text'
        name='zipCode'
        id='zipCode'
      />

      <label htmlFor='city'>City:</label>

      <input onChange={props.onChange} type='text' name='city' id='city' />

      <label htmlFor='country'>Country:</label>

      <input
        onChange={props.onChange}
        type='text'
        name='country'
        id='country'
      />

    </div>
  );
};

export default AppointmentDetailsEditForm;

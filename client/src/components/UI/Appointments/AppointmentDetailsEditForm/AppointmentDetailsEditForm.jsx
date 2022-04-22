import React from 'react';

const AppointmentDetailsEditForm = (props) => {
  return (
    <div>
      <label className='' htmlFor='firstName'>
        First Name:
      </label>
      <input type='text' name='firstName' id='firstName' />

      <label htmlFor='lastName'>Last Name: </label>
      <input type='text' name='lastName' id='lastName' />

      <label htmlFor='addressName'>Address name:</label>
      <input type='text' name='addressName' id='addressName' />

      <label htmlFor='streetName'>Street name:</label>

      <input type='text' name='streetName' id='streetName' />

      <label htmlFor='streetNumber'>Street number:</label>

      <input type='number' name='streetNumber' id='streetNumber' />

      <label htmlFor='postalCode'>Postal code:</label>
      <input type='text' name='postalCode' id='postalCode' />

      <label htmlFor='city'>City:</label>

      <input type='text' name='city' id='city' />

      <label htmlFor='country'>Country:</label>

      <input type='text' name='country' id='country' />

      <button type='submit'>Save Changes</button>
    </div>
  );
};

export default AppointmentDetailsEditForm;

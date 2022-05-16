import React from 'react';
import styles from './SignupBox.module.css';

import { useState, useEffect } from 'react';
import axios from 'axios';
import BackgroundWrapper from '../../../UI/Wrappers/BackgroundWrapper/BackgroundWrapper';
const SignupBox = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      default:
        break;
    }
  };
  const signUpUser = () => {
    axios
      .post('/api/v1/user/signup', {
        email: email,
        pw: password,
        first_name: firstName,
        last_name: lastName,
      })
      .then((resFromDb) => {
        console.log(resFromDb);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  return (
    <BackgroundWrapper>
      <div className={styles.outerWrapper}>
        <h4>Please sign up: </h4>
        <label htmlFor='firstName'>First Name: </label>
        <input
          onChange={handleInput}
          id='firstName'
          type='text'
          name='firstName'
        ></input>
        <label htmlFor='lastName'>Last Name: </label>
        <input
          onChange={handleInput}
          id='lastName'
          type='text'
          name='lastName'
        ></input>
        <label htmlFor='email'>Email: </label>
        <input
          onChange={handleInput}
          id='email'
          type='email'
          name='email'
        ></input>
        <label htmlFor='email'>Password: </label>
        <input
          onChange={handleInput}
          id='password'
          type='password'
          name='password'
        ></input>
        <hr />
        <button onClick={signUpUser}>Sign me up</button>
      </div>
    </BackgroundWrapper>
  );
};

export default SignupBox;

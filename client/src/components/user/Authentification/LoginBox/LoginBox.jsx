import React from 'react';
import { useState, useEffect } from 'react';
import styles from './LoginBox.module.css';
import ButtonNext from '../../../UI/Buttons/ButtonNext/ButtonNext';
import BackgroundWrapper from '../../../UI/Wrappers/BackgroundWrapper/BackgroundWrapper';
import axios from 'axios';

const LoginBox = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      default:
        break;
    }
  };
  const logInUser = () => {
    axios
      .post('/api/v1/user/login', {
        email: email,
        pw: password,
      })
      .then((resFromDb) => {
        console.log(resFromDb);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  const getHandler = () => {
    axios.get('/api/v1/get/').then((resFromDb) => {
      console.log(resFromDb);
    });
  };
  const putHandler = () => {
    axios.get('/api/v1/put/').then((resFromDb) => {
      console.log(resFromDb);
    });
  };
  return (
    <>
      <BackgroundWrapper>
        <div className={styles.outerWrapper}>
          <h4>Please log in:</h4>
          <label htmlFor='email'>Email: </label>
          <input
            onChange={handleInput}
            id='email'
            type='email'
            name='email'
          ></input>
          <label htmlFor='password'>Password: </label>
          <input
            onChange={handleInput}
            id='password'
            type='password'
            name='password'
          ></input>
          <hr />
          <button onClick={logInUser}>Log me in</button>
        </div>
        <p>Don't have an account yet?</p>
        <ButtonNext to='/signup'>Sign up</ButtonNext>
      </BackgroundWrapper>
      <hr />
      <BackgroundWrapper>
        <div className={styles.outerWrapper}>
          <h4>put message in session</h4>
          <button onClick={putHandler}>PUT</button>
          <h4>get message from session</h4>
          <button onClick={getHandler}>GET</button>
        </div>
      </BackgroundWrapper>
    </>
  );
};

export default LoginBox;

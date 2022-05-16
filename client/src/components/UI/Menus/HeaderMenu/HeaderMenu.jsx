import React from 'react';
import styles from './HeaderMenu.module.css';
import NavButton from '../../Buttons/NavButton/NavButton';
const HeaderMenu = () => {
  return (
    <div className={styles.outerWrapper}>
      <NavButton to='/'>Testify</NavButton>
      <NavButton to='/appointments/date'>Book Now!</NavButton>
      <NavButton to='login'>Login</NavButton>
    </div>
  );
};

export default HeaderMenu;

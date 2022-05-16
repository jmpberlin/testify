import React from 'react';
import BackgroundWrapper from '../../../UI/Wrappers/BackgroundWrapper/BackgroundWrapper';
import ButtonNext from '../../../UI/Buttons/ButtonNext/ButtonNext';
const Home = (props) => {
  return (
    <div>
      <BackgroundWrapper>
        <h3>Book your Covid-Test now! </h3>
        <ButtonNext to='/appointments/date' type={'submit'}>
          Next
        </ButtonNext>{' '}
      </BackgroundWrapper>
    </div>
  );
};

export default Home;

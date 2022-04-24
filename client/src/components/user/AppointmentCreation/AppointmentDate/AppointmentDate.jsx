import React from 'react';
import { useState, useContext, useEffect } from 'react';
import ButtonNext from '../../../UI/Buttons/ButtonNext/ButtonNext';
import BackgroundWrapper from '../../../UI/Wrappers/BackgroundWrapper/BackgroundWrapper';
import TitleBox from '../../../UI/Boxes/TitleBox/TitleBox';
import axios from 'axios';
import TimeSlotWrapper from './TimeSlotWrapper/TimeSlotWrapper';
import AppointmentContext from '../../../stores/appointment-context';
const AppointmentDate = (props) => {
  const appoCtx = useContext(AppointmentContext);

  const [selectedDate, setSelectedDate] = useState();
  const [timeSlotArray, setTimeSlotArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [timeslotIsSelected, setTimeslotIsSelected] = useState(false);
  const onSubmitHandler = (e) => {
    appoCtx.saveTimeslot();
  };
  const selectServiceHandler = (e) => {
    console.log(e.target.value);
    appoCtx.transmitService(e.target.value);
  };
  const onSelectDateHandler = (e) => {
    if (e.target.value && e.target.value !== selectedDate) {
      setSelectedDate(e.target.value);
      let dateObj = new Date(e.target.value);
      axios
        .get(`/api/v1/Timeslots/show/getByDate/${dateObj.toISOString()}`)
        .then((resFromDb) => {
          setTimeSlotArray(resFromDb.data.appointments);
          setErrorMessage(null);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            setErrorMessage(
              'There are no appointments available for the selected date!'
            );
            setTimeSlotArray([]);
          }
        });
    }
  };
  useEffect(() => {
    if (appoCtx.timeslotId !== 0) {
      setTimeslotIsSelected(true);
    }
  }, [appoCtx.timeslotId]);
  useEffect(() => {
    selectServiceHandler({
      target: {
        value: 'kostenloser Bürgertest',
      },
    });
  }, []);

  return (
    <BackgroundWrapper>
      <div className='borderbox flexwrapper'>
        <form>
          <TitleBox>
            <label htmlFor='service'>Service:</label>
          </TitleBox>
          <select onChange={selectServiceHandler} name='service' id='service'>
            <option select='selected' value='konstenloser Bürgertest'>
              kostenloser Bürgertest
            </option>
            <option value='PCR-Test'>PCR-Test</option>
            <option value='Antigen-Test'>Antigen-Test</option>
          </select>
          <br />
          <label htmlFor='appointmentDate'>Datum</label>
          <input
            onSelect={onSelectDateHandler}
            type='date'
            name='appointmentDate'
            id='appointmentDate'
          />

          <br />
          <br />
          {timeSlotArray.length > 0 && (
            <TimeSlotWrapper timeSlotArray={timeSlotArray}></TimeSlotWrapper>
          )}
          {errorMessage && <p>{errorMessage}</p>}
          <ButtonNext
            to='/appointments/details'
            type={'submit'}
            disabled={!timeslotIsSelected}
            onClick={onSubmitHandler}
          >
            Next
          </ButtonNext>
        </form>
      </div>
    </BackgroundWrapper>
  );
};

export default AppointmentDate;

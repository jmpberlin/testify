import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppointmentDate from './components/user/AppointmentCreation/AppointmentDate/AppointmentDate';
import AppointmentDetails from './components/user/AppointmentCreation/AppointmentDetails/AppointmentDetails';
import AppointmentConfirmation from './components/user/AppointmentCreation/AppointmentConfirmation/AppointmentConfirmation';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path='/appointments/date'
            element={<AppointmentDate />}
          ></Route>
          <Route
            exact
            path='/appointments/details'
            element={<AppointmentDetails />}
          ></Route>
          <Route
            exact
            path='/appointments/confirmation'
            element={<AppointmentConfirmation />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import './App.css';
import Home from './components/user/LandingPage/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppointmentDate from './components/user/AppointmentCreation/AppointmentDate/AppointmentDate';
import AppointmentDetails from './components/user/AppointmentCreation/AppointmentDetails/AppointmentDetails';
import AppointmentConfirmation from './components/user/AppointmentCreation/AppointmentConfirmation/AppointmentConfirmation';
import HeaderMenu from './components/UI/Menus/HeaderMenu/HeaderMenu';
import LoginBox from './components/user/Authentification/LoginBox/LoginBox';
import SignupBox from './components/user/Authentification/SignupBox/SignupBox';
function App() {
  return (
    <div>
      <BrowserRouter>
        <HeaderMenu></HeaderMenu>

        <Routes>
          <Route exact path='/' element={<Home />}></Route>
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
          <Route exact path='/login' element={<LoginBox />}></Route>
          <Route exact path='/signup' element={<SignupBox />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import './App.css';
import { Router, Route } from 'react-router-dom';
import AppointmentDate from './components/user/AppointmentCreation/AppointmentDate/AppointmentDate';

function App() {
  return (
    <div>
      <Router>
        <Route
          exact
          path='/appointments/date'
          component={AppointmentDate}
        ></Route>
      </Router>
    </div>
  );
}

export default App;

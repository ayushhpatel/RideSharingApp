import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Signin from './Signin';
import AvailableRides from './AvailableRides';
import CreateRide from './CreateRide';
import Signout from './Signout';
import DriverRides from './DriverRides';

function App() {
    const userType = localStorage.getItem('userType');
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/available-rides" element={<AvailableRides />} />
                <Route path="/driver-rides" element={userType ==='Driver' ? (<DriverRides />):(<AvailableRides/>)} />
                <Route path="/create-ride" element={userType ==='Driver' ? (<CreateRide />):(<AvailableRides/>)} />
                <Route path="/signout" element={<Signout />} />
                <Route path="*" element={<Signin />} />
            </Routes>
        </Router>
    );
}

export default App;

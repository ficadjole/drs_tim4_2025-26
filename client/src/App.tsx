import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AutentifikacionaForma from './components/autentifikacija/AutentifikacionaForma';
import UsersList from './components/users/UserList';
import { authApi } from './api_services/auth/AuthAPIService';
import EditUserForm from './components/users/EditUserForm';
import Navbar from './components/Navbar';
import UserDetails from './components/users/UserDetail';
import FlightList from './components/flights/FlightList';
import CreateFlight from './components/flights/CreateFlight';
import EditFlight from './components/flights/EditFlight';

function App() {
  const [prijavljen, setPrijavljen] = useState<boolean>(false);
  
  const uloga = (localStorage.getItem("userRole"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPrijavljen(true);
    }
  }, []);

  return (
    <div className="App min-h-screen bg-gradient-to-br from-pink-250 via-blue-400 to-blue-200 bg-fixed">
      {prijavljen && <Navbar />}

      <Routes>
    <Route 
      path="/" 
      element={
        prijavljen 
          ? (uloga === "ADMINISTRATOR" ? <Navigate to="/users/getAll" /> : <Navigate to="/profile" />)
          : <AutentifikacionaForma authApi={authApi} onLoginSuccess={() => setPrijavljen(true)} />
      } 
    />

    <Route path="/users/getAll" element={uloga === "ADMINISTRATOR" ? <UsersList /> : <Navigate to="/profile" />} />

    <Route path="/profile" element={prijavljen ? <UserDetails /> : <Navigate to="/" />} />

    <Route path="/edit-user/:id" element={prijavljen ? <EditUserForm /> : <Navigate to="/" />} />

    <Route path="/flights" element={<FlightList/>}/>
    <Route path="/create-flight" element={prijavljen? <CreateFlight/> : <Navigate to="/"/>}/>
    <Route path="/edit-flight/:id" element={prijavljen ? <EditFlight/> : <Navigate to="/"/>}/>

  </Routes>
    </div>
  );
}

export default App;
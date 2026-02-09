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
import TicketList from './components/tickets/TicketList';
import AirCompanyList from './components/air-company/AirCompanyList';
import CreateAirCompany from './components/air-company/CreateAirCompany';
import EditAirCompany from './components/air-company/EditAirCompany';

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
    <div className="App min-h-screen bg-[#0b4163] text-slate-200 selection:bg-sky-500/30">
      {prijavljen && <Navbar />}

      <Routes>
    <Route 
      path="/" 
      element={
        prijavljen 
              ? <Navigate to="/flights" /> 
              : <AutentifikacionaForma authApi={authApi} onLoginSuccess={() => setPrijavljen(true)} />
      } 
    />

    <Route path="/users/getAll" element={uloga === "ADMINISTRATOR" ? <UsersList /> : <Navigate to="/profile" />} />

    <Route path="/profile" element={prijavljen ? <UserDetails /> : <Navigate to="/" />} />

    <Route path="/edit-user/:id" element={prijavljen ? <EditUserForm /> : <Navigate to="/" />} />

    <Route path="/flights" element={<FlightList/>}/>
    <Route path="/create-flight" element={prijavljen? <CreateFlight/> : <Navigate to="/"/>}/>
    <Route path="/edit-flight/:id" element={prijavljen ? <EditFlight/> : <Navigate to="/"/>}/>

    <Route path="/my-tickets" element={<TicketList/>}/>

    <Route path="/air-companies" element={<AirCompanyList/>}/>
    <Route path="/create-airline" element={prijavljen ? <CreateAirCompany/> : <Navigate to="/"/>}/>
    <Route path="/edit-airline/:id" element={prijavljen ? <EditAirCompany/> : <Navigate to="/"/>}/>
  </Routes>
    </div>
  );
}

export default App;
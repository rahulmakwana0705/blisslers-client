import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Customer from './components/customer/customer';
import NewCustomer from './components/customer/NewCustomer';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <ToastContainer />
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/customers" replace />} />
            <Route path="/home" element={<div className='text-2xl font-bold text-center mt-4'>Home</div>} />
            <Route path="/templates" element={<div className='text-2xl font-bold text-center mt-4'>Templates</div>} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/customers/:action" element={<NewCustomer />} />
            <Route path="/customers/:action/:customerId" element={<NewCustomer />} />
            <Route path="/employees" element={<div className='text-2xl font-bold text-center mt-4'>Employees</div>} />
            <Route path="/settings" element={<div className='text-2xl font-bold text-center mt-4'>Settings</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

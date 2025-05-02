import React, { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Chat_interface/landing';

const App = () => {
  const [showModal, setShowModal] = useState(true);
  const [authMode, setAuthMode] = useState(null); // null, 'login', 'signup'

  const closeModal = () => {
    setShowModal(false);
    setAuthMode(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-fade-in">
            {!authMode && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white  mb-4">Welcome!</h2>
                <p className=" mb-6 text-white">Choose how you want to continue</p>
                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                    onClick={() => setAuthMode('login')}
                  >
                    Login
                  </button>
                  <button
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                    onClick={() => setAuthMode('signup')}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
            {authMode === 'login' && <Login switchPage={() => setAuthMode('signup')} closeModal={closeModal} />}
            {authMode === 'signup' && <Signup switchPage={() => setAuthMode('login')} closeModal={closeModal} />}

            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {!showModal && (
        <div className="text-center">
          {/* <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to the App!</h1>
          <p className="text-gray-600">You are now authenticated.</p> */}
          <Landing/>
        </div>
      )}
    </div>
  );
};

export default App;

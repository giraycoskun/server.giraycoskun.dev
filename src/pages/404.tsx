import React from 'react';
import { Link } from 'react-router-dom';
import DinoGame from 'react-chrome-dino-ts';
import 'react-chrome-dino-ts/index.css';

/**
 * Game Component
 * Stripped of outer layout wrappers to make it reusable inside other containers
 */
const GameDashboard: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Game Container - added overflow-hidden to handle mobile resizing */}
      <div className="w-full bg-white rounded-lg overflow-hidden border-2 border-gray-200">
        <DinoGame />
      </div>
      
      {/* Instructions */}
      <p className="mt-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">
        Press <span className="px-2 py-1 mx-1 bg-gray-200 text-gray-700 rounded border border-gray-300 font-mono">Space</span> to Jump
      </p>
    </div>
  );
};

/**
 * 404 Page Component
 * Handles the main page layout and centering
 */
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="text-center pt-10 pb-6 px-6">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
          <h2 className="mt-2 text-lg text-gray-500 font-medium">
            Page not found, but we found a Dino.
          </h2>
        </div>

        {/* Game Section */}
        <div className="bg-gray-50 p-6 border-t border-b border-gray-100 flex justify-center">
          <GameDashboard />
        </div>

        {/* Footer / Action Section */}
        <div className="p-8 text-center bg-white">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
          >
            ← Return Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Profile = ({ name, email, photoUrl, onEdit}) => {
  const navigate = useNavigate()
  return (

    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-cyan-200">
      <div className="bg-cyan-100/70 p-6 flex flex-col items-center">
        <img
          src={photoUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
        />
        <h2 className="text-xl font-semibold text-gray-700 mt-4">{name}</h2>
        <p className="text-gray-600 text-sm">{email}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
          >
            Manage
          </button>
          <button
            onClick={()=>{
        
                localStorage.clear()
                // window.location.reload();}}
                navigate("/")}}
            className="px-4 py-2 text-sm rounded-lg bg-white text-cyan-600 border border-cyan-600 hover:bg-cyan-50 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

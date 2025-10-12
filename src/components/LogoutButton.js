import React from 'react';
import { useHistory } from 'react-router-dom'; // For navigation
import { signOut } from 'firebase/auth'; // Firebase signOut method
import { auth } from '../firebase'; // Import the auth instance from your firebase config

const LogoutButton = () => {
  const history = useHistory();

  const handleLogout = () => {
    signOut(auth)  // Call the Firebase signOut method
      .then(() => {
        // Successfully logged out, redirect to login page
        history.push('/login');  // Redirect to the login page
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error logging out:', error);
      });
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;

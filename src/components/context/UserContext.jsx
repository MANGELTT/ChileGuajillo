import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user-profile', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokerUser_Verified'))}`
          }
        });
        const data = await response.json();
        setProfileId(data.userData.profile.user_id);
      } catch (error) {
        console.error('Error fetching profile ID:', error);
      }
    };

    fetchProfileId();
  }, []);

  return (
    <UserContext.Provider value={{ profileId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

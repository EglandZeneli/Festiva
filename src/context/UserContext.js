import { createContext, useContext, useState } from "react";

// 1. Create the context object
const UserContext = createContext();

// 2. Create a custom provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = guest

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Create a custom hook for cleaner access
export const useUser = () => useContext(UserContext);

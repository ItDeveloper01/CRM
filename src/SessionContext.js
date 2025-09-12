
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  //const [user, setUser] = useState(null); // will hold {id, name, roles...}
  const [user, setUser]= useState(() => 
    {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : { isLoggedIn: false, role: null, user: null };
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useGetSessionUser() {
  return useContext(UserContext);
}

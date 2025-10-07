// import { createContext, useContext, useState, useEffect } from "react";

// const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem("auth");
//     return saved ? JSON.parse(saved) : { isLoggedIn: false, role: null, user: null };
//   });

//   const [menu, setMenu] = useState(() => {
//     const savedMenu = localStorage.getItem("menu");
//     return savedMenu ? JSON.parse(savedMenu) : [];
//   });

//   // Sync state with localStorage whenever it changes
//   useEffect(() => {
//     debugger;
//      console.log("User state changed:", user);
//      console.log("Menu state changed:", menu);
//     if (user?.isLoggedIn) {
//       localStorage.setItem("auth", JSON.stringify(user));
//       localStorage.setItem("menu", JSON.stringify(menu));
//     } else {
//       localStorage.removeItem("auth");
//       localStorage.removeItem("menu");
//     }
//   }, [user, menu]);

//   // Optional: logout helper
//   const logout = () => {
//     setUser({ isLoggedIn: false, role: null, user: null });
//     localStorage.removeItem("auth");
//     localStorage.removeItem("menu");
//     setMenu([]);
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, menu, setMenu, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useGetSessionUser() {
//   return useContext(UserContext);
// }

import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  //const [user, setUser] = useState(null); // will hold {id, name, roles...}
  const [user, setUser]= useState(() => 
    {
    const saved = localStorage.getItem("auth");
    const sideMenu = localStorage.getItem("menu");
    return saved ? JSON.parse(saved) : { isLoggedIn: false, role: null, user: null };
  });

  const [menu, setMenu] = useState(() => {
    const savedMenu = localStorage.getItem("menu");
    return savedMenu ? JSON.parse(savedMenu) : [];
  });

   //Optional: logout helper
  const logout = () => {
    setUser({ isLoggedIn: false, role: null, user: null });
    localStorage.removeItem("auth");
    localStorage.removeItem("menu");
    setMenu([]);
  };


  return (
    <UserContext.Provider value={{ user, setUser, menu, setMenu }}>
      {children}
    </UserContext.Provider>
  );
}

export function useGetSessionUser() {
  return useContext(UserContext);
}

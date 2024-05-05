import React, { createContext, useContext, useEffect, useState } from "react";
import {getCurrentUser} from "../lib/appwrite";


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true)
            try {
                const user = await getCurrentUser()
                if (user) {
                    setUser(user)
                    setIsLogged(true)
                }else {
                    setUser(null)
                    setIsLogged(false)
                }
            }catch (e) {
                console.log(e)
            }finally {
                setLoading(false)
            }
        }

        getUser()
    }, []);


  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

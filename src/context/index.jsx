import { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Map } from "immutable";
import { auth } from "../firebase";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Add your state management code here
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(Map());
  const [loading, setLoading] = useState(true);
  const [userGenres, setUserGenres] = useState(null);
  const [purchasedMovies , setPurchasedMovies ] = useState([]);


  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
        const sessionCart = localStorage.getItem(user.uid);
        if (sessionCart) {
          setCart(Map(JSON.parse(sessionCart)));
        }
      }
      setLoading(false);
    });
  }, [])

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <StoreContext.Provider value={{ user, setUser, cart, setCart, userGenres, setUserGenres, purchasedMovies, setPurchasedMovies }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  return useContext(StoreContext);
}
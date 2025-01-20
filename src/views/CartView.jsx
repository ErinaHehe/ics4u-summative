import { useStoreContext } from "../context";
import { firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Cartview.css";
import { useEffect } from "react";
import { Map } from "immutable";

function CartView() {
  const { user, cart, setCart, purchasedMovies, setPurchasedMovies } = useStoreContext();

  const checkout = async () => {
    const purchasedMoviesData = cart.toJS();
    const docRef = doc(firestore, "users", user.uid);

    try {
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const existingData = userDoc.data();
        const existingPurchases = existingData.purchasedMovies || {};

        // Update Firestore document while preserving other fields like genres
        await setDoc(docRef, {
          ...existingData, // Retain existing fields
          purchasedMovies: { ...existingPurchases, ...purchasedMoviesData },
        });
      } else {
        // Create a new document if it doesn't exist
        await setDoc(docRef, {
          purchasedMovies: purchasedMoviesData,
          genres: userGenres || [], // Ensure genres are set even if the document is new
        });
      }

      setPurchasedMovies((prev) => ({ ...prev, ...purchasedMoviesData }));

      setCart(cart.clear());
      localStorage.removeItem(`cart_${user.email}`);

      alert("Thank you for your purchase!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem(`cart_${user.email}`)) {
      setCart(Map(JSON.parse(localStorage.getItem(`cart_${user.email}`))));
    }
  }, [user.email, setCart]);

  return (
    <div className="cart-view">
      <h1>Shopping Cart</h1>
      {cart.size === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <button onClick={checkout} className="checkout-button">
          Checkout
        </button>
      )}
      <div className="cart-items">
        {cart.entrySeq().map(([key, value]) => (
          <div className="cart-item" key={key}>
            <img src={`https://image.tmdb.org/t/p/w500${value.url}`} alt={value.title} />
            <h1>{value.title}</h1>
            <button
              onClick={() => {
                setCart((prevCart) => {
                  const updatedCart = prevCart.delete(key);
                  localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart.toJS())); // Update local storage
                  return updatedCart;
                });
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CartView;
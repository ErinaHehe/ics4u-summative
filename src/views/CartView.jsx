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
        const existingPurchases = userDoc.data().purchasedMovies || {};
        await setDoc(docRef, { purchasedMovies: { ...existingPurchases, ...purchasedMoviesData } });
      } else {
        await setDoc(docRef, { purchasedMovies: purchasedMoviesData });
      }

      setPurchasedMovies((prev) => ({ ...prev, ...purchasedMoviesData }));

      setCart(cart.clear());
      localStorage.removeItem("cart");

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
  }, [])

  // make the remove button as a function to remove the movies from cart when clicked 

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
            <button onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CartView;
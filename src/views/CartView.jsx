import { useStoreContext } from "../context";
import { firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Cartview.css";

function CartView() {
  const { user, cart, setCart, purchasedMovies, setPurchasedMovies } = useStoreContext();

  const checkout = async () => {
    if (!user) {
      alert("Please log in to proceed with the purchase.");
      return;
    }

    // Convert cart to a plain JS object
    const purchasedMoviesData = cart.toJS();
    const docRef = doc(firestore, "users", user.uid);

    try {
      // Get user's Firestore document
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        // Merge existing purchased movies with the new ones
        const existingPurchases = userDoc.data().purchasedMovies || {};
        await setDoc(docRef, { purchasedMovies: { ...existingPurchases, ...purchasedMoviesData } });
      } else {
        // Create new Firestore document if it doesn't exist
        await setDoc(docRef, { purchasedMovies: purchasedMoviesData });
      }

      // Update local state for purchased movies
      setPurchasedMovies((prev) => ({ ...prev, ...purchasedMoviesData }));

      // Clear the cart and localStorage
      setCart(cart.clear());
      localStorage.removeItem("cart");

      // Display a thank-you message
      alert("Thank you for your purchase!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  // Prevent adding purchased movies to the cart
  const isMoviePurchased = (movieId) => !!purchasedMovies[movieId];

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
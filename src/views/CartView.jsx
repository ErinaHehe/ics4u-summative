import { useStoreContext } from "../context";
import "./Cartview.css";

function CartView() {
  const { cart, setCart } = useStoreContext();

  return (
    <div className="cart-view">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {
          cart.entrySeq().map(([key, value]) => {
            return (
              <div className="cart-item" key={key}>
                <img src={`https://image.tmdb.org/t/p/w500${value.url}`} />
                <h1>{value.title}</h1>
                <button onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default CartView;
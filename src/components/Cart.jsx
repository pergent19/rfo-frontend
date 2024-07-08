import React, { useContext } from 'react'
import Modal from './UI/Modal'
// import CartContext from '../store/CartContext'
// import UserProgressContext from '../store/UserProgressContext'
import Button from './UI/Button'
import { currencyFormatter } from '../util/formatting'
import { useCartContext } from "../hooks/useCartContext";
import { UserProgressContext } from '../context/UserProgressContext';
import CartItem from './CartItem'
import { useAuthContext } from "../hooks/useAuthContext";

export default function Cart() {
  const { items, dispatchCartAction } = useCartContext();
  const { user } = useAuthContext();
  const userProgressCtx = useContext(UserProgressContext);
  const prod = "https://rfo-api.onrender.com/"
  //const local =  "http://localhost:3000/"

  const cartTotal = items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

  function handleShowCheckout() {
    userProgressCtx.showCheckout();
  }

  async function handleAddMealToCart(meal) {

    const response = await fetch(
      `${prod}api/meals`,
      {
        method: "PATCH",
        body: JSON.stringify(meal),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    
    dispatchCartAction({
      type: 'ADD_ITEM', 
      meal
    })

    dispatchCartAction({ 
      type: 'SET_CART', 
      items: json 
    });

  }

  async function handleRemoveMealToCart(id) {
    const item = {  id }
    const response = await fetch(
      `${prod}api/meals/removeItem`,
      {
        method: "PATCH",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    dispatchCartAction({
      type: 'REMOVE_ITEM', 
      id
    })

    dispatchCartAction({ 
      type: 'SET_CART', 
      items: json 
    });
  }



  return (
    <Modal className='cart' open={userProgressCtx.progress === 'cart'}>
        <h2>Your Cart</h2>
        <ul>
            {items.map(item => (
              <CartItem 
                key={item.productId} 
                name={item.name} 
                quantity={item.quantity} 
                price={item.price}                 
                onIncreaase={() => handleAddMealToCart(item)}
                onDecrease={() => handleRemoveMealToCart(item.productId)}
                 />
            ))}
        </ul>
        <p className='cart-total'>{currencyFormatter.format(cartTotal)}</p>
        <p className='modal-actions'>
            <Button onClick={handleCloseCart} textOnly>Close</Button>
            {items.length > 0 && <Button onClick={handleShowCheckout}>Go to Checkout</Button>}
        </p>
    </Modal>
  )
}

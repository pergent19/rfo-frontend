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
  const apiUrl = process.env.REACT_APP_API_URL;

  const cartTotal = items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)
  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

  function handleShowCheckout() {
    userProgressCtx.showCheckout();
  }

  async function handleAddMealToCart(meal) {
    const response = await fetch(
      `${apiUrl}/api/meals`,
      {
        method: "PATCH",
        body: JSON.stringify(meal),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    await response.json();
    
    dispatchCartAction({
      type: 'ADD_ITEM', 
      meal
    })

  }

  async function handleRemoveMealToCart(id) {
    const item = {  id }
    const response = await fetch(
      `${apiUrl}/api/meals/removeItem`,
      {
        method: "PATCH",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    await response.json();

    dispatchCartAction({
      type: 'REMOVE_ITEM', 
      id
    })
  }



  return (
    <Modal className='cart' open={userProgressCtx.progress === 'cart'}>
        <div className='cart-header'>
          <h2>Your Cart</h2>
          <p>{items.length} {items.length > 1  ? 'Items' : 'Item'}</p>
        </div>

        {items.length > 0 &&         
          <ul className='cart-description'>
            <li key='desc1'>Product Details</li>
            <li key='desc2'> Quantity</li>
            <li key='desc3'>Price</li>
            <li key='desc4' className='total-header'>Total</li>
          </ul>
        }

        <ul>
            {items.map((item, index) => (
              <CartItem 
                key={index} 
                name={item.name} 
                quantity={item.quantity} 
                price={item.price}
                image={item.image}        
                onIncreaase={() => handleAddMealToCart(item)}
                onDecrease={() => handleRemoveMealToCart(item.productId)}
                 />
            ))}
        </ul>
        {items.length > 0 && <p className='cart-total'>{currencyFormatter.format(cartTotal)}</p>}
        <p className='modal-actions'>
            <Button onClick={handleCloseCart} textOnly>Close</Button>
            {items.length > 0 && <Button onClick={handleShowCheckout}>Go to Checkout</Button>}
        </p>
    </Modal>
  )
}

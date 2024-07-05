import React, { useContext } from 'react'
import Modal from './UI/Modal'
// import CartContext from '../store/CartContext'
// import UserProgressContext from '../store/UserProgressContext'
import Button from './UI/Button'
import { currencyFormatter } from '../util/formatting'
import { useCartContext } from "../hooks/useCartContext";
import { UserProgressContext } from '../context/UserProgressContext';
import CartItem from './CartItem'

export default function Cart() {
  const { items, dispatchCartAction } = useCartContext();
  const userProgressCtx = useContext(UserProgressContext)

  const cartTotal = items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

  function handleShowCheckout() {
    userProgressCtx.showCheckout();
  }

  function handleAddMealToCart(meal) {
    dispatchCartAction({
      type: 'ADD_ITEM', 
      meal
    })
  }

  function handleRemoveMealToCart(id) {
    dispatchCartAction({
      type: 'REMOVE_ITEM', 
      id
    })
  }



  return (
    <Modal className='cart' open={userProgressCtx.progress === 'cart'}>
        <h2>Your Cart</h2>
        <ul>
            {items.map(item => (
              <CartItem 
                key={item.id} 
                name={item.name} 
                quantity={item.quantity} 
                price={item.price}                 
                onIncreaase={() => handleAddMealToCart(item)}
                onDecrease={() => handleRemoveMealToCart(item.id)}
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

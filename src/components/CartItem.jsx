import React from 'react'
import { currencyFormatter } from '../util/formatting'

export default function CartItem({ name, quantity, price, image, onIncreaase, onDecrease}) {
  const totalPerItem = price * quantity;
  const apiUrl = process.env.REACT_APP_API_URL;
  return (
    <li className='cart-item'>
        <p className='cart-prod-desc-container'>
          <span className='cart-img-container'>
            <img className='cart-img' src={`${apiUrl}/${image}`} alt={name} />
          </span>
         <span>{name}</span>
         </p>
        <p className='cart-item-actions'>
            <button onClick={onDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={onIncreaase}>+</button>
        </p>
        <p>{currencyFormatter.format(price)}</p>
        <p className='total-col'>{currencyFormatter.format(totalPerItem)}</p>
    </li>
  )
}

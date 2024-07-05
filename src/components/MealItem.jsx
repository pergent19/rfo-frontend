// import React, { useContext } from 'react'
import { currencyFormatter } from '../util/formatting'
import Button from './UI/Button'
// import CartContext from '../store/CartContext'
import { useCartContext } from "../hooks/useCartContext";

export default function MealItem({meal}) {
  const { dispatchCartAction } = useCartContext();
  const prod = "https://rfo-api.onrender.com/"
  const local = "http://localhost:3000/"


  function handleAddMealToCart() {
    dispatchCartAction({
      type: 'ADD_ITEM', 
      meal
    })
  }
  
  return (
    <li className='meal-item'>
        <article>
          <div className="header">
            <img src={`${prod}${meal.image}`} alt={meal.name} />
              <div className="icon">
              <a href="#home"><i className="fa fa-heart-o"></i></a>
              </div>
            </div>
            <div>
                <h3>{meal.name}</h3>
                <p className='meal-item-price'>{currencyFormatter.format(meal.price)}</p>
                <p className='meal-item-description'>{meal.description}</p>
            </div>
            <p className='meal-item-actions'>
                <Button onClick={handleAddMealToCart}>Add to Cart</Button>
            </p>
        </article>
    </li>
  )
}

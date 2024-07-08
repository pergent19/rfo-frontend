// import React, { useContext } from 'react'
import { currencyFormatter } from '../util/formatting'
import Button from './UI/Button'
// import CartContext from '../store/CartContext'
import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";

export default function MealItem({meal}) {
  const { dispatchCartAction } = useCartContext();
  const prod = "https://rfo-api.onrender.com/"
  const { user } = useAuthContext();
  //const local = "http://localhost:3000/"


  async function handleAddMealToCart() {

    const response = await fetch(
      //"http://localhost:3000/api/meals",
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

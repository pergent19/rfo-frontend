import { currencyFormatter } from '../util/formatting'
import Button from './UI/Button'
import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";

export default function MealItem({meal}) {
  const { dispatchCartAction } = useCartContext();
  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;


  async function handleAddMealToCart() {
    meal.productId = meal.id;
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

    // dispatchCartAction({ 
    //   type: 'SET_CART', 
    //   items: json 
    // });
  }
  
  return (
    <li className='meal-item'>
        <article>
          <div className="header">
            <img src={`${apiUrl}/${meal.image}`} alt={meal.name} />
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

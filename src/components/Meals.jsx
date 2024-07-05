import {useEffect, useState} from 'react'
import MealItem from './MealItem';

export default function Meals() {
    const[loadedMeals, setLoadedMeals] = useState([]);
    const prod = "https://rfo-api.onrender.com/api/meals/get"
    const local = "http://localhost:3000/api/meals/get"

    useEffect(() => {
        async function fetchMeals() {
            const response = await fetch(prod);
            if(!response.ok) {
                //..
            }
        
            const meals = await response.json();
            setLoadedMeals(meals);
        }

        fetchMeals();
    }, []);

    return (
        <ul id='meals'>{loadedMeals.map(meal => (
            <MealItem key={meal.id} meal={meal} />
        ))}</ul>
    )
}

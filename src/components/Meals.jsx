import {useEffect, useState} from 'react'
import MealItem from './MealItem';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Meals() {
    const[loadedMeals, setLoadedMeals] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const { user } = useAuthContext();

    useEffect(() => {
        async function fetchMeals() {
            //const response = await fetch(prod);
            const response = await fetch(`${apiUrl}/api/meals/get`, {
                method: "get",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if(!response.ok) {
                //..
            }
        
            const meals = await response.json();
            setLoadedMeals(meals);
        }

        fetchMeals();
    }, [user, apiUrl]);

    return (
        <ul id='meals'>{loadedMeals.map(meal => (
            <MealItem key={meal.id} meal={meal} />
        ))}</ul>
    )
}

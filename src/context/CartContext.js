import { useReducer, createContext, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const CartContext = createContext();

const cartReducer = (state, action) => {
    
    if (action.type === 'SET_CART') {
        return { items: action.items };
    }

    if (action.type === 'ADD_ITEM') {
        const existingCartItemIndex = state.items.findIndex((item) => item.id === action.meal.productId);

        const updatedItems = [...state.items];
        
        if (existingCartItemIndex > -1) {
            const existingItem = state.items[existingCartItemIndex]
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1
            }
            updatedItems[existingCartItemIndex] = updatedItem
        } else {
            updatedItems.push({...action.meal, quantity: 1});
        }

        return { ...state, items: updatedItems }
    }

    if (action.type === 'REMOVE_ITEM') {
        //.. remove an item from the state
        const existingCartItemIndex = state.items.findIndex((item) => item.productId === action.id);

        const existingCartItem = state.items[existingCartItemIndex];
        const updatedItems = [...state.items];

        if (existingCartItem.quantity === 1) {
            updatedItems.splice(existingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1
            }

            updatedItems[existingCartItemIndex] = updatedItem
        }

        return { ...state, items: updatedItems }
    }

    if (action.type === 'CLEAR_CART') {
        return { ...state, items: [] }
    }

    return state;
};

export const CartContextProvider = ({ children }) => {
  const [ cart, dispatchCartAction ] = useReducer(cartReducer, {items: []});
  //const local = "http://localhost:3000/api/meals"
  const prod = "https://rfo-api.onrender.com/"
  const { user } = useAuthContext();
  
  useEffect(() => {
    const getCart = async () => {
        if (user && user.token) {
            try {
                const response = await fetch(`${prod}api/meals`, {
                    method: "get",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const json = await response.json();
                    dispatchCartAction({ type: 'SET_CART', items: json });
            } catch (error) {
                console.error("Failed to fetch cart items:", error);
            }
        }
    };

    getCart();
}, [user, prod]);

  console.log("CartContext state:", cart);

  return (
    <CartContext.Provider value={{ ...cart, dispatchCartAction }}>
      {children}
    </CartContext.Provider>
  );
};

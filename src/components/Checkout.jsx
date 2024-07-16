import React, { useContext, useState } from 'react'
import Modal from './UI/Modal'
import Input from './UI/Input';
import { CartContext } from '../context/CartContext';
import { useCartContext } from "../hooks/useCartContext";
import { UserProgressContext } from '../context/UserProgressContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Button from './UI/Button';
import Error from './Error';

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const { dispatchCartAction } = useCartContext();
  const userProgressCtx = useContext(UserProgressContext);
  const { user } = useAuthContext();

  const [data, setData] = useState({})
  const [error, setError] = useState()
  const [emptyFields, setEmptyFields] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  //const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

  function clearData() {
    setData({});
  }

  async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("hi")
    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());
  
    const order = {
      items: cartCtx.items,
      customer: customerData
    };
  
    // setData(order);
    setIsLoading(true); // Set loading state while submitting
  
    try {
      const response = await fetch(
        "http://localhost:3000/api/order/create",
        {
          method: "POST",
          body: JSON.stringify(order),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
  
      const json = await response.json();
      console.log(json)
      setData(json);
  
      if (!response.ok) {
        setError(json.message);
        setEmptyFields(json.emptyFields);
      } else {
        setError(null);
        setEmptyFields([]);
  
        // Handle successful submission, perhaps show success message or update UI
        console.log("Order submitted successfully:", json);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setError("Failed to submit order. Please try again later.");
    } finally {
      setIsLoading(false); // Reset loading state after submission
    }
  }

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  async function handleFinish() {
    userProgressCtx.hideCheckout();
    clearData();
    //need to update the MongoDB backend
    const response = await fetch(
      "http://localhost:3000/api/order/clear",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      console.log('Cart cleared successfully', result);
      // Update the frontend state to reflect the cleared cart
    } else {
      console.error('Failed to clear cart', response.statusText);
    }
    dispatchCartAction({
      type: 'CLEAR_CART'
  })
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>Close</Button>
      <Button type="submit">Submit Order</Button>
    </>
  )

  if(isLoading) {
    actions = <span>Sending order data...</span>
  }


  if(Object.keys(data).length >  0 && error === null) {
    return(
      <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
        <h2>Success!</h2>
        <p>Your order was submitted successfully</p>
        <p>We will get back to you with more detauks via email within the next week.</p>
        <p className='modal-actions'>
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    )
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <Input label="Full Name" id="name" type="text" className={emptyFields.includes("name") ? "error" : ""} />
        <Input label="E-mail Address" id="email" type="email" className={emptyFields.includes("email") ? "error" : ""} />
        <Input label="Street" id="street" type="text" className={emptyFields.includes("street") ? "error" : ""} />
        <div className='control-row'>
          <Input label="Postal Code" id="postal-code" type="text" className={emptyFields.includes("postal") ? "error" : ""} />
          <Input label="City" id="city" type="text" className={emptyFields.includes("city") ? "error" : ""} />
        </div>

        {error && <Error title="Failed to submit order" message={error} />}

        <p className='modal-actions'>
          {actions}
        </p>
      </form>
    </Modal>
  )
}

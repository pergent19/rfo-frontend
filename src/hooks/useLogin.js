import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const prod = "https://rfo-api.onrender.com/api/user/login"
  //const local = "http://localhost:3000/api/user/login"

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    // console.log(process.env.REACT_APP_API_URL);
    const response = await fetch(
      prod,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const json = await response.json();
    console.log(json)
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      //saving user token to local storage
      localStorage.setItem("user", JSON.stringify(json));

      //update the auth context
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
    }
  };
  return { login, error, isLoading };
};

import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import Button from "./UI/Button";
import { useCartContext } from "../hooks/useCartContext";
import { UserProgressContext } from "../context/UserProgressContext";
import { useContext } from "react";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { items } = useCartContext();

  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems= items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);


  const handleClick = () => {
    logout();
  };

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>React Food Order</h1>
        </Link>
        <nav>
        {user && (
            <Button onClick={handleShowCart} className="cart-button" textOnly>
              <i className="fas fa-shopping-cart">
                {totalCartItems > 0 && (
                  <span className="cart-count">{totalCartItems}</span>
                )}
              </i>
            </Button>
          )}
          {user && (<div>
            {/* <span>{user.email}</span> */}
            <button onClick={handleClick}>Log out</button>
          </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

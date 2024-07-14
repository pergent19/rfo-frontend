import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  const redirectToRoute = (routePath) => {
    navigate(routePath); // Redirects to the specified route
  };
  return (
    <div className="login-page">
      <form className="login" onSubmit={handleSubmit}>
        <h3>Login </h3>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="abc@gmail.com"
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          placeholder="password"
          required
        />
        <button type="button" className="create-account-btn" onClick={() => redirectToRoute('/signup')}>Create account</button>
        <button disabled={isLoading}>Log In</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;

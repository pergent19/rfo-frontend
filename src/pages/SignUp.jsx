import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await signup(email, password, confirmPassword);
  };
  return (
    <div className="signup-page">
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign Up </h3>
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
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirm-password"
          placeholder="confirm password"
          required
        />
        <button type="submit" disabled={isLoading}>
          Sign Up
        </button>
        <div className="login-account-btn">
          <p>Already have an account? <Link to="/login"><span>Login here</span></Link></p>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>

  );
};

export default SignUp;

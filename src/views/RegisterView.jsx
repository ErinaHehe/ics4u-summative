import "./RegisterView.css";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";

function RegisterView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useStoreContext();
  const navigate = useNavigate();

  const registerByEmail = async (event) => {
    event.preventDefault();

    try {
      const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      setUser(user);
      navigate('/movies');
    } catch (error) {
      alert("Error registering!");
    }
  };

  const registerByGoogle = async () => {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      navigate('/movies');
    } catch {
      alert("Error registering!");
    }
  }

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Create an Account</h2>
        <form onSubmit={(e) => registerByEmail(e)}>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <a href="#">Login</a>
        </p>
        <button onClick={() => registerByGoogle()} className="register-button">Register by Google</button>
      </div>
    </div>
  );
}

export default RegisterView;
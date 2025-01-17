import "./RegisterView.css";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";

function RegisterView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const { setUser, setUserGenres, purchasedMovies, setPurchasedMovies } = useStoreContext();
  const navigate = useNavigate();

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres((prev) =>
      checked ? [...prev, value] : prev.filter((genre) => genre !== value)
    );
  };

  const registerByEmail = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: firstName });
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, {
        genres: selectedGenres,
        moviesPurchased: purchasedMovies,
        //cart: [],
      });

      setUser(user);
      setUserGenres(selectedGenres);
      navigate("/movies");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else {
        alert("Error registering: " + error.message);
      }
    }
  };

  const registerByGoogle = async () => {
    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres.");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const docSnapshot = await setDoc(userDocRef, {
        genres: selectedGenres,
        moviesPurchased: purchasedMovies,
        // cart: [],
      });

      setUser(user);
      setUserGenres(selectedGenres);
      navigate("/movies");
    } catch (error) {
      alert("Error registering with Google: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Create an Account</h2>
        <form onSubmit={registerByEmail}>
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

          <fieldset>
            <legend>Select Your Favorite Genres (at least 10)</legend>
            {genres.map((genre) => (
              <div key={genre}>
                <label>
                  <input
                    type="checkbox"
                    value={genre}
                    onChange={handleCheckboxChange}
                  />
                  {genre}
                </label>
              </div>
            ))}
          </fieldset>

          <button type="submit" className="register-button">
            Register with Email
          </button>
          <button type="button" onClick={registerByGoogle} className="register-button">
            Register with Google
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterView;

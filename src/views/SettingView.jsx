import "./SettingView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../context";
import { auth, firestore } from "../firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

function SettingView() {
  const { user, setUser, userGenres, setUserGenres } = useStoreContext();
  const [formData, setFormData] = useState({
    firstName: user?.displayName?.split(" ")[0] || "",
    lastName: user?.displayName?.split(" ")[1] || "",
    selectedGenres: userGenres || [],
    password: "",
    confirmPassword: "",
  });
  const [pastPurchases, setPastPurchases] = useState(null);

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Family", "Fantasy",
    "History", "Horror", "Music", "Mystery", "Sci-Fi", "Thriller", "War", "Western",
  ];

  useEffect(() => {
    const fetchPastPurchases = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            setPastPurchases(docSnapshot.data().purchasedMovies || []);
          }
        } catch (error) {
          console.error("Error fetching past purchases:", error);
        }
      }
    };
    fetchPastPurchases();
    console.log(pastPurchases)
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      selectedGenres: checked
        ? [...prev.selectedGenres, value]
        : prev.selectedGenres.filter((genre) => genre !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, selectedGenres, password, confirmPassword } = formData;

    if (auth.currentUser?.providerData[0]?.providerId !== "password") {
      alert("Only users who signed in via email can update these settings.");
      return;
    }

    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres.");
      return;
    }

    try {
      if (firstName || lastName) {
        const displayName = `${firstName} ${lastName}`.trim();
        await updateProfile(auth.currentUser, { displayName });
        setUser({ ...user, displayName });
      }

      if (password && password === confirmPassword) {
        await updatePassword(auth.currentUser, password);
      } else if (password && password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, { genres: selectedGenres });
      setUserGenres(selectedGenres);

      alert("Settings updated successfully!");
    } catch (error) {
      alert(`Error updating settings: ${error.message}`);
    }
  };

  return (
    <div className="settings-container">
      <div className="form-container">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!user?.emailVerified}
          />

          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!user?.emailVerified}
          />

          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={!user?.emailVerified}
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={!user?.emailVerified}
          />

          <fieldset>
            <legend>Update Your Favorite Genres (at least 10)</legend>
            {genres.map((genre) => (
              <div key={genre}>
                <label>
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.selectedGenres.includes(genre)}
                    onChange={handleCheckboxChange}
                  />
                  {genre}
                </label>
              </div>
            ))}
          </fieldset>

          <h2>Past Purchases</h2>
          <ul>
            {pastPurchases ? (
              Object.entries(pastPurchases).map(([key, value]) => (<li key={key}>{value.title}</li>))
            ) : (
              <p>No past purchases found.</p>
            )}
          </ul>

          <button type="submit" className="settings-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default SettingView;
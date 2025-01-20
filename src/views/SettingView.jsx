import "./SettingView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../context";
import { auth, firestore } from "../firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

function SettingView() {
  const { user, setUser, userGenres, setUserGenres } = useStoreContext();
  const [formData, setFormData] = useState({
    firstName: user?.displayName?.split(" ")[0] || "",
    lastName: user?.displayName?.split(" ")[1] || "",
    selectedGenres: userGenres || [],
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });
  const [pastPurchases, setPastPurchases] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const reauthenticate = async (currentPassword) => {
    const userCredential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, userCredential);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, selectedGenres, password, confirmPassword, currentPassword } = formData;

    if (!auth.currentUser) {
      alert("User is not authenticated.");
      return;
    }

    const isEmailProvider = auth.currentUser.providerData.some(
      (provider) => provider.providerId === "password"
    );

    if (!isEmailProvider) {
      alert("Only users signed in via email can update their name and password.");
      return;
    }

    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres.");
      return;
    }

    if (password && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (password) {
        await reauthenticate(currentPassword);
      }

      const displayName = `${firstName} ${lastName}`.trim();
      if (displayName && displayName !== user?.displayName) {
        await updateProfile(auth.currentUser, { displayName });
        setUser((prev) => ({ ...prev, displayName }));
      }

      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, { genres: selectedGenres });
      setUserGenres(selectedGenres);

      alert("Settings updated successfully!");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("The current password is incorrect.");
      } else if (error.code === "auth/requires-recent-login") {
        alert("Please log out and log back in to perform this action.");
      } else {
        console.error("Error updating settings:", error);
        alert(`Error updating settings: ${error.message}`);
      }
    } finally {
      setLoading(false);
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
            disabled={loading}
          />

          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={loading}
          />

          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            disabled={loading}
            required={formData.password}
          />

          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
          />

          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
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
                    disabled={loading}
                  />
                  {genre}
                </label>
              </div>
            ))}
          </fieldset>

          <h2>Past Purchases</h2>
          <ul>
            {pastPurchases ? (
              Object.entries(pastPurchases).map(([key, value]) => (
                <li key={key}>{value.title}</li>
              ))
            ) : (
              <p>No past purchases found.</p>
            )}
          </ul>

          <button type="submit" className="settings-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SettingView;
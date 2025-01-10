import "./SettingView.css";
import { useState } from "react";
import { Set } from 'immutable';

function SettingsView() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    selectedGenres: Set(),
  });

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Family", "Fantasy",
    "History", "Horror", "Music", "Mystery", "Sci-Fi", "Thriller", "War", "Western"
  ];

  /* if (user.email) { something like this
  } */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferredGenres: checked
        ? [...prev.preferredGenres, value]
        : prev.preferredGenres.filter((genre) => genre !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, preferredGenres } = formData;

    if (!firstName || !lastName || preferredGenres.length === 0) {
      alert("Please fill out all fields and select at least ten genre.");
      return;
    }

    setUser({ ...user, firstName, lastName, preferredGenres });
    alert("Settings updated successfully!");
  };

  return (
    <div className="settings-container">
      <div className="form-container">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="first-name">First name</label>
          <input type="text" id="first-name" name="firstName" value={formData.firstName} onChange={(e) => handleInputChange(e)} />

          <label htmlFor="last-name">Last name</label>
          <input type="text" id="last-name" name="lastName" value={formData.lastName} onChange={(e) => handleInputChange(e)} />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleInputChange(e)} disabled />

          <fieldset>
            <legend>Update Your Favorite Genres (at least 10)</legend>
            {genres.map((genre) => (
              <div key={genre}>
                <label>
                  <input
                    type="checkbox"
                    value={genre}
                    onChange={(e) => handleCheckboxChange(e)}
                  />
                  {genre}
                </label>
              </div>
            ))}
          </fieldset>

          <button type="submit" className="settings-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default SettingsView;
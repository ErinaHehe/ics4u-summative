import "./RegisterView.css";
import { useState } from "react";
import { Set } from 'immutable';
import { useStoreContext } from "../context";
import { useNavigate } from "react-router";

function RegisterView() {
  const navigate = useNavigate();
  const { setUser } = useStoreContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
    selectedGenres: Set(),
  });

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Family", "Fantasy",
    "History", "Horror", "Music", "Mystery", "Sci-Fi", "Thriller", "War", "Western"
  ];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      selectedGenres: checked ? prev.selectedGenres.add(value) : prev.selectedGenres.delete(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, rePassword, selectedGenres } = formData;

    if (!firstName || !lastName || !email || !password || !rePassword) {
      alert("All fields must be filled!");
      return;
    }

    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }

    if (selectedGenres.size < 10) {
      alert("Please select at least 10 genres.");
      return;
    }

    setUser(formData);
    navigate("/movies");
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Create an Account</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="first-name">First name</label>
          <input type="text" id="first-name" name="firstName" value={formData.firstName} onChange={(e) => handleInputChange(e)} required />

          <label htmlFor="last-name">Last name</label>
          <input type="text" id="last-name" name="lastName" value={formData.lastName} onChange={(e) => handleInputChange(e)} required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleInputChange(e)} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={(e) => handleInputChange(e)} required />

          <label htmlFor="rePassword">Re-enter Password</label>
          <input type="password" id="rePassword" name="rePassword" value={formData.rePassword} onChange={(e) => handleInputChange(e)} required />

          <fieldset>
            <legend>Select Your Favorite Genres (at least 10)</legend>
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

          <input type="submit" className="register-button" value="Register" />
        </form>
        <p className="login-link">Already have an account? <a href="#">Login</a></p>
      </div>
    </div>
  )
}

export default RegisterView;
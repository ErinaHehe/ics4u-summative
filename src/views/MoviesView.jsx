import { Outlet, useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./MoviesView.css";

function MoviesView() {
  const navigate = useNavigate();
  const { user, setUser, genres, setGenres } = useStoreContext();

  function logout() {
    setUser(null);
    signOut(auth);
    navigate("/");
  }

  function cart() {
    navigate("/cart")
  }

  function setting() {
    navigate("/setting")
  }

  const favGenres = [
    { genre: "Action", id: 28 },
    { genre: "Adventure", id: 12 },
    { genre: "Animation", id: 16 },
    { genre: "Comedy", id: 35 },
    { genre: "Crime", id: 80 },
    { genre: "Family", id: 10751 },
    { genre: "Fantasy", id: 14 },
    { genre: "History", id: 36 },
    { genre: "Horror", id: 27 },
    { genre: "Music", id: 10402 },
    { genre: "Mystery", id: 9648 },
    { genre: "Sci-Fi", id: 878 },
    { genre: "Thriller", id: 53 },
    { genre: "War", id: 10752 },
    { genre: "Western", id: 37 },
  ];

    function handleGenreClick(id) {
      navigate(`/movies/genre/${id}`);
    }

    return (
      <div className="app-container">
        <div className="header">
          <h1>{`Hello ${user.firstname}!`}</h1>
          <button onClick={() => setting()} className="logout-button">Setting</button>
          <button onClick={() => cart()} className="logout-button">Cart</button>
          <button onClick={() => logout()} className="logout-button">Logout</button>

        </div>
        <div className="filter">
          <h3>Genres</h3>
          <ul id="with_favGenres" className="multi_select text">
            {favGenres.map((genre) => (
              <li
                key={genre.id}
                className="genre-item"
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.genre}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    );
  }

  export default MoviesView;
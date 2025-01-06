import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./HomeView.css";

function HomeView() {
  const [movies, setMovies] = useState([]);

  function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  useEffect(() => {
    async function getMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
        );

        const threeMovies = [];
        shuffle(response.data.results);
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());

        setMovies(threeMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    getMovies();
  }, []);

  return (
    <div className="hero">
      <div className="overlay"></div>
      <header>
        <div className="buttons">
          <Link to={`/register`} className="button">Sign Up</Link>
          <Link to={`/login`} className="button">Sign In</Link>
        </div>
      </header>
      <div className="hero-content">
        <h1>Infinite movies, TV shows, and more</h1>
        <p>Starts at $999.99. No Refunds.</p>
      </div>

      <div className="feature">
        <h2 className="featured-header">Trending Now</h2>
        <div className="movies-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
            </div>
          ))}
        </div>
      </div>

      <footer>
        <p className="phone-number">Questions? Call 1-123-456-7890</p>
        <a href="https://www.linkedin.com/in/erina-he-b82827303/" target="_blank" rel="noopener noreferrer">Erina's LinkedIn</a>
        <p className="copyright">© 2024 Flixify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomeView;
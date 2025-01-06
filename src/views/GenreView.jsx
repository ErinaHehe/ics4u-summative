import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./GenreView.css";

function GenreView() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [page, setPage] = useState(1);
  const { genre_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async function fetchGenres() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list`,
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_KEY,
            },
          }
        );
        const genreMap = response.data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenres(genreMap);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async function getMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie`,
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_KEY,
              with_genres: genre_id,
              page: page,
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    })();
  }, [genre_id, page]);

  function loadMovie(id) {
    navigate(`/movies/details/${id}`);
  }

  function goToNextPage() {
    setPage((prevPage) => prevPage + 1);
  }

  function goToPreviousPage() {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  }

  const genreName = genres[genre_id] || `Genre ${genre_id}`;

  return (
    <div className="genre-view">
      <h1>{genreName}</h1>
      <div className="movies-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => loadMovie(movie.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <h3>{movie.title}</h3>
            </div>
          ))
        ) : (
          <p>Loading movies...</p>
        )}
      </div>
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={goToNextPage}>Next</button>
      </div>
    </div>
  );
}

export default GenreView;
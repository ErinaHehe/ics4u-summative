import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStoreContext } from "../context";
import "./DetailView.css";

function DetailView() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const { user, cart, setCart } = useStoreContext();
  
  const addToCart = () => {
    setCart((prevCart) => {
      const cart = prevCart.set(params.id, { title: movie.original_title, url: movie.poster_path });
      localStorage.setItem(user.uid, JSON.stringify(cart.toJS()));
      return cart;
    });
  }

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const detailsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
        );
        setMovieDetails(detailsResponse.data);

        const trailersResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
        );
        const filteredTrailers = trailersResponse.data.results.filter(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailers(filteredTrailers);
      } catch (error) {
        console.error("Error fetching movie details or trailers:", error);
      }
    }

    fetchMovieDetails();
  }, [id]);

  const handleBuyClick = (movie) => {
    setCart((prevCart) =>
      prevCart.has(movie.id)
        ? prevCart.delete(movie.id)
        : prevCart.set(movie.id, { title: movie.title, url: movie.poster_path })
    );
  };

  if (!movieDetails) {
    return <p>Loading movie details...</p>;
  }

  return (
    <div className="detail-view">
      <div className="movie-header">
        <img
          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
          alt={movieDetails.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h1>{movieDetails.title}</h1>
          <p><strong>Overview:</strong> {movieDetails.overview}</p>
          <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
          <p><strong>Runtime:</strong> {movieDetails.runtime} minutes</p>
          <p><strong>Vote Average:</strong> {movieDetails.vote_average}</p>
          <button
            onClick={() => handleBuyClick(movieDetails)}
            className="buy-button"
          >
            {cart.has(movieDetails.id) ? "Added" : "Buy"}
          </button>
        </div>
      </div>
      <div className="movie-trailers">
        <h2>Trailers</h2>
        {trailers.length > 0 ? (
          trailers.map((trailer) => (
            <div key={trailer.id} className="trailer">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p>{trailer.name}</p>
            </div>
          ))
        ) : (
          <p>No trailers available.</p>
        )}
      </div>
    </div>
  );
}

export default DetailView;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/index.jsx";
import HomeView from "../src/views/HomeView.jsx";
import DetailView from "../src/views/DetailView.jsx";
import GenreView from "../src/views/GenreView.jsx";
import LoginView from "../src/views/LoginView.jsx";
import MoviesView from "../src/views/MoviesView.jsx";
import RegisterView from "../src/views/RegisterView.jsx";
import CartView from "../src/views/CartView.jsx";
import SettingView from "../src/views/SettingView.jsx";
import ErrorView from "./views/ErrorView";
import ProtectedRoutes from "./util/ProtectedRoutes";
import './App.css';

function App() {

  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/cart" element={<CartView />} />
            <Route path="/setting" element={<SettingView />} />
            <Route path="/movies" element={<MoviesView />}>
              <Route path="/movies/genre/:genre_id" element={<GenreView />} />
              <Route path="/movies/details/:id" element={<DetailView />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
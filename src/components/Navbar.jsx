import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  const handleRemoveFavorite = (favorite) => {
    dispatch({
      type: "remove_favorite",
      payload: favorite,
    });
  };

  return (
    <nav className="navbar navbar-light bg-light px-4">
      <div className="container">
        <Link to="/" className="navbar-brand text-decoration-none fw-bold">
          STAR WARS
        </Link>

        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Favorites {store.favorites.length}
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            {store.favorites.length === 0 ? (
              <li>
                <span className="dropdown-item text-muted">No favorites yet</span>
              </li>
            ) : (
              store.favorites.map((favorite) => (
                <li
                  key={`${favorite.type}-${favorite.uid}`}
                  className="dropdown-item d-flex justify-content-between align-items-center"
                >
                  <span>{favorite.name}</span>
                  <button
                    className="btn btn-sm border-0 bg-transparent"
                    onClick={() => handleRemoveFavorite(favorite)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
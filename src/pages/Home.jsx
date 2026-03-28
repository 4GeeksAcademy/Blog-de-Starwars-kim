import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "set_loading", payload: true });
      dispatch({ type: "set_error", payload: null });

      try {
        const [peopleRes, planetsRes, vehiclesRes] = await Promise.all([
          fetch("https://www.swapi.tech/api/people?page=1&limit=10"),
          fetch("https://www.swapi.tech/api/planets?page=1&limit=10"),
          fetch("https://www.swapi.tech/api/vehicles?page=1&limit=10"),
        ]);

        if (!peopleRes.ok || !planetsRes.ok || !vehiclesRes.ok) {
          throw new Error("No se pudieron cargar los datos de SWAPI");
        }

        const peopleData = await peopleRes.json();
        const planetsData = await planetsRes.json();
        const vehiclesData = await vehiclesRes.json();

        dispatch({
          type: "set_characters",
          payload: peopleData.results || [],
        });

        dispatch({
          type: "set_planets",
          payload: planetsData.results || [],
        });

        dispatch({
          type: "set_vehicles",
          payload: vehiclesData.results || [],
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: "set_error", payload: error.message });
      } finally {
        dispatch({ type: "set_loading", payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  const isFavorite = (uid, type) => {
    return store.favorites.some((fav) => fav.uid === uid && fav.type === type);
  };

  const toggleFavorite = (item, type) => {
    const favorite = {
      uid: item.uid,
      name: item.name,
      type,
    };

    if (isFavorite(item.uid, type)) {
      dispatch({
        type: "remove_favorite",
        payload: favorite,
      });
    } else {
      dispatch({
        type: "add_favorite",
        payload: favorite,
      });
    }
  };

  const renderCards = (items, type, title) => (
    <div className="mb-5">
      <h2 className="text-danger mb-3">{title}</h2>
      <div className="d-flex overflow-auto gap-3 pb-3">
        {items.map((item) => (
          <div key={item.uid} className="card" style={{ minWidth: "18rem" }}>
            <img
              src="https://placehold.co/400x200"
              className="card-img-top"
              alt={item.name}
            />
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text text-muted">UID: {item.uid}</p>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <Link to={`/details/${type}/${item.uid}`} className="btn btn-outline-primary">
                  Learn more!
                </Link>

                <button
                  className={`btn ${
                    isFavorite(item.uid, type) ? "btn-warning" : "btn-outline-warning"
                  }`}
                  onClick={() => toggleFavorite(item, type)}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      {store.loading && <p>Cargando datos...</p>}
      {store.error && <p className="text-danger">{store.error}</p>}

      {!store.loading && !store.error && (
        <>
          {renderCards(store.characters, "people", "Characters")}
          {renderCards(store.planets, "planets", "Planets")}
          {renderCards(store.vehicles, "vehicles", "Vehicles")}
        </>
      )}
    </div>
  );
};

export { Home };
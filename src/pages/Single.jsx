import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = () => {
  const { type, uid } = useParams();
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const fetchSingleItem = async () => {
      dispatch({ type: "set_loading", payload: true });
      dispatch({ type: "set_error", payload: null });

      try {
        const response = await fetch(`https://www.swapi.tech/api/${type}/${uid}`);

        if (!response.ok) {
          throw new Error("No se pudo cargar el detalle");
        }

        const data = await response.json();

        dispatch({
          type: "set_single_item",
          payload: data.result || null,
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: "set_error", payload: error.message });
      } finally {
        dispatch({ type: "set_loading", payload: false });
      }
    };

    fetchSingleItem();
  }, [type, uid, dispatch]);

  const properties = store.singleItem?.properties || {};

  return (
    <div className="container mt-5 mb-5">
      <Link to="/" className="btn btn-secondary mb-4">
        Back home
      </Link>

      {store.loading && <p>Cargando detalle...</p>}
      {store.error && <p className="text-danger">{store.error}</p>}

      {!store.loading && !store.error && store.singleItem && (
        <>
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img
                src="https://placehold.co/800x600"
                alt={properties.name}
                className="img-fluid"
              />
            </div>
            <div className="col-md-6 text-center">
              <h1>{properties.name}</h1>
              <p>
                This is a detailed view for {properties.name}. Here you can later
                improve the UI to look closer to the mockup.
              </p>
            </div>
          </div>

          <hr className="border-danger" />

          <div className="row text-center text-danger">
            {Object.entries(properties).slice(0, 6).map(([key, value]) => (
              <div key={key} className="col">
                <h6>{key.replaceAll("_", " ")}</h6>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
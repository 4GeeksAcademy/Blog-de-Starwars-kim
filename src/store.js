export const initialStore = () => {
  return {
    characters: [],
    planets: [],
    vehicles: [],
    favorites: [],
    singleItem: null,
    loading: false,
    error: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_loading":
      return {
        ...store,
        loading: action.payload,
      };

    case "set_error":
      return {
        ...store,
        error: action.payload,
      };

    case "set_characters":
      return {
        ...store,
        characters: action.payload,
      };

    case "set_planets":
      return {
        ...store,
        planets: action.payload,
      };

    case "set_vehicles":
      return {
        ...store,
        vehicles: action.payload,
      };

    case "set_single_item":
      return {
        ...store,
        singleItem: action.payload,
      };

    case "add_favorite": {
      const exists = store.favorites.some(
        (fav) => fav.uid === action.payload.uid && fav.type === action.payload.type
      );

      if (exists) return store;

      return {
        ...store,
        favorites: [...store.favorites, action.payload],
      };
    }

    case "remove_favorite":
      return {
        ...store,
        favorites: store.favorites.filter(
          (fav) => !(fav.uid === action.payload.uid && fav.type === action.payload.type)
        ),
      };

    default:
      return store;
  }
}
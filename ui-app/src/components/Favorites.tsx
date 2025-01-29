import { useState, useEffect } from "react";
import axios from "axios";
import "./FilmList.css";

const Favorites = () => {
    interface Film {
        id_film: number;
        title: string;
        year: number;
        duration?: string;
        rating?: number;
        votes?: number;
        score?: number;
        critics_score?: number;
        user_score?: number;
    }

    const [films, setFilms] = useState<Film[]>([]);
    const [favourites, setFavourites] = useState<Set<number>>(new Set());
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found");
            setIsLoading(false);
            return;
        }

        setAuthToken(token);

        // Pobieramy listę wszystkich filmów
        axios.get("http://localhost:8000/api/film-list/")
            .then((response) => {
                setFilms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching films:", error);
            });

        // Pobieramy listę ID filmów polubionych przez użytkownika
        axios.get("http://localhost:8000/api/favorites/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const favouriteIds: Set<number> = new Set(
                    response.data.map((fav: { id_film: number }) => fav.id_film)
                );
                setFavourites(favouriteIds);
            })
            .catch((error) => {
                console.error("Error fetching favorites:", error);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const removeFromFavorites = (id_film: number) => {
        if (!authToken) return;

        axios.delete(`http://localhost:8000/api/favorites/${id_film}/`, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(() => {
                setFavourites((prevFavourites) => {
                    const updatedFavourites = new Set(prevFavourites);
                    updatedFavourites.delete(id_film);
                    return updatedFavourites;
                });
            })
            .catch((error) => {
                console.error("Error removing from favorites:", error);
            });
    };

    if (isLoading) return <p>Loading...</p>;

    const favouriteFilms = films.filter(film => favourites.has(film.id_film));

    return (
        <div className="film-container">
            <h1>Your Favorite Films</h1>

            {favouriteFilms.length > 0 ? (
                <div className="film-list">
                    {favouriteFilms.map((film) => (
                        <div className="film-item" key={film.id_film}>
                            <h2>{film.title}</h2>
                            <p>Year: {film.year}</p>
                            {film.duration && <p>Duration: {film.duration}</p>}
                            {film.rating && <p>IMDb Rating: {film.rating}</p>}
                            {film.votes && <p>IMDb Votes: {film.votes.toLocaleString()}</p>}
                            {film.score && <p>Filmweb Score: {film.score}</p>}
                            {film.critics_score && <p>RT Critics' Score: {film.critics_score}%</p>}
                            {film.user_score && <p>RT User Score: {film.user_score}%</p>}
                            
                            <button className="remove-button" onClick={() => removeFromFavorites(film.id_film)}>
                                Remove from Favorites
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No favorite films found.</p>
            )}
        </div>
    );
};

export default Favorites;

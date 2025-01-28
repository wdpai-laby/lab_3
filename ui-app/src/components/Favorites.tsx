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
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("title");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [favourites, setFavourites] = useState<Set<number>>(new Set()); // Set of favorite film IDs

    useEffect(() => {
        const token = sessionStorage.getItem("token"); // Replace with your token mechanism
        if (token) {
            setIsAuthenticated(true);
            setAuthToken(token);
        }
        axios
            .get("http://localhost:8000/api/film-list/")
            .then((response) => {
                const rawData = response.data;
                const filmData: Film[] = [];
                const filmMap = new Map();

                rawData.forEach((item: any) => {
                    if (item.id_film && item.title) {
                        if (!filmMap.has(item.id_film)) {
                            filmMap.set(item.id_film, {
                                id_film: item.id_film,
                                title: item.title,
                                year: item.year,
                                duration: item.duration,
                                rating: item.rating,
                                votes: item.votes,
                                score: item.score,
                                critics_score: item.critics_score,
                                user_score: item.user_score,
                            });
                        }
                    }
                });

                filmMap.forEach((film) => filmData.push(film));
                setFilms(filmData);
            })
            .catch((error) => {
                console.error("Error fetching films:", error);
            });
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    };

    const toggleFavourite = (id_film: number) => {
        if (!authToken) {
            console.error("No authentication token found");
            return;
        }

        const updatedFavourites = new Set(favourites);
        const isAddingToFavourites = !updatedFavourites.has(id_film);

        // Optimistically update the UI
        if (isAddingToFavourites) {
            updatedFavourites.add(id_film);
        } else {
            updatedFavourites.delete(id_film);
        }
        setFavourites(updatedFavourites);

        // Send request to the backend
        if (isAddingToFavourites) {
            // Add to favourites (POST request)
            axios
                .post(
                    "http://localhost:8000/api/favorites/",
                    { id_film },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                )
                .then(() => {
                    alert("Film added to favourites");
                })
                .catch((error) => {
                    console.error("Error adding to favourites:", error);

                    // Revert UI changes on error
                    updatedFavourites.delete(id_film);
                    setFavourites(new Set(updatedFavourites));
                    alert("An error occurred while adding to favourites.");
                });
        } else {
            // Remove from favourites (DELETE request)
            axios
                .delete(`http://localhost:8000/api/favorites/${id_film}/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                })
                .then(() => {
                    alert("Film removed from favourites");
                })
                .catch((error) => {
                    console.error("Error removing from favourites:", error);

                    // Revert UI changes on error
                    updatedFavourites.add(id_film);
                    setFavourites(new Set(updatedFavourites));
                    alert("An error occurred while removing from favourites.");
                });
        }
    };

    const filteredFilms = films
        .filter((film) => film.title.toLowerCase().includes(searchQuery))
        .sort((a, b) => {
            if (sortOption === "title") return a.title.localeCompare(b.title);
            if (sortOption === "year") return a.year - b.year;
            if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
            if (sortOption === "filmweb_score") return (b.score || 0) - (a.score || 0);
            if (sortOption === "critics_score") return (b.critics_score || 0) - (a.critics_score || 0);
            if (sortOption === "user_score") return (b.user_score || 0) - (a.user_score || 0);
            return 0;
        });

    return (
        <div className="film-container">
            <h1>Films</h1>

            {/* Controls */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search films..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <select value={sortOption} onChange={handleSort}>
                    <option value="title">Sort by Title</option>
                    <option value="year">Sort by Year</option>
                    <option value="rating">Sort by IMDb Rating</option>
                    <option value="filmweb_score">Sort by Filmweb Score</option>
                    <option value="critics_score">Sort by RT Critics' Score</option>
                    <option value="user_score">Sort by RT User Score</option>
                </select>
            </div>

            {/* Film List */}
            <div className="film-list">
                {filteredFilms.length > 0 ? (
                    filteredFilms.map((film) => (
                        <div className="film-item" key={film.id_film}>
                            <h2>{film.title}</h2>
                            <p>Year: {film.year}</p>
                            {film.duration && <p>Duration: {film.duration}</p>}
                            {film.rating && <p>IMDb Rating: {film.rating}</p>}
                            {film.votes && <p>IMDb Votes: {film.votes.toLocaleString()}</p>}
                            {film.score && <p>Filmweb Score: {film.score}</p>}
                            {film.critics_score && <p>RT Critics' Score: {film.critics_score}%</p>}
                            {film.user_score && <p>RT User Score: {film.user_score}%</p>}
                            {/* Conditionally Render Button */}
                            {isAuthenticated && (
                                <button
                                    className={`heart-button ${
                                        favourites.has(film.id_film) ? "active" : ""
                                    }`}
                                    onClick={() => toggleFavourite(film.id_film)}
                                >
                                    {favourites.has(film.id_film) ? "❤️" : "🖤"}
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No films available</div>
                )}
            </div>
        </div>
    );
};

export default Favorites;

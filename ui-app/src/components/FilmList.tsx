import { useState, useEffect } from "react";
import axios from "axios";
import "./FilmList.css";

const FilmList = () => {
    interface Film {
        id_film: number;
        title: string;
        year: number;
        duration?: string;
        rating?: number; // IMDb rating
        votes?: number;  // IMDb votes
        score?: number; // Filmweb score
        critics_score?: number; // Rotten Tomatoes critics score
        user_score?: number; // Rotten Tomatoes user score
    }

    const [films, setFilms] = useState<Film[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("title");

    useEffect(() => {
        console.log("Fetching films data");
        axios
            .get("http://localhost:8000/api/film-list/")
            .then((response) => {
                const rawData = response.data;

                // Group and merge the data
                const filmData: Film[] = [];
                const filmMap = new Map();

                rawData.forEach((item: any) => {
                    if (item.id_film && item.title) {
                        // Process Film data
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

                // Convert the Map back to an array
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
                        </div>
                    ))
                ) : (
                    <div>No films available</div>
                )}
            </div>
        </div>
    );
};

export default FilmList;

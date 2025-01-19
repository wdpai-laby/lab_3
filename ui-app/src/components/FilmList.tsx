import { useState, useEffect } from "react";
import axios from "axios";
import "./FilmList.css";

const FilmList = () => {
    interface Film {
        id: number;
        title: string;
        year: number;
        score?: number; // Filmweb score
        critics_score?: number; // RottenTomatoes critics score
        user_score?: number; // RottenTomatoes user score
        imdb_rating?: number; // IMDb rating
        imdb_votes?: number; // IMDb votes
        imdb_duration?: string; // IMDb duration
    }

    const [films, setFilms] = useState<Film[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("title");

    useEffect(() => {
        console.log("Fetching films data");
        axios
            .get("http://localhost:8000/api/film-list/")
            .then((response) => {
                const rawData = response.data;
                const formattedData: Film[] = [];

                // Process raw data and group them by film ID
                rawData.forEach((item: any) => {
                    let film = formattedData.find((f) => f.id === item.film || f.id === item.id);

                    if (!film) {
                        film = {
                            id: item.id,
                            title: item.title || "",
                            year: item.year || 0,
                        };
                        formattedData.push(film);
                    }

                    if (item.score) film.score = item.score;
                    if (item.critics_score) film.critics_score = item.critics_score;
                    if (item.user_score) film.user_score = item.user_score;
                    if (item.rating) film.imdb_rating = item.rating;
                    if (item.votes) film.imdb_votes = item.votes;
                    if (item.duration) film.imdb_duration = item.duration;
                });

                setFilms(formattedData);
            })
            .catch((error) => {
                console.error("Error fetching films:", error);
            });
    }, []);

    // Filter films based on the search term
    const filteredFilms = films.filter((film) =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort films based on the selected sorting option
    const sortedFilms = [...filteredFilms].sort((a, b) => {
        switch (sortOption) {
            case "title":
                return a.title.localeCompare(b.title);
            case "year":
                return b.year - a.year; // Descending order
            case "imdb_rating":
                return (b.imdb_rating || 0) - (a.imdb_rating || 0); // Descending order
            case "imdb_votes":
                return (b.imdb_votes || 0) - (a.imdb_votes || 0); // Descending order
            default:
                return 0;
        }
    });

    return (
        <div className="film-container">
            <h1>Films</h1>

            {/* Search and Sort Controls */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="title">Sort by Title</option>
                    <option value="year">Sort by Year</option>
                    <option value="imdb_rating">Sort by IMDb Rating</option>
                    <option value="imdb_votes">Sort by IMDb Votes</option>
                </select>
            </div>

            <div className="film-list">
                {sortedFilms && sortedFilms.length > 0 ? (
                    sortedFilms.map((film) => (
                        <div className="film-item" key={film.id}>
                            <h2>{film.title}</h2>
                            <p>Year: {film.year}</p>
                            {film.imdb_duration && <p>Duration: {film.imdb_duration}</p>}
                            {film.score && <p>Filmweb Score: {film.score}</p>}
                            {film.critics_score && <p>RT Critics' Score: {film.critics_score}%</p>}
                            {film.user_score && <p>RT User Score: {film.user_score}%</p>}
                            {film.imdb_rating && <p>IMDb Rating: {film.imdb_rating}</p>}
                            {film.imdb_votes && <p>IMDb Votes: {film.imdb_votes}</p>}
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

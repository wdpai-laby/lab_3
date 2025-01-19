import psycopg
from playwright.sync_api import sync_playwright

HOST = "postgres"
DB_NAME = "mydatabase"
USER = "myuser"
PASSWORD = "mypassword"
PORT = "5432"

with sync_playwright() as p:
    # Launch the Chromium browser
    browser = p.chromium.launch(headless=False)  # Set headless=False if you want to see the browser window
    page = browser.new_page()
    
    # Navigate to IMDb Top 250 page
    page.goto("https://www.imdb.com/chart/top/")
    
    # Wait for the page to load completely
    page.wait_for_load_state("networkidle")
    
    # Select all <li> elements with the class "ipc-metadata-list-summary-item"
    metadata_items = page.locator("li.ipc-metadata-list-summary-item.sc-4929eaf6-0.DLYcv.cli-parent")
    
    # Loop through the elements and extract the text content
    movie_metadata = []
    for i in range(metadata_items.count()):
        metadata_text = metadata_items.nth(i).all_inner_texts()[0].split("\n") # Get the metadata text
        
        movie_metadata.append(metadata_text)
    
    for movie in movie_metadata:
        movie[0] = movie[0].split(".")[1][1:]
        movie[-2] = movie[-2].split("(")[1].split(")")[0]
        movie[-2] = movie[-2].lower()
        if "k" in movie[-2]:
            movie[-2] = movie[-2].replace("k", "000")
        elif "m" in movie[-2]:
            movie[-2] = movie[-2].replace(".", "").replace("m", "")
            if len(movie[-2]) == 1:
                movie[-2] = movie[-2] + "000000"
            else: 
                movie[-2] = movie[-2] + "00000"
        movie.pop(-1)
        movie_dict = {}
        movie_dict["title"] = movie[0]
        movie_dict["year"] = movie[1]
        movie_dict["duration"] = movie[2]
        movie_dict["rating"] = movie[-2]
        movie_dict["votes"] = movie[-1]
        with psycopg.connect(f"host={HOST} port={PORT} dbname={DB_NAME} user={USER} password={PASSWORD}") as conn:
            with conn.cursor() as cur:
                film_id = cur.execute("SELECT id_film FROM api_film WHERE title = %s AND year = %s", (movie_dict["title"], movie_dict["year"])).fetchone()
                if not film_id:
                    film_id = cur.execute("INSERT INTO api_film (title, year, duration) VALUES (%s, %s, %s) RETURNING id_film", (movie_dict["title"], movie_dict["year"], movie_dict["duration"])).fetchone()
                film_id = film_id[0]
                # if len(cur.execute("SELECT id_film FROM api_imbdfilm WHERE id_file = %s", (film_id)).fetchall()) > 0:
                    # cur.execute("UPDATE api_imdbfilm SET rating = %s, votes = %s WHERE id_film = %s", (movie_dict["rating"], movie_dict["votes"], film_id))
                # else:
                cur.execute("INSERT INTO api_imdbfilm(id_film, rating, votes) VALUES (%s, %s, %s)", (film_id, movie_dict["rating"], movie_dict["votes"]))   
    
    # Close the browser
    browser.close()
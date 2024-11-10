// Function to fetch articles from The Guardian API
export const fetchGuardianArticles = async () => {
  const apiKey = import.meta.env.VITE_GUARDIAN_API_KEY;
  const url = `https://content.guardianapis.com/search?q=drug+addiction+recovery&api-key=${apiKey}`;

  try {
    console.log("Fetching Guardian articles...");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Guardian API Error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    // Log the response structure
    console.log("Guardian API Response:", {
      total: data.response?.total,
      pageSize: data.response?.pageSize,
      resultCount: data.response?.results?.length,
    });

    if (!data.response?.results) {
      throw new Error("Invalid response format from Guardian API");
    }

    return data.response.results;
  } catch (error) {
    console.error("Guardian API Error:", error);
    console.error(
      "Guardian API Key present:",
      !!import.meta.env.VITE_GUARDIAN_API_KEY
    );
    return [];
  }
};

// Function to fetch books from Open Library API
export const fetchOpenLibraryBooks = async () => {
  const url =
    "https://openlibrary.org/search.json?q=drug+addiction+recovery&limit=5";

  try {
    console.log("Fetching Open Library books...");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Open Library API Error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    // Log the response structure
    console.log("Open Library API Response:", {
      numFound: data.numFound,
      resultCount: data.docs?.length,
    });

    if (!data.docs) {
      throw new Error("Invalid response format from Open Library API");
    }

    // Transform the data to match the expected format
    return data.docs.map((book) => ({
      key: book.key,
      title: book.title,
      author_name: book.author_name,
      first_publish_year: book.first_publish_year,
      publisher: book.publisher?.[0],
    }));
  } catch (error) {
    console.error("Open Library API Error:", error);
    return [];
  }
};

// Function to fetch podcasts from Spotify API
export const fetchSpotifyPodcasts = async (accessToken) => {
  if (!accessToken) {
    console.error("No Spotify access token provided");
    return [];
  }

  // URL encode the query parameters
  const query = encodeURIComponent("addiction recovery");
  const url = `https://api.spotify.com/v1/search?q=${query}&type=show&market=US&limit=10`;

  try {
    console.log("Fetching Spotify podcasts...");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Spotify API Error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    // Log the response structure
    console.log("Spotify API Response:", {
      total: data.shows?.total,
      resultCount: data.shows?.items?.length,
    });

    if (!data.shows?.items) {
      throw new Error("Invalid response format from Spotify API");
    }

    return data.shows.items;
  } catch (error) {
    console.error("Spotify API Error:", error);
    console.error("Access Token length:", accessToken?.length);
    return [];
  }
};

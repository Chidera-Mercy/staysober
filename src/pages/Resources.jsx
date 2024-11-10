import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchGuardianArticles,
  fetchOpenLibraryBooks,
  fetchSpotifyPodcasts,
} from "../db/apiResources";
import Header from "../components/header";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FaBookOpen,
  FaNewspaper,
  FaPodcast,
  FaExternalLinkAlt,
} from "react-icons/fa";

const fetchSpotifyAccessToken = async (authorizationCode) => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  const body = new URLSearchParams({
    code: authorizationCode,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Token fetch failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

const Resources = () => {
  const [guardianArticles, setGuardianArticles] = useState([]);
  const [openLibraryBooks, setOpenLibraryBooks] = useState([]);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(() =>
    sessionStorage.getItem("spotify_access_token")
  );
  const [spotifyPodcasts, setSpotifyPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();

  // Load non-Spotify resources
  const loadBaseResources = async () => {
    try {
      const [guardianData, libraryData] = await Promise.all([
        fetchGuardianArticles(),
        fetchOpenLibraryBooks(),
      ]);

      setGuardianArticles(guardianData);
      setOpenLibraryBooks(libraryData);
    } catch (error) {
      console.error("Error loading base resources:", error);
    }
  };

  // Load Spotify resources
  const loadSpotifyResources = async (token) => {
    try {
      const podcastData = await fetchSpotifyPodcasts(token);
      setSpotifyPodcasts(podcastData);
    } catch (error) {
      console.error("Error loading Spotify resources:", error);
    }
  };

  // Check Auth0 authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          await getAccessTokenSilently();
        } catch (error) {
          if (location.search.includes("code=")) {
            sessionStorage.setItem("returnToUrl", window.location.href);
          }
          loginWithRedirect({
            appState: { returnTo: window.location.href },
          });
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, loginWithRedirect, getAccessTokenSilently, location]);

  // Handle initial resource loading and Spotify authentication
  useEffect(() => {
    const handleResourceLoading = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);

      // Load base resources first
      await loadBaseResources();

      // Handle Spotify authorization code if present
      const queryParams = new URLSearchParams(location.search);
      const authorizationCode = queryParams.get("code");

      if (authorizationCode && !spotifyAccessToken) {
        const token = await fetchSpotifyAccessToken(authorizationCode);
        if (token) {
          setSpotifyAccessToken(token);
          sessionStorage.setItem("spotify_access_token", token);
          await loadSpotifyResources(token);
        }
      } else if (spotifyAccessToken) {
        await loadSpotifyResources(spotifyAccessToken);
      }

      setIsLoading(false);
    };

    handleResourceLoading();
  }, [isAuthenticated, location.search, spotifyAccessToken]);

  const handleSpotifyAuth = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scopes = "user-library-read playlist-read-private";

    sessionStorage.setItem("auth0_state", "active");

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-lg text-purple-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  const isValidPodcast = (podcast) => {
    return (
      podcast &&
      typeof podcast === "object" &&
      podcast.id &&
      podcast.name &&
      podcast.external_urls?.spotify
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-12">
          Resources for Recovery
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="text-lg text-purple-700 animate-pulse">
              Loading resources...
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Articles Section */}
            <section className="bg-pink-50 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <FaNewspaper className="w-8 h-8 text-pink-600" />
                  <h2 className="text-2xl font-semibold text-pink-800">
                    Articles for Recovery
                  </h2>
                </div>
                <div className="space-y-6">
                  {guardianArticles.length > 0 ? (
                    guardianArticles.map((article) => (
                      <div
                        key={article.id}
                        className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <a
                          href={article.webUrl}
                          className="group flex items-start gap-4"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
                              {article.webTitle}
                            </h3>
                            <p className="mt-2 text-pink-600 text-sm">
                              {article.sectionName}
                            </p>
                          </div>
                          <FaExternalLinkAlt className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      No articles available.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Books Section */}
            <section className="bg-blue-50 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <FaBookOpen className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-blue-800">
                    Books for Recovery
                  </h2>
                </div>
                <div className="space-y-6">
                  {openLibraryBooks.length > 0 ? (
                    openLibraryBooks.map((book) => (
                      <div
                        key={book.key}
                        className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <a
                          href={`https://openlibrary.org${book.key}`}
                          className="group flex items-start gap-4"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                              {book.title}
                            </h3>
                            <p className="mt-2 text-blue-600 text-sm">
                              {book.author_name?.join(", ") || "Unknown"}
                            </p>
                          </div>
                          <FaExternalLinkAlt className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      No books available.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Spotify Podcasts Section */}
            <section className="bg-green-50 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <FaPodcast className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-semibold text-green-800">
                    Spotify Podcasts for Recovery
                  </h2>
                </div>

                {!spotifyAccessToken ? (
                  <button
                    onClick={handleSpotifyAuth}
                    className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-4 px-6 rounded-xl font-medium shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Login with Spotify
                  </button>
                ) : spotifyPodcasts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spotifyPodcasts.filter(isValidPodcast).map((podcast) => (
                      <div
                        key={podcast.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      >
                        {podcast.images && podcast.images[0]?.url ? (
                          <img
                            src={podcast.images[0].url}
                            alt={podcast.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150";
                              e.target.alt = "Placeholder image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <FaPodcast className="w-12 h-12 text-gray-300" />
                          </div>
                        )}

                        <div className="p-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            {podcast.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {podcast.description || "No description available"}
                          </p>
                          <a
                            href={podcast.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                          >
                            Listen on Spotify
                            <FaExternalLinkAlt className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    No podcasts available.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;

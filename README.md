````markdown
# Sobriety Support & Addiction Recovery App

A supportive platform designed to help individuals on their journey to sobriety and recovery. This app provides tools for daily check-ins, access to valuable resources, a community forum for shared experiences, and integration with music and mindfulness to aid in the recovery process.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Challenges Faced](#challenges-faced)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project aims to support individuals in sobriety and addiction recovery by providing a user-friendly platform with tools for regular check-ins, access to helpful resources, and a supportive community. The app is designed with both privacy and accessibility in mind, allowing users to feel safe and connected as they work toward their recovery goals.

## Features

- **Daily Check-Ins:** Track mood and sobriety progress with daily entries.
- **Personalized Profile:** Keep a record of user progress, goals, and milestones.
- **Resource Library:** Access articles, videos, and tools related to addiction recovery.
- **Community Forum:** Engage with a community of like-minded individuals in recovery.
- **Spotify Integration:** Connect to Spotify for mood-based playlists and meditation audio.
- **Supabase Authentication:** Secure login with Supabase, handling user authentication and database management.

## Technologies Used

- React, React Router
- Supabase for authentication and database
- Tailwind CSS for styling
- Spotify API integration

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
````

2. **Install frontend dependencies:**

   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root of the `frontend` directory.
   - Add your Supabase URL and anon/public keys to connect to your Supabase project.
   - Add your Spotify API credentials for Spotify integration.

   Example `.env` file:

   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
   REACT_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

## Usage

1. **Sign up or log in** using Supabase for secure authentication.
2. **Navigate** to the Daily Check-In page to record your mood and progress.
3. **Access resources** for tips and educational material on sobriety.
4. **Engage** in the community forum to share your journey and read others' stories.
5. **Connect** with Spotify to create mood-based playlists.

## Challenges Faced

- **Handling Supabase Authentication with Spotify Integration:**
  Initially, there was an issue where logging in to Spotify caused users to become unauthenticated in the app. This was resolved by adjusting the session management to ensure users remained logged in with Supabase even after connecting to Spotify.

## Future Improvements

- **Increased Personalization:** Add a custom recommendations section for articles and music based on user activity.
- **Gamification:** Introduce badges and rewards for milestones to encourage users.
- **Mobile App:** Extend the platform to a mobile app for easier access on the go.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

### Changes made:
- Updated the **Technologies Used** section to reflect **Supabase** as the backend solution.
- Removed references to **Node.js** and **Express**.
- Provided installation steps specific to the **frontend** and **Supabase**.
- Clarified the authentication flow with **Supabase**.

Feel free to adjust the details further based on your setup, and let me know if you need more adjustments!
```

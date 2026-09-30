import React, { useState } from 'react';

// TypeScript interface defining the GitHub user data structure returned by the API
interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export default function App() {
  // State 1: Stores what the user types into the input box
  const [username, setUsername] = useState('');

  // State 2: Stores the fetched user profile data from the GitHub API
  const [userData, setUserData] = useState<GitHubUser | null>(null);

  // State 3: Tracks if the API request is currently in progress
  const [isLoading, setIsLoading] = useState(false);

  // State 4: Stores error messages to display to the user
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch GitHub user data using fetch()
  const searchUser = async (targetUsername?: string) => {
    const query = (targetUsername !== undefined ? targetUsername : username).trim();

    // Reset previous states
    setErrorMessage('');
    setUserData(null);

    // Check if input is empty
    if (!query) {
      setErrorMessage('Please enter a GitHub username.');
      return;
    }

    setIsLoading(true);

    try {
      // Call the public GitHub REST API using the native fetch() function
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(query)}`);

      // 404 indicates user was not found
      if (response.status === 404) {
        setErrorMessage('GitHub user not found. Please check the username.');
        setIsLoading(false);
        return;
      }

      // Check for rate limit or other non-OK HTTP status codes
      if (!response.ok) {
        setErrorMessage(`GitHub API error: ${response.statusText || 'Unable to fetch user'}`);
        setIsLoading(false);
        return;
      }

      // Parse JSON response data
      const data: GitHubUser = await response.json();
      setUserData(data);
    } catch (error) {
      // Handle network errors (e.g. offline, connection failure)
      setErrorMessage('Failed to connect to GitHub API. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Allow pressing Enter key in the input box to trigger search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchUser();
    }
  };

  // Helper to load sample student example usernames
  const handleSampleClick = (sampleName: string) => {
    setUsername(sampleName);
    searchUser(sampleName);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      {/* Module / Course Header Label */}
      <div className="text-center mb-4">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
          Web Programming Lab &bull; Module 6
        </p>
      </div>

      {/* Main Application Card */}
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-sm p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          GitHub Profile Finder
        </h1>

        {/* Search Input and Button Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => searchUser()}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md text-sm transition-colors cursor-pointer"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick Example Suggestions for Testing */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
          <span>Try:</span>
          {['octocat', 'torvalds', 'defunkt'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleSampleClick(name)}
              className="text-blue-600 hover:underline cursor-pointer bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100"
            >
              {name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-6 text-gray-600 text-sm font-medium">
            Searching...
          </div>
        )}

        {/* Error Message Display */}
        {errorMessage && !isLoading && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {/* GitHub User Profile Display */}
        {userData && !isLoading && (
          <div className="mt-4 pt-6 border-t border-gray-200 text-center">
            {/* Profile Picture */}
            <img
              src={userData.avatar_url}
              alt={`${userData.login}'s avatar`}
              className="w-28 h-28 mx-auto rounded-full border-2 border-gray-200 shadow-sm object-cover mb-4"
            />

            {/* Username and Name */}
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {userData.name || userData.login}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              @{userData.login}
            </p>

            {/* Bio */}
            {userData.bio ? (
              <p className="text-sm text-gray-700 mb-4 px-2 italic">
                "{userData.bio}"
              </p>
            ) : (
              <p className="text-sm text-gray-400 mb-4 italic">
                No bio provided.
              </p>
            )}

            {/* User Statistics & Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 text-left text-sm space-y-2">
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-600 font-medium">Location:</span>
                <span className="text-gray-800">{userData.location || 'Not specified'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-600 font-medium">Public Repositories:</span>
                <span className="font-semibold text-gray-900">{userData.public_repos}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-600 font-medium">Followers:</span>
                <span className="font-semibold text-gray-900">{userData.followers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Following:</span>
                <span className="font-semibold text-gray-900">{userData.following}</span>
              </div>
            </div>

            {/* View Profile External Link Button */}
            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm transition-colors"
            >
              View GitHub Profile
            </a>
          </div>
        )}
      </div>

      {/* Lab footer note */}
      <footer className="mt-6 text-center text-xs text-gray-400">
        College Web Programming Lab Assignment &bull; Built with React &amp; GitHub REST API
      </footer>
    </div>
  );
}

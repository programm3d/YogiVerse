import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../styles/leader.css";

const Leaderboard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch data from the provided API endpoint
    axios
      .get("https://yogiverse.onrender.com/yoga/feed")
      .then((response) => {
        const sortedPosts = response.data.sort((a, b) =>
          a.title.localeCompare(b.title)
        ); // Sort posts alphabetically by title
        setPosts(sortedPosts);
      })
      .catch((error) => {
        console.error("Error fetching feed data:", error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <div className="list">
          <ol>
            {posts.map((post, index) => (
              <li key={post._id}>
                <h3>{post.title}</h3>
                <p>By: {post.username}</p>
                <p>{post.description}</p>
                <a
                  href={post.contentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;

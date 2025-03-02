import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import '../styles/feed.css'

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchFeed = async () => {
    try {
      const response = await fetch("https://yogiverse.onrender.com/yoga/feed");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching feed data", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <>
      <Navbar />
      <div className="feedPosts">
        {posts.map(
          ({
            _id,
            contentLink,
            title,
            description,
            createdAt,
            username,
            profilePictureLink,
          }) => (
            <div className="post" key={_id}>
              <div className="postHeader">
                <p>Author: {username}</p>
              </div>
              <p>{title}</p>
              <video src={contentLink} controls></video>
              <p>{description}</p>
              <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Feed;

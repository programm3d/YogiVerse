import React, { useEffect, useState } from "react";
import { ArrowBigUp } from "lucide-react";
import Navbar from "./Navbar";
import "../styles/feed.css";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [diff, setDiff] = useState({});

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

  const handleDiff = (e, id) => {
    if (!diff[id]) {
      setDiff({ ...diff, [id]: true });
      axios
        .patch(
          `https://yogiverse.onrender.com/yoga/increaseCount/${id}/difficult`
        )
        .then((response) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === id
                ? { ...post, diffCount: post.diffCount + 1 }
                : post
            )
          );
        })
        .catch((err) => {
          console.error("Error updating diff count", err);
        });
    }
  };

  if (posts.length === 0) {
    return <h1 className="loader">Loading....</h1>;
  }

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
            diffCount,
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
              <div className="diffcount">
                <ArrowBigUp
                  className={`diff-icon ${diff[_id] ? "actived" : ""}`}
                  onClick={(e) => handleDiff(e, _id)}
                />
                <span className="diff-count">{diffCount || 0}</span>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Feed;

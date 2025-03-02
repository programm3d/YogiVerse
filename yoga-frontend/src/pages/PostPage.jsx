import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentLink, setContentLink] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      userId: user.userId,
      description,
      contentLink,
      difficultyLevel,
    };

    try {
      await axios.post(
        "https://yogiverse.onrender.com/yoga/postVideo",
        postData
      );
      navigate("/dashboard"); // Navigate back to the dashboard after submission
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Create Post</h2>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content Link:</label>
          <input
            type="url"
            value={contentLink}
            onChange={(e) => setContentLink(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Difficulty Level:</label>
          <input
            type="number"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPage;

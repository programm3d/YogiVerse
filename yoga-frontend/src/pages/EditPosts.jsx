import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPost = () => {
  const location = useLocation();
  const { post } = location.state;
  const { id } = useParams(); // Get the post ID from URL parameters
  const [editPostData, setEditPostData] = useState({
    title: post.title,
    description: post.description,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://yogiverse.onrender.com/yoga/updatePost/${id}`,
        editPostData
      );
      console.log("Post updated successfully:", response.data);
      // Redirect or update UI after successful update
      navigate('/dashboard')
    } catch (error) {
      console.error(
        "Error updating post:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleEditSubmit}>
        <h2>Edit Post</h2>
        <input
          type="text"
          name="title"
          value={editPostData.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="description"
          value={editPostData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPost;

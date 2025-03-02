import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const EditPost = () => {
  const location = useLocation();
  const { post } = location.state;
  const [editPostData, setEditPostData] = useState({
    title: post.title,
    description: post.description,
    contentLink: post.contentLink,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
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
        <input
          type="text"
          name="contentLink"
          value={editPostData.contentLink}
          onChange={handleInputChange}
          placeholder="Content Link"
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPost;

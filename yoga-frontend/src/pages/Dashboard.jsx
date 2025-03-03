import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import '../styles/dash.css'
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";

const Dashboard = () => {
  const { user, signout } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    signout();
    navigate("/login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `https://yogiverse.onrender.com/yoga/userPosted/${user.userId}`
      );
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchPosts();
    }
  }, [user]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://yogiverse.onrender.com/yoga/deletevideo/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchPosts();
        console.log(`Deleted post with id: ${id}`);
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    const postToEdit = posts.find((post) => post._id === id);
    navigate(`/editPost/${id}`, { state: { post: postToEdit } });
  };

  const handlePost = () => {
    navigate("/post");
  };

  if (posts.length === 0) {
    return <h1 className="loader">Loading....</h1>;
  }

  return (
    <>
      <Navbar />
      <div className="dash">
      <h1>Dashboard</h1>
      <div className="welcome">
        <p>Welcome, {user.email}!</p>
        <button onClick={handlePost}>Create Post</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="userPosts">
        {posts.map(
          ({ contentLink, description, difficultyLevel, title, _id }) => (
            <div className="poster" key={_id}>
              <p>{title}</p>
              <video src={contentLink}></video>
              <p>{description}</p>
              <p>Difficulty: {difficultyLevel}</p>
              <Trash2 onClick={(e) => handleDelete(e, _id)} className="del-btn" />
              <Pencil  onClick={(e) => handleEdit(e, _id)} className="edit-btn"/>
            </div>
          )
        )}
      </div>
    </div>
    </>
  );
};

export default Dashboard;

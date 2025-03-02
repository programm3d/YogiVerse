import React from "react";
import { useAuth } from "../context/AuthContext";
import Feed from "./Feed";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/signup");
  };
  return (
    <div>
      {user ? (
        <Feed />
      ) : (
        <div className="home">
          <div>
            <h1>Welcome to Yogiverse</h1>
            <p>
              Please <Link to="/login">login</Link> to continue.
            </p>
            <p>
              In the swirling chaos of modern life, where demands pull us in
              every direction, Yogiverse offers a serene harbor—a digital
              sanctuary dedicated to the practice and philosophy of yoga and
              mindfulness. More than just an app, it's a thriving community, a
              collective breath taken in unison. Here, you can share your
              personal yoga journey, from triumphant poses to quiet moments of
              mindful reflection, and find inspiration in the experiences of
              others. Yogiverse provides a rich tapestry of content, including
              guided meditations, insightful articles, and engaging discussions,
              all designed to foster inner peace and cultivate a deeper
              connection with yourself and a supportive network of like-minded
              individuals. Whether you're a seasoned yogi or just beginning to
              explore the path of mindfulness, Yogiverse invites you to step
              onto the mat, breathe deeply, and discover the transformative
              power of mindful living.
            </p>
            <button onClick={handleRegister}>Register Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

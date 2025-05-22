import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../styles/leader.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from the provided API endpoint
    axios
      .get("https://yogiverse.onrender.com/yoga/lead")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feed data:", error);
      });
  }, []);


  if(users.length===0){
    return <h1 className="loader">Loading...</h1>
  }
  return (
    <>
      <Navbar />
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <div className="list">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Total Posts</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.totalPosts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;

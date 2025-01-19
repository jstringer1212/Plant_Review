import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from '../api';
import "../Styler/Account.css"; // Optional: Styles for the layout
import { verifyToken } from "./Utilities/authUtils";

const Account = () => {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [plants, setPlants] = useState([]);
  const [columns, setColumns] = useState({ colA: [], colB: [], colC: [] });
  const userStatus = sessionStorage.getItem('status');

  // State to manage edit mode
  const [editReview, setEditReview] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");

  useEffect(() => {
    const authenticateUser = async () => {
      if (!userId || !token) {
        console.log("User not authenticated");
        window.location.href = "/login";
        return;
      }

      // Verify the JWT token
      const isTokenValid = await verifyToken(token);
      if (!isTokenValid) {
        console.log("Invalid or expired token");
        window.location.href = "/login";
        return;
      }

      fetchData();
    };

    const fetchData = async () => {
      try {
        const [favResponse, revResponse, comResponse, plantResponse] =
          await Promise.all([
            axios.get(`/api/favorites`, {
              params: { userId },
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`/api/reviews`, {
              params: { userId },
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`/api/comments`, {
              params: { userId },
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`/api/plants`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setFavorites(favResponse.data);
        setReviews(revResponse.data);
        setComments(comResponse.data);
        setPlants(plantResponse.data);

        organizeColumns(
          favResponse.data,
          revResponse.data,
          comResponse.data,
          plantResponse.data
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    authenticateUser();
  }, [userId, token]);

  const organizeColumns = (favorites, reviews, comments, plants) => {
    const colA = [];
    const colB = [];
    const colC = [];
    const renderedPlantIds = new Set(); // Track rendered plant IDs for Column B

    // Map favorites into Column A
    favorites.forEach((favorite) => {
      const plantReviews = reviews.filter(
        (review) => review.plantId === favorite.plantId
      );
      const plantComments = comments.filter((comment) =>
        plantReviews.some((review) => review.id === comment.reviewId)
      );

      const plantData = plants.find((plant) => plant.id === favorite.plantId); // Get plant data

      if (plantData) {
        colA.push({
          plant: plantData,
          reviews: plantReviews,
          comments: plantComments,
        });
      }
    });

    // Map reviews/comments not associated with favorites into Column B
    reviews.forEach((review) => {
      if (
        !favorites.some((fav) => fav.plantId === review.plantId) && // Exclude favorites
        !renderedPlantIds.has(review.plantId) // Exclude duplicates
      ) {
        const plantComments = comments.filter(
          (comment) => comment.reviewId === review.id
        );

        const plantData = plants.find((plant) => plant.id === review.plantId); // Get plant data

        if (plantData) {
          colB.push({
            plant: plantData,
            reviews: [review],
            comments: plantComments,
          });

          renderedPlantIds.add(review.plantId); // Mark plant as rendered
        }
      }
    });

    // Map all reviews and comments into Column C
    reviews.forEach((review) => {
      const plantComments = comments.filter(
        (comment) => comment.reviewId === review.id
      );

      const plantData = plants.find((plant) => plant.id === review.plantId); // Get plant data

      colC.push({
        review,
        comments: plantComments,
        plant: plantData, // Add plant data to Column C
      });
    });

    setColumns({ colA, colB, colC });
  };

  const handleEditReview = (reviewId, content) => {
    setEditReview(reviewId);
    setNewReviewContent(content);
  };

  const handleSaveReview = async (reviewId) => {
    try {
      const updatedReview = { content: newReviewContent };
      await axios.put(`/api/reviews/${reviewId}`, updatedReview, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the reviews in state
      const updatedReviews = reviews.map((review) =>
        review.id === reviewId ? { ...review, content: newReviewContent } : review
      );
      setReviews(updatedReviews);
      setEditReview(null); // Exit edit mode
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const handleDeleteReview = async (reviewId, plantId) => {
    const userId = parseInt(sessionStorage.getItem("userId"), 10);
    const role = sessionStorage.getItem("role"); 
    
    try {
      const response = await api.delete(`/reviews/${reviewId}`, {
        data: { 
          reviewId, 
          plantId, 
          userId, 
          role 
        },
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
  
      if (response.status === 200) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review. Please try again later.');
    }
  };
  

  const handleEditComment = (commentId, content) => {
    setEditComment(commentId);
    setNewCommentContent(content);
  };

  const handleSaveComment = async (commentId) => {
    try {
      const updatedComment = { content: newCommentContent };
      await axios.put(`/api/comments/${commentId}`, updatedComment, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the comments in state
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: newCommentContent } : comment
      );
      setComments(updatedComments);
      setEditComment(null); // Exit edit mode
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the comment from the state
      const updatedComments = comments.filter((comment) => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="account-container">
      {/* Column A: Favorites */}
      <div className="column column-a">
        <h3>Favorites</h3>
        {columns.colA.map((item, index) => (
          <div key={index} className="plant-card">
            {item.plant && (
              <>
                <img
                  src={item.plant.imageUrl}
                  alt={item.plant.cName}
                  className="ui account image"
                />
                <h4>{item.plant.cName}</h4>
                <p>{item.plant.care}</p>
                <button
                  className="ui button"
                  onClick={() =>
                    (window.location.href = `/plants/${item.plant.id}`)
                  }
                >
                  Go to Plant
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Column B: Reviewed or Commented */}
      <div className="column column-b">
        <h3>Plants you have reviewed or commented on:</h3>
        {columns.colB.map((item, index) => (
          <div key={index} className="plant-card">
            {item.plant && (
              <>
                <img
                  src={item.plant.imageUrl}
                  alt={item.plant.cName}
                  className="ui account image"
                />
                <h4>{item.plant.cName}</h4>
                <p>{item.plant.care}</p>
                <button
                  className="ui button"
                  onClick={() =>
                    (window.location.href = `/plants/${item.plant.id}`)
                  }
                >
                  Go to Plant
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Column C: Details */}
      <div className="column column-c">
        <h3>Details</h3>
        {columns.colC.map((item, index) => (
          <div key={index} className="review-card">
            {item.review && item.plant && (
              <>
                <h4>Review: {item.plant.cName}</h4>
                <p>Rating: {item.review.rating}</p>
                {editReview === item.review.id ? (
                  <textarea
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                  />
                ) : (
                  <p>{item.review.content}</p>
                )}
                {editReview === item.review.id ? (
                  <button onClick={() => handleSaveReview(item.review.id)}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEditReview(item.review.id, item.review.content)}>
                    Edit
                  </button>
                )}
                <button onClick={() => handleDeleteReview(item.review.id, item.review.plantId)}>Delete</button>
                <button
                  className="ui button"
                  onClick={() =>
                    (window.location.href = `/plants/${item.plant.id}`)
                  }
                >
                  Go to Plant
                </button>
              </>
            )}
            {item.comments.map((comment, idx) => (
              <div key={idx}>
                {editComment === comment.id ? (
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                  />
                ) : (
                  <p>Comment: {comment.content}</p>
                )}
                {editComment === comment.id ? (
                  <button onClick={() => handleSaveComment(comment.id)}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEditComment(comment.id, comment.content)}>
                    Edit
                  </button>
                )}
                <button
                  className="ui icon trash button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <i aria-hidden="true" className="trash icon"></i>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Account;

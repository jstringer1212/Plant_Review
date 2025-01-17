import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styler/Account.css"; // Optional: Styles for the layout
import { verifyToken } from "./Utilities/authUtils";

const Account = () => {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [plants, setPlants] = useState([]);
  const [columns, setColumns] = useState({ colA: [], colB: [], colC: [] });
  const userStatus = sessionStorage.getItem('status');

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
                  window.location.href = `/plants/${item.plant.id}`
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
                  window.location.href = `/plants/${item.plant.id}`
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
                <p>{item.review.content}</p>
                <button
                  className="ui button"
                  onClick={() =>
                  window.location.href = `/plants/${item.plant.id}`
                  }
                >
                  Go to Plant
                </button>
              </>
            )}
            {item.comments.map((comment, idx) => (
              <div key={idx}>
                <p>Comment: {comment.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default Account;

import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import EverythingCard from './Card';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Loader from "./Loader";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function TopHeadlines() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 6;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/top-headlines?language=en&pageSize=${pageSize}&page=${page}`)
      .then((response) => response.ok ? response.json() : Promise.reject('Fetch error'))
      .then((json) => {
        if (json.success) {
          setTotalResults(json.data.totalResults);
          setData(json.data.articles);
        } else {
          setError(json.message || 'An error occurred');
        }
      })
      .catch(() => setError('Failed to fetch news. Please try again later.'))
      .finally(() => setIsLoading(false));
  }, [page, params.category]);

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <h2 className="section-header">
        <span className="section-title capitalize">{params.category || "Top Headlines"}</span>
      </h2>

      <div className="cards-grid">
        {!isLoading ? (
          data.length > 0 ? (
            data.map((element, index) => (
              <EverythingCard
                key={index}
                title={element.title}
                description={element.description}
                imgUrl={element.urlToImage}
                publishedAt={element.publishedAt}
                url={element.url}
                author={element.author}
                source={element.source.name}
              />
            ))
          ) : <p>No articles found for this category.</p>
        ) : <Loader />}
      </div>

      {!isLoading && data.length > 0 && (
        <div className="pagination">
          <button disabled={page <= 1} className="pagination-btn" onClick={() => setPage(page - 1)}>Prev</button>
          <p className="pagination-info">{page} of {Math.ceil(totalResults / pageSize)}</p>
          <button disabled={page >= Math.ceil(totalResults / pageSize)} className="pagination-btn" onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}

export default TopHeadlines;
// This code defines a React component that fetches and displays top headlines from a news API.
// It includes pagination and error handling, and uses a custom card component to display each article.
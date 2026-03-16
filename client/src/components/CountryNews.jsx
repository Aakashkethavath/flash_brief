import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EverythingCard from './Card';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function CountryNews() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 6;

  function handlePrev() {
    setPage(page - 1);
  }

  function handleNext() {
    setPage(page + 1);
  }

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/country/${params.iso}?page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok');
      })
      .then((json) => {
        if (json.success) {
          setTotalResults(json.data.totalResults);
          setData(json.data.articles);
        } else {
          setError(json.message || 'An error occurred');
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError('Failed to fetch news. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, params.iso]);

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      <h2 className="section-header">
        <span className="section-title">News from {params.iso?.toUpperCase()}</span>
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
          ) : (
            <p>No news articles found for this criteria.</p>
          )
        ) : (
          <Loader />
        )}
      </div>

      {!isLoading && data.length > 0 && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            className="pagination-btn"
            onClick={handlePrev}
          >
            Prev
          </button>
          <p className="pagination-info">
            {page} of {Math.ceil(totalResults / pageSize)}
          </p>
          <button
            disabled={page >= Math.ceil(totalResults / pageSize)}
            className="pagination-btn"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default CountryNews;

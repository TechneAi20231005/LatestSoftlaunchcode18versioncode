// Shimmer.js
import React from 'react';

const CommentShimmer = () => {
  return (
    <div style={{ marginBottom: '10px' }}>
      {/* Customize this div for the shimmer effect */}
      <div
        style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#eee',
          marginBottom: '8px'
        }}
      ></div>
      <div
        style={{
          width: '80%',
          height: '15px',
          backgroundColor: '#eee'
        }}
      ></div>
    </div>
  );
};

const Shimmer = ({ count }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <CommentShimmer key={index} />
      ))}
    </div>
  );
};

export default Shimmer;

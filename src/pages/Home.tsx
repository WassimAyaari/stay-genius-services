
import React from 'react';
import { Navigate } from 'react-router-dom';

// This is a redirect component since we're using Index.tsx as our home page
const Home = () => {
  return <Navigate to="/" replace />;
};

export default Home;

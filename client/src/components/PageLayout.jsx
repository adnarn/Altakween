import React from 'react';
import PropTypes from 'prop-types';

const PageLayout = ({ children, className = '' }) => {
  return (
    <main className={`pt-24 min-h-screen ${className}`}>
      {children}
    </main>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default PageLayout;

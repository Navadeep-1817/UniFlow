import React from 'react';
import { Link } from 'react-router-dom';

const BreadcrumbNav = ({ items }) => {
  return (
    <nav className="breadcrumb-nav">
      {items.map((item, index) => (
        <span key={index}>
          {index < items.length - 1 ? (
            <>
              <Link to={item.path}>{item.label}</Link>
              <span className="separator"> / </span>
            </>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;

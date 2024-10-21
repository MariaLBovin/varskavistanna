import React from "react";
import './loader.css';

const Loader: React.FC = () => {
    return (
        <div
          className="loader"
          role="alert"
          aria-live="assertive"
          aria-busy="true"
        ></div>
      );
};

export default Loader;

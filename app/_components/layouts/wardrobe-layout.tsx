// components/Wardrobe.js

import React from 'react';
import './layouts.css'

const Wardrobe = () => {
  return (
    <div className="cabinet">
      {/* First Column: Two Boxes */}
      <div className="col-start-1 col-span-1 row-start-1 row-end-4 box"></div>
      <div className="col-start-1 col-span-1 row-start-4 row-end-7 box"></div>

      {/* Second and Third Columns: Shelf, Box, Shelf */}
      <div className="col-start-2 col-span-2 row-start-1 row-end-2 box"></div>
      <div className="col-start-2 col-span-2 row-start-2 row-end-6 box"></div>
      <div className="col-start-2 col-span-2 row-start-6 row-end-7 box"></div>

      {/* Fourth Column: One Large Box */}
      <div className="col-start-4 col-span-1 row-start-1 row-end-7 box"></div>
    </div>
  );
};

export default Wardrobe;

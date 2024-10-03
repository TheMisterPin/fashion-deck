import React from "react";

export default function ProcessingIndicator(){
  return (
    <div>
      <div className="inline-block w-8 h-8 mb-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
      <p>Processing image...</p>
    </div>
  );
};

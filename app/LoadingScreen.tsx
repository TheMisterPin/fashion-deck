import React from "react";

export default function LoadingScreen(){
  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-black">
      <div className="text-center">
        <div className="inline-block w-8 h-8 mb-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        <p className="text-lg">Loading background removal model...</p>
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import MDEditor to prevent SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CoverLetterPreview = ({ content = "" }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  if (!isClient) return <p className="text-gray-500">Loading preview...</p>;

  return (
    <div className="py-4 border rounded-lg p-4 bg-white shadow-sm">
      {content ? (
        <MDEditor value={content} preview="preview" height={700} />
      ) : (
        <p className="text-gray-500 italic">No content available</p>
      )}
    </div>
  );
};

export default CoverLetterPreview;

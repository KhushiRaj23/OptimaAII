"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { saveCoverLetter, getCoverLetters } from "@/actions/cover-letter";
import { toast } from "sonner";

// Dynamically import MDEditor to prevent SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CoverLetterPreview = ({ content = "", jobTitle, companyName }) => {
  const [isClient, setIsClient] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverLetters, setCoverLetters] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      fetchCoverLetters(); // Fetch saved cover letters on mount
    }
  }, []);

  const fetchCoverLetters = async () => {
    try {
      const data = await getCoverLetters();
      setCoverLetters(data);
    } catch (error) {
      toast.error("Failed to load cover letters");
    }
  };

  const handleSave = async () => {
    if (!content) {
      toast.error("Cover letter content is empty");
      return;
    }

    setSaving(true);
    try {
      await saveCoverLetter({ content, jobTitle, companyName });
      toast.success("Cover letter saved successfully!");
      fetchCoverLetters(); // Refresh the list
    } catch (error) {
      toast.error("Failed to save cover letter");
    } finally {
      setSaving(false);
    }
  };

  if (!isClient) return <p className="text-gray-500">Loading preview...</p>;

  return (
    <div className="py-4 border rounded-lg p-4 bg-gray shadow-sm">

      {/* List of saved cover letters */}
      <div className="mt-6">
        <h2 className="text-2xl gradient-title font-semibold">Saved Cover Letters</h2>
        {coverLetters.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {coverLetters.map((letter) => (
              <li
                key={letter.id}
                className="border p-3 rounded-lg text-muted-foreground hover:bg-gray-600 transition"
              >
                <p className="font-medium">{letter.jobTitle} at {letter.companyName}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No saved cover letters yet.</p>
        )}
      </div>
    </div>
  );
};

export default CoverLetterPreview;

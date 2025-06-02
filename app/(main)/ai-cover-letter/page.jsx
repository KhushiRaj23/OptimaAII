import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CoverLetterPage() {
  let coverLetters = [];

  try {
    coverLetters = await getCoverLetters();
  } catch (error) {
    console.error("Failed to fetch cover letters:", error);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button asChild>
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </div>
          </Button>
        </Link>
      </div>

      {coverLetters.length > 0 ? (
        <CoverLetterList coverLetters={coverLetters} />
      ) : (
        <p className="text-gray-500 text-lg">No cover letters found.</p>
      )}
    </div>
  );
}

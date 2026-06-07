import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DocumentReviewClient from "./DocumentReviewClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Server Component page that fetches document details dynamically by ID
 * and forwards them to the client review component.
 */
export default async function DocumentDashboardPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch the document record from PostgreSQL via Prisma
  const doc = await prisma.document.findUnique({
    where: { id },
  });

  if (!doc) {
    notFound();
  }

  // Serialize Date objects to JSON-friendly strings for Client Components
  const serializedDoc = {
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <DocumentReviewClient document={serializedDoc} />
    </div>
  );
}

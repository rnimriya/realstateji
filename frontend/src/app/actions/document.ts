"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server Action to save edited clause extractions and update the document status to VERIFIED.
 */
export async function verifyDocumentAction(id: string, updatedData: Record<string, any>) {
  try {
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        extractedData: updatedData,
        status: "VERIFIED",
      },
    });

    // Revalidate the document dashboard page
    revalidatePath(`/dashboard/document/${id}`);

    return {
      success: true,
      document: JSON.parse(JSON.stringify(updatedDocument)),
    };
  } catch (error: any) {
    console.error("Failed to verify document:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while saving.",
    };
  }
}

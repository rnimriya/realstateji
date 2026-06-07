"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

/**
 * Server Action to save edited clause extractions and update the document status to VERIFIED.
 */
export async function verifyDocumentAction(id: string, updatedData: Prisma.InputJsonValue) {
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
  } catch (error: unknown) {
    console.error("Failed to verify document:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while saving.";
    return {
      success: false,
      error: message,
    };
  }
}

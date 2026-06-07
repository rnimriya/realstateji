import prisma from "./prisma";

/**
 * Self-healing helper that ensures at least one User and one Organization
 * exist in the database. Returns the default user.
 */
export async function getOrCreateDefaultUser() {
  // 1. Try to find the first user
  let user = await prisma.user.findFirst();
  if (user) {
    return user;
  }

  // 2. If no user, ensure we have an organization first
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Default Legal & Real Estate Firm",
      },
    });
  }

  // 3. Create the default user context
  user = await prisma.user.create({
    data: {
      email: "user@example.com",
      passwordHash: "seeded-password-hash",
      firstName: "Default",
      lastName: "User",
      subscriptionStatus: "inactive", // Defaults to inactive paywall state
      organizationId: org.id,
    },
  });

  console.log("INFO: Database self-healed. Seeded default user:", user.email);
  return user;
}

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  const admin = await prisma.user.findUnique({
    where: {
      email: "superadmin@gmail.com",
    },
  });

  if (admin) {
    console.log("Super Admin sudah ada");
    return;
  }

  const password = await bcrypt.hash("12345678", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("Super Admin berhasil dibuat");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
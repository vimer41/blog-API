import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'ModsenAdmin',
    email: 'modsenemail@gmail.com',
    passwordHash:
      '$2a$12$or3epYRa6D4TavD59K29DOZfsyaXPOFnvBM5dh4X/IRAvSCc/SW5O',
    role: 'Admin',
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({
      data: u,
    });
  }
}

main();

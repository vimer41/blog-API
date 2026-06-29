import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../src/generated/prisma/client.js';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    username: process.env.SEED_USERNAME || 'ModsenADM',
    email: process.env.SEED_EMAIL || 'modsenemail@gmail.com',
    passwordHash:
      process.env.SEED_PASSWORD_HASH ||
      '$2a$12$or3epYRa6D4TavD59K29DOZfsyaXPOFnvBM5dh4X/IRAvSCc/SW5O',
    role: 'Admin',
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.upsert({
      where: {
        email: u.email
      },
      update: {},
      create: u
    });
  }
}

main();

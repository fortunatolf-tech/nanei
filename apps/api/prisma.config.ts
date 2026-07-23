import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Fallback inócuo para ambientes sem banco (CI roda apenas `prisma generate`)
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/nanei",
  },
});

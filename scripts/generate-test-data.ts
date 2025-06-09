import { DataSource } from "typeorm";
import { User } from "../src/users/entities/user.entity";
import { Document } from "../src/documents/entities/document.entity";
import * as bcrypt from "bcryptjs";

async function generateTestData() {
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "nestjs_db",
    entities: [User, Document],
    synchronize: true,
  });

  const connection = await dataSource.initialize();

  const userRepo = connection.getRepository(User);
  const documentRepo = connection.getRepository(Document);

  // Generate 1000 users
  const roles = ["admin", "editor", "viewer"];
  for (let i = 0; i < 1000; i++) {
    const user = userRepo.create({
      username: `user${i}`,
      password: await bcrypt.hash("password", 10),
      role: roles[Math.floor(Math.random() * roles.length)],
    });
    await userRepo.save(user);

    // Generate 100 documents per user (100,000 total)
    for (let j = 0; j < 100; j++) {
      const document = documentRepo.create({
        title: `Document ${i}-${j}`,
        content: `Content for document ${j} by user ${i}`,
        ownerId: user.id,
        filePath: `/uploads/doc${i}-${j}.txt`,
      });
      await documentRepo.save(document);
    }
  }

  await connection.destroy();
  console.log("Test data generation completed");
}

generateTestData().catch(console.error);

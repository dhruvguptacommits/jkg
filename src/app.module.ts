import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DocumentsModule } from "./documents/documents.module";
import { IngestionModule } from "./ingestion/ingestion.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "nestjs_db",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
    IngestionModule,
  ],
})
export class AppModule {}

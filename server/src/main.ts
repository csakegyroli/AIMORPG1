import "dotenv/config";
import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { AppModule } from "./app.module";

function validateProductionEnvironment() {
  if (process.env.NODE_ENV !== "production") return;
  const webOrigin = process.env.WEB_ORIGIN || "";
  if (!webOrigin.startsWith("https://")) throw new Error("Éles módban a WEB_ORIGIN HTTPS cím kell legyen.");
  if (!process.env.DATABASE_URL?.startsWith("postgres")) throw new Error("Éles módban érvényes DATABASE_URL szükséges.");
  const auditSecret = process.env.AUDIT_HASH_SECRET || "";
  if (auditSecret.length < 32 || auditSecret.includes("replace-with") || auditSecret.includes("dev-only")) throw new Error("Éles módban legalább 32 karakteres, véletlen AUDIT_HASH_SECRET szükséges.");
}

async function bootstrap() {
  validateProductionEnvironment();
  // Disable Nest's default 100 KB JSON parser so the API can enforce its explicit
  // 1 MB request ceiling; individual save payloads are capped more tightly in the controller.
  const app = await NestFactory.create(AppModule, { cors: false, bodyParser: false });
  app.setGlobalPrefix("api");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(express.json({ limit: "1mb", strict: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.WEB_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: { enableImplicitConversion: false } }));
  const port = Number(process.env.PORT || 4000);
  await app.listen(port, "0.0.0.0");
  // No secrets, request bodies, emails or raw IPs are written to application logs.
  process.stdout.write(`AImorpg API elindult a ${port} porton.\n`);
}

void bootstrap();

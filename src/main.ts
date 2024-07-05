import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from "class-validator";
import { GlobalExceptionFilter } from "./utils/functions/middleware/global-exception.filter";
import { validationPipeConfig } from "./utils/functions/middleware/validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(validationPipeConfig);
  app.useGlobalFilters(new GlobalExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT);
}
bootstrap();

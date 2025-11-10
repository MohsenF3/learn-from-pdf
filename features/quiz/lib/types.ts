import z from "zod";
import { createQuizSchema } from "./schemas";

export type CreateQuizSchemaType = z.infer<ReturnType<typeof createQuizSchema>>;

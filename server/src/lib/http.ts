import { z } from "zod";
export const parseId = (value: unknown) => z.coerce.number().int().positive().parse(value)
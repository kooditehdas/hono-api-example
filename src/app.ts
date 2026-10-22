import { Hono } from "hono";
import { type RequestIdVariables, requestId } from "hono/request-id";
import { health } from "./routes/health.js";

export const app = new Hono<{ Variables: RequestIdVariables }>();

app.use(requestId());

app.route("/health", health);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

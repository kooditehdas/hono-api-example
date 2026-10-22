import { Hono } from "hono";
import { health } from "./routes/health.js";

export const app = new Hono();

app.route("/health", health);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

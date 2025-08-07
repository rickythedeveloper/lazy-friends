import express, { type Request } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import { getDbConnection } from "./dbService.ts";
import { createGroup } from "./groups/operations.ts";
import { getAuthContextOrThrow } from "./authContext/AuthContext.ts";
import { z } from "zod";

const app = express();
const port = 3001;

const checkJwt = auth({
  audience: "lazy-friends.ricky-kawagishi.com",
  issuerBaseURL: "https://dev-cx465djnl0dls2wi.uk.auth0.com/",
});

getDbConnection()
  .then((db) => {
    return db.query({
      query: "select version()",
      row_type: z.object({ version: z.string() }),
    });
  })
  .then((result) => {
    const row = result[0];
    if (row) {
      console.log(row.version);
    }
  })
  .catch((error: unknown) => {
    console.log(error);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req, res) => {
  console.log("heyo");
  res.send("Hello World!");
});

app.get("/public", (req, res) => {
  console.log("heyo publid");
  res.send("Public endpoint");
});

app.get("/users", checkJwt, (req, res) => {
  console.log("heyo private");
  res.json("Private endpoint");
});

app.post("/groups", checkJwt, async (req, res) => {
  const authContext = getAuthContextOrThrow(req);
  const db = await getDbConnection();

  const createdGroup = await createGroup({
    group: { title: "test groups" },
    authContext,
    db,
  });

  res.json(createdGroup);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`);
});

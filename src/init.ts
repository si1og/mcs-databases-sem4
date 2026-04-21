import { readFileSync } from "fs";
import { pool } from "./db.js";

async function init() {
  const sql = readFileSync("init.sql", "utf-8");
  await pool.query(sql);
  console.log("Tables created successfully");
  await pool.end();
}

init().catch(console.error);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, price, currency
      FROM products
      WHERE is_active = true
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "პროდუქტების წამოღება ვერ მოხერხდა"
    });
  }
});

app.listen(3000, () => {
  console.log("Backend მუშაობს: http://localhost:3000");
});
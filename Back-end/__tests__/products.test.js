const request = require("supertest");
const express = require("express");
const { Sequelize } = require("sequelize");

const bodyParser = require("body-parser");
const cors = require("cors");

// Setup environment
require("dotenv").config({ path: ".env.test" });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Sequelize setup with in-memory SQLite for testing
const sequelize = new Sequelize("sqlite::memory:", { logging: false });
const Product = require("../models/product")(sequelize);

app.get("/api/products", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }
  const product = await Product.create({
    name,
    price: parseFloat(price),
    description: description || "",
    imageUrl: "https://via.placeholder.com/150",
  });
  res.status(201).json(product);
});

app.put("/api/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, price, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  await product.update({
    name,
    price,
    description,
    imageUrl: "https://via.placeholder.com/150",
  });

  res.json(product);
});

app.delete("/api/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.destroy();
  res.json({ message: "Product deleted successfully" });
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Product API", () => {
  let productId;

  test("POST /api/products - should create a product", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Test Product", price: 99.99 });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Product");
    productId = res.body.id;
  });

  test("GET /api/products - should return products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("PUT /api/products/:id - should update the product", async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({ name: "Updated Product", price: 120 });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Product");
  });

  test("DELETE /api/products/:id - should delete the product", async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });

  test("GET /api/products - should return empty after deletion", async () => {
    const res = await request(app).get("/api/products");
    expect(res.body.length).toBe(0);
  });
});

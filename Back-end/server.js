const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize(
  process.env.DB_NAME || "product_store",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const Product = require("./models/product")(sequelize);

const sampleProducts = [
  {
    name: "Laptop",
    price: 1299.99,
    description: "High-performance laptop with SSD storage",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Smartphone",
    price: 699.99,
    description: "Latest model with high-resolution camera and fast processor",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Headphones",
    price: 199.99,
    description: "Noise-cancelling wireless headphones",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ force: false }); 

    const count = await Product.count();

    if (count === 0) {
      await Product.bulkCreate(sampleProducts);
      console.log("Sample products added to database");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    process.exit(1);
  }
};

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      description: description || "",
      imageUrl: imageUrl || "https://via.placeholder.com/150",
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, description, imageUrl } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const updatedProduct = await product.update({
      name,
      price: parseFloat(price),
      description:
        description !== undefined ? description : product.description,
      imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
    });

    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const deletedProduct = { ...product.toJSON() };
    await product.destroy();

    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

(async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

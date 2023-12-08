const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Product = require("./model/productModel");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);

    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json({ message: `updated product`, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/products/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      console.log("no product");
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    res.status(200).json({ message: `deleted`, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(5000, () => {
      console.log(`Node API app is running on port 5000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

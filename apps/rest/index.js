import db from "./mongo.js";
import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/menu", (_req, res) => {
  res.send([
    { id: 1, name: "Pizza Margherita", price: 8.99 },
    { id: 2, name: "Spaghetti Carbonara", price: 10.99 },
    { id: 3, name: "Caesar Salad", price: 7.99 },
    { id: 4, name: "Grilled Chicken Sandwich", price: 9.99 },
    { id: 5, name: "Tiramisu", price: 6.99 },
  ]);
});

app.post("/orders", async (req, _res) => {
  const order = req.body;
  const collection = await db.collection("orders");
  await collection.insertOne(order);
});

app.get("/orders", async (_req, res) => {
  const collection = db.collection("orders");
  const result = await collection.find({}).toArray();
  res.send(result);
});

app.put("/orders/:id", (req, res) => {
  const orderId = new ObjectId(req.params.id);
  const collection = db.collection("orders");
  const order = collection.find({ _id: orderId });

  if (!order) {
    return res.status(404).send({ message: "Order not found" });
  }

  collection.update({ _id: orderId }, { $set: { done: true } });

  res.send(order);
});

app.get("/analytics", async (_req, res) => {
  const collection = db.collection("orders");
  const result = await collection.find({}).toArray();

  const totalOrders = result.length;
  const totalRevenue = result.reduce((acc, order) => acc + order.totalPrice, 0);

  res.send({ totalOrders, totalRevenue });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

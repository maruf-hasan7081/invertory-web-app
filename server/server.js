require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const app = express();

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory API Running");
});

/* ========================
   INVENTORY ROUTES
======================== */

app.get("/inventories", async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany({
      orderBy: { id: "asc" },
    });

    res.json(inventories);
  } catch (error) {
    console.error("GET inventories error:", error);
    res.status(500).json({ error: "Failed to fetch inventories" });
  }
});

app.get("/inventories/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const inventory = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    res.json(inventory);
  } catch (error) {
    console.error("GET inventory by id error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/inventories", async (req, res) => {
  try {
    const { title, description, creator } = req.body;

    if (!title || !description || !creator) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newInventory = await prisma.inventory.create({
      data: {
        title,
        description,
        creator,
      },
    });

    res.status(201).json(newInventory);
  } catch (error) {
    console.error("POST inventory error:", error);
    res.status(500).json({ error: "Failed to create inventory" });
  }
});

app.put("/inventories/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, creator } = req.body;

    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        title,
        description,
        creator,
      },
    });

    res.json(updatedInventory);
  } catch (error) {
    console.error("PUT inventory error:", error);
    res.status(500).json({ error: "Failed to update inventory" });
  }
});

app.delete("/inventories/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.inventory.delete({
      where: { id },
    });

    res.json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("DELETE inventory error:", error);
    res.status(500).json({ error: "Failed to delete inventory" });
  }
});

/* ========================
   ITEM ROUTES
======================== */

app.get("/inventories/:id/items", async (req, res) => {
  try {
    const inventoryId = Number(req.params.id);

    const items = await prisma.item.findMany({
      where: { inventoryId },
      orderBy: { id: "asc" },
    });

    res.json(items);
  } catch (error) {
    console.error("GET items error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/inventories/:id/items", async (req, res) => {
  try {
    const inventoryId = Number(req.params.id);
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        inventoryId,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("POST item error:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await prisma.item.delete({
      where: { id },
    });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("DELETE item error:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

/* ========================
   SERVER START
======================== */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
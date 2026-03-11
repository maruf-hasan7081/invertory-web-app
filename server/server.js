require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const app = express();

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

/* =========================
   CREATE FIXED ADMIN
========================= */
async function createDefaultAdmin() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isBlocked: false,
      },
    });

    console.log("Default admin created: admin@gmail.com / admin123");
  }
}

/* =========================
   AUTH ROUTES
========================= */

app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
        isBlocked: false,
      },
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("LOGIN error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

/* =========================
   SIMPLE ADMIN CHECK
========================= */
async function requireAdmin(req, res, next) {
  try {
    const email = req.headers["x-user-email"];

    if (!email) {
      return res.status(401).json({ error: "No admin email provided" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.error("ADMIN CHECK error:", error);
    res.status(500).json({ error: "Admin check failed" });
  }
}

/* =========================
   ADMIN ROUTES
========================= */

app.get("/admin/users", requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("GET admin users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.patch("/admin/users/:id/block", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: true },
    });

    res.json({ message: "User blocked", user });
  } catch (error) {
    console.error("BLOCK user error:", error);
    res.status(500).json({ error: "Failed to block user" });
  }
});

app.patch("/admin/users/:id/unblock", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: false },
    });

    res.json({ message: "User unblocked", user });
  } catch (error) {
    console.error("UNBLOCK user error:", error);
    res.status(500).json({ error: "Failed to unblock user" });
  }
});

app.patch("/admin/users/:id/make-admin", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.update({
      where: { id },
      data: { role: "admin" },
    });

    res.json({ message: "User promoted to admin", user });
  } catch (error) {
    console.error("MAKE ADMIN error:", error);
    res.status(500).json({ error: "Failed to make admin" });
  }
});

app.patch("/admin/users/:id/remove-admin", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.update({
      where: { id },
      data: { role: "user" },
    });

    res.json({ message: "Admin role removed", user });
  } catch (error) {
    console.error("REMOVE ADMIN error:", error);
    res.status(500).json({ error: "Failed to remove admin role" });
  }
});

app.delete("/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (req.currentUser.id === id) {
      return res.status(400).json({ error: "You cannot delete yourself" });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

/* =========================
   BASIC ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Inventory API Running");
});

/* =========================
   INVENTORY ROUTES
========================= */

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

/* =========================
   ITEM ROUTES
========================= */

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

    await prisma.item.delete({
      where: { id },
    });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("DELETE item error:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

/* =========================
   START SERVER
========================= */
async function startServer() {
  await createDefaultAdmin();

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

startServer();
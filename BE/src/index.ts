import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.route.js";
import kampusRoute from "./routes/kampus.route.js";
import bidangRoute from "./routes/bidang.route.js";
import kriteriaRoute from "./routes/kriteria.route.js";
import perusahaanRoute from "./routes/perusahaan.route.js";
import nilaiKriteriaRoute from "./routes/nilaiKriteria.route.js";
import ratingRoutes from "./routes/rating.route.js";
import rekomendasiRoutes from "./routes/rekomendasi.route.js";

import { getHasilRekomendasi } from "./controllers/rekomendasi.controller.js";
import { authenticate } from "./middlewares/authMiddleware.js";

const app = express();
const port = 3000;

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Root
// ======================
app.get("/", (req, res) => {
  res.send("Backend SPK Rekomendasi Tempat Magang Berjalan 🚀");
});

// ======================
// Routes
// ======================
app.use("/users", userRoutes);
app.use("/kampus", kampusRoute);
app.use("/bidang", bidangRoute);
app.use("/kriteria", kriteriaRoute);
app.use("/perusahaan", perusahaanRoute);
app.use("/nilai-kriteria", nilaiKriteriaRoute);
app.use("/rating", ratingRoutes);
app.use("/rekomendasi", rekomendasiRoutes);

app.get(
  "/rekomendasi/:id/hasil",
  authenticate,
  getHasilRekomendasi
);

// ======================
// Server
// ======================
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
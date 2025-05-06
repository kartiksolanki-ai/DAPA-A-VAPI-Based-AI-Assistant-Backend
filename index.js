import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Rate Limiter
import { rateLimiter } from "./middlewares/rateLimiter.js";

// Routes imports
import authRoutes from "./routes/auth.js";
import overViewRoutes from "./routes/overview.js";
import logsRoutes from "./routes/logs.js";
import platformRoutes from "./routes/platform.js";
import voiceRoutes from "./routes/voice.js";

// Data imports
/*
  ******************************************************
    import User from "./models/User.js";
    import Product from "./models/Product.js";
    import ProductStat from "./models/ProductStat.js";
    import Transaction from "./models/Transaction.js";
    import OverallStat from "./models/OverallStat.js";
    import AffiliateStat from "./models/AffiliateStat.js";
    import {
      dataUser,
      dataProduct,
      dataProductStat,
      dataTransaction,
      dataOverallStat,
      dataAffiliateStat,
    } from "./data/index.js";
  ******************************************************
*/

// Configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(rateLimiter);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes Setup
app.use("/auth", authRoutes);
app.use("/client", overViewRoutes);
app.use("/general", logsRoutes);
app.use("/management", platformRoutes);
app.use("/sales", voiceRoutes);

// Mongoose Setup
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    
    // Only run first time when running app to insert data into mongodb
    /**
      ***********************************************
        User.insertMany(dataUser);
        Product.insertMany(dataProduct);
        ProductStat.insertMany(dataProductStat);
        Transaction.insertMany(dataTransaction);
        OverallStat.insertMany(dataOverallStat);
        AffiliateStat.insertMany(dataAffiliateStat);
      ***********************************************
    */
  })
  .catch((error) => console.log(`${error} did not connect.`));

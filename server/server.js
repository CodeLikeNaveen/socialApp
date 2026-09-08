import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"


const app = express();

await connectDB();

app.use(cors());
app.use(express.json({limit: "16kb"}));
app.use(express.static("public"));

app.use("/api/inngest", serve({ client: inngest, functions }));


app.get('/',(req,res)=>res.send('Server is Running'))

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))



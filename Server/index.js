import express from "express";
import cors from "cors";
import PptGen from "./routes/PptGen.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/",PptGen);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
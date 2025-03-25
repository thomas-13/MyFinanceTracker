// 9Z4fwwNlESZUAeoW
// tomgeorge1307
import express, {Express} from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

const mongoURI: string = "mongodb+srv://tomgeorge1307:9Z4fwwNlESZUAeoW@financecluster.pns23.mongodb.net/";

mongoose.connect(mongoURI)
    .then(()=> console.log("Connected to MongoDB"))
    .catch((err)=> console.error("Failed to connect to MongoDB", err));


app.use("/financial-records", financialRecordRouter);

app.listen(port, ()=>{
    console.log(`Server running on Port ${port}`)
})
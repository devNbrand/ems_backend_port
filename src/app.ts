import express , {Request,Response,Express} from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/userRoutes.js";
import TaskRoutes from "./routes/taskRoute.js";
import BreakRoutes from "./routes/break.js";
import availabilityHoursRoutes from './routes/availabilityHours.js';
import workingHoursRoutes from './routes/workingHours.js';
const app:Express = express();
app.use(cookieParser()); // for parsing cookies
app.use(express.json())


dotenv.config({})
const PORT = process.env.PORT || 3000;
app.use("/api/user", UserRoutes);
app.use("/api/task", TaskRoutes);
app.use("/api/break", BreakRoutes);
app.use("/api/availabilityHours", availabilityHoursRoutes);
app.use("/api/workingHours", workingHoursRoutes);



app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})
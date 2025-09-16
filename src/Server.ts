import { connectDB } from "./utils/Database";
import dotenv from "dotenv";
import App from "./App";

dotenv.config();

const PORT = Number(process.env.PORT) || 5051;
const server = new App(PORT);

connectDB().then(() => {
    server.listen();
});
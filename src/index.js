import 'dotenv/config';
import connectDB from './database/index.js';
import { app } from './app.js';

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log("server is listening");
        })
    })
    .catch((err) => {
        console.error("mongodb connection failed!!", err);

    })



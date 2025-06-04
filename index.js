import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import Stripe from 'stripe';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

// initialize express
const app = express();
app.use(cors());
app.use(express.json());

//construct the path
const _filename = fileURLToPath(import.meta.url);
const PATH = dirname(_filename);

//serve static files
app.use(express.static(path.join(PATH, 'dist')));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post('/payment', async (req, res) => {
    const { amount } = req.body;

    try {
        const payment = await stripe.paymentIntents.create({
            amount: parseInt(amount * 100),
            currency: 'usd'
        });

        res.status(200).json({ client_secret: payment.client_secret });
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
});

// listen to port
app.listen(PORT, () => {
    console.log(`server is up and running on port :  http://localhost:${PORT}`);
});

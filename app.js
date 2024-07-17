import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import countryList from "./codes.js";
import config from "./config.js";

const app = express();
const PORT = 3000;
const Base_URL = "https://v6.exchangerate-api.com/v6/";
const API_key = config.API_KEY;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', './views');

app.get("/", (req,res) => {
    const from_country = "USD";
    const to_country = "INR";
    res.render('index', {
        country:countryList,
        from_country,
        to_country,
    });
});

app.post("/result", async(req,res) => {
    try {
        const from_country = req.body.from;
        const to_country = req.body.to;
        const amount = req.body.amount;
        const response = await axios.get(Base_URL + API_key + "/latest/" + from_country);
        const result = response.data;
        
        res.render("index", {
            country : countryList,
            c1 : result.conversion_rates[from_country],
            c2 : result.conversion_rates[to_country],
            from_country,
            to_country,  
            amount,
        });
    } catch (error) {
        console.log(error);
        res.status(404).send("Error! Not Found");

    }
});

app.listen(PORT,() => {
    console.log(`App is listening on port ${PORT}`)
});

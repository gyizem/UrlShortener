require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const pool= require("./db");
const { v4: uuidv4} = require('uuid');
const randomAlias = require("./helpers/randomAlias.js")
const path = require("path")

const BASE_URL = process.env.BASE_URL

app.post("/shorten",async(req,res)=>{
    let originalUrl = req.body.original_url;
    if(!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")){
        originalUrl = "https://"+originalUrl
    }
    const alias = req.body.alias;
    const finalAlias = alias?.trim() || randomAlias();
    if (!/^[\w-]+$/.test(finalAlias)) {
        return res.status(400).json({ error: "Invalid alias format" });
    }
    const id = uuidv4();
    try{
        await pool.query("INSERT INTO urls (id,original_url, alias, click_count) VALUES ($1, $2, $3, 0)",[id, originalUrl, finalAlias]);
        res.json({ short_url: BASE_URL+finalAlias});
    } catch (err){
        console.error(err);
        if(err.code ==='23505'){
            res.status(400).json({ error: "Alias already exists."});
        } else{
            res.status(500).json({ error: "Internal server error"});
        }
    }

});

app.get("/stats/:alias", async (req,res) => {
    try{
        const alias = req.params.alias;
        const check = await pool.query("SELECT 1 FROM urls WHERE alias = $1", [alias]);

        if(check.rows.length ===0){
            return res.status(404).send("Alias not found");
        }

        const totalResult = await pool.query("SELECT COUNT(*) AS total FROM visits WHERE alias = $1", [alias]);
        const totalClicks = totalResult.rows[0].total;

        const byCountry = (await pool.query("SELECT country, COUNT(*) AS count FROM visits WHERE alias = $1 GROUP BY country", [alias])).rows;
        const byCity = ( await pool.query("SELECT city, COUNT(*) AS count FROM visits WHERE alias = $1 GROUP BY city", [alias])).rows;

        res.json({
            alias,
            totalClicks,
            byCountry,
            byCity
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error"})
    }
});

app.get("/:alias", async(req,res)=> {
    try{
        const alias = req.params.alias;
        const result = await pool.query("SELECT original_url FROM urls WHERE alias = $1", [alias])
        if(result.rows.length>0){
            const ip = req.headers['x-forwarded-for'] || req.ip;
            const response = await fetch("http://ip-api.com/json/" +ip);
            const data = await response.json();
            const country = data.country;
            const city = data.city;
            const id = uuidv4();

            await pool.query("INSERT INTO visits (id,alias, ip_address, country, city) VALUES ($1, $2, $3, $4, $5)", [id, alias, ip, country, city]);
            await pool.query(`UPDATE urls
                                SET click_count = click_count + 1
                                WHERE alias = $1`, [alias])

            res.redirect(result.rows[0].original_url);
        }
        else{
            res.status(404).send("Short URL not found");
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error"}); 
    }
});

app.use(express.static(path.join(__dirname, '../url-shortener-frontend/dist')))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../url-shortener-frontend/dist/index.html'));
});

app.listen(process.env.PORT || 3000, ()=> {
    console.log("Sunucu çalışıyor..");
});
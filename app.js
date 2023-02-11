//require packages
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

//create express app
const app = express();

//server port number
const port = process.env.PORT || 3000;

//set template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//parse html for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render("index");
});

app.post('/convert-mp3', async (req, res) => {
  const videoId = req.body.videoID;
  if(
    videoId === undefined ||
    videoId === "" ||
    videoId === null
  ){
    return res.render("index", {success : false, message : "Please enter a valid video ID"});
  } else {
    const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": process.env.API_HOST
      }
    });
    
    const fetchResponse = await fetchAPI.json();

    if(fetchResponse.status === "ok")
      return res.render("index", {success : true, song_title : fetchResponse.title, song_link : fetchResponse.link});
    else
      return res.render("index", {success : false, message : fetchResponse.message});
  }
}); 

//start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


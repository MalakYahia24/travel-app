
import express from "express";
const app = express();
import cors from"cors";
import dotenv  from "dotenv";
import axios from "axios";

//read the json files coming to you
app.use(express.json())
app.use(express.static('dist'))

//require dotenv
dotenv.config();
//using cors
app.use(cors());

app.get("/", (req, res) => {
    res.render("index.html")
  });
  
const username = "malakyahia";
const key=process.env.WETHER_KEY;
const pic_key=process.env.PIC_KEY;

  app.post("/", async (req,res) => {
      const {city} = req.body;
      console.log(req.body);
      const Location= await getLoc(city,username);
      return res.send(Location)
  });


  app.post("/getWeather", async (req,res) => {
    console.log(req.body);
    const {lng,lat,remainingDays}=req.body;
    const weather = await getCW(lng , lat ,remainingDays,key);
    return res.send(weather);
});

app.post("/cityPic", async (req,res) => {
  const {city} = req.body;
  const getPic = await getCityPic(city, pic_key);
  return res.send(getPic);
})

  const getLoc = async(city,username) => {
    const {data} = await axios.get(`http://api.geonames.org/searchJSON`, {
      params: {
          q: city,
          maxRows: 1,
          username: username,  // Your API username
      }
  });
    console.log(data.geonames.length);
    if(!data.geonames.length){
        const errMsg = {
            message: "No city with that name. Please make sure of your spelling",
            error: true
        }
        return errMsg
    }
    const {name,lat,lng}= await data.geonames[0];
    return {name,lat,lng};
}

const getCW = async(lng,lat,Rdays,key) => {
  if(Rdays < 0) {
    const errMsg = {
        message: "Date cannot be in the past",
        error: true
    }
    return errMsg
}

if(Rdays > 0 && Rdays <= 7) {
const {data} = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&units=M&key=${key}`)
const {weather , temp} = data.data[data.data.length -1];
const {description} = weather;
const weather_data = {description, temp}
console.log(weather_data);
return weather_data

}else if (Rdays > 7){
const {data} = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&units=M&days=${Rdays}&key=${key}`);
const {weather , temp, app_max_temp, app_min_temp} = data.data[data.data.length -1];
const {description} = weather;
const weather_data = {description, temp, app_max_temp, app_min_temp}
console.log(weather_data);
return weather_data
}
}

const getCityPic = async(city, key) => {
  const {data} = await axios.get(`https://pixabay.com/api/?key=${key}&q=${city}&image_type=photo`)
  const img =await data.hits[0]? await data.hits[0].webformatURL: "https://source.unsplash.com/random/640x480?city,morning,night?sig=1"
  if(img){
 // now i will send an object with single property image
 return {img};
  }
}

const port = 8000
app.listen(8000, () => console.log(`server is listening on port ${port}`))
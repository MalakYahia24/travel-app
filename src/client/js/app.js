import axios from "axios";
import {getRdays} from "./getRdays";
 const form = document.querySelector("form");
const cityInp = document.querySelector("#city");
const dateInp = document.querySelector("#date");

const city_error = document.querySelector("#cError");
const date_error = document.querySelector("#dError");

window.onload = function () {
    form.addEventListener("submit",handelSubmit);
};

const handelSubmit = async (e) =>{
  e.preventDefault();
  //check that fun. is connect
  console.log("handle is workingg");
 // make sure the inputs is there
  if(!validate()){
    return;
  };
  const location= await cityloc();
  if (Location && Location.error) {
    //handling the error coming from the server-side
    city_error.innerHTML = `unvalid city`;
    city_error.style.display = "block";
    return ;
  }
  else if (Location && !Location.error) {
  const {name,lng,lat }=await location;
  const date=dateInp.value;
  if (!date) {
    console.log("please enter the date");
    date_error.innerHTML = `Please enter the date`;
    date_error.style.display = "block";
    return;
  }
  if (lng && lat) {
  const remDays = getRdays(date);
  const weather= await getWeather(lng,lat,remDays);
  if(weather && weather.error) {
    date_error.innerHTML = `${weather.message}`;
    date_error.style.display = "block";
    return;
  }
  console.log(weather);
  const city=cityInp.value;
  const pic= await getCityPic(city);
  showInf(remDays, city, pic, weather);
   }
  }
};

const validate = () => {
  city_error.style.display = "none";
  date_error.style.display = "none";
  if(!cityInp.value){
    city_error.innerHTML = `You need to enter the city`;
    city_error.style.display = "block";
    return;
  }
  if(!dateInp.value){
    date_error.innerHTML = `Please enter the date`;
    date_error.style.display = "block";
    return;
  }
  if(getRdays(dateInp.value) < 0){
    date_error.innerHTML = `Date cannot be in the past`;
    date_error.style.display = "block";
    return;
  }
  city_error.style.display = "none";
  date_error.style.display = "none";

  return true
};

const cityloc= async ()=>{
    console.log("getcity");
    const { data } = await axios.post("http://localhost:8000/",form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(data);
      return data;
};

const getWeather = async (lng, lat, remainingDays) => {
  const { data } = await axios.post("http://localhost:8000/getWeather", {
    lng,
    lat,
    remainingDays,
  });
  return data;
};

const getCityPic = async (city) => {
  const { data } = await axios.post("http://localhost:8000/cityPic", {
    city,
  });
  const { img } = await data;
  console.log(data)
  return img;
}; 

const showInf = (Rdays, city, pic, weather) => {
  document.querySelector(".data").style.display= "block";
  document.querySelector("#Remaindays").innerHTML = `
  Your trip starts in ${Rdays} days from now
  `;
  document.querySelector(".cityName").innerHTML = `Location: ${city}`;
  document.querySelector(".weather").innerHTML =
    Rdays > 7
      ? `Weather is: ${weather.description}`
      : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temp").innerHTML =
    Rdays > 7
      ? `Forecast: ${weather.temp}&degC`
      : `Temperature: ${weather.temp} &deg C`;
  document.querySelector(".max-temp").innerHTML =
    Rdays > 7 ? `Max-Temp: ${weather.app_max_temp}&degC` : "";
  document.querySelector(".min-temp").innerHTML =
    Rdays > 7 ? `Min-Temp: ${weather.app_min_temp}&degC` : "";
  document.querySelector(".pic").innerHTML = `
   <image 
   src="${pic}" 
   alt="an image that describes the city nature"
   >
   `;
  document.querySelector(".data").style.display = "block";
};

export {handelSubmit};
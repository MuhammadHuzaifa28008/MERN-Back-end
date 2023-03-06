import dotenv from "dotenv";
import fetch from "node-fetch";
import {readFile, writeFile} from 'fs/promises';
import path from "path";
import * as url from 'url';

// import { createClient } from "pexels";

dotenv.config({ path: "./config/.env" });

const __dirname = url.fileURLToPath(new URL('./', import.meta.url));

const jsonFile = path.join( __dirname, 'data.json');
// const client = createClient(process.env.PexelsApiKey);
const responseToSend = {};

const writeToFile = async(data)=>{
  try {
    console.log(`jsonFile path: ${jsonFile}`)
    await writeFile(jsonFile, JSON.stringify(data));
    
    console.log('writing to file went Good');
  } catch (error) {
    console.log('writing to file went Wrong');
    console.log(error);
  }
}
export const  readFromFile = async()=>{
  try {
    const data = await readFile(jsonFile, 'utf8');
    // console.error(`read data from ${jsonFile}`);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${jsonFile}: ${error}`);
      return null;
  }
}

const resCategories = new Set();
let getCategories = (entrie) => {
  resCategories.add(entrie.Category);
};



// const getRandomImg = async(Category, imgUrls) => {
//   try{
//       let pics = await client.photos
//       .search({
//           query: Category,
//           size: "small",
//           orientation: "portrait",
//           color: "#595bd4",
//           total_results: 10,
//         })
    
//         let length = pics.photos.length;
//       if (length > 0) {
//           let index = Math.floor(Math.random() * length);
//           let imgUrl = pics.photos[index].src.original;
//           imgUrls.push(imgUrl);
//         } else {
//             imgUrls.push("https://via.placeholder.com/400");
//         }
//     }
//     catch(err){
//         imgUrls.push("https://via.placeholder.com/400");
//     }
// };


async function getData() {
  try {
    const apiResponse = await fetch(process.env.freeApis);
    const apisRes = await apiResponse.json();
    apisRes.entries.map(getCategories);
    const categories = Array.from(resCategories);

    const imgUrls = [];
    for (let category of categories) {
      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: process.env.PexelsApiKey,
            "X-RapidAPI-Key":
              "fd4888af43msh61e8b7e00ae3fb0p1dcb67jsn6fe28310ff0e",
            "X-RapidAPI-Host": "PexelsdimasV1.p.rapidapi.com",
          },
        };

        const imgApiResponse = await fetch(
          `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${category}&locale=en-US&per_page=15&page=1&size=small&orientation=portrait&color=#595bd4`,
          options
        );

        const pexelsApiData = await imgApiResponse.json();
        
        const imageUrls = pexelsApiData.photos;
        let length = imageUrls.length;
        if (length > 0) {
          let index = Math.floor(Math.random() * length);
          let imgUrl = imageUrls[index].src.small;
          imgUrls.push(imgUrl);
        } else {
          imgUrls.push("altBg");
        }
      } catch (error) {
        imgUrls.push("https://via.placeholder.com/400");
      }
    }

    responseToSend.urls = imgUrls;
    responseToSend.apis = apisRes.entries;
    responseToSend.categories = categories;
    
  } catch (err) {
    responseToSend.success = false;
    responseToSend.error = err.message;
  }
}

getData()
  .then(() => {
    console.log("Data fetched successfully");
    writeToFile(responseToSend);
  })
  .catch((err) => {
    console.log("Data fetch unseccusfull");
    responseToSend.success = false;
    responseToSend.error = err.message;
  });

export default responseToSend;

import axios from "axios";
import { apiKey } from "../constants";

const getByTitle = (params) => `http://www.omdbapi.com/?apikey=${apiKey}&s=${params}`;

const apiCall = async (endPoint) => {
  const options = {
    method: "GET",
    url: endPoint,
  };
  try {
    console.log(endPoint);
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.log("error: ", err);
    return null;
  }
};

export const fetchByTitle = (params) => {
 
  return apiCall(getByTitle(params));
};

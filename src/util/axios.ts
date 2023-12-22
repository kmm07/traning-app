import axios from "axios";

const customAxios = () =>
  axios.create({
    baseURL:"/api/admin",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      'Access-Control-Allow-Origin': '*'
    },
    withCredentials: false
  });

export default customAxios;

import axios from "axios";

const customAxios = () =>
  axios.create({
    baseURL:"https://personaltrainerkmm.com/api/admin",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    withCredentials: true
  });

export default customAxios;

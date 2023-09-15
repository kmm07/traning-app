import axios from "axios";

const customAxios = () =>
  axios.create({
    baseURL: "https://personaltrainerkmm.com/api/admin",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    withCredentials: false,
  });

export default customAxios;

import axios from "axios";

const customAxios = () =>
  axios.create({
    baseURL: "https://thirsty-franklin.85-215-43-232.plesk.page/api/admin",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    withCredentials: false,
  });

export default customAxios;

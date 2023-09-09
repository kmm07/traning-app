/* eslint-disable camelcase */
import axios from "axios";

const customAxios = () =>
  axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    withCredentials: true,
  });

export default customAxios;

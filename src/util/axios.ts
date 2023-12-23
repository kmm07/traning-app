import axios from "axios";

const customAxios = () =>
  axios.create({

    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    withCredentials: false
  });

export default customAxios;

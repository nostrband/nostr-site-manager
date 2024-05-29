import axios from "axios";

const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATE,
});

export default ApiClient;

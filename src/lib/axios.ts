import axios from "axios";

const url = "https://portfolio-pool-test.damnserver.com:443"

const apiEnv = axios.create({
  baseURL: url,
});

export { apiEnv };

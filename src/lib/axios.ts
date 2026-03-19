import axios from "axios";

const url = "https://portfolio-pool-dev.damnserver.com:443";

const apiEnv = axios.create({
  baseURL: url,
});

export { apiEnv };

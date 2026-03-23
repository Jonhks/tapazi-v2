import axios from "axios";

const url = "https://portfolio-pool-test.damnserver.com:443";
// const url = "https://portfolio-pool-prod.damnserver.com:443";

const apiEnv = axios.create({
  baseURL: url,
});

export { apiEnv };

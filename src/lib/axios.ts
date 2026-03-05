import axios from "axios";

const url = "https://portfolio-pool-test.damnserver.com:443";
// no se pueden subir ya cambios a main probando deploy en vercel de dev

const apiEnv = axios.create({
  baseURL: url,
});

export { apiEnv };

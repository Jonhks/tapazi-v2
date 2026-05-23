import axios from "axios";

const url = "https://portfolio-pool-test.damnserver.com:443";

const apiEnv = axios.create({
  baseURL: url,
});

// Header aplicado globalmente — no repetir en cada llamada de API
apiEnv.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";

export { apiEnv };

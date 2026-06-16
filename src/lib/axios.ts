import axios from "axios";

const url =
  window.location.hostname === "theportfoliopool.com"
    ? "https://portfolio-pool-prod.damnserver.com:443"
    : "https://portfolio-pool-prod.damnserver.com:443";

const apiEnv = axios.create({
  baseURL: url,
});

// Header aplicado globalmente — no repetir en cada llamada de API
apiEnv.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";

export { apiEnv };

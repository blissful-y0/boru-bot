import rateLimit from "express-rate-limit";
import serverConfig from "../../config/server";

const createRateLimit = () => {
  return rateLimit(serverConfig.rateLimit);
};

export default createRateLimit;

const httpStatus = require("http-status");
import {util, token, config} from 'midgar';

const authConfig = config.publicUrl;

function isAuthHeaderInvalid(req: any) {
  const authHeader = req.headers.authorization;
  return !authHeader || authHeader.split(" ")[0] !== "Bearer";
}

const intercept = (req: any, res: any, next: any) => {
  if (authConfig.includes(req.url)) {
    next();
    return;
  }
  if (isAuthHeaderInvalid(req)) {
    return util.createErrorResponse(res, httpStatus.UNAUTHORIZED, `Error in authorization format. Invalid authentication header. ${httpStatus["401_MESSAGE"]}`);
  }
  try {
    token.verifyToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (err) {
    return util.createErrorResponse(res, httpStatus.UNAUTHORIZED, `Invalid token. ${httpStatus["401_MESSAGE"]}`);
  }
  next();
}

export const auth = {
  intercept
}
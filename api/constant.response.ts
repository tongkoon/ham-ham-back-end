import { DEFAULT_TIME_RANDOM } from "./constant";

export const RESPONSE_TRUE = { response: true };
export const RESPONSE_TRUE_TIME_DEFAULT = { response: true ,msg:"Set Time Random Default "+DEFAULT_TIME_RANDOM+" Minute"};
export const RESPONSE_FALSE = { response: false };
export const RESPONSE_FALSE_INTERNAL_SERVER_ERROR = { response: false, error: "Internal Server Error " };
export const RESPONSE_FALSE_DUPLICATE_USER = { response: false, error: "Duplicate username" };
export const RESPONSE_FALSE_USER_NOT_FOUND = { response: false, error: "Username Invalid"};
export const RESPONSE_FALSE_PICTURE_NOT_FOUND = { response: false, error: "Picture not found"};
export const RESPONSE_FALSE_BAD_PASSWORD = { response: false, error: "Password Invalid"};
export const RESPONSE_FALSE_TOKEN = { response: false, error: "Invalid signature"};
export const RESPONSE_FALSE_WRITE_FILE = { response: false, error: "Error Writing file"};
export const RESPONSE_FALSE_READ_FILE = { response: false, error: "Error Reading file"};
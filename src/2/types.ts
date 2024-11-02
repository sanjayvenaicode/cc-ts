type JSONValue = null | boolean | string | number | JSONArray | JSONObject;

type JSONArray = JSONValue[];

type JSONObject = {
  [key: string]: JSONValue;
};

export { JSONValue, JSONArray, JSONObject };

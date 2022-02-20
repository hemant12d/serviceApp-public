import appConfig from "../config/appConfig.js"
const fileFormatValidate = (file) => {
    const type = file.mimetype.split("/").pop();
    const validTypes = appConfig.FILE_SUPPORTED;
    if (validTypes.indexOf(type) === -1) {
      return false;
    }
    return true;
}

export default fileFormatValidate;
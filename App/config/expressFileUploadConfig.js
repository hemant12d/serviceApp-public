const expressFileUploadConfig = {
    useTempFiles: true,
    tempFileDir: "../../tmp",
    preserveExtension: true,
    safeFileNames: true,
    parseNested: true,
    abortOnLimit: true,
}

export default expressFileUploadConfig;
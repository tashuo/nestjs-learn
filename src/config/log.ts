export default {
    level: process.env.LOG_LEVEL || 'DEBUG',
    error_file: process.env.ERROR_LOG_FILE || 'error.log',
    app_file: process.env.APP_LOG_FILE || 'app.log',
};

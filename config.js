'use strict'
//Configure values for mongoDB URL & port the app will run on
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/medicine-cabinet";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://localhost/test-medicine-cabinet";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
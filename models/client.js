var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// client schema
var ClientSchema = new Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: false },
    email: { type: String, required: false },
    ip: { type: String, required: false }
}, {timestamps: true});

module.exports = mongoose.model('Client', ClientSchema);
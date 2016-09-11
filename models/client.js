var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// client schema
var ClientSchema = new Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    location: { type: String, required: false },
    interest: { type: String, required: true },
    email: { type: String, unique: true, required: false },
    time: { type: String, required: false }
}, {timestamps: true});

module.exports = mongoose.model('Client', ClientSchema);
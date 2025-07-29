const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    headquarter: String
},{ timestamps: true })

module.exports = mongoose.model( "newPublisher", publisherSchema);


const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
    {
        user: {
            id: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            receiver: [{
                id: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                },
                messages: [{
                    date: {
                        type: Date,
                        default: Date.now
                    },
                    content: {
                        type: String,
                        required: true
                    },
                    type: {
                        type: String,
                        required: true
                    },
                    time: {
                        type: Date,
                        default: Date.now
                    }
                }]
            }]
        }
    })
module.exports = mongoose.model('Message', MessageSchema);
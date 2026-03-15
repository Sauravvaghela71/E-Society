const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String,
         required: true 
            },
    description: { type: String,
         required: true 
        },
    noticeDate: { type: Date,
         default: Date.now 
        },
    
    priority: { type: String,
         enum: ['low', 'medium', 'High'],
          default: 'low' },
    status: { type: String,
         enum: ['Active', 'inActive'],
          default: 'Active' }
}, 
{ timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
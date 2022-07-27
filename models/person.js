const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    })

const personSchema = new mongoose.Schema({
    name: { type: String, minlength: 3 },
    number: { type: String, minlength: 8, validate: {
        validator: function(v) {
            return /^\d{2,3}-\d{7,8}$/.test(v);
        }, message: `Given number is not a valid phone number!`
    } }
})

//[0-9]{2,3}[-][0-9]{7,8}

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject._v
    }
})


module.exports = mongoose.model('Person', personSchema);
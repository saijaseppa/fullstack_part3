const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('password is missing');
    process.exit(1);
}
else {
    const password = process.argv[2];
    
    const url =
        `mongodb+srv://zaija:${password}@clusterfullstack.d8lddf7.mongodb.net/phoneBook?retryWrites=true&w=majority`
    
    mongoose.connect(url);

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });

    const Person = mongoose.model('Person', personSchema);

    if (process.argv.length == 3) {
        console.log('phonebook: ');
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person.name, person.number);
            });
            mongoose.connection.close();
        })
    }
    
    if (process.argv.length === 5) {
        const givenName = process.argv[3];
        const givenNumber = process.argv[4];

        const person = new Person({
            name: givenName,
            number: givenNumber
        });

        person.save().then(result => {
            console.log(`added ${givenName} number ${givenNumber} to phonebook`);
            mongoose.connection.close();
        });
    }

}






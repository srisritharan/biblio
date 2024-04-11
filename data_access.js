// mongodb client driver
const { MongoClient } = require('mongodb');

// DB Connection URL
var url = "mongodb://127.0.0.1:27017";

// Create client
const client = new MongoClient(url);

// Database and collection variables
const dbName = "biblio_db";
const collectionName = "books"

module.exports.call = async function call(operation, parameters, callback) {
    // connect to the db server
    await client.connect();

    // set the database to use
    const db = client.db(dbName);
    // set the collection to use
    const collection = db.collection(collectionName);

    //Execute Operations
    // available operations: 
    // ['initbooks'|'clearbooks'|'findallbooks'|'findbook'|'updatebook' ]
    switch (operation.toLowerCase()) {
        case 'initbooks':
            const initialRecords = [
                { "_id": "5dfb7b07cef0eaea7dedefc6", "isbn": "001", "price": 18, "title": "Moby Dick" },
                { "_id": "5dfb7b3ccef0eaea7dedefd5", "isbn": "002", "price": 4.48, "title": "War and Peace" }
            ];
            await collection.insertMany(initialRecords).then(
                (result)=>{ callback({ status: "book records have been initialized." })},
                (reason)=>{ callback({ status: "error initializing book records" }) }
            );
            break;

        case 'clearbooks':
            await collection.deleteMany({}).then(
                (result)=>{ callback({ status: "book records have been removed." })},
                (reason)=>{ callback({ status: "error removing book records." }) }
            );
            break;

        case 'findallbooks':
            const books = await collection.find({}).toArray();
            callback({ books: books });
            break;

        case 'findbook':
            const book = await collection.findOne({ isbn: parameters.isbn });
            callback({ book:book });
            break;

        case 'updatebook':
            await collection.updateOne(
                { isbn: parameters.book.isbn },
                {$set: parameters.book},
                {upsert: true});
            callback({ status: 'item updated:'+parameters.book.isbn });
            break;

        default:
            break;
    }
    console.log( 'call complete: ' + operation );
    client.close();
    return 'call complete';
}


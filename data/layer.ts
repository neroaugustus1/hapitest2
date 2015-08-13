
import documentdb = require('documentdb');

class Utility {

    getOrCreateDatabase(client, databaseId, callback): void {

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: databaseId
            }]
        };

        client.queryDatabases(querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                if (results.length === 0) {
                    var databaseSpec = {
                        id: databaseId
                    };

                    client.createDatabase(databaseSpec, function (err, created) {
                        callback(null, created);
                    });

                } else {
                    callback(null, results[0]);
                }
            }
        })
    };

    getOrCreateCollection(client, databaseLink, collectionId, callback): void {

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: collectionId
            }]
        };

        client.queryCollections(databaseLink, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                if (results.length === 0) {
                    var collectionSpec = {
                        id: collectionId
                    };

                    var requestOptions = {
                        offerType: 'S1'
                    };

                    client.createCollection(databaseLink, collectionSpec, requestOptions, function (err, created) {
                        callback(null, created);
                    });

                } else {
                    callback(null, results[0]);
                }
            }
        });
    }
}

export class DataLayer {

    private database: any;
    private databaseId: string = 'octavia-test';
    private collection: any;
    private collectionId: string = 'content';
    client: documentdb.DocumentClient;
    private utility: Utility = new Utility();

    init(callback?): void {
        var self = this;
        self.utility.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);

            } else {
                self.database = db;
                self.utility.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                    if (err) {
                        callback(err);

                    } else {
                        self.collection = coll;
                    }
                });
            }
        });
    };

    addContent(content, callback): void {
        content.created = Date.now();
        content.completed = false;
        this.client.createDocument(this.collection._self, content, null, callback);
    };

    constructor(options) {
        this.client = new documentdb.DocumentClient(options.endpoint, { 'masterKey': options.authKey });
    };
}

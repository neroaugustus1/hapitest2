var Hapi = require('hapi');
var Data = require('./data/layer');
var server = new Hapi.Server();
var data = new Data.DataLayer({
    endpoint: 'https://octavia.documents.azure.com:443/',
    authKey: 'MRwildlXhqtgaI/e/YBob+CgkhmKrk3UZYt0yB0sgUUNJHDIssoX2GTIoDWUcXLgVOObjCedpg8cg/L+gbS86Q=='
});
data.init();
server.connection({ port: 3000 });
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, World!');
    }
});
server.route({
    method: 'POST',
    path: '/upload',
    handler: function (request, reply) {
        console.log(request.payload);
        data.addContent({ description: 'a beautifull poem' }, function (err, doc) {
            if (err) {
                console.log(err);
                reply(500);
            }
            else {
                reply(200);
            }
        });
    }
});
server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
//# sourceMappingURL=app.js.map
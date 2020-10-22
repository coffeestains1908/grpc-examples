/**
 * seems like descriptor is a less messy way to get services and shit.
 * from the examples, I can see that they generated a so-called _pb.js file which
 * i assume, is a serialized descriptor
 *
 * @type {module:grpc}
 */

const fs = require('fs');
const grpc = require("grpc")
const protoLoader = require('@grpc/proto-loader');

const _host = '0.0.0.0';
const _port = process.env.port | '50051';
const host = _host + ':' + _port;

const PROTO_PATH = __dirname + '/../protos/test.proto';
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

function sayHi(call, callback) {
  const req = call.request;
  fs.writeFileSync('test.png', req.img);
  callback(null, {
    message: `Hi ${req.name}!`
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(protoDescriptor.TestService.service, {
    SayHi: sayHi
  });
  server.bind(host, grpc.ServerCredentials.createInsecure());
  console.info('Starting server');
  server.start();
  console.info('Server started on ' + host);
}

main();

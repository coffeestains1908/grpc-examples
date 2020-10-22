/**
 * when client sends an extra field, i noticed that the server automatically
 * discards the extra field and accept what it was told to accept
 */

const fs = require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const _host = '127.0.0.1';
const _port = process.env.port | '50051';
const host = _host + ':' + _port;

const PROTO_PATH = __dirname + '/../protos/test.proto';
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const testService = protoDescriptor.TestService.service;

function main() {
    const stub = new protoDescriptor.TestService(host, grpc.credentials.createInsecure());
    const fileToRead = '/home/zerotrust/Pictures/Screenshot from 2020-04-23 12-43-42.png';
    fs.readFile(fileToRead, (err, data) => {
        const arrByte = Uint8Array.from(data);
        stub.sayHi({name: 'Danish', img: arrByte}, (err, message) => {
            if (err) {
                console.error(err);
            } else {
                console.info(message);
            }
        });
    });
}

main();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'api.proto'); // ganti ke api.proto

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// 💡 GANTI dari `helloworld` ke `api`
const fileServiceProto = protoDescriptor.api;

const fileServiceImpl = require('./services/file.service');

const server = new grpc.Server();
server.addService(fileServiceProto.FileService.service, fileServiceImpl);

const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server is running on ${PORT}`);
});

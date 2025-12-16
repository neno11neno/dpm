const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(cors());
server.use(middlewares);

// 確保請求進入伺服器
server.use((req, res, next) => {

    next();
});

// 設定路由
server.use(router);

// 啟動伺服器
server.listen(3000, () => {
    console.log('✅ JSON Server is running on http://localhost:3000');
});
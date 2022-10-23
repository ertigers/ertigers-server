const fs = require('fs')
const path = require('path');
const express = require('express');
const router = express.Router();

try {
    let files = fs.readdirSync(path.resolve(__dirname));
    for (let file of files) {
        if ((file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.js' && file !== 'index.ts') {
            let routerName = '/api/v1';
            let fileName = path.basename(file, '.js');
            fileName = path.basename(fileName, '.ts');
            fileName.split('.').forEach((name) => { if (name) routerName += '/' + name; });
            if (routerName) {
                (async function (routerName) {
                    let childRouter = await import(`./${file}`);
                    router.use(routerName, childRouter.default);
                }(routerName));
            } else {
                console.error('路由加载失败', file);
            }
        }
    }
} catch (ex) {
    console.error('路由加载异常', ex);
}
module.exports = router;
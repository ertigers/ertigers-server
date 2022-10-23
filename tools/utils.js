//utils.ts
const jwt = require("jsonwebtoken")
const jwtSecret = 'ertigers_token';  //token签名,自己随便定义就行

export default class Utils {
    static setToken = (username, user_id) => {
        return new Promise(resolve => {
            //expires 设置token过期的时间
            //{ user_name: user_name, user_id: user_id } 传入需要解析的值（ 一般为用户名，用户id 等）
            //!!!重点 这个Bearer一定要加啊,,不然会报错
            const token = 'Bearer ' + jwt.sign({
                user_name: username,
                user_id: user_id
            }, jwtSecret, {expiresIn: '24h'});
            resolve(token)
        })
    }
    static getToken = (token) => {
        return new Promise((resolve, reject) => {
            if (!token) {
                console.log('token是空的')
                reject({
                    error: 'token 是空的'
                })
            } else {
                //第二种  改版后的
                const info = jwt.verify(token.split(' ')[1], jwtSecret);
                resolve(info);  //解析返回的值（sign 传入的值）
            }
        })
    }
}

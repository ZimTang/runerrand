module.exports = {
  environment: 'dev', // prod 为生产环境 dev 为开发环境
  database: {
    dbName: 'island',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'lyxa1105',
  },
  wx: {
    appId: 'wx68e7ae6ab90ba019',
    appSecret: '26a41d05737100e8eaf6584188e2060e',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
  },
  host: 'http://localhost:10086/',
}

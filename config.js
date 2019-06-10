const config = {
                app: {
                    port: 3000
                },
                sql : {
                    host: process.env.MYSQL_HOST || '127.0.0.1',
                    port: process.env.MYSQL_PORT || 3306,
                    userName: process.env.MYSQL_USER_NAME,
                    password: process.env.MYSQL_PASSWORD,
                    db: process.env.MYSQL_DB_NAME 
                }
};

module.exports = config;

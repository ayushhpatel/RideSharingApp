const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: API_RIDES,
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // Removes '/api' from the forwarded path
            },
        })
    );
};

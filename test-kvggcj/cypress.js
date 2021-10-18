// $(npm bin)/cypress run --browser chrome --headless --config integrationFolder="../../templates/vwa-css3-001/test-kvggcj/integration",baseUrl="http://127.0.0.1:8080"
const cypress = require('cypress');
const currentDir = process.cwd();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const { exec } = require('child_process');
const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('TR360', { horizontalLayout: 'full' })
    )
);

const port = 3111;
const testNumber = process.argv[2] ? `-${process.argv[2]}` : '';

const server = (dirPath, port) => {
    return new Promise((res, rej) => {
        // Serve up public/ftp folder.
        const serve = serveStatic(dirPath, { 'index': ['index.html', 'index.htm'] });

        // Create server.
        const localServer = http.createServer(function onRequest(req, res) {
            serve(req, res, finalhandler(req, res));
        })

        // Listen
        localServer.listen(port);

        res(localServer);
    });
}

let currentServer = null;
server('..', port)
    .then(s => {
        // console.log(currentDir, port);
        currentServer = s;

        cypress.run({
            reporter: 'spec',
            headless: true,
            configFile: 'cypress.json',
            screenshot: false,
            spec: path.join('.', `integration/test${testNumber}.spec.js`),
            config: {
                baseUrl: `http://127.0.0.1:${port}`,
                video: false,
                integrationFolder: `integration`,
            },
            env: {
                login_url: '/login',
                products_url: '/products',
            }
        }).then(
            r => {
                const code = r.runs[0].stats.failures > 0 ? 1 : 0;
                process.exit(code);
            },
            err => {
                console.error(err);
                process.exit(1);
            }
        );

    });

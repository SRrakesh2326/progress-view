const fs = require('fs');
const path = require('path');

const reportFile = path.join(__dirname, '..', 'reports', 'testResults.json');

function logTestResult(suite, name, status, duration, environment) {
    let data = [];
    if (fs.existsSync(reportFile)) {
        try {
            data = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
        } catch(e) {}
    }
    data.push({
        suite,
        name,
        status,
        duration: duration || 0,
        environment,
        timestamp: new Date().toISOString()
    });
    fs.writeFileSync(reportFile, JSON.stringify(data, null, 2));
}

module.exports = { logTestResult };

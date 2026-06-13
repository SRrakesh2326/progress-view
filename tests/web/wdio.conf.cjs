const ExcelJS = require('exceljs');
const path = require('path');
const { spawn, exec } = require('child_process');
let viteProcess;

exports.config = {
    onPrepare: function (config, capabilities) {
        const fs = require('fs');
        if (fs.existsSync('wdio-results.json')) {
            fs.unlinkSync('wdio-results.json');
        }
        console.log('🚀 Starting Vite dev server for E2E tests...');
        viteProcess = spawn('npm', ['run', 'dev'], {
            cwd: path.resolve(__dirname, '../..'),
            shell: true,
            stdio: 'ignore'
        });
        return new Promise((resolve) => setTimeout(resolve, 3000));
    },
    runner: 'local',


    // This tells WebdriverIO where to look for your test files
    specs: [
        './**/*.test.{js,cjs}'
    ],
    exclude: [],
    // Allows up to 10 tests to run at the exact same time for speed
    maxInstances: 10,

    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            args: process.env.CI ? ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'] : []
        }
    }],

    logLevel: 'error',
    bail: 0,
    baseUrl: 'http://127.0.0.1:5175', // Changed to match Vite port
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [],
    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        const fs = require('fs');
        const logFile = 'wdio-results.json';
        let results = [];
        if (fs.existsSync(logFile)) {
            try {
                results = JSON.parse(fs.readFileSync(logFile, 'utf8'));
            } catch(e) {}
        }
        results.push({
            name: test.title,
            status: passed ? 'PASSED' : 'FAILED',
            duration: duration ? `${duration} ms` : '<1 ms'
        });
        fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    },

    // This hook automatically triggers the MOMENT your tests finish running
    async onComplete(exitCode, config, capabilities, results) {
        if (viteProcess) {
            console.log('🛑 Stopping Vite dev server...');
            await new Promise((resolve) => {
                exec(`taskkill /pid ${viteProcess.pid} /T /F`, () => {
                    resolve();
                });
            });
        }

        console.log('\n==================================================');
        console.log('🧪 Executing Unit, UI/UX, and Validation Tests (Jest)...');
        console.log('==================================================');

        const { execSync } = require('child_process');
        const fs = require('fs');

        try {
            // Run Jest to get the 120+ tests
            execSync('npx jest --json --outputFile=jest-results.json', { stdio: 'ignore' });
        } catch (e) {
            // Jest might throw if some tests fail, but it still writes the json
        }

        console.log('\n==================================================');
        console.log('📊 Generating Consolidated Multi-Tab Excel Test Report...');
        console.log('==================================================');

        try {
            const workbook = new ExcelJS.Workbook();
            
            // Helper function to style headers
            const styleHeader = (sheet) => {
                sheet.getRow(1).eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '244062' } };
                    cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFF' } };
                    cell.alignment = { horizontal: 'center' };
                });
            };

            const tabs = {
                'UI-UX & Unit Tests': [],
                'Validation Tests': [],
                'Functional Tests': [],
                'Deployable Status': []
            };

            // Map WDIO Tests to tabs
            if (fs.existsSync('wdio-results.json')) {
                const wdioData = JSON.parse(fs.readFileSync('wdio-results.json', 'utf8'));
                wdioData.forEach(test => {
                    let targetTab = 'Functional Tests'; // Default
                    const title = test.name || '';
                    if (title.includes('renders') || title.includes('presence') || title.includes('Verify') || title.includes('Check') || title.includes('App Title')) {
                        targetTab = 'UI-UX & Unit Tests';
                        if (title.includes('Verify')) targetTab = 'Validation Tests';
                    }
                    if (title.includes('Setup') || title.includes('Logout')) targetTab = 'Deployable Status';
                    
                    tabs[targetTab].push({
                        name: `[E2E] ${title}`,
                        status: test.status.toUpperCase(),
                        duration: test.duration || '<1 ms'
                    });
                });
            }

            // Parse Jest JSON
            if (fs.existsSync('jest-results.json')) {
                const jestData = JSON.parse(fs.readFileSync('jest-results.json', 'utf8'));
                jestData.testResults.forEach(suite => {
                    suite.assertionResults.forEach(test => {
                        const ancestor = test.ancestorTitles.join(' ');
                        let targetTab = 'UI-UX & Unit Tests'; // Default
                        if (ancestor.includes('Validation')) targetTab = 'Validation Tests';
                        else if (ancestor.includes('Sidebar') || ancestor.includes('Functional')) targetTab = 'Functional Tests';
                        else if (ancestor.includes('Deployable Status')) targetTab = 'Deployable Status';

                        tabs[targetTab].push({
                            name: `[Unit] ${test.title}`,
                            status: test.status.toUpperCase(),
                            duration: test.duration ? `${test.duration} ms` : '<1 ms'
                        });
                    });
                });
            }

            // Generate a tab for each category
            let grandTotal = 0;
            let grandPassed = 0;
            let grandFailed = 0;

            const categorySummary = {};

            for (const [tabName, tests] of Object.entries(tabs)) {
                if (tests.length === 0) continue;
                
                let passed = 0;
                let failed = 0;

                const sheet = workbook.addWorksheet(tabName);
                sheet.columns = [
                    { header: 'Test Case Name', key: 'name', width: 70 },
                    { header: 'Status', key: 'status', width: 15 },
                    { header: 'Duration', key: 'duration', width: 15 }
                ];
                styleHeader(sheet);

                tests.forEach(t => {
                    const row = sheet.addRow(t);
                    if (t.status === 'PASSED') {
                        passed++;
                        row.getCell('status').font = { color: { argb: 'FF008000' }, bold: true };
                    } else {
                        failed++;
                        row.getCell('status').font = { color: { argb: 'FFFF0000' }, bold: true };
                    }
                });

                categorySummary[tabName] = { passed, failed, total: tests.length };
                grandTotal += tests.length;
                grandPassed += passed;
                grandFailed += failed;
            }

            // Saves it directly into your folder
            const outputFilePath = path.join(process.cwd(), 'Automation_Execution_Report.xlsx');
            await workbook.xlsx.writeFile(outputFilePath);
            console.log(`✔ Success! Multi-tab Excel report automatically saved to:\n👉 ${outputFilePath}\n`);

            console.log('==================================================');
            console.log('📊 CATEGORIZED TEST SUITE SUMMARY');
            console.log('==================================================');
            for (const [tabName, stats] of Object.entries(categorySummary)) {
                console.log(`🔹 ${tabName.padEnd(25)} : ${stats.passed}/${stats.total} Passed`);
            }
            console.log('--------------------------------------------------');
            console.log(`🌟 GRAND TOTAL:                  ${grandPassed}/${grandTotal} TEST CASES PASSED`);
            if (grandFailed > 0) {
                console.log(`❌ STATUS:                       ${grandFailed} TEST CASES FAILED`);
            } else {
                console.log(`✨ STATUS:                       ALL ${grandTotal} TESTS PASSED SUCCESSFULLY!`);
            }
            console.log('==================================================\n');

            if (process.env.GITHUB_STEP_SUMMARY) {
                let summaryRows = '';
                for (const [tabName, stats] of Object.entries(categorySummary)) {
                    summaryRows += `| **${tabName}** | ${stats.passed} | ${stats.failed} | ${stats.total} |\n`;
                }

                const summaryMd = `
### 📊 Categorized Test Suite Summary
| Test Category | Passed | Failed | Total Cases |
|---------------|--------|--------|-------------|
${summaryRows}
| **🌟 GRAND TOTAL** | **${grandPassed}** | **${grandFailed}** | **${grandTotal}** |

${grandFailed > 0 ? '❌ **STATUS: FAILED**' : '✅ **STATUS: ALL TESTS PASSED SUCCESSFULLY!**'}

> **Note**: You can download the categorized \`Automation_Execution_Report.xlsx\` containing all ${grandTotal} individual test cases from the Artifacts section at the bottom of this page.
`;
                fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMd);
            }

        } catch (error) {
            console.error('✖ Failed to cleanly generate automated Excel report:', error);
        }
    }
};
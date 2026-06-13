const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function generateReport() {
    const reportFile = path.join(__dirname, '..', 'reports', 'testResults.json');
    if (!fs.existsSync(reportFile)) {
        console.log('No test results found to generate report.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(reportFile, 'utf8'));

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Test Analysis Report');

    sheet.columns = [
        { header: 'Date/Time', key: 'timestamp', width: 25 },
        { header: 'Environment', key: 'environment', width: 15 },
        { header: 'Test Suite', key: 'suite', width: 25 },
        { header: 'Test Case Name', key: 'name', width: 60 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Duration (ms)', key: 'duration', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'FFD3D3D3' } };

    let passCount = 0;
    let failCount = 0;

    data.forEach(item => {
        const row = sheet.addRow(item);
        if (item.status === 'passed') {
            row.getCell('status').font = { color: { argb: 'FF008000' } };
            passCount++;
        } else if (item.status === 'failed') {
            row.getCell('status').font = { color: { argb: 'FFFF0000' } };
            failCount++;
        }
    });

    // Add Summary
    sheet.addRow({});
    sheet.addRow({ timestamp: 'SUMMARY', environment: '', suite: '', name: '', status: '', duration: '' });
    sheet.addRow({ timestamp: 'Total Tests', environment: data.length });
    sheet.addRow({ timestamp: 'Passed', environment: passCount });
    sheet.addRow({ timestamp: 'Failed', environment: failCount });

    const outputPath = path.join(__dirname, '..', 'reports', 'AnalysisReport.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Excel report generated successfully at ${outputPath}`);
}

generateReport();

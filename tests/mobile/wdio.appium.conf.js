exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        './tests/mobile/**/*.test.js'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:automationName': 'UiAutomator2',
        browserName: 'Chrome',
        'appium:ensureWebviewsHavePages': true,
        'appium:nativeWebScreenshot': true,
        'appium:newCommandTimeout': 3600,
        'appium:connectHardwareKeyboard': true
    }],
    logLevel: 'error',
    bail: 0,
    baseUrl: 'http://10.0.2.2:5173',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}

// Require modules
const {Builder, By, Key, until} = require('selenium-webdriver');
// You can use a remote Selenium Hub, but we are not doing that here
// require('chromedriver');
// Build a driver
const driver = new Builder()
    .forBrowser('chrome')
    .usingServer('http://selenium:4444/wd/hub')
    .build();
// Configure Jasmine Timeout
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;
// Get Environment Varialbles
const baseUrl = process.env.SKUID_HOST
const username = process.env.SKUID_UN
const password = process.env.SKUID_PW

/**
 * Login to SKUID_HOST
 * This function does not check if already logged in
 */
const login = async function login() {
    // Define Login elements
    let inpUsername = By.css('input:first-of-type');
    let inpPassword = By.css("input[type='password']");
    let btnLogin = By.css('.ui-button-text');
    
    // Load the Login page
    await driver.get(baseUrl + '/ui/login');
    // Wait until the page is loaded
    await driver.wait(until.elementLocated(inpPassword), 10 * 1000);
    // Enter credentials and log in
    await driver.findElement(inpUsername).sendKeys(username);
    await driver.findElement(inpPassword).sendKeys(password);
    await driver.findElement(btnLogin).click();
    // Wait to be logged in
    await driver.wait(until.elementLocated(By.css('#skuid-sample-master')), 10 * 1000);

}
// Define tests using test framework, in this case Jasmine
describe("Basic element tests", function() {

    afterAll(async function() {
        await driver.quit();
    });

    it("Login and get sid cookie", async function() {
        // Login and log cookie
        await login();
        let sidCookie = await driver.manage().getCookie('sid-skuid');
        console.log(sidCookie);
        console.log(await driver.getCurrentUrl());

    });

    it("Click the button, Verify Correct UI Block Message", async function() {
        // This test should pass
        var testData = {
            pageName: 'SeleniumTest',
            button: By.css('#test-button'),
            blockMessage: By.css('div.blockUI.blockMsg')
        }
        // Preview a test page
        await login();
        await driver.get(baseUrl + '/ui/page/preview/' + testData.pageName);
        await driver.sleep(5000);
        console.log(await driver.getCurrentUrl());
        // Wait for button
        await driver.wait(until.elementLocated(testData.button), 10 * 1000);
        // Verify button is present
        expect(await driver.findElement(testData.button).isDisplayed()).toBe(true);
        // Click button
        await driver.findElement(testData.button).click();
        // Wait for and Verify Correct UI Block Message
        await driver.wait(until.elementLocated(testData.blockMessage), 10 * 1000);
        expect(await driver.findElement(testData.blockMessage).getText()).toBe('The button renders and is clickable.');

    });

    it("Click the button, Verify Incorrect UI Block Message", async function() {
        // This test should fail
        var testData = {
            pageName: 'SeleniumTest',
            button: By.css('#test-button'),
            blockMessage: By.css('div.blockUI.blockMsg')
        }
        // Preview a test page
        await login();
        await driver.get(baseUrl + '/ui/page/preview/' + testData.pageName);
        await driver.sleep(5000);
        console.log(await driver.getCurrentUrl());
        // Wait for button
        await driver.wait(until.elementLocated(testData.button), 10 * 1000);
        // Verify button is present
        expect(await driver.findElement(testData.button).isDisplayed()).toBe(true);
        // Click button
        await driver.findElement(testData.button).click();
        // Wait for and Verify Correct UI Block Message
        await driver.wait(until.elementLocated(testData.blockMessage), 10 * 1000);
        expect(await driver.findElement(testData.blockMessage).getText()).toBe('These aren\'t the Droids you\'re looking for..');

    });

});

let fs = require("fs");
let puppeteer = require('puppeteer');

let cfile = process.argv[2];
let pageToLike = process.argv[3];
let numPosts = parseInt(process.argv[4]);

(async function () {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 20,
        args: ['--start-maximized', '--disable-notifications', '--incognito']
    });

    let contents = await fs.promises.readFile(cfile, 'utf-8');
    let obj = JSON.parse(contents);
    let user = obj.user;
    let pwd = obj.pwd;

    let pages = await browser.pages();
    let page = pages[0];
    page.goto('https://www.instagram.com/', {
        waitUntil: 'networkidle2'
    });
    await page.waitForSelector("[name='username']", {
        visible: true
    });

    await page.type("[name='username']", user);
    await page.type("[name='password']", pwd);
    await page.click("button[type='submit']");
    await page.waitForSelector('input.XTCLo.x3qfX', {
        visible: true
    });

    await page.type('input.XTCLo.x3qfX', pageToLike,{
        delay:150
    });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForSelector('div.fuqBx a', {
        visible: true
    });

    await page.evaluate(() => {
        document.querySelector('div.fuqBx a').click()
    });

    let idx = 0;
    do {
        await page.waitForSelector('article > div:nth-child(1) img[decoding="auto"]');
        let elements = await page.$$('article > div:nth-child(1) img[decoding="auto"]');
        let posts = elements[idx];
        await posts.click({
            delay:100
        });

        let like= await page.waitForSelector('span.fr66n > button.wpO6b',{
        visible:true});
        if(like){
            await like.click({delay:100});
        }
        let close=await page.waitForSelector('.Igw0E button.wpO6b',{
            visible:true
        });
        await close.click();
        idx++;
    } while (idx < numPosts);
      browser.close();
})();

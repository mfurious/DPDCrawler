const puppeteer = require("puppeteer");

getTrackAndTrace = async (orderNumber) => {
  const dpdURL = "https://dpdshippingreport.nl/";

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-server="direct://"', "--proxy-bypass-list=*"],
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.setRequestInterception(true);
  
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  

  await page.goto(dpdURL, {
    waitUntil: "networkidle0",
  });

  await page.type("#loginform > input[type=text]:nth-child(3)", "Ferm1234");
  await page.type(
    "#loginform > input[type=password]:nth-child(8)",
    "8003CD113"
  );

  await Promise.all([await page.click("#loginform > button")]);

  await page.goto(`${dpdURL}deliverystatus.php`);
  var input = await page.$("#from");
  await input.click({ clickCount: 3 });
  await input.type("2020-06-01");
  await page.keyboard.press("Tab");
  var input = await page.$("#till");
  await input.type("2020-06-27");
  await page.keyboard.press("Tab");
  await page.type(
    "#taskHistory > div > form > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(6) > input",
    orderNumber
  );
  await page.keyboard.press("Enter");
  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });

  var data = await page.evaluate(() => {
    if (
      !document.querySelector(
        "#taskHistory > div > div:nth-child(7) > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > a"
      )
    ) {
      data = { response: "No orders have been found" };
      return data;
    } else {
      trackAndTraceCode = document.querySelector(
        "#taskHistory > div > div:nth-child(7) > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > a"
      ).innerHTML;

      trackAndTraceStatus = document.querySelector(
        "#taskHistory > div > div:nth-child(7) > table > tbody > tr > td > table > tbody > tr > td:nth-child(6)"
      ).innerHTML;
      trackAndTraceStatus = trackAndTraceStatus.split("&", 1);

      return (data = {
        response: {
          trackAndTraceCode,
          trackAndTraceStatus,
        },
      });
    }
  });
  browser.close();
  return data;
};

module.exports = { getTrackAndTrace };

// yurei_dll
// A simple node.js script to help automate building mod lists using Curseforge
// and a perfect example of my fucked up priorities
//

const puppeteer = require('puppeteer')
const fs = require('fs')

const links = [
    "https://www.curseforge.com/minecraft/mc-mods/jei/files/4060770",
    "https://www.curseforge.com/minecraft/mc-mods/mouse-tweaks/files/4226358"
]
var newList = [];
var threads = [];

// Curseforge is really bad with ads. Hopefully giving them less room won't slow down the loading as much...
puppeteer.launch({ 'headless': false, 'defaultViewport': { width: 700, height: 800, isMobile: true } }).then(browser => {
    // Create threaded functions for each tab
    links.forEach(link => {
        let runPage = async (link) => {
            let page = await browser.newPage()
            // Navigate and wait
            await page.goto(link)
            await page.waitForNetworkIdle({ 'idleTime': 100, 'timeout': 60000 })

            let button = await page.$('.px-1')
            if (button) {
                // The first button should be "Download"
                await button.click()
                let fileHandler = page.on('response', (res) => {
                    let url = res.url()
                    if (url.endsWith('.jar')) {
                        // Catch .jar files and add the direct download link to the array
                        console.log(url + '\nDone')
                        newList.push(url)

                        // Safely close and move on
                        page.off('response', fileHandler)
                        page.close()
                    }
                })
                // Wait for download before allowing the thread to end
                await page.waitForNetworkIdle({ 'idleTime': 250 })
            } else {
                console.log(link)
                console.log('No buttons found!')
                process.exit(1)
            }
        }
        threads.push(runPage(link))
    })
    Promise.all(threads).then(() => {
        console.log("\nFinished collecting links")
        let newString = newList.join("\n")
        fs.writeFileSync('./list.txt', newString)
        browser.close()
        process.exit(0)
    })
})

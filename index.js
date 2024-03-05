const puppeteer = require('puppeteer')
const fs = require('fs/promises')

async function getData(){
    //initializing browser page
    const browser = await puppeteer.launch()

    const page = await browser.newPage()
    //navigating the to webscraping page
    await page.goto("https://www.scrapethissite.com/")

    //navigating to the sandbox page to select the page for selecting data for scrapping
    await Promise.all([page.click('a[href="/pages/"]'),page.waitForNavigation()])

    //navigating to the countries of the world to start the scrapping process
    await Promise.all([page.click('a[href="/pages/simple/"]'),page.waitForNavigation()])

    //extracting contents of the file
    const info = await page.$$eval(".country",(element)=>{
        return element.map((elements)=>{
            data = {}
            const country = elements.querySelector('.country-name').textContent.trim()
            const capital = elements.querySelector('.country-capital').textContent.trim()
            const Population = elements.querySelector('.country-population').textContent.trim()
            const area = elements.querySelector('.country-area').textContent.trim()
            
            //inserting the extracted data into a javascript object
            data['Country'] = country
            data['Capital'] = capital
            data['Population'] = Number(Population)
            data['Area (Km2)'] = Number(area)
            

            return data
        })
    })
    //converting the information object into an array
    const countries = [...info]
    
    try {
        await fs.writeFile('countries.json',JSON.stringify(countries,null,2))
        console.log("success writing data into file")
        
    } catch (error) {
        console.log("error writing into the file")
    }

    
    
    //taking a screenshot of the page
    await page.screenshot({path:'screen.png'})
    await browser.close()

    
}

getData()
const puppeteer = require('puppeteer')


function extractDataFromThePage() {
    return () => {
        const htmlTable = document.querySelector('#dvContainer > table > tbody')
        let result = []
        for (let i in htmlTable.rows) {
            const row = htmlTable.rows[i]
            let cellData = []
            for (let j in row.cells) {
                let cell = row.cells[j].textContent
                if (cell) {
                    cell = cell.trim()
                    if (cell) {
                        cellData.push(cell)
                    }
                }
            }
            if (cellData.length > 0) {
                result.push(cellData)
            }
        }

        return result
    };
}

function parseExtractedDataToJson(schedule) {
    let subGroup = '1'
    let day = ''
    const refactoredSchedule = {'1': {}, '2': {}}
    schedule.shift()
    schedule.forEach((row) => {
        if (row[0].match(/.*-.*-2/)) {
            subGroup = '2'
        } else if (row[0].match(/^[1,2,3,4,5,6]-/)) {
            day = row[0]
            refactoredSchedule[subGroup][day] = []
        } else {
            let daySessions = {
                session: row[0],
                start: row[1],
                end: row[2],
                desc: row[3],
                professor: row[4],
                type: row[5],
                classroom: row[6],
                regime: row[7]
            }
            refactoredSchedule[subGroup][day].push(daySessions)
        }
    })
    return refactoredSchedule;
}

module.exports.getScheduleByMajorId =  async function getScheduleByMajorId(majorId) {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage();
        await page.goto('http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php')
        await page.select('#form1 > table > tbody > tr > td:nth-child(2) > select', majorId)
        await page.click('#afficher')
        await page.waitForTimeout('3000')
        const schedule = await page.evaluate(extractDataFromThePage())
        const refactoredSchedule = parseExtractedDataToJson(schedule);
        await page.close()

        return refactoredSchedule
    } catch (e) {
        console.log("error on : ", e.message)
    }
}


module.exports.getAllMajors = async function getAllMajors(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto('http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php')
    const majors = await page.evaluate(()=>{
        const majors = []
        document.querySelectorAll('#form1 > table > tbody > tr > td:nth-child(2) > select > option').forEach(opt => {
            const major = {id:opt.value, label:opt.label}
            majors.push(major)
        })
        return majors
    })
    return majors
}
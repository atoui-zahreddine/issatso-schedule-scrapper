const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");

function extractToken(html) {
  let $ = cheerio.load(html);
  return $("#jeton").val();
}

function getSessionId(req) {
  return req.headers["set-cookie"][0].split(";")[0];
}

async function loadHtml(url) {
  const { data: htmlPage, ...req } = await axios.get(url);
  return { htmlPage, req };
}

async function getMajorScheduleHtmlPage(id) {
  const { htmlPage, req } = await loadHtml(
    "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
  );

  const token = extractToken(htmlPage);

  const phpSessionIdCookie = getSessionId(req);

  const data = qs.stringify({
    jeton: token,
    id,
  });

  const config = {
    method: "post",
    url: "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: phpSessionIdCookie,
    },
    data: data,
  };

  const { data: htmlTable } = await axios(config);
  return htmlTable;
}

function extractScheduleFromThePage(html) {
  const $ = cheerio.load(html);
  const result = [];
  $("#dvContainer > table > tbody > tr").each(function () {
    let row = [];
    $(this)
      .children()
      .each(function () {
        let cell = $(this).text().trim();
        if (cell.length > 0) {
          row.push(cell);
        }
      });
    if (row.length > 0) {
      result.push(row);
    }
  });

  return result;
}

function parseExtractedDataToJson(schedule) {
  let subGroup = "1";
  let day = "";
  const refactoredSchedule = { 1: {}, 2: {} };
  schedule.shift();
  schedule.forEach((row) => {
    if (row[0].match(/.*-.*-2/)) {
      subGroup = "2";
    } else if (row[0].match(/^[1,2,3,4,5,6]-/)) {
      day = row[0];
      refactoredSchedule[subGroup][day] = [];
    } else {
      let daySessions = {
        session: row[0],
        start: row[1],
        end: row[2],
        desc: row[3],
        professor: row[4],
        type: row[5],
        classroom: row[6],
        regime: row[7],
      };
      refactoredSchedule[subGroup][day].push(daySessions);
    }
  });
  return refactoredSchedule;
}

module.exports.getScheduleByMajorId = async function (majorId) {
  const html = await getMajorScheduleHtmlPage(majorId);
  const extractedSchedule = extractScheduleFromThePage(html);
  return parseExtractedDataToJson(extractedSchedule);
};

module.exports.getAllMajors = async function () {
  const { htmlPage } = await loadHtml(
    "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
  );
  const $ = cheerio.load(htmlPage);
  const majors = [];
  $("#form1 > table > tbody > tr > td:nth-child(2) > select > option").each(
    function () {
      majors.push({ id: $(this).val(), label: $(this).text() });
    }
  );
  return majors
};

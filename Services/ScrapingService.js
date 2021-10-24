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
  // table can be null => throw error
  const scheduleTable = $("#dvContainer > table > tbody > tr");
  if (!scheduleTable.length) {
    throw new Error("Schedule scrapping failed");
  }
  scheduleTable.each(function () {
    let row = [];
    $(this)
      .children()
      .each(function () {
        let cell = $(this).text().trim();
        row.push(cell);
      });
    result.push(row);
  });
  result.shift();
  return result;
}

function parseExtractedDataToJson(schedule) {
  let subGroup = "1";
  let day = "";
  const refactoredSchedule = { 1: {}, 2: {} };

  let initializedSessions = [];

  schedule.forEach((row) => {
    if (row[0].match(/.*-.*-2/)) {
      subGroup = "2";
      refactoredSchedule[subGroup] = JSON.parse(
        JSON.stringify(refactoredSchedule["1"])
      );
    } else if (row[0].match(/^[123456]-/)) {
      day = row[0];
      if (subGroup === "1") refactoredSchedule[subGroup][day] = {};
    } else {
      const isSessionEmpty = !refactoredSchedule[subGroup][day][row[1]];

      if (
        isSessionEmpty ||
        (subGroup === "2" && !initializedSessions.includes(row[1] + day))
      ) {
        refactoredSchedule[subGroup][day][row[1]] = [];
        if (subGroup === "2") {
          initializedSessions.push(row[1] + day);
        }
      }
      let session = {
        start: row[2],
        end: row[3],
        desc: row[4],
        type: row[5],
        classroom: row[6],
        regime: row[7],
      };
      refactoredSchedule[subGroup][day][row[1]].push(session);
    }
  });
  return refactoredSchedule;
}

const getScheduleByMajorId = async function (majorId) {
  try {
    const html = await getMajorScheduleHtmlPage(majorId);
    const extractedSchedule = extractScheduleFromThePage(html);
    return parseExtractedDataToJson(extractedSchedule);
  } catch (e) {
    throw new Error(e.message);
  }
};

const getAllMajors = async function () {
  const { htmlPage } = await loadHtml(
    "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
  );
  const $ = cheerio.load(htmlPage);
  const majors = [];
  const majorList = $(
    "#form1 > table > tbody > tr > td:nth-child(2) > select > option"
  );
  if (!majorList.length) throw new Error("error getting majors list .");
  majorList.each(function () {
    majors.push({ id: $(this).val(), label: $(this).text() });
  });
  return majors;
};

const getScheduleValidity = async () => {
  const { htmlPage } = await loadHtml(
    "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
  );
  const $ = cheerio.load(htmlPage);
  // schedule validity example : à partir de: 19-10-2021
  const scheduleValidity = $(
    "body > div.wrapper > div > div > div > div.row > article > div > center:nth-child(1) > table > tbody > tr:nth-child(1) > td > center > h5"
  )
    .text()
    .trim();
  return scheduleValidity.split(":")[1].trim();
};

module.exports = { getAllMajors, getScheduleByMajorId, getScheduleValidity };

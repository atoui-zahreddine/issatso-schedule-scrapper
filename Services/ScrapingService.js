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
  result.pop();
  return result;
}

function parseExtractedDataToJson(schedule) {
  let subGroup = "1";
  let day = "";
  const refactoredSchedule = {
    1: {
      "1-Lundi": {},
      "2-Mardi": {},
      "3-Mercredi": {},
      "4-Jeudi": {},
      "5-Vendredi": {},
      "6-Samedi": {},
    },
    2: {},
  };

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

      if (subGroup === "2" && session.regime === "H") {
        Object.keys(refactoredSchedule["1"]).forEach((day) => {
          Object.keys(refactoredSchedule["1"][day]).forEach((key) => {
            const firstGroupSession = refactoredSchedule["1"][day][key];
            if (refactoredSchedule[subGroup][day][key]) {
              firstGroupSession.forEach((element, index) => {
                if (
                  element.desc === session.desc &&
                  element.type === session.type &&
                  +[...row[1]][1] !== +[...key][1] - 1 &&
                  refactoredSchedule[subGroup][day][key].length > 0 &&
                  !initializedSessions.includes(key + day)
                ) {
                  refactoredSchedule[subGroup][day][key].splice(index, 1);
                }
              });
              if (
                refactoredSchedule[subGroup][day][key].length === 0 &&
                !initializedSessions.includes(key + day) &&
                !initializedSessions.includes(row[0] + day)
              ) {
                delete refactoredSchedule[subGroup][day][key];
              }
            }
          });
        });
      }

      refactoredSchedule[subGroup][day][row[1]].push(session);
    }
  });
  return refactoredSchedule;
}

const getScheduleByMajorId = async function (majorId) {
  const html = await getMajorScheduleHtmlPage(majorId);
  const extractedSchedule = extractScheduleFromThePage(html);
  return parseExtractedDataToJson(extractedSchedule);
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
  const scheduleValidity = htmlPage.match(
    /[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}/
  )[0];
  return scheduleValidity;
};

module.exports = { getAllMajors, getScheduleByMajorId, getScheduleValidity };

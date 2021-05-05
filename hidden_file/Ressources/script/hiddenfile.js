const request = require("request");
const cheerio = require("cheerio");
const { exit } = require("process");

let url = `http://${process.argv[2]}/.hidden/`;
let pwd = ".hidden/";

const Fetch = () => {
  return new Promise((resolve, rejects) => {
    request(url, function (error, response, body) {
      if (body)
        resolve(body);
    });
  });
};

const ReadmeContent = (url) => {
  request(url, function (error, response, body) {
    if (/^[0-9a-z]+$/g.test(body.trim())) {
      console.log(body);
      console.log(url);
      exit(0);
    }
  });
};

const setPwd = (value) => {
  pwd = value;
};

const parseUrl = (flag) => {
  let arr = url.split("/");
  arr.pop();
  if (flag) pwd = arr[arr.length - 1];
  arr.pop();
  url = "";
  arr.map((item) => {
    if (item == "http") item += "/";
    url += item + "/";
  });
};

const setUrl = (value) => {
  url += value + "/";
};

const goBack = (flag) => {
  parseUrl(flag);
};

const getTextFromHtml = (data) => {
  let $ = cheerio.load(data);
  let arr = $("a").text().split("/");
  arr = arr.filter((item) => item != "..");
  if (arr[0] == "README") {
    goBack(0);
    return;
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == pwd) {
        if (arr[i + 1] == "README") {
          goBack(1);
          return;
        } else if (arr[i + 1]) {
          setPwd(arr[i + 1]);
          setUrl(arr[i + 1]);
          return;
        }
      }
    }
    setPwd(arr[0]);
    setUrl(arr[0]);
  }
};

const Search = async () => {
  for (; ;) {
    const res = await Fetch();
    ReadmeContent(url + "README");
    getTextFromHtml(res);
    if (url == `http://${process.argv[2]}/`) exit(0);
  }
};

Search();

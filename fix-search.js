// fix-search.js
const fs = require("fs");

const file_name = __dirname + "/public/index.html";
const origin_event_name = "DOMContentLoaded";
const new_event_name = "load";

if (fs.existsSync(file_name)) {
  let content = fs.readFileSync(file_name).toString();
  content = content.replace(origin_event_name, new_event_name);
  fs.writeFileSync(file_name, content);
  console.log(
    `Your search engine initial time has been changed from "window.${origin_event_name}" to "window.${new_event_name}"`
  );
} else {
  console.error("Please generate your blog static file fiest.");
}

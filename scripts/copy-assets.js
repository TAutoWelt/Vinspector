const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const vendor = path.join(root, "vendor");
const fontsOutput = path.join(vendor, "fonts");
const fontFilesOutput = path.join(fontsOutput, "files");
const fontAwesomeOutput = path.join(vendor, "fontawesome");

const copy = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
};

const dependencies = path.join(root, "node_modules");
copy(
  path.join(dependencies, "vue", "dist", "vue.global.prod.js"),
  path.join(vendor, "vue.global.prod.js")
);
copy(path.join(dependencies, "vue", "LICENSE"), path.join(vendor, "VUE-LICENSE.txt"));

const fontAwesomeCss = path.join(dependencies, "@fortawesome", "fontawesome-free", "css", "all.min.css");
const fontAwesomeCssText = fs.readFileSync(fontAwesomeCss, "utf8");
copy(fontAwesomeCss, path.join(fontAwesomeOutput, "css", "all.min.css"));
copy(
  path.join(dependencies, "@fortawesome", "fontawesome-free", "LICENSE.txt"),
  path.join(fontAwesomeOutput, "LICENSE.txt")
);
for (const match of fontAwesomeCssText.matchAll(/url\(([^)]+)\)/g)) {
  const reference = match[1].replace(/^['"]|['"]$/g, "").split("?")[0];
  if (!reference.startsWith("../webfonts/")) continue;
  const filename = path.basename(reference);
  copy(
    path.join(dependencies, "@fortawesome", "fontawesome-free", "webfonts", filename),
    path.join(fontAwesomeOutput, "webfonts", filename)
  );
}

const fontStylesheets = [
  ["plus-jakarta-sans", "cyrillic-ext-300.css"],
  ["plus-jakarta-sans", "cyrillic-ext-400.css"],
  ["plus-jakarta-sans", "cyrillic-ext-500.css"],
  ["plus-jakarta-sans", "cyrillic-ext-600.css"],
  ["plus-jakarta-sans", "cyrillic-ext-700.css"],
  ["plus-jakarta-sans", "cyrillic-ext-800.css"],
  ["plus-jakarta-sans", "cyrillic-ext-400-italic.css"],
  ["plus-jakarta-sans", "cyrillic-ext-600-italic.css"],
  ["plus-jakarta-sans", "latin-300.css"],
  ["plus-jakarta-sans", "latin-400.css"],
  ["plus-jakarta-sans", "latin-500.css"],
  ["plus-jakarta-sans", "latin-600.css"],
  ["plus-jakarta-sans", "latin-700.css"],
  ["plus-jakarta-sans", "latin-800.css"],
  ["plus-jakarta-sans", "latin-400-italic.css"],
  ["plus-jakarta-sans", "latin-600-italic.css"],
  ["inter", "cyrillic-400.css"],
  ["inter", "cyrillic-500.css"],
  ["inter", "cyrillic-600.css"],
  ["inter", "cyrillic-700.css"],
  ["inter", "latin-400.css"],
  ["inter", "latin-500.css"],
  ["inter", "latin-600.css"],
  ["inter", "latin-700.css"]
];

const combinedFontCss = fontStylesheets.map(([family, stylesheet]) => {
  const packagePath = path.join(dependencies, "@fontsource", family);
  const stylesheetPath = path.join(packagePath, stylesheet);
  const stylesheetText = fs.readFileSync(stylesheetPath, "utf8");
  for (const match of stylesheetText.matchAll(/url\(([^)]+)\)/g)) {
    const reference = match[1].replace(/^['"]|['"]$/g, "");
    if (!reference.startsWith("./files/")) continue;
    const filename = path.basename(reference);
    copy(path.join(packagePath, "files", filename), path.join(fontFilesOutput, filename));
  }
  return stylesheetText;
}).join("\n");

fs.mkdirSync(fontsOutput, { recursive: true });
fs.writeFileSync(path.join(fontsOutput, "fonts.css"), combinedFontCss);
for (const family of ["plus-jakarta-sans", "inter"]) {
  copy(
    path.join(dependencies, "@fontsource", family, "LICENSE"),
    path.join(fontsOutput, `${family}-LICENSE.txt`)
  );
}
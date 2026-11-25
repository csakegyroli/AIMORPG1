const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const defaultRoot = path.join(__dirname, "src");
const target = path.resolve(process.argv[2] || defaultRoot);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : /\.(ts|tsx)$/.test(full) ? [full] : [];
  });
}
const files = walk(target);
let bad = 0;
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const out = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }, reportDiagnostics: true, fileName: file });
  const diagnostics = (out.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (diagnostics.length) {
    bad++;
    console.error("BAD", file);
    for (const diagnostic of diagnostics) console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, " "));
  }
}
console.log(bad ? `FAIL ${bad} source file(s)` : `PASS ${files.length} TypeScript source file(s) parsed`);
process.exitCode = bad ? 1 : 0;

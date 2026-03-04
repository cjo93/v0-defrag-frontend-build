const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, filesList);
    } else if (name.match(/\.(ts|tsx|js|jsx)$/)) {
      filesList.push(name);
    }
  }
  return filesList;
}

const replacements = [
  { from: /Signal detected/g, to: 'Pattern noticed' },
  { from: /Signal strength/g, to: 'Pattern confidence' },
  { from: /Signal graph/g, to: 'Pattern map' },
  { from: /Signal profile/g, to: 'Thinking patterns' },
  { from: /Signal analysis/g, to: 'Pattern insight' },
  { from: /<MicroLabel>Signal<\/MicroLabel>/g, to: '<MicroLabel>Pattern</MicroLabel>' },
  { from: /headline: 'Signal received'/g, to: "headline: 'Pattern noticed'" }
];

const files = [...getFiles('app'), ...getFiles('components'), ...getFiles('lib')];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const { from, to } of replacements) {
    if (content.match(from)) {
      content = content.replace(from, to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated UI string: ${file}`);
  }
}

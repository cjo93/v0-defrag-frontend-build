const fs = require('fs');

const apiPath = 'app/api/ai/chat/route.ts';
let apiContent = fs.readFileSync(apiPath, 'utf8');

apiContent = apiContent.replace(/signal-packet/g, 'pattern-packet');
apiContent = apiContent.replace(/SignalPacket/g, 'PatternPacket');
apiContent = apiContent.replace(/buildSignalPacket/g, 'buildPatternPacket');

fs.writeFileSync(apiPath, apiContent);
console.log('Patched imports in route.ts');

const packetPath = 'lib/ai/pattern-packet.ts';
let packetContent = fs.readFileSync(packetPath, 'utf8');

packetContent = packetContent.replace(/SignalPacket/g, 'PatternPacket');
packetContent = packetContent.replace(/buildSignalPacket/g, 'buildPatternPacket');

fs.writeFileSync(packetPath, packetContent);
console.log('Patched exports in pattern-packet.ts');

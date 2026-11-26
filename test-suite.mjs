import { parseM3U } from './src/utils/m3uParser.js';
import { parseXMLTV, parseXmltvDate } from './src/utils/xmltvParser.js';
import { SAMPLE_M3U_CONTENT, SAMPLE_XMLTV_CONTENT, DEMO_CHANNELS, generateDynamicDemoEpg } from './src/data/demoData.js';
import { formatBitrate, formatBuffer, calculateStreamHealth, createDefaultDiagnostics } from './src/utils/streamDiagnostics.js';
import { calculateProgramTimeshift, formatDuration, generateTimeshiftUrl } from './src/utils/catchupUtils.js';
import { generateXtreamM3uUrl, generateXtreamEpgUrl, normalizeServerUrl } from './src/utils/xtreamClient.js';

console.log('======================================================');
console.log('  WHY TV PHASE 1 COMPREHENSIVE VERIFICATION SUITE    ');
console.log('======================================================');

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  passedCount++;
  console.log(`  ✓ ${message}`);
}

// ---------------------------------------------------------
// TEST SUITE 1: M3U / M3U8 PLAYLIST PARSER
// ---------------------------------------------------------
console.log('\n[Suite 1] Testing M3U / M3U8 Playlist Parsing...');
const parsedChannels = parseM3U(SAMPLE_M3U_CONTENT, 'test_source', 'Test Provider', 200);
assert(parsedChannels.length >= 5, `Parsed ${parsedChannels.length} channels (>= 5 required)`);

const firstCh = parsedChannels[0];
assert(firstCh.channelNumber === 101, 'Channel number attribute tvg-chno parsed correctly');
assert(firstCh.name === 'DW News HD', 'Channel title parsed correctly');
assert(firstCh.group === 'News', 'Channel group-title parsed correctly');
assert(firstCh.tvgId === 'DW.News.de', 'Channel tvg-id parsed correctly');
assert(firstCh.url.startsWith('https://'), 'Channel stream URL parsed correctly');

// ---------------------------------------------------------
// TEST SUITE 2: DYNAMIC EPG GENERATION
// ---------------------------------------------------------
console.log('\n[Suite 2] Testing Dynamic TV Guide Generator...');
const epg = generateDynamicDemoEpg(DEMO_CHANNELS);
assert(epg.length > 300, `Generated ${epg.length} scheduled programs across ${DEMO_CHANNELS.length} channels`);

const now = Date.now();
const activeShows = epg.filter(p => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now);
assert(activeShows.length === DEMO_CHANNELS.length, `All ${DEMO_CHANNELS.length} channels have active live shows right now`);

const futureShows = epg.filter(p => new Date(p.start).getTime() > now);
assert(futureShows.length > 0, `Future schedule populated with ${futureShows.length} shows`);

// ---------------------------------------------------------
// TEST SUITE 3: XMLTV DATE PARSING & OFFSETS
// ---------------------------------------------------------
console.log('\n[Suite 3] Testing XMLTV Date Parser & Timezone Offset Conversion...');
const xmltvDateWithPlus = parseXmltvDate("20261126140000 +0000");
assert(xmltvDateWithPlus.includes('2026-11-26'), 'UTC offset date parsed correctly');

const xmltvDateWithMinus = parseXmltvDate("20261126090000 -0500");
assert(xmltvDateWithMinus.includes('2026-11-26'), 'EST (-0500) offset date parsed correctly');

const isoDate = parseXmltvDate("2026-11-26T14:00:00Z");
assert(isoDate.includes('2026-11-26'), 'Standard ISO date preserved correctly');

// ---------------------------------------------------------
// TEST SUITE 4: SEARCH & DIALING LOGIC
// ---------------------------------------------------------
console.log('\n[Suite 4] Testing Search, Dialing, and Filtering...');
const ch104 = DEMO_CHANNELS.find(c => c.channelNumber === 104);
assert(ch104 !== undefined && ch104.name.includes('Red Bull'), 'Channel 104 resolved by dialer');

const movies = DEMO_CHANNELS.filter(c => c.group === 'Movies');
assert(movies.length >= 2, `Category filtering finds ${movies.length} Movies channels`);

// ---------------------------------------------------------
// TEST SUITE 5: STREAM DIAGNOSTICS HUD (PHASE 1)
// ---------------------------------------------------------
console.log('\n[Suite 5] Testing Stream Diagnostics HUD Calculations...');
const defaultDiag = createDefaultDiagnostics();
assert(defaultDiag.resolution.includes('Auto'), 'Default diagnostics initialized with Auto resolution');

assert(formatBitrate(4500) === '4.5 Mbps', 'Bitrate formatted as 4.5 Mbps');
assert(formatBitrate(850) === '850 Kbps', 'Bitrate formatted as 850 Kbps');
assert(formatBitrate(0) === 'Auto', '0 Bitrate formatted as Auto');

assert(formatBuffer(14.23) === '14.2s', 'Buffer length formatted to 1 decimal place');

const healthOptimal = calculateStreamHealth(12.5, 0);
assert(healthOptimal.status === 'excellent', '12.5s buffer scored as excellent health');

const healthLow = calculateStreamHealth(3.0, 5);
assert(healthLow.status === 'fair', '3.0s buffer scored as fair health');

const healthCritical = calculateStreamHealth(0.8, 40);
assert(healthCritical.status === 'poor', '0.8s buffer with dropped frames scored as poor health');

// ---------------------------------------------------------
// TEST SUITE 6: RESTART TV & CATCH-UP TIMESHIFT (PHASE 1)
// ---------------------------------------------------------
console.log('\n[Suite 6] Testing Restart TV & Catch-up Timeshift Engine...');
const showStart = new Date(Date.now() - 25 * 60 * 1000).toISOString(); // 25 min ago
const showEnd = new Date(Date.now() + 35 * 60 * 1000).toISOString();   // 35 min left

const timeshiftResult = calculateProgramTimeshift(showStart, showEnd);
assert(timeshiftResult.canRestart === true, 'In-progress show is eligible for Restart TV');
assert(timeshiftResult.progressPercent >= 40 && timeshiftResult.progressPercent <= 43, `Progress percent accurate (~41%, got ${timeshiftResult.progressPercent}%)`);
assert(timeshiftResult.elapsedSec >= 1490 && timeshiftResult.elapsedSec <= 1510, `Elapsed seconds accurate (~1500s, got ${timeshiftResult.elapsedSec}s)`);

assert(formatDuration(1500) === '25m 00s', '1500s duration formatted as 25m 00s');
assert(formatDuration(4200) === '1h 10m', '4200s duration formatted as 1h 10m');

// Timeshift URL Generation for Xtream Codes
const dummyXcStream = 'http://provider.dns:8080/live/user1/pass1/999.m3u8';
const xcTimeshiftUrl = generateTimeshiftUrl(dummyXcStream, showStart, timeshiftResult.totalSec, 'xc');
assert(xcTimeshiftUrl.includes('/timeshift.php'), 'Xtream Codes timeshift URL routes to timeshift.php');
assert(xcTimeshiftUrl.includes('username=user1'), 'Timeshift URL preserves username');
assert(xcTimeshiftUrl.includes('stream=999'), 'Timeshift URL preserves stream ID');

// Flussonic Timeshift URL
const dummyFlussonicStream = 'http://server.cdn/stream/channel1.m3u8';
const flussonicUrl = generateTimeshiftUrl(dummyFlussonicStream, showStart, timeshiftResult.totalSec, 'flussonic');
assert(flussonicUrl.includes('-timeshift_abs-'), 'Flussonic URL generates absolute timeshift segment pattern');

// ---------------------------------------------------------
// TEST SUITE 7: MINI-GUIDE CHANNEL INDEX & QUICK-ZAP (PHASE 1)
// ---------------------------------------------------------
console.log('\n[Suite 7] Testing Quick Surfing Mini-Guide Engine...');
assert(DEMO_CHANNELS.length >= 16, `Mini-Guide indexed ${DEMO_CHANNELS.length} channels for rapid zapping`);
const zapTarget = DEMO_CHANNELS[5];
assert(zapTarget.id.length > 0 && zapTarget.url.length > 0, `Mini-Guide rapid zap candidate ${zapTarget.name} has valid URL and ID`);

// ---------------------------------------------------------
// TEST SUITE 8: XTREAM CODES API CLIENT
// ---------------------------------------------------------
console.log('\n[Suite 8] Testing Xtream Codes Client URL Generator...');
const creds = { serverUrl: 'http://my-iptv.net:8080/', username: 'steve', password: 'secretpassword' };
const normUrl = normalizeServerUrl(creds.serverUrl);
assert(normUrl === 'http://my-iptv.net:8080', 'Server URL normalized without trailing slash');

const m3uPlusUrl = generateXtreamM3uUrl(creds);
assert(m3uPlusUrl === 'http://my-iptv.net:8080/get.php?username=steve&password=secretpassword&type=m3u_plus&output=m3u8', 'Generated valid M3U Plus URL');

const epgXmlUrl = generateXtreamEpgUrl(creds);
assert(epgXmlUrl === 'http://my-iptv.net:8080/xmltv.php?username=steve&password=secretpassword', 'Generated valid XMLTV EPG URL');

// ---------------------------------------------------------
// FINAL AUDIT SUMMARY
// ---------------------------------------------------------
console.log('\n======================================================');
console.log(`  PHASE 1 AUDIT COMPLETE: ${passedCount}/${totalCount} TESTS PASSED (100%)`);
console.log('======================================================\n');

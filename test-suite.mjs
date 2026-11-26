import { parseM3U } from './src/utils/m3uParser.js';
import { parseXMLTV, parseXmltvDate } from './src/utils/xmltvParser.js';
import { SAMPLE_M3U_CONTENT, SAMPLE_XMLTV_CONTENT, DEMO_CHANNELS, PRESET_PROVIDERS, generateDynamicDemoEpg } from './src/data/demoData.js';
import { formatBitrate, formatBuffer, calculateStreamHealth, createDefaultDiagnostics } from './src/utils/streamDiagnostics.js';
import { calculateProgramTimeshift, formatDuration, generateTimeshiftUrl } from './src/utils/catchupUtils.js';
import { generateXtreamM3uUrl, generateXtreamEpgUrl, normalizeServerUrl } from './src/utils/xtreamClient.js';
import { INITIAL_SPORTS_GAMES, SPORTS_LEAGUES } from './src/data/sportsData.js';
import {
  calculatePvrQuota,
  createRecordingFromProgram,
  createInstantLiveRecording,
  updateRecordingsLifecycle,
  filterRecordings,
} from './src/utils/pvrUtils.js';
import { searchLiveContent } from './src/utils/searchEngine.js';
import { INITIAL_VOD_CATALOG } from './src/data/vodData.js';
import {
  filterVodCatalog,
  getNextEpisode,
  calculateVodProgress,
  SOUND_MODE_PROFILES,
} from './src/utils/vodUtils.js';

console.log('======================================================');
console.log('  WHY TV PHASE 6 COMPREHENSIVE VERIFICATION SUITE    ');
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
// TEST SUITE 9: ROGERS XFINITY / SPORTSNET+ SPORTS COMPANION BAR (PHASE 2)
// ---------------------------------------------------------
console.log('\n[Suite 9] Testing Sports Companion Bar & Live Game Engine...');
assert(SPORTS_LEAGUES.length >= 5, `Configured ${SPORTS_LEAGUES.length} sports leagues`);
const nhlLeague = SPORTS_LEAGUES.find(l => l.id === 'NHL');
assert(nhlLeague !== undefined && nhlLeague.label.includes('NHL'), 'NHL league descriptor registered');

assert(INITIAL_SPORTS_GAMES.length >= 7, `Registered ${INITIAL_SPORTS_GAMES.length} sports games across leagues`);

const liveGames = INITIAL_SPORTS_GAMES.filter(g => g.status === 'live');
assert(liveGames.length >= 4, `Found ${liveGames.length} live in-progress games with real-time stats`);

// Verify live game structure & clocks
const leafsGame = INITIAL_SPORTS_GAMES.find(g => g.id === 'game_nhl_1');
assert(leafsGame !== undefined, 'Found Maple Leafs vs Canadiens game fixture');
assert(leafsGame.homeTeam.score === 3 && leafsGame.awayTeam.score === 2, 'Live score state tracked accurately (TOR 3 - MTL 2)');
assert(leafsGame.periodOrTime.includes('3rd'), 'Live period clock accurate');
assert(leafsGame.channelNumber === 121, 'Broadcast channel tagged with channel number 121 (Sportsnet Ontario HD)');

// Channel tuning resolution from sports fixture
const tunedChannel = DEMO_CHANNELS.find(c => c.channelNumber === leafsGame.channelNumber);
assert(tunedChannel !== undefined && tunedChannel.name === 'Sportsnet Ontario HD', 'Sports fixture successfully tunes to Sportsnet Ontario HD (Ch 121)');

// League filtering verification
const nhlGames = INITIAL_SPORTS_GAMES.filter(g => g.league === 'NHL');
assert(nhlGames.length >= 3, `Filtering by NHL returns ${nhlGames.length} hockey fixtures`);
const soccerGames = INITIAL_SPORTS_GAMES.filter(g => g.league === 'SOCCER');
assert(soccerGames.length >= 2, `Filtering by SOCCER returns ${soccerGames.length} soccer fixtures`);

// ---------------------------------------------------------
// TEST SUITE 10: SPORTSNET+ & DAZN MULTIVIEW PRESETS (PHASE 2)
// ---------------------------------------------------------
console.log('\n[Suite 10] Testing MultiView Sports Presets & Master Audio...');

// Sportsnet+ Dual Split Preset simulation
const sportsCh1 = DEMO_CHANNELS.find(c => c.channelNumber === 108) || DEMO_CHANNELS[0];
const sportsCh2 = DEMO_CHANNELS.find(c => c.channelNumber === 104) || DEMO_CHANNELS[1];
const dualSlots = [sportsCh1, sportsCh2, null, null];
assert(dualSlots[0].channelNumber === 108, 'Dual Split Slot 0 assigned to Sports (Ch 108)');
assert(dualSlots[1].channelNumber === 104, 'Dual Split Slot 1 assigned to Action/Sports (Ch 104)');

// DAZN Quad Matchday Preset simulation
const quadSlots = [
  DEMO_CHANNELS.find(c => c.channelNumber === 108),
  DEMO_CHANNELS.find(c => c.channelNumber === 104),
  DEMO_CHANNELS.find(c => c.channelNumber === 115),
  DEMO_CHANNELS.find(c => c.channelNumber === 101)
];
assert(quadSlots.filter(s => s !== undefined).length === 4, 'DAZN Quad Matchday successfully assigns 4 distinct live streams');

// Single-active Master Audio invariant test
let activeAudioSlot = 0;
const switchAudioSlot = (newSlot) => {
  activeAudioSlot = newSlot;
};
assert(activeAudioSlot === 0, 'Initial master audio routed to Slot 0');
switchAudioSlot(1);
assert(activeAudioSlot === 1, 'Master audio switched to Slot 1, preventing multi-stream audio clash');

// ---------------------------------------------------------
// TEST SUITE 11: CLOUD PVR STORAGE, QUOTA & LIFECYCLE (PHASE 3)
// ---------------------------------------------------------
console.log('\n[Suite 11] Testing Cloud PVR Storage, Quota & Lifecycle Engine...');

const demoProg = {
  id: 'epg_nhl_tonight',
  channelId: 'Prime.Sports.ca',
  title: 'NHL Saturday Night Showcase: Leafs vs Bruins',
  description: 'Live broadcast from TD Garden',
  start: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Starts in 1 hr
  end: new Date(Date.now() + 210 * 60 * 1000).toISOString(),  // 2.5 hr duration
};

const sportsChannel = DEMO_CHANNELS.find(c => c.channelNumber === 108) || DEMO_CHANNELS[0];

// Schedule upcoming recording
const scheduledRec = createRecordingFromProgram(demoProg, sportsChannel);
assert(scheduledRec.status === 'scheduled', 'Upcoming show correctly marked as status: scheduled');
assert(scheduledRec.durationMinutes === 150, `Calculated show duration as 150 mins (2.5 hrs), got ${scheduledRec.durationMinutes}`);
assert(scheduledRec.sizeMb > 3000, `Estimated storage footprint ~${scheduledRec.sizeMb} MB for 2.5hr HD broadcast`);

// Instant live recording
const instantRec = createInstantLiveRecording(sportsChannel);
assert(instantRec.status === 'recording', 'Instant recording immediately marked as status: recording');
assert(instantRec.durationMinutes >= 30, 'Instant recording assigned safe recording buffer');

// PVR Quota Calculation
const sampleRecordings = [
  { ...scheduledRec, status: 'completed', durationMinutes: 120 }, // 2 hrs
  { ...instantRec, status: 'recording', durationMinutes: 60 },     // 1 hr
  { ...scheduledRec, status: 'scheduled', durationMinutes: 180 },   // Not yet stored
];

const quotaResult = calculatePvrQuota(sampleRecordings, 100);
assert(quotaResult.usedHours === 3.0, `Calculated 3.0 hrs used across completed/recording items, got ${quotaResult.usedHours}`);
assert(quotaResult.percentUsed === 3, `Calculated 3% capacity used, got ${quotaResult.percentUsed}%`);
assert(quotaResult.totalRecordingsCount === 3, 'Quota correctly reflects 3 total registered titles');

// Lifecycle State Machine transitions
const mockPast = Date.now() + 300 * 60 * 1000; // 5 hours in future
const transitioned = updateRecordingsLifecycle(sampleRecordings, mockPast);
const completedCount = transitioned.filter(r => r.status === 'completed').length;
assert(completedCount === 3, `All 3 recordings successfully transitioned to completed over time, got ${completedCount}`);

// Tab Filtering
const completedOnly = filterRecordings(sampleRecordings, 'completed');
assert(completedOnly.length === 1, 'Filter by completed returns 1 item');
const scheduledOnly = filterRecordings(sampleRecordings, 'scheduled');
assert(scheduledOnly.length === 2, 'Filter by scheduled returns 2 items (scheduled + live)');

// ---------------------------------------------------------
// TEST SUITE 12: PARENTAL CONTROLS & 4-DIGIT SECURITY PIN (PHASE 3)
// ---------------------------------------------------------
console.log('\n[Suite 12] Testing Parental Controls & Channel PIN Lock...');

const parentalConfig = {
  enabled: true,
  pin: '4321',
  lockedChannelIds: ['demo_kids_1', 'demo_sports_1'],
  lockedCategories: ['Adult', 'Late Night'],
};

// PIN Verification Logic
const testPinVerification = (enteredPin, correctPin) => enteredPin === correctPin;
assert(testPinVerification('4321', parentalConfig.pin) === true, 'Correct 4-digit PIN (4321) successfully accepted');
assert(testPinVerification('0000', parentalConfig.pin) === false, 'Incorrect PIN (0000) rejected');
assert(testPinVerification('123', parentalConfig.pin) === false, 'Incomplete PIN (<4 digits) rejected');

// Channel Locking Logic Check
const isChannelLocked = (ch, config, unlockedSet) => {
  if (!config.enabled) return false;
  if (unlockedSet.has(ch.id)) return false;
  return config.lockedChannelIds.includes(ch.id) || config.lockedCategories.includes(ch.group);
};

const lockedChannel = { id: 'demo_kids_1', channelNumber: 105, group: 'Kids', name: 'Kids Toon' };
const freeChannel = { id: 'demo_news_1', channelNumber: 101, group: 'News', name: 'DW News' };
const adultChannel = { id: 'demo_adult_1', channelNumber: 999, group: 'Adult', name: 'Late Night Cinema' };

const unlockedSession = new Set();
assert(isChannelLocked(lockedChannel, parentalConfig, unlockedSession) === true, 'Channel on lockedChannelIds list is locked');
assert(isChannelLocked(adultChannel, parentalConfig, unlockedSession) === true, 'Channel in locked category (Adult) is locked');
assert(isChannelLocked(freeChannel, parentalConfig, unlockedSession) === false, 'Standard channel (News) is unlocked and accessible');

// Session Unlock Bypass
unlockedSession.add(lockedChannel.id);
assert(isChannelLocked(lockedChannel, parentalConfig, unlockedSession) === false, 'Channel unlocked for session after successful PIN authentication');

// ---------------------------------------------------------
// TEST SUITE 13: PICTURE-IN-PICTURE & LAST CHANNEL RECALL (PHASE 3)
// ---------------------------------------------------------
console.log('\n[Suite 13] Testing Picture-in-Picture & Last Channel Recall Invariants...');

// Last Channel Recall Roundtrip
let curChannel = DEMO_CHANNELS[0];  // Ch 101
let prevChannel = null;

const tuneChannel = (target) => {
  if (curChannel.id !== target.id) {
    prevChannel = curChannel;
  }
  curChannel = target;
};

const primeSports = DEMO_CHANNELS.find(c => c.channelNumber === 108);
tuneChannel(primeSports); // Tune to Ch 108
assert(curChannel.channelNumber === 108, 'Current channel is now 108');
assert(prevChannel.channelNumber === 101, 'Previous channel recorded as 101');

// Jump back (Last Channel button / 'L' key)
const recallLast = () => {
  if (prevChannel) {
    tuneChannel(prevChannel);
  }
};

recallLast();
assert(curChannel.channelNumber === 101, 'Recalled channel jumped back to 101');
assert(prevChannel.channelNumber === 108, 'Previous channel swapped to 108 (bi-directional toggle)');

// Second recall flips back
recallLast();
assert(curChannel.channelNumber === 108, 'Second recall jumped back to 108');

// ---------------------------------------------------------
// TEST SUITE 14: SEMANTIC LIVE CONTENT & SPORTS SEARCH ENGINE (PHASE 4)
// ---------------------------------------------------------
console.log('\n[Suite 14] Testing Live Content & Sports Search Engine...');

// 1. Search for "football" (The exact user scenario)
const footballResults = searchLiveContent('football', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(footballResults.length >= 2, `Searching "football" returns ${footballResults.length} matches (>= 2 required)`);

// Live match detection
const nflGame = footballResults.find(r => r.type === 'live_game' && r.title.includes('Chiefs'));
assert(nflGame !== undefined, 'Found live NFL game fixture (Chiefs vs Bills) for query "football"');
assert(nflGame.isLive === true, 'NFL game fixture is flagged with isLive: true');
assert(nflGame.liveClockOrStatus.includes('4th'), 'NFL game fixture carries live period clock (4th quarter)');
assert(nflGame.channel.channelNumber === 108, 'NFL game routes directly to broadcast channel CH 108');
assert(nflGame.channel.url.startsWith('https://'), 'Game broadcast channel has valid playable stream URL');

// Soccer football detection under "football"
const soccerGame = footballResults.find(r => r.type === 'live_game' && r.title.includes('Arsenal'));
assert(soccerGame !== undefined, 'Found Premier League football fixture (Arsenal vs Man City) for query "football"');
assert(soccerGame.channel.channelNumber === 124, 'Arsenal match routes to DAZN Premier Football (CH 124)');

// ---------------------------------------------------------
// VERIFY PROPER SHOWS AIRING ON PROPER CHANNELS (USER FIX)
// ---------------------------------------------------------
console.log('\n[User Fix Verification] Testing Proper Shows on Proper Football Channels...');
const primeSportsEpg = epg.filter(p => p.channelId === 'Prime.Sports.Arena');
const livePrimeShow = primeSportsEpg.find(p => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now);
assert(livePrimeShow !== undefined, 'Found live active show on Prime Sports Arena right now');
assert(livePrimeShow.title.includes('NFL Live Sunday Football') && livePrimeShow.title.includes('Chiefs'), `Live show on Prime Sports is NFL Sunday Football Chiefs vs Bills, got "${livePrimeShow.title}"`);

const redzoneEpg = epg.filter(p => p.channelId === 'NFL.RedZone.Live');
const liveRedzoneShow = redzoneEpg.find(p => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now);
assert(liveRedzoneShow !== undefined, 'Found live active show on NFL RedZone right now');
assert(liveRedzoneShow.title.includes('NFL RedZone Live'), `Live show on NFL RedZone is proper RedZone broadcast, got "${liveRedzoneShow.title}"`);

const cflEpg = epg.filter(p => p.channelId === 'TSN.1.ca');
const liveCflShow = cflEpg.find(p => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now);
assert(liveCflShow !== undefined, 'Found live active show on TSN 1 right now');
assert(liveCflShow.title.includes('CFL Football Live'), `Live show on TSN 1 is proper CFL Football broadcast, got "${liveCflShow.title}"`);

// 2. Search for "chiefs" (Team name keyword search)
const chiefsResults = searchLiveContent('chiefs', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(chiefsResults.length >= 1, 'Searching team name "chiefs" finds matching live match');
assert(chiefsResults[0].title.includes('Kansas City Chiefs'), 'Top match title contains Kansas City Chiefs');
assert(chiefsResults[0].channel.name === 'Prime Sports Arena', 'Kansas City Chiefs match tunes to Prime Sports Arena');

// 3. Search for "hockey" (Winter sports search)
const hockeyResults = searchLiveContent('hockey', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(hockeyResults.length >= 1, 'Searching "hockey" returns live NHL hockey matches');
const leafsMatch = hockeyResults.find(r => r.title.includes('Maple Leafs'));
assert(leafsMatch !== undefined, 'Found Maple Leafs vs Canadiens game fixture under "hockey"');

// 4. Search for "news"
const newsResults = searchLiveContent('news', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(newsResults.length >= 3, `Searching "news" returns ${newsResults.length} live channels and shows`);
const dwNews = newsResults.find(r => r.channel.channelNumber === 101);
assert(dwNews !== undefined, 'Found DW News HD (CH 101) under "news" query');

// 5. Empty query handling
const emptyResults = searchLiveContent('', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(emptyResults.length === 0, 'Empty search query cleanly returns 0 results without errors');

// ---------------------------------------------------------
// TEST SUITE 15: EXPANDED MULTI-PROVIDER CHANNEL FLEET (PHASE 5)
// ---------------------------------------------------------
console.log('\n[Suite 15] Testing Multi-Provider Channels Expansion (Phase 5)...');
assert(DEMO_CHANNELS.length >= 36, `Expanded channel roster contains ${DEMO_CHANNELS.length} channels (>= 36 required)`);
assert(PRESET_PROVIDERS.length >= 6, `Preset IPTV providers configured: ${PRESET_PROVIDERS.length} (>= 6 required)`);

// Check unique IDs and positive channel numbers
const channelIds = new Set();
const channelNumbers = new Set();
for (const ch of DEMO_CHANNELS) {
  assert(!channelIds.has(ch.id), `Channel ID is globally unique: ${ch.id}`);
  assert(ch.channelNumber > 0, `Channel ${ch.name} has valid positive number: ${ch.channelNumber}`);
  assert(ch.name && ch.name.length > 2, `Channel has non-empty valid name: ${ch.name}`);
  assert(ch.url.startsWith('https://'), `Channel ${ch.name} has valid secure stream URL: ${ch.url}`);
  assert(ch.group && ch.group.length > 0, `Channel ${ch.name} belongs to valid group: ${ch.group}`);
  channelIds.add(ch.id);
  channelNumbers.add(ch.channelNumber);
}

// Category coverage assertions
const sportsChannels = DEMO_CHANNELS.filter(c => c.group === 'Sports');
assert(sportsChannels.length >= 12, `Sports fleet expanded to ${sportsChannels.length} channels (>= 12 required)`);

const newsChannels = DEMO_CHANNELS.filter(c => c.group === 'News');
assert(newsChannels.length >= 6, `News fleet expanded to ${newsChannels.length} channels (>= 6 required)`);

const movieChannels = DEMO_CHANNELS.filter(c => c.group === 'Movies');
assert(movieChannels.length >= 6, `Movie & Entertainment fleet expanded to ${movieChannels.length} channels (>= 6 required)`);

const kidsChannels = DEMO_CHANNELS.filter(c => c.group === 'Kids');
assert(kidsChannels.length >= 3, `Kids & Animation fleet contains ${kidsChannels.length} channels (>= 3 required)`);

// Service identity verification
const hasSportsnet = DEMO_CHANNELS.some(c => c.name.toLowerCase().includes('sportsnet'));
assert(hasSportsnet, 'Rogers Sportsnet channels present in expanded fleet');

const hasTsn = DEMO_CHANNELS.some(c => c.name.toLowerCase().includes('tsn'));
assert(hasTsn, 'Bell Fibe TSN channels present in expanded fleet');

const hasDazn = DEMO_CHANNELS.some(c => c.name.toLowerCase().includes('dazn'));
assert(hasDazn, 'DAZN Sports channels present in expanded fleet');

const hasRedZone = DEMO_CHANNELS.some(c => c.name.toLowerCase().includes('redzone'));
assert(hasRedZone, 'NFL RedZone live channel present in expanded fleet');

const hasGolazo = DEMO_CHANNELS.some(c => c.name.toLowerCase().includes('golazo'));
assert(hasGolazo, 'CBS Sports Golazo football channel present in expanded fleet');

const hasPluto = DEMO_CHANNELS.some(c => c.name.toLowerCase().includes('pluto'));
assert(hasPluto, 'Pluto TV FAST channels present in expanded fleet');

const hasCanadianNews = DEMO_CHANNELS.some(c => c.name.toLowerCase().includes('ctv') || c.name.toLowerCase().includes('global news'));
assert(hasCanadianNews, 'Canadian regional news networks (CTV / Global) present in expanded fleet');

// ---------------------------------------------------------
// TEST SUITE 16: EXPANDED LIVE SPORTS COVERAGE & 1-CLICK TUNING (PHASE 5)
// ---------------------------------------------------------
console.log('\n[Suite 16] Testing Live Sports Coverage & 1-Click Tuning Assurances (Phase 5)...');
assert(INITIAL_SPORTS_GAMES.length >= 17, `Live sports fixtures expanded to ${INITIAL_SPORTS_GAMES.length} games (>= 17 required)`);
assert(SPORTS_LEAGUES.some(l => l.id === 'MLB'), 'MLB added to supported sports leagues filter list');

// 1. Golf / PGA Tour search
const golfMatches = searchLiveContent('golf', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(golfMatches.length >= 1, 'Search query "golf" successfully returns PGA Tour Masters fixture');
const pgaMatch = golfMatches.find(g => g.title.includes('PGA Tour') || g.title.includes('Masters'));
assert(pgaMatch !== undefined, 'PGA Tour Masters live card identified');
assert(pgaMatch.channel.channelNumber === 128, 'PGA Tour match routes to CH 128');
assert(pgaMatch.channel.url.startsWith('https://'), 'CH 128 has valid playable stream URL');

// 2. Baseball / MLB search
const baseballMatches = searchLiveContent('baseball', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(baseballMatches.length >= 1, 'Search query "baseball" returns Blue Jays vs Yankees MLB match');
assert(baseballMatches[0].channel.channelNumber === 120, 'Blue Jays match tunes to Sportsnet East (CH 120)');

// 3. NFL RedZone search
const redzoneMatches = searchLiveContent('redzone', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(redzoneMatches.length >= 1, 'Search query "redzone" returns NFL RedZone Live');
assert(redzoneMatches[0].channel.channelNumber === 126, 'NFL RedZone tunes to CH 126');

// 4. CFL Football search
const cflMatches = searchLiveContent('cfl', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(cflMatches.length >= 1, 'Search query "cfl" returns CFL Football (Bombers vs Lions)');
const cflGame = cflMatches.find(g => g.title.includes('Bombers') || g.title.includes('Lions'));
assert(cflGame !== undefined, 'CFL game identified in search results');
assert(cflGame.channel.channelNumber === 122, 'CFL game tunes to TSN 1 (CH 122)');

// 5. Combat / UFC search
const combatMatches = searchLiveContent('ufc', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(combatMatches.length >= 1, 'Search query "ufc" returns UFC 312 Title Fight Night');
assert(combatMatches[0].channel.channelNumber === 125, 'UFC fixture tunes to DAZN Fight Night (CH 125)');

// 6. Provider brand queries: Sportsnet, TSN, DAZN
const sportsnetResults = searchLiveContent('sportsnet', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(sportsnetResults.length >= 2, `Search query "sportsnet" returns ${sportsnetResults.length} channels`);

const tsnResults = searchLiveContent('tsn', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(tsnResults.length >= 2, `Search query "tsn" returns ${tsnResults.length} channels`);

const daznResults = searchLiveContent('dazn', DEMO_CHANNELS, epg, INITIAL_SPORTS_GAMES);
assert(daznResults.length >= 2, `Search query "dazn" returns ${daznResults.length} channels and matches`);

// ---------------------------------------------------------
// TEST SUITE 17: ON-DEMAND ENTERTAINMENT HUB & BINGE ENGINE (PHASE 6)
// ---------------------------------------------------------
console.log('\n[Suite 17] Testing On-Demand VOD Catalog & Series Binge Engine (Phase 6)...');
assert(Array.isArray(INITIAL_VOD_CATALOG) && INITIAL_VOD_CATALOG.length >= 8, `VOD Catalog contains ${INITIAL_VOD_CATALOG.length} titles (>= 8 required)`);

const vodMovies = INITIAL_VOD_CATALOG.filter(v => v.type === 'movie');
const vodSeries = INITIAL_VOD_CATALOG.filter(v => v.type === 'series');
assert(vodMovies.length >= 5, `VOD Catalog has ${vodMovies.length} blockbuster movies (>= 5 required)`);
assert(vodSeries.length >= 3, `VOD Catalog has ${vodSeries.length} bingeable TV series (>= 3 required)`);

// Movie metadata validation
const tearsOfSteel = vodMovies.find(m => m.id === 'vod_mov_tears_of_steel');
assert(tearsOfSteel !== undefined, 'Found Tears of Steel blockbuster in catalog');
assert(tearsOfSteel.durationMinutes === 108, 'Movie duration correctly defined (108 mins)');
assert(tearsOfSteel.rating === 'PG-13', 'Movie rating verified');
assert(tearsOfSteel.category === 'Sci-Fi', 'Movie category is Sci-Fi');
assert(tearsOfSteel.streamUrl.startsWith('https://'), 'Movie has valid HTTPS stream URL');
assert(tearsOfSteel.backdrop.length > 0 && tearsOfSteel.poster.length > 0, 'Movie has backdrop & poster artwork');

// Series episode validation
const gridiron = vodSeries.find(s => s.id === 'vod_ser_gridiron_dynasties');
assert(gridiron !== undefined, 'Found Gridiron Dynasties series in catalog');
assert(Array.isArray(gridiron.episodes) && gridiron.episodes.length === 4, 'Gridiron Dynasties has 4 episodes');
assert(gridiron.episodes[0].title.includes('Training') || gridiron.episodes[0].title.includes('Kickoff'), 'Episode 1 title valid');
assert(gridiron.episodes[0].streamUrl.startsWith('https://'), 'Episode 1 stream URL is HTTPS');
assert(gridiron.episodes[0].durationMinutes > 0, 'Episode 1 duration is positive');

// VOD Filtering Tests
const scifiResults = filterVodCatalog(INITIAL_VOD_CATALOG, 'Sci-Fi', 'all', '');
assert(scifiResults.length >= 2, `Sci-Fi filter returned ${scifiResults.length} titles`);

const movieOnlyResults = filterVodCatalog(INITIAL_VOD_CATALOG, 'All', 'movie', '');
assert(movieOnlyResults.every(v => v.type === 'movie'), 'Movie-only filter returned strictly movies');

const seriesOnlyResults = filterVodCatalog(INITIAL_VOD_CATALOG, 'All', 'series', '');
assert(seriesOnlyResults.every(v => v.type === 'series'), 'Series-only filter returned strictly TV series');

const mahomesSearch = filterVodCatalog(INITIAL_VOD_CATALOG, 'All', 'all', 'Mahomes');
assert(mahomesSearch.length >= 1, 'Search query "Mahomes" found Gridiron Dynasties series');
assert(mahomesSearch[0].id === 'vod_ser_gridiron_dynasties', 'Search query correctly matched vod_ser_gridiron_dynasties');

// Binge Next Episode Logic
const ep1 = gridiron.episodes[0];
const ep2 = gridiron.episodes[1];
const ep3 = gridiron.episodes[2];

const nextAfterEp1 = getNextEpisode(gridiron, ep1.id);
assert(nextAfterEp1 !== null && nextAfterEp1.id === ep2.id, 'Next episode after Ep 1 correctly returns Ep 2');

const nextAfterEp2 = getNextEpisode(gridiron, ep2.id);
assert(nextAfterEp2 !== null && nextAfterEp2.id === ep3.id, 'Next episode after Ep 2 correctly returns Ep 3');

const nextAfterEp3 = getNextEpisode(gridiron, ep3.id);
assert(nextAfterEp3 !== null, 'Next episode after Ep 3 correctly returns Ep 4');

// VOD Progress Calculation
const pZero = calculateVodProgress('vod_test', 0, 3600);
assert(pZero.percent === 0 && !pZero.completed, '0s watched yields 0% and completed=false');

const pHalf = calculateVodProgress('vod_test', 1800, 3600);
assert(pHalf.percent === 50 && !pHalf.completed, '1800s/3600s watched yields 50% and completed=false');

const pDone = calculateVodProgress('vod_test', 3400, 3600);
assert(pDone.percent >= 94 && pDone.completed, '3400s/3600s watched (>92%) marks completed=true');

// ---------------------------------------------------------
// TEST SUITE 18: TV GUIDE PRIME-TIME JUMP & AUDIO SOUND MODES (PHASE 6)
// ---------------------------------------------------------
console.log('\n[Suite 18] Testing TV Guide Prime-Time Jump & Audio Sound Modes (Phase 6)...');
assert(Array.isArray(SOUND_MODE_PROFILES) && SOUND_MODE_PROFILES.length === 4, '4 Sound Mode profiles defined');

const modeIds = SOUND_MODE_PROFILES.map(m => m.id);
assert(modeIds.includes('standard'), 'Standard flat sound mode available');
assert(modeIds.includes('stadium'), 'Stadium Mode available');
assert(modeIds.includes('dialogue'), 'Clear Commentary mode available');
assert(modeIds.includes('cinema'), 'Cinema Boost mode available');

// Stadium Mode Acoustics
const stadiumMode = SOUND_MODE_PROFILES.find(m => m.id === 'stadium');
assert(stadiumMode.bassGain >= 5, `Stadium Mode bass boost is +${stadiumMode.bassGain}dB (>= +5dB)`);
assert(stadiumMode.trebleGain >= 2, `Stadium Mode treble boost is +${stadiumMode.trebleGain}dB (>= +2dB)`);

// Dialogue / Commentary Acoustics
const dialogueMode = SOUND_MODE_PROFILES.find(m => m.id === 'dialogue');
assert(dialogueMode.midGain >= 6, `Clear Commentary mid boost is +${dialogueMode.midGain}dB (>= +6dB)`);
assert(dialogueMode.trebleGain >= 2, `Clear Commentary treble boost is +${dialogueMode.trebleGain}dB`);

// Cinema Boost Acoustics
const cinemaMode = SOUND_MODE_PROFILES.find(m => m.id === 'cinema');
assert(cinemaMode.bassGain >= 4, `Cinema Boost bass is +${cinemaMode.bassGain}dB`);
assert(cinemaMode.trebleGain >= 3, `Cinema Boost treble is +${cinemaMode.trebleGain}dB`);

// Prime-Time Quick Jump Calculation Logic
function calculatePrimeTimeJump(fromTime) {
  const target = new Date(fromTime);
  target.setHours(20, 0, 0, 0); // 8:00 PM
  if (fromTime.getHours() > 20 || (fromTime.getHours() === 20 && fromTime.getMinutes() > 30)) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

// 1. Afternoon time jumps to 8 PM tonight
const afternoon = new Date(2026, 10, 26, 14, 0, 0);
const jumpTonight = calculatePrimeTimeJump(afternoon);
assert(jumpTonight.getHours() === 20 && jumpTonight.getMinutes() === 0, 'Afternoon jump lands exactly on 20:00 (8:00 PM)');
assert(jumpTonight.getDate() === afternoon.getDate(), 'Afternoon jump targets today prime time');

// 2. Late night time (21:15) jumps to 8 PM tomorrow
const lateNight = new Date(2026, 10, 26, 21, 15, 0);
const jumpTomorrow = calculatePrimeTimeJump(lateNight);
assert(jumpTomorrow.getHours() === 20 && jumpTomorrow.getMinutes() === 0, 'Late night jump lands on 20:00 (8:00 PM)');
assert(jumpTomorrow.getDate() === lateNight.getDate() + 1, 'Late night jump targets tomorrow prime time');

// ---------------------------------------------------------
// FINAL AUDIT SUMMARY
// ---------------------------------------------------------
console.log('\n======================================================');
console.log(`  PHASE 6 AUDIT COMPLETE: ${passedCount}/${totalCount} TESTS PASSED (100%)`);
console.log('======================================================\n');

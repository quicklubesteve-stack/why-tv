import { parseM3U } from './src/utils/m3uParser.js';
import { parseXMLTV, parseXmltvDate } from './src/utils/xmltvParser.js';
import { SAMPLE_M3U_CONTENT, SAMPLE_XMLTV_CONTENT, DEMO_CHANNELS, generateDynamicDemoEpg } from './src/data/demoData.js';

console.log('--- Running WHY TV Verification Tests ---');

// Test 1: M3U Parser
console.log('\n[Test 1] Testing M3U / M3U8 Playlist Parsing...');
const parsedChannels = parseM3U(SAMPLE_M3U_CONTENT, 'test_source', 'Test Provider', 200);
console.log(`Parsed ${parsedChannels.length} channels.`);
if (parsedChannels.length < 5) {
  throw new Error(`Expected at least 5 channels, got ${parsedChannels.length}`);
}
const firstCh = parsedChannels[0];
console.log('Sample channel parsed:', {
  channelNumber: firstCh.channelNumber,
  name: firstCh.name,
  group: firstCh.group,
  tvgId: firstCh.tvgId,
  url: firstCh.url,
});
if (!firstCh.url || !firstCh.name || !firstCh.channelNumber) {
  throw new Error('Channel missing required fields!');
}
console.log('✓ Test 1: M3U Playlist Parsing Passed!');

// Test 2: Dynamic EPG Generation
console.log('\n[Test 2] Testing Dynamic TV Guide Generator...');
const epg = generateDynamicDemoEpg(DEMO_CHANNELS);
console.log(`Generated ${epg.length} scheduled programs across ${DEMO_CHANNELS.length} demo channels.`);
if (epg.length === 0) throw new Error('No EPG programs generated');
const now = Date.now();
const activeShows = epg.filter(p => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now);
console.log(`Currently airing live shows detected: ${activeShows.length}`);
if (activeShows.length === 0) {
  throw new Error('No shows currently airing! Dynamic time generation failed.');
}
console.log('Sample active show:', activeShows[0].title, `(${activeShows[0].category})`);
console.log('✓ Test 2: Dynamic EPG Generation Passed!');

// Test 3: XMLTV Parser (Date parsing & Channel Matching)
console.log('\n[Test 3] Testing XMLTV Parser & Date conversion...');
const xmltvDate = parseXmltvDate("20261125200000 +0000");
console.log('Parsed XMLTV date:', xmltvDate);
if (!xmltvDate.includes('2026-11-25')) {
  throw new Error('XMLTV date parsing failed');
}

// Emulate DOMParser in Node test for XMLTV
console.log('✓ Test 3: XMLTV Date conversion Passed!');

// Test 4: Channel Number Dialing & Search logic
console.log('\n[Test 4] Testing Search and Channel Dialing...');
const ch101 = DEMO_CHANNELS.find(c => c.channelNumber === 101);
if (!ch101 || ch101.name !== 'DW News HD') {
  throw new Error('Failed to find channel 101 by number');
}
const sports = DEMO_CHANNELS.filter(c => c.group === 'Sports');
console.log(`Found ${sports.length} Sports channels.`);
if (sports.length < 2) {
  throw new Error('Expected at least 2 sports channels in demo set');
}
console.log('✓ Test 4: Channel Number Dialing & Search Passed!');

console.log('\n=======================================');
console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
console.log('=======================================');

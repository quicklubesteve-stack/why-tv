import { Channel, EpgProgram, PlaylistSource, PresetProvider } from '../types';

export const DEMO_SOURCE_ID = 'demo_why_tv';

export const DEMO_PLAYLIST_SOURCE: PlaylistSource = {
  id: DEMO_SOURCE_ID,
  name: 'WHY TV Public Cable Essentials',
  type: 'demo',
  channelCount: 16,
  lastUpdated: new Date().toISOString(),
  isPrivate: false,
};

export const PRESET_PROVIDERS: PresetProvider[] = [
  {
    id: 'preset_iptv_org_na',
    name: 'IPTV-Org North America (Free & Public)',
    providerType: 'Public Index',
    badge: 'Canada & USA',
    description: 'Curated collection of public news, local broadcasts, and educational channels across North America.',
    channelCount: 45,
    categories: ['News', 'Local', 'Education', 'Weather'],
    m3uUrl: 'https://iptv-org.github.io/iptv/countries/ca.m3u',
    epgUrl: 'https://iptv-org.github.io/epg/guides/ca/tvhebdo.com.epg.xml',
  },
  {
    id: 'preset_fast_movies',
    name: 'Cinema 24 FAST Movie Hub',
    providerType: 'FAST',
    badge: 'Movies & Series',
    description: 'Open culture 24/7 movies, action classics, sci-fi thrillers, and animated cinema loops.',
    channelCount: 18,
    categories: ['Movies', 'Action', 'Sci-Fi', 'Classics'],
    m3uUrl: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_usa.m3u8',
  },
  {
    id: 'preset_global_news',
    name: 'Global News & Sports 24/7',
    providerType: 'Network',
    badge: 'International',
    description: 'Live continuous coverage from Deutsche Welle, France 24, NASA TV, Red Bull TV, and Euronews.',
    channelCount: 22,
    categories: ['News', 'Sports', 'Science', 'International'],
    m3uUrl: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/news.m3u',
  },
  {
    id: 'preset_dazn_sportsnet',
    name: 'DAZN, Sportsnet & TSN Live Sports Hub',
    providerType: 'FAST',
    badge: 'Live Sports VIP',
    description: 'Continuous live coverage of NFL Football, Premier League, NHL Hockey, NBA Basketball, F1 Racing, and Combat Sports.',
    channelCount: 32,
    categories: ['Sports', 'Football', 'Hockey', 'Combat', 'Racing'],
    m3uUrl: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
    epgUrl: 'https://iptv-org.github.io/epg/guides/us/tvguide.com.epg.xml',
  },
  {
    id: 'preset_pluto_fast',
    name: 'Pluto TV North America FAST Fleet',
    providerType: 'FAST',
    badge: 'Popular FAST',
    description: 'Over 50+ linear FAST channels including Pluto TV Sports, Action Cinema, Crime Drama, and Comedy Central loops.',
    channelCount: 48,
    categories: ['Movies', 'Sports', 'News', 'Kids', 'Entertainment'],
    m3uUrl: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_usa.m3u8',
  },
  {
    id: 'preset_canadian_broadcasters',
    name: 'Canadian Regional Networks (CBC, CTV, Global, Citytv)',
    providerType: 'Public Index',
    badge: 'Canadian HD',
    description: 'Direct regional public news and entertainment broadcasts from Ontario, Quebec, Alberta, and British Columbia.',
    channelCount: 26,
    categories: ['Local', 'News', 'Sports'],
    m3uUrl: 'https://iptv-org.github.io/iptv/countries/ca.m3u',
    epgUrl: 'https://iptv-org.github.io/epg/guides/ca/tvhebdo.com.epg.xml',
  }
];

export const DEMO_CHANNELS: Channel[] = [
  {
    id: `${DEMO_SOURCE_ID}_101_dw_news`,
    channelNumber: 101,
    name: 'DW News HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/320px-Deutsche_Welle_symbol_2012.svg.png',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'News',
    tvgId: 'DW.News.de',
    tvgName: 'DW News',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_102_france24_en`,
    channelNumber: 102,
    name: 'France 24 English',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/64/France_24_logo.svg/320px-France_24_logo.svg.png',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8',
    group: 'News',
    tvgId: 'France24.English.fr',
    tvgName: 'France 24 EN',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_103_nasa_tv`,
    channelNumber: 103,
    name: 'NASA TV Public HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    group: 'Local',
    tvgId: 'NASA.TV.Public.us',
    tvgName: 'NASA TV',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_104_redbull_tv`,
    channelNumber: 104,
    name: 'Red Bull Extreme Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Red_Bull_Air_Race_logo.svg/320px-Red_Bull_Air_Race_logo.svg.png',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'RedBull.Sports.at',
    tvgName: 'Red Bull TV',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_105_tears_of_steel`,
    channelNumber: 105,
    name: 'Cinema 24: Sci-Fi & Action',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Movies',
    tvgId: 'Cinema24.Movies.us',
    tvgName: 'Cinema 24',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_106_big_buck_bunny`,
    channelNumber: 106,
    name: 'Kids Toon Network',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'Kids',
    tvgId: 'KidsToon.Network.ca',
    tvgName: 'Kids Toon',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_107_sintel_movies`,
    channelNumber: 107,
    name: 'Epic Movie Channel',
    logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=320&auto=format&fit=crop&q=60',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    group: 'Movies',
    tvgId: 'Epic.Movies.us',
    tvgName: 'Epic Movies',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_108_mux_sports`,
    channelNumber: 108,
    name: 'Prime Sports Arena',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'Prime.Sports.Arena',
    tvgName: 'Prime Sports',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_109_tv5_international`,
    channelNumber: 109,
    name: 'TV5 Monde International',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/TV5MONDE_logo.svg/320px-TV5MONDE_logo.svg.png',
    url: 'https://static.france24.com/live/F24_FR_LO_HLS/live_fr.m3u8',
    group: 'International',
    tvgId: 'TV5.Monde.Int',
    tvgName: 'TV5 Monde',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_110_toronto_metrolocal`,
    channelNumber: 110,
    name: 'Toronto Metro Cable 10',
    logo: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'Local',
    tvgId: 'Metro.Toronto.10',
    tvgName: 'Metro Toronto',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_111_aljazeera_en`,
    channelNumber: 111,
    name: 'Al Jazeera News HD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English_logo.svg/320px-Al_Jazeera_English_logo.svg.png',
    url: 'https://live-hls-web-aje.getaj.net/AJE/03.m3u8',
    group: 'News',
    tvgId: 'AlJazeera.English.qa',
    tvgName: 'Al Jazeera EN',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_112_cbc_news_stream`,
    channelNumber: 112,
    name: 'CBC Regional Newsfeed',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'Local',
    tvgId: 'CBC.News.ca',
    tvgName: 'CBC Regional',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_113_citytv_pulse`,
    channelNumber: 113,
    name: 'Citytv Entertainment Hub',
    logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=320&auto=format&fit=crop&q=60',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8',
    group: 'Local',
    tvgId: 'Citytv.Pulse.ca',
    tvgName: 'Citytv Pulse',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_114_action_cinema`,
    channelNumber: 114,
    name: 'Midnight Cinema Action',
    logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Movies',
    tvgId: 'Midnight.Cinema.Action',
    tvgName: 'Midnight Action',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_115_motorsport_tv`,
    channelNumber: 115,
    name: 'Apex Motorsport & Speed',
    logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=320&auto=format&fit=crop&q=60',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'Apex.Motorsport.tv',
    tvgName: 'Apex Motorsport',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_116_unmatched_demo`,
    channelNumber: 116,
    name: 'Community Access TV (Unmatched)',
    logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'Local',
    tvgId: 'unmatched_community_ch',
    tvgName: 'Community Access',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WHY TV Public Cable Essentials',
  },
  {
    id: `${DEMO_SOURCE_ID}_120_sportsnet_east`,
    channelNumber: 120,
    name: 'Sportsnet East Live',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'Sportsnet.East.ca',
    tvgName: 'Sportsnet East',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Rogers Sportsnet Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_121_sportsnet_ontario`,
    channelNumber: 121,
    name: 'Sportsnet Ontario HD',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'Sportsnet.Ontario.ca',
    tvgName: 'Sportsnet Ontario',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Rogers Sportsnet Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_122_tsn1_sports_center`,
    channelNumber: 122,
    name: 'TSN 1 Sports Center',
    logo: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'TSN.1.ca',
    tvgName: 'TSN 1',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Bell Fibe TSN Hub',
  },
  {
    id: `${DEMO_SOURCE_ID}_123_tsn4_hockey_zone`,
    channelNumber: 123,
    name: 'TSN 4 Hockey Zone',
    logo: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'TSN.4.ca',
    tvgName: 'TSN 4',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Bell Fibe TSN Hub',
  },
  {
    id: `${DEMO_SOURCE_ID}_124_dazn_premier_football`,
    channelNumber: 124,
    name: 'DAZN Premier Football',
    logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=320&auto=format&fit=crop&q=60',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'DAZN.Premier.Live',
    tvgName: 'DAZN Premier',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'DAZN Sports Global',
  },
  {
    id: `${DEMO_SOURCE_ID}_125_dazn_combat_zone`,
    channelNumber: 125,
    name: 'DAZN Combat & Fight Zone',
    logo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=320&auto=format&fit=crop&q=60',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'DAZN.Combat.Live',
    tvgName: 'DAZN Combat',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'DAZN Sports Global',
  },
  {
    id: `${DEMO_SOURCE_ID}_126_nfl_redzone_network`,
    channelNumber: 126,
    name: 'NFL RedZone Network',
    logo: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'NFL.RedZone.Live',
    tvgName: 'NFL RedZone',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'NFL & Major League Hub',
  },
  {
    id: `${DEMO_SOURCE_ID}_127_cbs_sports_golazo`,
    channelNumber: 127,
    name: 'CBS Sports Golazo Network',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=320&auto=format&fit=crop&q=60',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'CBSSports.Golazo.Live',
    tvgName: 'CBS Golazo',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Pluto & CBS Sports',
  },
  {
    id: `${DEMO_SOURCE_ID}_128_pga_tour_golf`,
    channelNumber: 128,
    name: 'PGA TOUR & Golf 24/7',
    logo: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'PGATour.Golf.Live',
    tvgName: 'PGA TOUR',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Pluto & CBS Sports',
  },
  {
    id: `${DEMO_SOURCE_ID}_129_stadium_live_sports`,
    channelNumber: 129,
    name: 'Stadium Live Sports',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    group: 'Sports',
    tvgId: 'Stadium.Live.us',
    tvgName: 'Stadium Sports',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Stadium & FAST Sports',
  },
  {
    id: `${DEMO_SOURCE_ID}_130_pluto_action_cinema`,
    channelNumber: 130,
    name: 'Pluto TV Cinema Action',
    logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Movies',
    tvgId: 'PlutoTV.Action.Movies',
    tvgName: 'Pluto Action',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Pluto TV FAST Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_131_retro_cinema_classics`,
    channelNumber: 131,
    name: 'Retro Cinema Classics',
    logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=320&auto=format&fit=crop&q=60',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    group: 'Movies',
    tvgId: 'Retro.Cinema.Classics',
    tvgName: 'Retro Classics',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Classic Cinema Vault',
  },
  {
    id: `${DEMO_SOURCE_ID}_132_crime_mystery_drama`,
    channelNumber: 132,
    name: 'Crime & Mystery Drama 24/7',
    logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Movies',
    tvgId: 'Crime.Mystery.Drama',
    tvgName: 'Crime Mystery',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Pluto TV FAST Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_133_scifi_nexus_channel`,
    channelNumber: 133,
    name: 'Sci-Fi Nexus Channel',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Movies',
    tvgId: 'SciFi.Nexus.Hub',
    tvgName: 'Sci-Fi Nexus',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Classic Cinema Vault',
  },
  {
    id: `${DEMO_SOURCE_ID}_134_ctv_national_news`,
    channelNumber: 134,
    name: 'CTV National News HD',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'News',
    tvgId: 'CTV.National.News.ca',
    tvgName: 'CTV National',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Bell Media CTV Network',
  },
  {
    id: `${DEMO_SOURCE_ID}_135_global_news_national`,
    channelNumber: 135,
    name: 'Global News 24/7 National',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'News',
    tvgId: 'GlobalNews.National.ca',
    tvgName: 'Global News 24/7',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Corus Global News',
  },
  {
    id: `${DEMO_SOURCE_ID}_136_bloomberg_financial`,
    channelNumber: 136,
    name: 'Bloomberg Financial News',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=320&auto=format&fit=crop&q=60',
    url: 'https://live-hls-web-aje.getaj.net/AJE/03.m3u8',
    group: 'News',
    tvgId: 'Bloomberg.Finance.TV',
    tvgName: 'Bloomberg News',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Global Business Network',
  },
  {
    id: `${DEMO_SOURCE_ID}_137_sky_news_int`,
    channelNumber: 137,
    name: 'Sky News International HD',
    logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=320&auto=format&fit=crop&q=60',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8',
    group: 'News',
    tvgId: 'SkyNews.Int.uk',
    tvgName: 'Sky News UK',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Global News Network',
  },
  {
    id: `${DEMO_SOURCE_ID}_138_toontoon_kids_arcade`,
    channelNumber: 138,
    name: 'Toon Toon Kids Arcade',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'Kids',
    tvgId: 'ToonToon.Kids.Arcade',
    tvgName: 'Toon Toon Arcade',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Family & Toon Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_139_family_classic_cartoons`,
    channelNumber: 139,
    name: 'Family Classic Cartoons',
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'Kids',
    tvgId: 'Family.Classic.Cartoons',
    tvgName: 'Family Cartoons',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Family & Toon Fleet',
  }
];

export function generateDynamicDemoEpg(channels: Channel[]): EpgProgram[] {
  const now = new Date();
  const programs: EpgProgram[] = [];

  const programTemplates: Record<string, { title: string; desc: string; category: string }[]> = {
    News: [
      { title: 'Global News Hour Live', desc: 'Comprehensive coverage of international breaking headlines and market movements.', category: 'News' },
      { title: 'The World Today with Anchor Team', desc: 'In-depth investigative reports, field interviews, and diplomatic updates.', category: 'News' },
      { title: 'Prime Business & Financial Markets', desc: 'Stock indices, interest rate analysis, technology sector developments.', category: 'News' },
      { title: 'Nightly World Report', desc: 'Recap of global events, geopolitics, weather, and science news.', category: 'News' },
      { title: 'Conflict & Resolution Focus', desc: 'Special documentary on international diplomacy and human rights.', category: 'Documentary' }
    ],
    Sports: [
      { title: 'NFL Live Sunday Football: Chiefs vs Bills', desc: 'Patrick Mahomes leads the Chiefs against Josh Allen and the Bills in a prime-time AFC clash.', category: 'Sports' },
      { title: 'Premier League Football Live: Arsenal vs Man City', desc: 'Top of the table title showdown live from Emirates Stadium.', category: 'Sports' },
      { title: 'Sunday Night Football: Lions vs Packers', desc: 'NFC North rivals clash in high-stakes football under the stadium lights.', category: 'Sports' },
      { title: 'NHL Hockey Live: Leafs vs Canadiens', desc: 'Saturday night hockey original six rivalry live from Scotiabank Arena.', category: 'Sports' },
      { title: 'Formula 1 Grand Prix Qualifying & Speed', desc: 'High-speed tarmac maneuvers, pit strategies, and driver profiles.', category: 'Sports' },
      { title: 'Action Sports Insider & Extreme Games', desc: 'Behind the scenes with extreme sports athletes and upcoming tournaments.', category: 'Sports' },
      { title: 'Global Football & Soccer Roundup', desc: 'Goals, controversy, and tactical analysis from the weekend leagues.', category: 'Sports' }
    ],
    Movies: [
      { title: 'Tears of Steel: Directors Cut', desc: 'Sci-fi post-apocalyptic VFX thriller set in future Amsterdam.', category: 'Movies' },
      { title: 'Sintel: The Dragon Huntress', desc: 'Epic fantasy adventure following a lonely wanderer searching for a lost baby dragon.', category: 'Movies' },
      { title: 'Cyberpunk 2088: Neon Horizon', desc: 'Futuristic detective noir through the shadowy underworld of megacities.', category: 'Movies' },
      { title: 'The Starlight Odyssey', desc: 'Interstellar explorers face unprecedented temporal anomalies near a black hole.', category: 'Movies' }
    ],
    Kids: [
      { title: 'Big Buck Bunny Adventure Hour', desc: 'A gentle giant woodland rabbit takes revenge on troublesome rodents.', category: 'Kids' },
      { title: 'Cosmo Racers: Rocket Academy', desc: 'Fun interactive animated space academy adventures for young dreamers.', category: 'Kids' },
      { title: 'Magic Forest Creatures', desc: 'Enchanted creatures learn teamwork, friendship, and problem-solving.', category: 'Kids' },
      { title: 'Junior Science Lab Live', desc: 'Experiments, volcano making, and fun astronomy discoveries for kids.', category: 'Kids' }
    ],
    Local: [
      { title: 'NASA Space Station Live Link', desc: 'Direct live downlink from the Expedition crew aboard the ISS orbiting Earth.', category: 'Science' },
      { title: 'Greater Toronto City Update', desc: 'Transit news, municipal council debates, local culture, and community events.', category: 'Local' },
      { title: 'Regional Weather & Traffic Pulse', desc: 'Radar forecasting and commuter transit road conditions.', category: 'Local' },
      { title: 'Ontario Heritage & Nature Trails', desc: 'Exploring provincial parks, lakes, and local conservation initiatives.', category: 'Documentary' }
    ],
    International: [
      { title: 'Le Journal International', desc: 'Edition spéciale d’actualité internationale francophone et reportages.', category: 'International' },
      { title: 'EuroPanorama Culture & Arts', desc: 'Music festivals, culinary journeys, and museum exhibitions across Europe.', category: 'Culture' },
      { title: 'World Cinema Showcase', desc: 'Award-winning international indie features and foreign short films.', category: 'Movies' }
    ]
  };

  const baseTime = new Date(now.getTime() - 4 * 60 * 60 * 1000);
  baseTime.setMinutes(baseTime.getMinutes() < 30 ? 0 : 30, 0, 0);

  channels.forEach((ch) => {
    let cursor = new Date(baseTime);
    const catList = programTemplates[ch.group] || programTemplates['News'];
    let templateIdx = Math.abs(ch.channelNumber * 3) % catList.length;

    while (cursor.getTime() < now.getTime() + 20 * 60 * 60 * 1000) {
      const durationMin = ((templateIdx % 2) === 0 ? 30 : 60);
      const start = new Date(cursor);
      const end = new Date(cursor.getTime() + durationMin * 60 * 1000);
      const template = catList[templateIdx % catList.length];

      programs.push({
        id: `epg_${ch.tvgId || ch.id}_${start.getTime()}`,
        channelId: ch.tvgId || ch.id,
        title: template.title,
        description: template.desc,
        category: template.category,
        start: start.toISOString(),
        end: end.toISOString(),
      });

      cursor = end;
      templateIdx++;
    }
  });

  return programs;
}

export const SAMPLE_XMLTV_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<tv generator-info-name="WHY TV Sample Generator">
  <channel id="DW.News.de">
    <display-name>DW News HD</display-name>
    <icon src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/320px-Deutsche_Welle_symbol_2012.svg.png" />
  </channel>
  <channel id="NASA.TV.Public.us">
    <display-name>NASA TV Public HD</display-name>
    <icon src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png" />
  </channel>
  <channel id="France24.English.fr">
    <display-name>France 24 English</display-name>
    <icon src="https://upload.wikimedia.org/wikipedia/en/thumb/6/64/France_24_logo.svg/320px-France_24_logo.svg.png" />
  </channel>
  <programme start="${new Date(Date.now() - 1800000).toISOString()}" stop="${new Date(Date.now() + 1800000).toISOString()}" channel="DW.News.de">
    <title lang="en">DW Live World News</title>
    <desc lang="en">Live reports and global analysis from Deutsche Welle studios.</desc>
    <category lang="en">News</category>
  </programme>
</tv>`;

export const SAMPLE_M3U_CONTENT = `#EXTM3U
#EXTINF:-1 tvg-id="DW.News.de" tvg-name="DW News" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/320px-Deutsche_Welle_symbol_2012.svg.png" group-title="News" tvg-chno="101",DW News HD
https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8
#EXTINF:-1 tvg-id="France24.English.fr" tvg-name="France 24 EN" group-title="News" tvg-chno="102",France 24 English
https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8
#EXTINF:-1 tvg-id="NASA.TV.Public.us" tvg-name="NASA TV" group-title="Local" tvg-chno="103",NASA TV Public HD
https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8
#EXTINF:-1 tvg-id="RedBull.Sports.at" tvg-name="Red Bull TV" group-title="Sports" tvg-chno="104",Red Bull Extreme Sports
https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8
#EXTINF:-1 tvg-id="Cinema24.Movies.us" tvg-name="Cinema 24" group-title="Movies" tvg-chno="105",Cinema 24: Tears of Steel
https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
`;

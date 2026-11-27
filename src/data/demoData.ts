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
    id: `${DEMO_SOURCE_ID}_108_acc_college_football`,
    channelNumber: 108,
    name: 'ACC College Football Live',
    logo: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=320&auto=format&fit=crop&q=60',
    url: 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8',
    group: 'Sports',
    tvgId: 'ACCDN.Football.Live',
    tvgName: 'ACC Football',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Raycom Sports & ACCDN',
  },
  {
    id: `${DEMO_SOURCE_ID}_109_bbc_news_world`,
    channelNumber: 109,
    name: 'BBC News World Edition HD',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=320&auto=format&fit=crop&q=60',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8',
    group: 'News',
    tvgId: 'BBC.News.World.uk',
    tvgName: 'BBC News',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'BBC World News Service',
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
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
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
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
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
    url: 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8',
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
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'TSN.4.ca',
    tvgName: 'TSN 4',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Bell Fibe TSN Hub',
  },
  {
    id: `${DEMO_SOURCE_ID}_124_bein_sports_xtra`,
    channelNumber: 124,
    name: 'beIN Sports XTRA Soccer',
    logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=320&auto=format&fit=crop&q=60',
    url: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8',
    group: 'Sports',
    tvgId: 'beIN.Sports.XTRA',
    tvgName: 'beIN Sports',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'beIN Sports Global',
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
    id: `${DEMO_SOURCE_ID}_126_sportsgrid_nfl_gameday`,
    channelNumber: 126,
    name: 'SportsGrid NFL Live GameDay',
    logo: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=320&auto=format&fit=crop&q=60',
    url: 'https://sportsgrid-tribal.amagi.tv/playlist1080p.m3u8',
    group: 'Sports',
    tvgId: 'SportsGrid.NFL.Live',
    tvgName: 'SportsGrid NFL',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'SportsGrid Network',
  },
  {
    id: `${DEMO_SOURCE_ID}_127_cbs_sports_golazo`,
    channelNumber: 127,
    name: 'CBS Sports Golazo Network',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=320&auto=format&fit=crop&q=60',
    url: 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8',
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
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
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
    url: 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8',
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
  },
  {
    id: `${DEMO_SOURCE_ID}_140_cpac_parliamentary`,
    channelNumber: 140,
    name: 'CPAC Canadian Parliamentary HD',
    logo: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'Local',
    tvgId: 'CPAC.Parliamentary.ca',
    tvgName: 'CPAC Canada',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'CPAC Public Affairs',
  },
  {
    id: `${DEMO_SOURCE_ID}_141_tvo_ontario`,
    channelNumber: 141,
    name: 'TVO Ontario Educational',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'Local',
    tvgId: 'TVO.Ontario.ca',
    tvgName: 'TVO Ontario',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'TVO Public Educational',
  },
  {
    id: `${DEMO_SOURCE_ID}_142_knowledge_bc`,
    channelNumber: 142,
    name: 'Knowledge Network British Columbia',
    logo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'Local',
    tvgId: 'Knowledge.Network.ca',
    tvgName: 'Knowledge BC',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Knowledge Network BC',
  },
  {
    id: `${DEMO_SOURCE_ID}_143_cbc_calgary_english`,
    channelNumber: 143,
    name: 'CBC Calgary News English HD',
    logo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'Local',
    tvgId: 'CBC.Calgary.ca',
    tvgName: 'CBC Calgary',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'CBC English Regional',
  },
  {
    id: `${DEMO_SOURCE_ID}_144_citytv_vancouver`,
    channelNumber: 144,
    name: 'Citytv Vancouver Coast HD',
    logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=320&auto=format&fit=crop&q=60',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8',
    group: 'Local',
    tvgId: 'Citytv.Vancouver.ca',
    tvgName: 'Citytv Vancouver',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Rogers Citytv Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_145_euronews_english`,
    channelNumber: 145,
    name: 'Euronews English Live HD',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=320&auto=format&fit=crop&q=60',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8',
    group: 'News',
    tvgId: 'Euronews.English.eu',
    tvgName: 'Euronews EN',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Euronews English Network',
  },
  {
    id: `${DEMO_SOURCE_ID}_146_reuters_live_world`,
    channelNumber: 146,
    name: 'Reuters World News Live 24/7',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/64/France_24_logo.svg/320px-France_24_logo.svg.png',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8',
    group: 'News',
    tvgId: 'Reuters.Live.uk',
    tvgName: 'Reuters Live',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Reuters Global News',
  },
  {
    id: `${DEMO_SOURCE_ID}_147_dw_english_global`,
    channelNumber: 147,
    name: 'DW English Global HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/320px-Deutsche_Welle_symbol_2012.svg.png',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'News',
    tvgId: 'DW.English.Global',
    tvgName: 'DW English',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Deutsche Welle English',
  },
  {
    id: `${DEMO_SOURCE_ID}_148_pbs_world_doc`,
    channelNumber: 148,
    name: 'PBS World Documentary',
    logo: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Local',
    tvgId: 'PBS.World.us',
    tvgName: 'PBS World',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'PBS Public Broadcasting',
  },
  {
    id: `${DEMO_SOURCE_ID}_149_nasa_space_ops`,
    channelNumber: 149,
    name: 'NASA Space Operations HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    group: 'Local',
    tvgId: 'NASA.Space.Ops.us',
    tvgName: 'NASA Space Ops',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'NASA Media Services',
  },
  {
    id: `${DEMO_SOURCE_ID}_150_weathernation_live`,
    channelNumber: 150,
    name: 'WeatherNation Live Radar HD',
    logo: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=320&auto=format&fit=crop&q=60',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    group: 'News',
    tvgId: 'WeatherNation.Live.us',
    tvgName: 'WeatherNation',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'WeatherNation Broadcast',
  },
  {
    id: `${DEMO_SOURCE_ID}_151_raycom_acc_extra`,
    channelNumber: 151,
    name: 'Raycom ACC Extra Sports',
    logo: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=320&auto=format&fit=crop&q=60',
    url: 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8',
    group: 'Sports',
    tvgId: 'Raycom.ACC.Extra',
    tvgName: 'ACC Extra',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Raycom Sports',
  },
  {
    id: `${DEMO_SOURCE_ID}_152_redbull_air_race`,
    channelNumber: 152,
    name: 'Red Bull Air Race Live',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Red_Bull_Air_Race_logo.svg/320px-Red_Bull_Air_Race_logo.svg.png',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'RedBull.AirRace.at',
    tvgName: 'Red Bull Air Race',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Red Bull Media House',
  },
  {
    id: `${DEMO_SOURCE_ID}_153_apex_speed_karting`,
    channelNumber: 153,
    name: 'Apex Speed Karting HD',
    logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=320&auto=format&fit=crop&q=60',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'Apex.Speed.Karting',
    tvgName: 'Apex Speed',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Apex Motorsports',
  },
  {
    id: `${DEMO_SOURCE_ID}_154_fight_hub_combat`,
    channelNumber: 154,
    name: 'Fight Hub Combat 24/7',
    logo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=320&auto=format&fit=crop&q=60',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    group: 'Sports',
    tvgId: 'FightHub.Combat.Live',
    tvgName: 'Fight Hub',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Combat Sports Global',
  },
  {
    id: `${DEMO_SOURCE_ID}_155_cinema24_noir`,
    channelNumber: 155,
    name: 'Cinema 24 Film Noir Classics',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Movies',
    tvgId: 'Cinema24.Noir.Movies',
    tvgName: 'Cinema 24 Noir',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Classic Cinema Vault',
  },
  {
    id: `${DEMO_SOURCE_ID}_156_sintel_fantasy_film`,
    channelNumber: 156,
    name: 'Sintel Fantasy Film World',
    logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=320&auto=format&fit=crop&q=60',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    group: 'Movies',
    tvgId: 'Sintel.Fantasy.Films',
    tvgName: 'Sintel Fantasy',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Epic Animated Cinema',
  },
  {
    id: `${DEMO_SOURCE_ID}_157_tears_action_hub`,
    channelNumber: 157,
    name: 'Tears of Steel Action Hub',
    logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&auto=format&fit=crop&q=60',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    group: 'Movies',
    tvgId: 'Tears.Action.Hub',
    tvgName: 'Tears Action',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Sci-Fi Action Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_158_kids_animation_playhouse`,
    channelNumber: 158,
    name: 'Kids Animation Playhouse',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'Kids',
    tvgId: 'Kids.Playhouse.Toon',
    tvgName: 'Kids Playhouse',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Family & Toon Fleet',
  },
  {
    id: `${DEMO_SOURCE_ID}_159_big_buck_bunny_club`,
    channelNumber: 159,
    name: 'Big Buck Bunny Cartoon Club',
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=320&auto=format&fit=crop&q=60',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'Kids',
    tvgId: 'BigBuck.Bunny.Club',
    tvgName: 'Bunny Club',
    sourceId: DEMO_SOURCE_ID,
    sourceName: 'Family & Toon Fleet',
  }
];

export interface ChannelScheduleDef {
  liveTitle: string;
  liveDesc: string;
  category: string;
  upcoming: { title: string; desc: string; category: string; durationMin?: number }[];
  past: { title: string; desc: string; category: string; durationMin?: number }[];
}

export const DEDICATED_CHANNEL_SCHEDULES: Record<number, ChannelScheduleDef> = {
  // 108: ACC College Football Live -> Thanksgiving Night College Football
  108: {
    liveTitle: 'College Football Thanksgiving Night: TCU Horned Frogs at Texas Tech Red Raiders',
    liveDesc: 'Live Thanksgiving Thursday rivalry clash from Jones AT&T Stadium in Lubbock, Texas. #11 Texas Tech battles TCU for Big 12 championship contention (TTU 31 - 24 TCU).',
    category: 'Sports',
    upcoming: [
      { title: 'College Football Rivalry Week Preview & Egg Bowl Countdown', desc: 'Breakdown of Black Friday and Saturday rivalry games across the nation.', category: 'Sports', durationMin: 60 },
      { title: 'ACC College Football Saturday: Palmetto Bowl & Sunshine Showdown', desc: 'Rivalry week preview and pregame tactical analysis.', category: 'Sports', durationMin: 120 },
      { title: 'College Football Final: Thanksgiving Thursday Scores & Highlights', desc: 'Highlights, post-game press conferences, and updated playoff rankings.', category: 'Sports', durationMin: 60 },
    ],
    past: [
      { title: 'College Football Thanksgiving Pre-Game Tailgate Live', desc: 'Live from Lubbock with game day traditions and campus reports.', category: 'Sports', durationMin: 60 },
      { title: 'College Football Countdown: Thanksgiving Rivalry Week Kickoff', desc: 'Holiday previews and key matchup keys to victory.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 126: SportsGrid NFL Live GameDay -> Thanksgiving Night Primetime: Bills vs Chiefs
  126: {
    liveTitle: 'NFL Thanksgiving Primetime Live: Buffalo Bills vs Kansas City Chiefs',
    liveDesc: 'Live real-time coverage from Highmark Stadium on Thanksgiving night: Josh Allen and the Bills lead Patrick Mahomes and the Chiefs (BUF 28 - 21 KC).',
    category: 'Sports',
    upcoming: [
      { title: 'NFL Thanksgiving Wrap-Up: Bears 39-35 Lions & Eagles 39-38 Cowboys', desc: 'Complete breakdown of all three Thanksgiving games: Bears 39-35 Lions, Eagles 39-38 Cowboys, Bills 28-21 Chiefs.', category: 'Sports', durationMin: 60 },
      { title: 'Black Friday Football Countdown: Raiders vs Chiefs Preview', desc: 'Looking ahead to the Black Friday NFL broadcast and playoff picture.', category: 'Sports', durationMin: 120 },
      { title: 'NFL Thanksgiving Final: Highmark Stadium Post-Game Press Conferences', desc: 'Live post-game reactions from Sean McDermott, Josh Allen, and Andy Reid.', category: 'Sports', durationMin: 60 },
    ],
    past: [
      { title: 'NFL Thanksgiving Afternoon Classic: Philadelphia Eagles 39, Dallas Cowboys 38', desc: 'Recap of Philadelphia\'s historic 39-38 fourth-quarter comeback in Dallas.', category: 'Sports', durationMin: 180 },
      { title: 'NFL Thanksgiving Early Classic: Chicago Bears 39, Detroit Lions 35', desc: 'Recap of Chicago\'s dramatic 39-35 Thanksgiving win in Detroit.', category: 'Sports', durationMin: 180 },
    ]
  },
  // 122: TSN 1 Sports Center -> CFL Football Live
  122: {
    liveTitle: 'CFL Football Live: Winnipeg Blue Bombers vs BC Lions',
    liveDesc: 'Zach Collaros leads the Blue Bombers against Vernon Adams Jr and the BC Lions in high-stakes CFL action.',
    category: 'Sports',
    upcoming: [
      { title: 'SportsCentre with Jay & Dan Live', desc: 'Canada\'s flagship sports highlights show with daily top 10 plays and hilarious commentary.', category: 'Sports', durationMin: 60 },
      { title: 'CFL GameDay Post-Game Wrap & Analysis', desc: 'Interviews with winning coaches, Grey Cup playoff implications, and standings.', category: 'Sports', durationMin: 60 },
      { title: 'TSN SportsCentre Overnight Edition', desc: 'Continuous Canadian sports scores, curling updates, and NHL highlights.', category: 'Sports', durationMin: 180 },
      { title: 'That\'s Hockey 2Night: NHL Breakdown', desc: 'Comprehensive coverage of Canadian NHL franchises with TSN Insiders.', category: 'Sports', durationMin: 60 },
    ],
    past: [
      { title: 'CFL Pre-Game Kickoff Live', desc: 'Field conditions, starting quarterbacks, and keys to victory.', category: 'Sports', durationMin: 60 },
      { title: 'TSN SportsCentre Morning Broadcast', desc: 'Overnight scores and morning headlines from across the sports world.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 129: Stadium Live Sports -> College Football Live
  129: {
    liveTitle: 'College Football Live: Michigan Wolverines vs Ohio State Buckeyes',
    liveDesc: 'The greatest rivalry in NCAA college football kicks off live with national championship playoff seeding on the line.',
    category: 'Sports',
    upcoming: [
      { title: 'NCAA Football Post-Game Live & College GameDay Wrap', desc: 'Locker room speeches, AP Poll impacts, and Bowl game scenarios.', category: 'Sports', durationMin: 60 },
      { title: 'Stadium College Basketball Saturday Showcase', desc: 'NCAA Division I college hoops action and conference tournament previews.', category: 'Sports', durationMin: 120 },
      { title: 'Inside College Athletics: The Big Ten Report', desc: 'In-depth feature on athletic programs, recruits, and coaches.', category: 'Sports', durationMin: 60 },
      { title: 'Stadium Sports Overnight Blitz', desc: 'Continuous loop of top college sports highlights from around the nation.', category: 'Sports', durationMin: 180 },
    ],
    past: [
      { title: 'College GameDay Tailgate Live', desc: 'Live from the campus quad with guest pickers and student crowds.', category: 'Sports', durationMin: 60 },
      { title: 'Stadium Pre-Game Huddle', desc: 'Tactical film study and key player matchups.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 124: DAZN Premier Football -> Premier League Live: Arsenal vs Man City
  124: {
    liveTitle: 'Premier League Football Live: Arsenal vs Manchester City',
    liveDesc: 'Mikel Arteta\'s Gunners face Pep Guardiola\'s champions in a colossal clash live from Emirates Stadium.',
    category: 'Sports',
    upcoming: [
      { title: 'UEFA Champions League Showcase: Liverpool vs Real Madrid', desc: 'European football titans clash under the floodlights in a classic European tie.', category: 'Sports', durationMin: 120 },
      { title: 'Premier League Matchday Review & Highlights', desc: 'Every goal, contentious VAR decision, and tactical analysis from the weekend fixtures.', category: 'Sports', durationMin: 60 },
      { title: 'DAZN Soccer Show: European Football Tactics', desc: 'Detailed heat maps, xG breakdowns, and post-match player interviews.', category: 'Sports', durationMin: 60 },
      { title: 'Match of the Day: Extended Highlights', desc: 'In-depth commentary and analysis of Saturday and Sunday matches.', category: 'Sports', durationMin: 90 },
    ],
    past: [
      { title: 'Premier League Saturday Warm-Up', desc: 'Pitchside build-up, lineup confirmation, and tactical previews.', category: 'Sports', durationMin: 60 },
      { title: 'The Football Show: Premier League Preview', desc: 'Pundits debate title contenders and relegation six-pointers.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 127: CBS Sports Golazo Network -> Serie A Live: Inter vs Juventus
  127: {
    liveTitle: 'Serie A Live: Inter Milan vs Juventus Derby d\'Italia',
    liveDesc: 'Derby d\'Italia live from San Siro. Lautaro Martinez and Inter battle the Bianconeri in a tense Italian classic.',
    category: 'Sports',
    upcoming: [
      { title: 'Morning Footy: European Soccer Tactics & Goals', desc: 'All the goals and analysis from Serie A, UEFA Champions League, and South American leagues.', category: 'Sports', durationMin: 120 },
      { title: 'Box2Box: Global Football News Desk', desc: 'Transfer scoops, international tournament draws, and managerial news.', category: 'Sports', durationMin: 60 },
      { title: 'CBS Golazo Highlights Showcase', desc: 'Every strike, free kick, and save from around the footballing globe.', category: 'Sports', durationMin: 90 },
      { title: 'Attacking Third: Women\'s Soccer Focus', desc: 'NWSL and international women\'s football news and game breakdowns.', category: 'Sports', durationMin: 60 },
    ],
    past: [
      { title: 'Calcio Live Pre-Match Show', desc: 'Atmosphere in Milan outside San Siro before the Derby d\'Italia.', category: 'Sports', durationMin: 60 },
      { title: 'Italian Football Weekly', desc: 'Recap of midweek Coppa Italia action and league tables.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 120: Sportsnet East Live -> MLB Live: Blue Jays vs Yankees
  120: {
    liveTitle: 'MLB Live Baseball: Toronto Blue Jays vs New York Yankees',
    liveDesc: 'Vladimir Guerrero Jr and the Blue Jays face AL East rivals New York Yankees at Rogers Centre.',
    category: 'Sports',
    upcoming: [
      { title: 'Blue Jays Central: Post-Game Live', desc: 'Instant reaction, locker room interviews, and pitching analysis from Rogers Centre.', category: 'Sports', durationMin: 60 },
      { title: 'Sportsnet Connected: Baseball Tonight', desc: 'Around Major League Baseball highlights, walk-off home runs, and standings.', category: 'Sports', durationMin: 60 },
      { title: 'MLB Classics: Historic Toronto Blue Jays Moments', desc: 'Relive historic franchise postseason games and milestone achievements.', category: 'Sports', durationMin: 120 },
      { title: 'Sportsnet Central: Late Night National Edition', desc: 'Comprehensive Canadian and international sports scores and highlights.', category: 'Sports', durationMin: 120 },
    ],
    past: [
      { title: 'Blue Jays Central Pre-Game Show', desc: 'Batting practice, starting pitchers report, and keys to the game.', category: 'Sports', durationMin: 60 },
      { title: 'Sportsnet Connected Morning Edition', desc: 'Top highlights from overnight baseball and hockey matchups.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 121: Sportsnet Ontario HD -> NHL Live: Leafs vs Canadiens
  121: {
    liveTitle: 'NHL Hockey Live: Toronto Maple Leafs vs Montreal Canadiens',
    liveDesc: 'Original Six rivalry live from Scotiabank Arena with Auston Matthews and Cole Caufield.',
    category: 'Sports',
    upcoming: [
      { title: 'Sportsnet Central: Leafs Post-Game Live', desc: 'Post-game reaction, head coach press conference, and three stars of the game.', category: 'Sports', durationMin: 60 },
      { title: 'Hockey Central: Around the NHL', desc: 'Scores, trades, and goaltender matchups across the National Hockey League.', category: 'Sports', durationMin: 60 },
      { title: 'NHL Tonight: Western Conference Showdown (Canucks vs Bruins)', desc: 'Late night game preview and highlights from Pacific Division match-ups.', category: 'Sports', durationMin: 150 },
      { title: 'Sportsnet Connected: Overnight Hockey Loop', desc: 'Highlights of every goal scored across the NHL tonight.', category: 'Sports', durationMin: 120 },
    ],
    past: [
      { title: 'Hockey Central at the Rink', desc: 'Pre-game skate, line combinations, and starting goaltenders.', category: 'Sports', durationMin: 60 },
      { title: 'Scotiabank Wednesday Night Hockey Preview', desc: 'Expert roundtable analyzing the Maple Leafs roster.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 123: TSN 4 Hockey Zone -> NBA Basketball Live: Raptors vs Celtics
  123: {
    liveTitle: 'NBA Basketball Live: Toronto Raptors vs Boston Celtics',
    liveDesc: 'Scottie Barnes and the Raptors host Jayson Tatum and the Boston Celtics live from Scotiabank Arena.',
    category: 'Sports',
    upcoming: [
      { title: 'Raptors Post-Up: Courtside Post-Game Live', desc: 'Player interviews, coach press conferences, and statistical analysis.', category: 'Sports', durationMin: 60 },
      { title: 'NBA Tonight: Highlights Around the League', desc: 'Dunks, buzzer beaters, and standings from around the NBA.', category: 'Sports', durationMin: 60 },
      { title: 'TSN SportsCentre: Late Edition', desc: 'Nightly recap of national Canadian sports action and global athletics.', category: 'Sports', durationMin: 120 },
      { title: 'Basketball Roots: Canadian Hoops Documentary', desc: 'The rise of basketball in Canada from grassroots to the NBA.', category: 'Sports', durationMin: 60 },
    ],
    past: [
      { title: 'Raptors Pre-Game Shootaround', desc: 'Warmup footage, injury reports, and match strategies.', category: 'Sports', durationMin: 60 },
      { title: 'NBA Action Weekly', desc: 'Top 10 plays of the week and player features.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 125: DAZN Combat & Fight Zone -> UFC 312 Championship Live
  125: {
    liveTitle: 'UFC 312 Championship Main Card Live',
    liveDesc: 'World title bouts and championship contenders collide inside the Octagon on DAZN Fight Zone.',
    category: 'Sports',
    upcoming: [
      { title: 'World Championship Boxing: Heavyweight Clash', desc: 'Championship boxing live on pay-per-view featuring undefeated title defenses.', category: 'Sports', durationMin: 120 },
      { title: 'DAZN Fight Zone: Post-Fight Press Conference', desc: 'Instant post-fight reactions, knockouts of the night, and fighter interviews.', category: 'Sports', durationMin: 60 },
      { title: 'The Modern Gladiators: Inside MMA Training', desc: 'Behind the scenes at premier mixed martial arts gyms.', category: 'Sports', durationMin: 60 },
      { title: 'Knockout Kings: Best Finishes in Combat History', desc: 'Memorable knockouts and submission finishes.', category: 'Sports', durationMin: 90 },
    ],
    past: [
      { title: 'UFC 312 Prelims & Octagon Countdown', desc: 'Early preliminary bouts and tale-of-the-tape breakdowns.', category: 'Sports', durationMin: 60 },
      { title: 'DAZN Boxing Weigh-In Show', desc: 'Fighters hit the scales ahead of championship fight night.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 128: PGA TOUR & Golf 24/7 -> The Masters Final Round Live
  128: {
    liveTitle: 'PGA Tour Live: The Masters Tournament Final Round',
    liveDesc: 'Scottie Scheffler, Rory McIlroy, and golf\'s elite battle through Amen Corner on championship Sunday.',
    category: 'Sports',
    upcoming: [
      { title: 'Amen Corner Live Shot Tracker & Leaderboard', desc: 'Featured group coverage of holes 11, 12, and 13 at Augusta National.', category: 'Sports', durationMin: 120 },
      { title: 'Golf Central: Green Jacket Ceremony & Post-Round', desc: 'Trophy presentation, winner press conference, and tournament recap.', category: 'Sports', durationMin: 60 },
      { title: 'Greatest Shots in Golf History', desc: 'A retrospective of legendary tournament-winning chip-ins and putts.', category: 'Sports', durationMin: 60 },
      { title: 'PGA Tour Highlights: Season Best Drives', desc: 'Longest drives, bunker recoveries, and eagle putts.', category: 'Sports', durationMin: 90 },
    ],
    past: [
      { title: 'Masters Sunday Breakfast at Augusta', desc: 'Course conditions, pin placements, and early round leaderboard.', category: 'Sports', durationMin: 60 },
      { title: 'PGA Tour Practice Range Live', desc: 'Driving range swings and putting green prep.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 115: Apex Motorsport & Speed -> Formula 1 Grand Prix Live
  115: {
    liveTitle: 'Formula 1 Grand Prix Live: Race Day Coverage',
    liveDesc: 'Max Verstappen, Charles Leclerc, and Lewis Hamilton battle from the starting lights to the chequered flag.',
    category: 'Sports',
    upcoming: [
      { title: 'F1 Post-Race Paddock Live & Podium Celebration', desc: 'Driver interviews in the media pen, trophy presentations, and constructor points.', category: 'Sports', durationMin: 60 },
      { title: 'Speed Weekly: World Rally Championship Highlights', desc: 'High-speed gravel, snow, and tarmac stage action from around the world.', category: 'Sports', durationMin: 60 },
      { title: 'Supercars & GT Championship Live', desc: 'Touring car sprint races and pit lane drama.', category: 'Sports', durationMin: 120 },
      { title: 'Apex Motorsport Overnight Speed Loop', desc: 'Continuous loop of race finishes, on-board laps, and tire strategy reviews.', category: 'Sports', durationMin: 180 },
    ],
    past: [
      { title: 'F1 Drivers Parade & National Anthem Ceremony', desc: 'Grid walk with Martin Brundle and celebrity pitlane interviews.', category: 'Sports', durationMin: 60 },
      { title: 'Formula 1 Qualifying & Pole Position Shootout', desc: 'Q1, Q2, and Q3 fastest laps on fresh soft tires.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 104: Red Bull Action Sports -> Extreme Mountain Biking
  104: {
    liveTitle: 'Red Bull Rampage: Extreme Mountain Biking Live',
    liveDesc: 'World elite freeriders drop into the Utah desert sandstone cliffs with massive natural drops and tricks.',
    category: 'Sports',
    upcoming: [
      { title: 'Red Bull Cliff Diving World Series Live', desc: 'High divers leap from 27-meter platforms into open oceans across Europe.', category: 'Sports', durationMin: 120 },
      { title: 'Action Sports Insider: Winter X Games Highlights', desc: 'Superpipe tricks, big air snowboarding, and medal ceremonies.', category: 'Sports', durationMin: 60 },
      { title: 'Way of the Wildcard: Extreme Athlete Profiles', desc: 'Documentary on underdog extreme athletes striving for championship titles.', category: 'Sports', durationMin: 60 },
      { title: 'Red Bull Flugtag: Crazy Flying Machines', desc: 'Hilarious homemade human-powered flying crafts launch into the water.', category: 'Sports', durationMin: 90 },
    ],
    past: [
      { title: 'Red Bull Rampage Course Walk & Line Prep', desc: 'Athletes sculpt their private lines down the vertical cliff walls.', category: 'Sports', durationMin: 60 },
      { title: 'Extreme Sports Morning Pulse', desc: 'Skate, surf, and BMX morning sessions.', category: 'Sports', durationMin: 90 },
    ]
  },
  // 101: DW News HD
  101: {
    liveTitle: 'DW News: Global World Headlines Live',
    liveDesc: 'Comprehensive real-time coverage of international breaking headlines, diplomatic summits, and global markets.',
    category: 'News',
    upcoming: [
      { title: 'The Day: In-Depth Investigative Report', desc: 'Field investigations and interviews with international policymakers.', category: 'News', durationMin: 60 },
      { title: 'Business Africa & Global Economy Focus', desc: 'Emerging tech hubs, market analysis, and economic indicators.', category: 'News', durationMin: 60 },
      { title: 'DW News Nightly Roundup', desc: 'Evening recap of European and transatlantic developments.', category: 'News', durationMin: 60 },
    ],
    past: [
      { title: 'DW Global Briefing', desc: 'Morning dispatch from Berlin, Brussels, and Washington bureaus.', category: 'News', durationMin: 60 },
      { title: 'Conflict Zone: Hard Talk Interviews', desc: 'High-stakes diplomatic confrontations and interviews.', category: 'News', durationMin: 60 },
    ]
  },
  // 134: CTV National News HD
  134: {
    liveTitle: 'CTV National News: Coast-to-Coast Live Report',
    liveDesc: 'Canada\'s most-watched national newscast with top national headlines, parliamentary debates, and regional updates.',
    category: 'News',
    upcoming: [
      { title: 'CTV News Channel: Primetime Panel', desc: 'Political correspondents analyze federal legislation and economic forecasts.', category: 'News', durationMin: 60 },
      { title: 'W5: Canadian Investigative Journalism', desc: 'Hard-hitting documentary reports exposing consumer fraud and injustice.', category: 'News', durationMin: 60 },
      { title: 'CTV National News Overnight Edition', desc: 'Continuous news updates for Canadian viewers coast to coast.', category: 'News', durationMin: 180 },
    ],
    past: [
      { title: 'CTV News at 5: Regional Headlines', desc: 'Local news, radar forecasting, and traffic updates.', category: 'News', durationMin: 60 },
      { title: 'Question Period with Vassy Kapelos', desc: 'Sunday morning political interviews and insider debate.', category: 'News', durationMin: 60 },
    ]
  },
  // 135: Global News 24/7 National
  135: {
    liveTitle: 'Global National Live: Coast-to-Coast Edition',
    liveDesc: 'Award-winning national reporting from Ottawa, Toronto, Calgary, and Vancouver bureaus.',
    category: 'News',
    upcoming: [
      { title: 'The West Block: Political Sunday', desc: 'Interviews with cabinet ministers, premier debates, and national polling.', category: 'News', durationMin: 60 },
      { title: 'Global News 24/7 Overnight Newsfeed', desc: 'Continuous rolling updates of Canadian and world news.', category: 'News', durationMin: 180 },
    ],
    past: [
      { title: 'Global News Morning Digest', desc: 'Top national stories, financial news, and weather maps.', category: 'News', durationMin: 60 },
      { title: 'Focus Ontario: Provincial Affairs', desc: 'Provincial parliament debates and regional healthcare discussions.', category: 'News', durationMin: 60 },
    ]
  },
  // 130: Pluto TV Cinema Action
  130: {
    liveTitle: 'Action Cinema: Maximum Velocity (Feature Film)',
    liveDesc: 'High-octane special forces operatives race against time through European capitals.',
    category: 'Movies',
    upcoming: [
      { title: 'The Delta Contingent: Extraction Point', desc: 'Explosive covert operation deep behind enemy lines.', category: 'Movies', durationMin: 120 },
      { title: 'Midnight Vigilante: City of Shadows', desc: 'Gritty street justice thriller in a dystopian metropolis.', category: 'Movies', durationMin: 120 },
    ],
    past: [
      { title: 'Armored Siege: The Final Stand', desc: 'Heavy firepower action thriller guarding an isolated fortress.', category: 'Movies', durationMin: 120 },
      { title: 'Tears of Steel: Director\'s Cut', desc: 'Sci-fi VFX thriller set in future Amsterdam.', category: 'Movies', durationMin: 90 },
    ]
  },
};

export function generateDynamicDemoEpg(channels: Channel[]): EpgProgram[] {
  const now = new Date();
  const programs: EpgProgram[] = [];

  const genericCategoryTemplates: Record<string, { title: string; desc: string; category: string }[]> = {
    News: [
      { title: 'Global News Hour Live', desc: 'Comprehensive coverage of international breaking headlines and market movements.', category: 'News' },
      { title: 'The World Today with Anchor Team', desc: 'In-depth investigative reports, field interviews, and diplomatic updates.', category: 'News' },
      { title: 'Prime Business & Financial Markets', desc: 'Stock indices, interest rate analysis, technology sector developments.', category: 'News' },
      { title: 'Nightly World Report', desc: 'Recap of global events, geopolitics, weather, and science news.', category: 'News' },
    ],
    Sports: [
      { title: 'NFL Live Sunday Football: Kansas City Chiefs vs Buffalo Bills', desc: 'Patrick Mahomes leads the Chiefs against Josh Allen and the Bills in prime time.', category: 'Sports' },
      { title: 'Premier League Football Live: Arsenal vs Man City', desc: 'Top of the table title showdown live from Emirates Stadium.', category: 'Sports' },
      { title: 'Sportsnet Central: Highlights Tonight', desc: 'Daily Canadian sports recap and highlights.', category: 'Sports' },
      { title: 'Action Sports Insider & Extreme Games', desc: 'Behind the scenes with extreme sports athletes and upcoming tournaments.', category: 'Sports' },
    ],
    Movies: [
      { title: 'Tears of Steel: Directors Cut', desc: 'Sci-fi post-apocalyptic VFX thriller set in future Amsterdam.', category: 'Movies' },
      { title: 'Sintel: The Dragon Huntress', desc: 'Epic fantasy adventure following a lonely wanderer searching for a lost baby dragon.', category: 'Movies' },
      { title: 'Cyberpunk 2088: Neon Horizon', desc: 'Futuristic detective noir through the shadowy underworld of megacities.', category: 'Movies' },
      { title: 'The Starlight Odyssey', desc: 'Interstellar explorers face unprecedented temporal anomalies near a black hole.', category: 'Movies' },
    ],
    Kids: [
      { title: 'Big Buck Bunny Adventure Hour', desc: 'A gentle giant woodland rabbit takes revenge on troublesome rodents.', category: 'Kids' },
      { title: 'Cosmo Racers: Rocket Academy', desc: 'Fun interactive animated space academy adventures for young dreamers.', category: 'Kids' },
      { title: 'Magic Forest Creatures', desc: 'Enchanted creatures learn teamwork, friendship, and problem-solving.', category: 'Kids' },
    ],
    Local: [
      { title: 'NASA Space Station Live Link', desc: 'Direct live downlink from the Expedition crew aboard the ISS orbiting Earth.', category: 'Science' },
      { title: 'Greater Toronto City Update', desc: 'Transit news, municipal council debates, local culture, and community events.', category: 'Local' },
      { title: 'Regional Weather & Traffic Pulse', desc: 'Radar forecasting and commuter transit road conditions.', category: 'Local' },
    ],
    International: [
      { title: 'Le Journal International', desc: 'Edition spéciale d’actualité internationale francophone et reportages.', category: 'International' },
      { title: 'EuroPanorama Culture & Arts', desc: 'Music festivals, culinary journeys, and museum exhibitions across Europe.', category: 'Culture' },
    ]
  };

  channels.forEach((ch) => {
    const channelId = ch.tvgId || ch.id;
    const dedicated = DEDICATED_CHANNEL_SCHEDULES[ch.channelNumber];

    // Determine current live show title & category
    let liveTitle = `${ch.name} Live Broadcast`;
    let liveDesc = `Live streaming broadcast from ${ch.sourceName || 'WHY TV Network'}.`;
    let liveCategory = ch.group || 'General';
    let upcomingList: { title: string; desc: string; category: string; durationMin?: number }[] = [];
    let pastList: { title: string; desc: string; category: string; durationMin?: number }[] = [];

    if (dedicated) {
      liveTitle = dedicated.liveTitle;
      liveDesc = dedicated.liveDesc;
      liveCategory = dedicated.category;
      upcomingList = dedicated.upcoming;
      pastList = dedicated.past;
    } else {
      const fallbackList = genericCategoryTemplates[ch.group] || genericCategoryTemplates['News'];
      liveTitle = `${ch.name}: ${fallbackList[0].title}`;
      liveDesc = fallbackList[0].desc;
      liveCategory = fallbackList[0].category;
      upcomingList = fallbackList.slice(1).concat(fallbackList);
      pastList = [
        { title: `${ch.name} Morning Report`, desc: 'Early morning news and community loop.', category: liveCategory },
        { title: `${ch.name} Early Broadcast`, desc: 'Pre-show analysis and broadcast warmup.', category: liveCategory },
      ];
    }

    // 1. Generate Past Shows (Starts 3.5 hrs ago, ends 45 mins ago)
    let pastCursor = new Date(now.getTime() - 210 * 60 * 1000); // 3.5 hrs ago
    const liveStart = new Date(now.getTime() - 45 * 60 * 1000); // 45 mins ago
    const liveEnd = new Date(now.getTime() + 75 * 60 * 1000);   // 75 mins in future (2 hr show total)

    pastList.forEach((p, idx) => {
      const dur = (p.durationMin || 75) * 60 * 1000;
      const pStart = new Date(pastCursor);
      const pEnd = new Date(Math.min(pastCursor.getTime() + dur, liveStart.getTime()));
      if (pEnd.getTime() > pStart.getTime()) {
        programs.push({
          id: `epg_${channelId}_past_${idx}_${pStart.getTime()}`,
          channelId,
          title: p.title,
          description: p.desc,
          category: p.category,
          start: pStart.toISOString(),
          end: pEnd.toISOString(),
        });
        pastCursor = pEnd;
      }
    });

    // 2. Generate CURRENT LIVE SHOW (Guaranteed to bracket Date.now())
    programs.push({
      id: `epg_${channelId}_live_${liveStart.getTime()}`,
      channelId,
      title: liveTitle,
      description: liveDesc,
      category: liveCategory,
      start: liveStart.toISOString(),
      end: liveEnd.toISOString(),
    });

    // 3. Generate Future Shows out to 24 hours
    let futureCursor = new Date(liveEnd);
    let upIdx = 0;
    while (futureCursor.getTime() < now.getTime() + 24 * 60 * 60 * 1000) {
      const templ = upcomingList[upIdx % upcomingList.length];
      const durMin = templ.durationMin || ((upIdx % 2 === 0) ? 60 : 120);
      const fStart = new Date(futureCursor);
      const fEnd = new Date(futureCursor.getTime() + durMin * 60 * 1000);

      programs.push({
        id: `epg_${channelId}_fut_${upIdx}_${fStart.getTime()}`,
        channelId,
        title: templ.title,
        description: templ.desc,
        category: templ.category,
        start: fStart.toISOString(),
        end: fEnd.toISOString(),
      });

      futureCursor = fEnd;
      upIdx++;
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

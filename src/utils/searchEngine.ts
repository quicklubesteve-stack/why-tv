import { Channel, EpgProgram, SportsGame, LiveSearchResult } from '../types';
import { INITIAL_SPORTS_GAMES } from '../data/sportsData';

/**
 * Semantic keyword synonyms for sport and media terms
 */
const SYNONYMS: Record<string, string[]> = {
  football: ['football', 'nfl', 'ncaa', 'college football', 'acc', 'clemson', 'seminoles', 'soccer', 'chiefs', 'bills', 'lions', 'packers', 'touchdown', 'quarterback', 'gridiron', 'epl', 'premier league'],
  ncaa: ['ncaa', 'college football', 'football', 'clemson', 'seminoles', 'acc', 'tigers', 'florida state', 'wolverines', 'buckeyes'],
  nfl: ['nfl', 'football', 'sportsgrid', 'redzone', 'chiefs', 'bills', 'lions', 'packers', 'mahomes', 'goff', 'super bowl'],
  redzone: ['redzone', 'nfl', 'sportsgrid', 'football', 'chiefs', 'bills'],
  soccer: ['soccer', 'football', 'premier league', 'champions league', 'arsenal', 'man city', 'real madrid', 'bayern', 'fifa', 'mls'],
  hockey: ['hockey', 'nhl', 'leafs', 'canadiens', 'oilers', 'flames', 'bruins', 'canucks', 'mcdavid', 'stanley cup'],
  nhl: ['nhl', 'hockey', 'leafs', 'canadiens', 'oilers', 'flames', 'bruins', 'canucks', 'mcdavid'],
  basketball: ['basketball', 'nba', 'raptors', 'celtics', 'lakers', 'warriors'],
  nba: ['nba', 'basketball', 'raptors', 'celtics', 'barnes', 'tatum'],
  baseball: ['baseball', 'mlb', 'blue jays', 'yankees', 'red sox', 'dodgers', 'home run'],
  mlb: ['mlb', 'baseball', 'blue jays', 'yankees', 'red sox', 'dodgers'],
  golf: ['golf', 'pga', 'masters', 'scheffler', 'mcilroy', 'amen corner'],
  pga: ['pga', 'golf', 'masters', 'tour'],
  combat: ['combat', 'ufc', 'mma', 'boxing', 'fight', 'championship'],
  ufc: ['ufc', 'mma', 'combat', 'fight', 'boxing', 'octagon'],
  cfl: ['cfl', 'canadian football', 'blue bombers', 'bc lions', 'grey cup'],
  racing: ['racing', 'motorsport', 'f1', 'formula', 'speed', 'verstappen', 'leclerc', 'ferrari', 'red bull'],
  news: ['news', 'breaking', 'headlines', 'politics', 'dw', 'france 24', 'al jazeera', 'cbc', 'world'],
  movies: ['movies', 'film', 'cinema', 'action', 'thriller', 'sci-fi', 'hollywood'],
  kids: ['kids', 'cartoons', 'animation', 'toon', 'children', 'disney'],
};

/**
 * Searches across live games, live airing programs, and channels using keyword matching & synonyms.
 */
export function searchLiveContent(
  query: string,
  channels: Channel[],
  epgPrograms: EpgProgram[],
  sportsGames: SportsGame[] = INITIAL_SPORTS_GAMES,
  nowMs: number = Date.now()
): LiveSearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // Expand query with synonyms
  const queryTokens = trimmed.split(/\s+/).filter(Boolean);
  const searchTerms = new Set<string>([...queryTokens, trimmed]);

  for (const token of queryTokens) {
    if (SYNONYMS[token]) {
      SYNONYMS[token].forEach((syn) => searchTerms.add(syn));
    }
  }

  const results: LiveSearchResult[] = [];
  const seenIds = new Set<string>();

  // 1. Search Live Sports Games (e.g. Chiefs vs Bills, Arsenal vs Man City)
  for (const game of sportsGames) {
    const gameText = `
      ${game.league} 
      ${game.homeTeam.name} 
      ${game.homeTeam.abbreviation} 
      ${game.awayTeam.name} 
      ${game.awayTeam.abbreviation} 
      ${game.broadcaster || ''} 
      ${game.statsSnippet || ''}
      ${game.league === 'NCAA' ? 'football college football ncaa acc ncaa football clemson seminoles wolverines' : ''}
      ${game.league === 'NFL' ? 'football nfl gridiron chiefs bills mahomes' : ''}
      ${game.league === 'SOCCER' ? 'football soccer premier league' : ''}
      ${game.league === 'NHL' ? 'hockey nhl' : ''}
      ${game.league === 'NBA' ? 'basketball nba' : ''}
      ${game.league === 'MLB' ? 'baseball mlb blue jays yankees' : ''}
      ${game.league === 'GOLF' ? 'golf pga masters' : ''}
      ${game.league === 'COMBAT' ? 'combat ufc mma boxing fight' : ''}
      ${game.league === 'MOTORSPORT' ? 'racing motorsport f1' : ''}
    `.toLowerCase();

    const matches = Array.from(searchTerms).some((term) => gameText.includes(term));
    if (matches) {
      // Find matching broadcast channel
      const ch =
        channels.find((c) => c.channelNumber === game.channelNumber) ||
        channels.find((c) => c.group === 'Sports') ||
        channels[0];

      if (ch) {
        const resultId = `sport_${game.id}`;
        if (!seenIds.has(resultId)) {
          seenIds.add(resultId);
          results.push({
            id: resultId,
            type: 'live_game',
            title: `${game.homeTeam.name} vs ${game.awayTeam.name}`,
            subtitle: `${game.broadcaster || ch.name} (CH ${ch.channelNumber}) • ${game.periodOrTime}`,
            description: game.statsSnippet,
            isLive: game.status === 'live',
            liveClockOrStatus: game.periodOrTime,
            scoreSummary: `${game.homeTeam.abbreviation} ${game.homeTeam.score} - ${game.awayTeam.score} ${game.awayTeam.abbreviation}`,
            badge: game.status === 'live' ? 'LIVE GAME' : game.status.toUpperCase(),
            category: game.league,
            channel: ch,
          });
        }
      }
    }
  }

  // 2. Search Live On-Air Programs (EPG)
  for (const prog of epgPrograms) {
    const startMs = new Date(prog.start).getTime();
    const endMs = new Date(prog.end).getTime();
    const isLive = startMs <= nowMs && endMs > nowMs;

    // We prioritize live on-air programs, but also include upcoming if query specifically matches
    if (!isLive && startMs > nowMs + 12 * 3600 * 1000) continue;

    const progText = `
      ${prog.title} 
      ${prog.description || ''} 
      ${prog.category || ''}
    `.toLowerCase();

    const matches = Array.from(searchTerms).some((term) => progText.includes(term));
    if (matches) {
      const ch = channels.find(
        (c) => c.id === prog.channelId || c.tvgId === prog.channelId
      );
      if (ch) {
        const resultId = `prog_${prog.id}`;
        if (!seenIds.has(resultId)) {
          seenIds.add(resultId);
          results.push({
            id: resultId,
            type: 'live_program',
            title: prog.title,
            subtitle: `${ch.name} (CH ${ch.channelNumber}) • ${isLive ? 'LIVE ON AIR' : 'Upcoming'}`,
            description: prog.description,
            isLive,
            badge: isLive ? 'LIVE ON AIR' : 'UPCOMING',
            category: prog.category,
            startTime: prog.start,
            endTime: prog.end,
            channel: ch,
          });
        }
      }
    }
  }

  // 3. Search Channels (e.g. searching "Sports", "News", "DW", or "108")
  for (const ch of channels) {
    const chText = `
      ${ch.name} 
      ${ch.channelNumber} 
      ${ch.group || ''}
      ${ch.group === 'Sports' ? 'football soccer hockey basketball racing' : ''}
    `.toLowerCase();

    const matches = Array.from(searchTerms).some((term) => chText.includes(term));
    if (matches) {
      const resultId = `ch_${ch.id}`;
      if (!seenIds.has(resultId)) {
        seenIds.add(resultId);
        results.push({
          id: resultId,
          type: 'channel',
          title: ch.name,
          subtitle: `CH ${ch.channelNumber} • ${ch.group} Category`,
          description: `Watch live stream on ${ch.name}`,
          isLive: true,
          badge: `CH ${ch.channelNumber}`,
          category: ch.group,
          channel: ch,
        });
      }
    }
  }

  // Sort results: Live Games and Live On-Air first, then by priority
  return results.sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    if (a.type === 'live_game' && b.type !== 'live_game') return -1;
    if (a.type !== 'live_game' && b.type === 'live_game') return 1;
    return 0;
  });
}

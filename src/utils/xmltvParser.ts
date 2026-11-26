import { EpgProgram } from '../types';

/**
 * Parses XMLTV string into structured channel metadata and program list.
 */
export interface XmltvParsedResult {
  channelIds: { id: string; name: string; icon?: string }[];
  programs: EpgProgram[];
}

/**
 * Parse XMLTV date string (e.g. "20261125200000 +0000", "20261125200000 -0500", or ISO) into ISO Date string
 */
export function parseXmltvDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  // Clean string
  const clean = dateStr.trim();

  // If already standard ISO or parseable
  if (clean.includes('T') || clean.includes('-')) {
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  // XMLTV format: YYYYMMDDHHmmss [+/-HHMM]
  // e.g. 20261125200000 +0000
  const match = clean.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:\s*([+-]\d{2})(\d{2}))?/);
  if (match) {
    const [_, year, month, day, hour, min, sec, tzH, tzM] = match;
    const tzString = tzH && tzM ? `${tzH}:${tzM}` : 'Z';
    const isoLike = `${year}-${month}-${day}T${hour}:${min}:${sec}${tzString}`;
    const d = new Date(isoLike);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  return new Date().toISOString();
}

export function parseXMLTV(xmlString: string): XmltvParsedResult {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Check for parse errors
  const parseError = xmlDoc.getElementsByTagName('parsererror');
  if (parseError.length > 0) {
    throw new Error('Failed to parse XMLTV file: ' + parseError[0].textContent);
  }

  const channels: { id: string; name: string; icon?: string }[] = [];
  const programs: EpgProgram[] = [];

  // Parse <channel> elements
  const channelNodes = xmlDoc.getElementsByTagName('channel');
  for (let i = 0; i < channelNodes.length; i++) {
    const chNode = channelNodes[i];
    const id = chNode.getAttribute('id');
    if (!id) continue;

    const displayNameNode = chNode.getElementsByTagName('display-name')[0];
    const name = displayNameNode ? displayNameNode.textContent?.trim() || id : id;

    const iconNode = chNode.getElementsByTagName('icon')[0];
    const icon = iconNode ? iconNode.getAttribute('src') || undefined : undefined;

    channels.push({ id, name, icon });
  }

  // Parse <programme> elements
  const progNodes = xmlDoc.getElementsByTagName('programme');
  for (let i = 0; i < progNodes.length; i++) {
    const progNode = progNodes[i];
    const channelId = progNode.getAttribute('channel');
    const startRaw = progNode.getAttribute('start');
    const stopRaw = progNode.getAttribute('stop');

    if (!channelId || !startRaw || !stopRaw) continue;

    const titleNode = progNode.getElementsByTagName('title')[0];
    const title = titleNode ? titleNode.textContent?.trim() || 'Untitled Program' : 'Untitled Program';

    const descNode = progNode.getElementsByTagName('desc')[0];
    const description = descNode ? descNode.textContent?.trim() : undefined;

    const catNode = progNode.getElementsByTagName('category')[0];
    const category = catNode ? catNode.textContent?.trim() : undefined;

    const iconNode = progNode.getElementsByTagName('icon')[0];
    const icon = iconNode ? iconNode.getAttribute('src') || undefined : undefined;

    programs.push({
      id: `prog_${channelId}_${startRaw}_${i}`,
      channelId,
      title,
      description,
      start: parseXmltvDate(startRaw),
      end: parseXmltvDate(stopRaw),
      category,
      icon,
    });
  }

  return { channelIds: channels, programs };
}

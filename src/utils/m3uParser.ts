import { Channel } from '../types';

/**
 * Parses M3U or M3U8 playlist text into an array of Channel objects.
 */
export function parseM3U(
  content: string,
  sourceId: string,
  sourceName: string,
  startChannelNumber: number = 100
): Channel[] {
  const lines = content.split(/\r?\n/);
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> | null = null;
  let chCounter = startChannelNumber;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;

    // Check for EXTINF line
    if (line.startsWith('#EXTINF:')) {
      currentChannel = {
        sourceId,
        sourceName,
        group: 'Other',
      };

      // Extract attributes: key="value" or key=value
      const attrRegex = /([a-zA-Z0-9_-]+)=["']?([^"']*)["']?/g;
      const commaIndex = line.lastIndexOf(',');
      const infoPart = commaIndex !== -1 ? line.substring(0, commaIndex) : line;
      const titlePart = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown Channel';

      let match: RegExpExecArray | null;
      while ((match = attrRegex.exec(infoPart)) !== null) {
        const key = match[1].toLowerCase();
        const value = match[2];

        if (key === 'tvg-id') {
          currentChannel.tvgId = value;
        } else if (key === 'tvg-name') {
          currentChannel.tvgName = value;
        } else if (key === 'tvg-logo') {
          currentChannel.logo = value;
        } else if (key === 'group-title') {
          currentChannel.group = value || 'Other';
        } else if (key === 'tvg-chno' || key === 'channel-number' || key === 'chno') {
          const num = parseInt(value, 10);
          if (!isNaN(num) && num > 0) {
            currentChannel.channelNumber = num;
          }
        }
      }

      currentChannel.name = titlePart || currentChannel.tvgName || `Channel ${chCounter}`;
      continue;
    }

    // Skip comments and directives
    if (line.startsWith('#')) {
      continue;
    }

    // If it's a URL or stream path and we have an EXTINF awaiting a URL
    if (currentChannel && (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('rtmp://') || line.endsWith('.m3u8') || line.endsWith('.ts'))) {
      currentChannel.url = line;
      if (!currentChannel.channelNumber) {
        currentChannel.channelNumber = chCounter++;
      } else {
        chCounter = Math.max(chCounter, currentChannel.channelNumber + 1);
      }

      // Unique channel ID
      const safeTvg = currentChannel.tvgId ? currentChannel.tvgId.replace(/[^a-zA-Z0-9_-]/g, '_') : '';
      currentChannel.id = `${sourceId}_${currentChannel.channelNumber}_${safeTvg || Math.random().toString(36).substring(2, 7)}`;

      channels.push(currentChannel as Channel);
      currentChannel = null;
    }
  }

  return channels;
}

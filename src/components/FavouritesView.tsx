import React from 'react';
import { Star, Tv, Play, Trash2 } from 'lucide-react';
import { Channel, EpgProgram, TimeZoneSetting } from '../types';
import { formatTimeInZone } from '../utils/dateUtils';

interface FavouritesViewProps {
  favourites: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onRemoveFavourite: (channelId: string) => void;
  epgPrograms: EpgProgram[];
  timeZone: TimeZoneSetting;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  favourites,
  onSelectChannel,
  onRemoveFavourite,
  epgPrograms,
  timeZone,
}) => {
  const getChannelNowProgram = (channel: Channel): EpgProgram | undefined => {
    const now = Date.now();
    return epgPrograms.find(
      (p) =>
        (p.channelId === channel.tvgId || p.channelId === channel.id) &&
        new Date(p.start).getTime() <= now &&
        new Date(p.end).getTime() > now
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-cable-border pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Favourite Channels</h2>
            <p className="text-xs text-slate-400">
              Quick access to your preferred cable channels. Saved locally on this device.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs px-3 py-1 rounded-full bg-cable-800 text-amber-400 font-bold border border-cable-border">
          {favourites.length} Channels
        </span>
      </div>

      {favourites.length === 0 ? (
        <div className="p-16 rounded-2xl bg-cable-900/40 border border-dashed border-cable-border text-center space-y-3">
          <Star className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No favourite channels yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You can add any channel to your favourites by clicking the star icon in Live TV or the TV Guide.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favourites.map((channel) => {
            const nowProg = getChannelNowProgram(channel);
            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                role="button"
                tabIndex={0}
                className="group relative flex flex-col justify-between p-4 rounded-xl bg-cable-900 hover:bg-cable-800 border border-cable-border/80 hover:border-amber-400 cursor-pointer shadow-lg transition-all duration-150 cable-focus-ring"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded bg-neutral-950 text-amber-400 border border-neutral-800 group-hover:border-amber-400">
                      CH {channel.channelNumber}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavourite(channel.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-neutral-950/80 transition"
                      title="Remove from Favourites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 my-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-950 p-1 flex items-center justify-center shrink-0 border border-neutral-800">
                      {channel.logo ? (
                        <img
                          src={channel.logo}
                          alt=""
                          className="max-h-9 max-w-9 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Tv className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-white truncate group-hover:text-amber-300">
                        {channel.name}
                      </h4>
                      <span className="text-xs text-slate-400 block">{channel.group}</span>
                    </div>
                  </div>

                  <div className="bg-cable-950/70 p-2.5 rounded-lg border border-neutral-800/80">
                    <span className="text-[10px] uppercase font-mono text-amber-400 block">
                      ON AIR NOW
                    </span>
                    <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                      {nowProg ? nowProg.title : 'Live Broadcast'}
                    </p>
                    {nowProg && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {formatTimeInZone(nowProg.start, timeZone)} - {formatTimeInZone(nowProg.end, timeZone)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cable-border/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate">via {channel.sourceName}</span>
                  <div className="flex items-center text-amber-400 font-bold group-hover:translate-x-1 transition">
                    <span>Watch</span>
                    <Play className="w-3.5 h-3.5 ml-1 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

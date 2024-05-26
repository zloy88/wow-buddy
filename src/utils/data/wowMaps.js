export const wowMaps = [
  {
    id: 559,
    name: 'Nagrand Arena (old)',
  },
  {
    id: 562,
    name: "zzOldBlade's Edge Arena",
  },
  {
    id: 572,
    name: 'Ruins of Lordaeron',
  },
  {
    id: 617,
    name: 'Dalaran Sewers',
  },
  {
    id: 618,
    name: 'The Ring of Valor',
  },
  {
    id: 980,
    name: "Tol'Viron Arena",
  },
  {
    id: 1134,
    name: "The Tiger's Peak",
  },
  {
    id: 1170,
    name: 'Shado-Pan Showdown',
  },
  {
    id: 1504,
    name: 'Black Rook Hold Arena',
  },
  {
    id: 1505,
    name: 'Nagrand Arena',
  },
  {
    id: 1552,
    name: "Ashamane's Fall",
  },
  {
    id: 1672,
    name: "Blade's Edge Arena",
  },
  {
    id: 1825,
    name: 'Hook Point',
  },
  {
    id: 1911,
    name: 'Mugambala',
  },
  {
    id: 2167,
    name: 'The Robodrome',
  },
  {
    id: 2373,
    name: 'Empyrean Domain',
  },
  {
    id: 2509,
    name: 'Maldraxxus Coliseum',
  },
  {
    id: 2511,
    name: 'Enigma Arena',
  },
  {
    id: 2547,
    name: 'Enigma Crucible',
  },
  {
    id: 2563,
    name: 'Nokhudon Proving Grounds',
  },
  {
    id: 30,
    name: 'Alterac Valley',
  },
  {
    id: 489,
    name: 'Classic Warsong Gulch',
  },
  {
    id: 529,
    name: 'Classic Arathi Basin',
  },
  {
    id: 566,
    name: 'Eye of the Storm',
  },
  {
    id: 607,
    name: 'Strand of the Ancients',
  },
  {
    id: 628,
    name: 'Isle of Conquest',
  },
  {
    id: 726,
    name: 'Twin Peaks',
  },
  {
    id: 727,
    name: 'Silvershard Mines',
  },
  {
    id: 761,
    name: 'The Battle for Gilneas',
  },
  {
    id: 968,
    name: 'Rated Eye of the Storm',
  },
  {
    id: 998,
    name: 'Temple of Kotmogu',
  },
  {
    id: 1010,
    name: 'CTF3',
  },
  {
    id: 1105,
    name: 'Deepwind Gorge (Legacy)',
  },
  {
    id: 1191,
    name: 'Ashran',
  },
  {
    id: 1280,
    name: 'Southshore vs. Tarren Mill',
  },
  {
    id: 1681,
    name: 'Arathi Basin Winter',
  },
  {
    id: 1686,
    name: 'AI Test - Arathi Basin',
  },
  {
    id: 1691,
    name: 'Cooking: Impossible',
  },
  {
    id: 1715,
    name: 'Battle for Blackrock Mountain',
  },
  {
    id: 1726,
    name: '[TEMP] RaceTrackBG',
  },
  {
    id: 1740,
    name: 'AI Test - Warsong Gulch',
  },
  {
    id: 1782,
    name: 'Seething Strand',
  },
  {
    id: 1802,
    name: '8.0 BG Temp',
  },
  {
    id: 1803,
    name: 'Seething Shore',
  },
  {
    id: 2106,
    name: 'Warsong Gulch',
  },
  {
    id: 2107,
    name: 'Arathi Basin',
  },
  {
    id: 2118,
    name: 'Battle for Wintergrasp',
  },
  {
    id: 2177,
    name: 'Arathi Basin Comp Stomp',
  },
  {
    id: 2197,
    name: "Korrak's Revenge",
  },
  {
    id: 2226,
    name: 'Programmer Map - Battlefield',
  },
  {
    id: 2245,
    name: 'Deepwind Gorge',
  },
  {
    id: 2292,
    name: '8.3 Epic Battleground - Warfront Arathi (PvP)',
  },
];


class MapsDictionary {
  constructor() {
    this.mapById = new Map();
    this.mapByName = new Map();
    this.mapInitData();
  }

  mapInitData() {
    wowMaps.forEach((wowMap) => {
      const { id, name } = wowMap;
      this.mapById.set(id, wowMap);
      this.mapByName.set(name, wowMap);
    });
  }

  getMapById(id) {
    return this.mapById.get(id) ?? null;
  }

  getMapByName(name) {
    return this.mapByName.get(name) ?? null;
  }
}

export const mapsDictionary = new MapsDictionary();

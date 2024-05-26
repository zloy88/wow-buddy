export const wowRaces = [
  {
    id: 10,
    name: 'Blood Elf',
  },
  {
    id: 34,
    name: 'Dark Iron Dwarf',
  },
  {
    id: 52,
    name: 'Dracthyr',
  },
  {
    id: 11,
    name: 'Draenei',
  },
  {
    id: 3,
    name: 'Dwarf',
  },
  {
    id: 7,
    name: 'Gnome',
  },
  {
    id: 9,
    name: 'Goblin',
  },
  {
    id: 28,
    name: 'Highmountain Tauren',
  },
  {
    id: 1,
    name: 'Human',
  },
  {
    id: 32,
    name: 'Kul Tiran',
  },
  {
    id: 30,
    name: 'Lightforged Draenei',
  },
  {
    id: 36,
    name: "Mag'har Orc",
  },
  {
    id: 37,
    name: 'Mechagnome',
  },
  {
    id: 27,
    name: 'Nightborne',
  },
  {
    id: 4,
    name: 'Night Elf',
  },
  {
    id: 2,
    name: 'Orc',
  },
  {
    id: 25,
    name: 'Pandaren',
  },
  {
    id: 6,
    name: 'Tauren',
  },
  {
    id: 8,
    name: 'Troll',
  },
  {
    id: 5,
    name: 'Undead',
  },
  {
    id: 29,
    name: 'Void Elf',
  },
  {
    id: 35,
    name: 'Vulpera',
  },
  {
    id: 22,
    name: 'Worgen',
  },
  {
    id: 31,
    name: 'Zandalari Troll',
  },
];

class RacesDictionary {
  constructor() {
    this.maps = {
      idMap: new Map(),
      nameMap: new Map(),
    };
    this.mapData();
  }

  getRaceById(id) {
    return this.maps.idMap.get(id);
  }

  getRaceByName(name) {
    return this.maps.nameMap.get(name);
  }

  mapData(dataToMap = wowRaces) {
    Object.values(this.maps).forEach((map) => map.clear());

    dataToMap.forEach((race) => {
      const { id, name } = race;

      this.maps.idMap.set(id, race);
      this.maps.nameMap.set(name, race);
    });
  }
}

export const racesDictionary = new RacesDictionary();

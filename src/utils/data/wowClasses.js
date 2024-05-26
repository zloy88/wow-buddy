export const wowClasses = [
  {
    name: 'Hunter',
    color: '#AAD372',
    id: 3,
    specializations: [
      {
        name: 'Beast Mastery',
        id: 253,
        class_id: 3,
      },
      {
        name: 'Marksmanship',
        id: 254,
        class_id: 3,
      },
      {
        name: 'Survival',
        icon: 'survival',
        id: 255,
        class_id: 3,
      },
    ],
  },
  {
    name: 'Warlock',
    color: '#8788EE',
    id: 9,
    specializations: [
      {
        name: 'Affliction',
        id: 265,
        class_id: 9,
      },
      {
        name: 'Demonology',
        id: 266,
        class_id: 9,
      },
      {
        name: 'Destruction',
        id: 267,
        class_id: 9,
      },
    ],
  },
  {
    name: 'Druid',
    color: '#FF7C0A',
    id: 11,
    specializations: [
      {
        name: 'Balance',
        id: 102,
        class_id: 11,
      },
      {
        name: 'Feral',
        id: 103,
        class_id: 11,
      },
      {
        name: 'Guardian',
        id: 104,
        class_id: 11,
      },
      {
        name: 'Restoration',
        id: 105,
        class_id: 11,
      },
    ],
  },
  {
    name: 'Mage',
    color: '#3FC7EB',
    id: 8,
    specializations: [
      {
        name: 'Arcane',
        id: 62,
        class_id: 8,
      },
      {
        name: 'Fire',
        id: 63,
        class_id: 8,
      },
      {
        name: 'Frost',
        id: 64,
        class_id: 8,
      },
    ],
  },
  {
    name: 'Death Knight',
    color: '#C41E3A',
    id: 6,
    specializations: [
      {
        name: 'Blood',
        id: 250,
        class_id: 6,
      },
      {
        name: 'Frost',
        id: 251,
        class_id: 6,
      },
      {
        name: 'Unholy',
        id: 252,
        class_id: 6,
      },
    ],
  },
  {
    name: 'Demon Hunter',
    color: '#A330C9',
    id: 12,
    specializations: [
      {
        name: 'Havoc',
        id: 577,
        class_id: 12,
      },
      {
        name: 'Vengeance',
        id: 581,
        class_id: 12,
      },
    ],
  },
  {
    name: 'Monk',
    color: '#00FF98',
    id: 10,
    specializations: [
      {
        name: 'Brewmaster',
        id: 268,
        class_id: 10,
      },
      {
        name: 'Mistweaver',
        id: 270,
        class_id: 10,
      },
      {
        name: 'Windwalker',
        id: 269,
        class_id: 10,
      },
    ],
  },
  {
    name: 'Priest',
    color: '#FFFFFF',
    id: 5,
    specializations: [
      {
        name: 'Discipline',
        id: 256,
        class_id: 5,
      },
      {
        name: 'Holy',
        id: 257,
        class_id: 5,
      },
      {
        name: 'Shadow',
        id: 258,
        class_id: 5,
      },
    ],
  },
  {
    name: 'Paladin',
    color: '#F48CBA',
    id: 2,
    specializations: [
      {
        name: 'Holy',
        id: 65,
        class_id: 2,
      },
      {
        name: 'Protection',
        id: 66,
        class_id: 2,
      },
      {
        name: 'Retribution',
        id: 70,
        class_id: 2,
      },
    ],
  },
  {
    name: 'Rogue',
    color: '#FFF468',
    id: 4,
    specializations: [
      {
        name: 'Assassination',
        id: 259,
        class_id: 4,
      },
      {
        name: 'Outlaw',
        id: 260,
        class_id: 4,
      },
      {
        name: 'Subtlety',
        id: 261,
        class_id: 4,
      },
    ],
  },
  {
    name: 'Shaman',
    color: '#0070DD',
    id: 7,
    specializations: [
      {
        name: 'Elemental',
        id: 262,
        class_id: 7,
      },
      {
        name: 'Enhancement',
        id: 263,
        class_id: 7,
      },
      {
        name: 'Restoration',
        id: 264,
        class_id: 7,
      },
    ],
  },
  {
    name: 'Warrior',
    color: '#C69B6D',
    id: 1,
    specializations: [
      {
        name: 'Arms',
        id: 71,
        class_id: 1,
      },
      {
        name: 'Fury',
        id: 72,
        class_id: 1,
      },
      {
        name: 'Protection',
        id: 73,
        class_id: 1,
      },
    ],
  },
  {
    name: 'Evoker',
    color: '#33937F',
    id: 13,
    specializations: [
      {
        name: 'Augmentation',
        id: 1473,
        class_id: 13,
      },
      {
        name: 'Devastation',
        id: 1467,
        class_id: 13,
      },
      {
        name: 'Preservation',
        id: 1468,
        class_id: 13,
      },
    ],
  },
];

class ClassesDictionary {
  constructor() {
    this.maps = {
      classIdMap: new Map(),
      classNameMap: new Map(),
      specializationIdMap: new Map(),
      specializationNameMap: new Map(),
    };
    this.mapData();
  }

  getClassById(id) {
    return this.maps.classIdMap.get(id);
  }

  getClassByName(name) {
    return this.maps.classNameMap.get(name);
  }

  getSpecializationById(id) {
    return this.maps.specializationIdMap.get(id);
  }

  getSpecializationByName(name) {
    return this.maps.specializationNameMap.get(name);
  }

  mapData(dataToMap = wowClasses) {
    Object.values(this.maps).forEach((map) => map.clear());

    dataToMap.forEach((characterClass) => {
      const {id, name, specializations} = characterClass;

      this.maps.classIdMap.set(id, characterClass);
      this.maps.classNameMap.set(name, characterClass);

      specializations.forEach((characterSpecialization) => {
        const {id, name, code, blizzard_id} = characterSpecialization;

        this.maps.specializationIdMap.set(id, characterSpecialization);
        this.maps.specializationNameMap.set(name, characterSpecialization);
      });
    });
  }
}

export const classesDictionary = new ClassesDictionary();

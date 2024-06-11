import luaparse from 'luaparse';
import {classesDictionary} from "../utils/data/wowClasses";
import {racesDictionary} from "../utils/data/wowRaces";

// lua fields name
const MATCH_FIELD_VERSION = '"Version"';
const MATCH_FIELD_SEASON = '"Season"';
const MATCH_FIELD_DURATION = '"Duration"';
const MATCH_FIELD_TIME = '"Time"';
const MATCH_FIELD_MAP = '"Map"';
const MATCH_FIELD_PLAYER_STATS = '"PlayerStats"';
const MATCH_FIELD_PLAYERS_NUM = '"PlayersNum"';
const MATCH_FIELD_IS_BRAWL = '"isBrawl"';
const MATCH_FIELD_IS_SOLO_SHUFFLE = '"isSoloShuffle"';
const MATCH_FIELD_PLAYERS = '"Players"';
const MATCH_FIELD_HIDDEN = '"Hidden"';
const MATCH_FIELD_IS_ARENA = '"isArena"';
const MATCH_FIELD_IS_RATED = '"isRated"';
const MATCH_FIELD_PLAYER_NUM = '"PlayerNum"';
const MATCH_FIELD_WINNER = '"Winner"';
const MATCH_FIELD_PLAYER_SIDE = '"PlayerSide"';
const MATCH_FIELD_TEAM_DATA = '"TeamData"';
const MATCH_FIELD_BG_COMPOSITION = '"BGComposition"';
const MATCH_FIELD_BG_PLACE = '"BGPlace"';

const mapLuaIndex = (luaIndex) => luaIndex - 1;
const replaceQuotes = (str) => str.replace(/"/g, '');

const matchMapping = {
  [MATCH_FIELD_SEASON]: 'season_id',
  [MATCH_FIELD_DURATION]: 'duration',
  [MATCH_FIELD_TIME]: 'time',
  [MATCH_FIELD_MAP]: 'map_id',
  [MATCH_FIELD_VERSION]: 'version',
  [MATCH_FIELD_PLAYER_NUM]: 'player_index',
  [MATCH_FIELD_WINNER]: 'winner',
  [MATCH_FIELD_PLAYER_SIDE]: 'player_side',
  [MATCH_FIELD_PLAYER_STATS]: 'player_stats',
};

const playerMapping = {
  [mapLuaIndex(1)]: 'name',
  [mapLuaIndex(6)]: 'side',
  [mapLuaIndex(10)]: 'damage',
  [mapLuaIndex(11)]: 'healing',
  [mapLuaIndex(12)]: 'rating_new',
  [mapLuaIndex(13)]: 'rating_change',
};

export const mapReflexLuaTable = (
  luaString,
  realm,
  region
) => {
  const luaAst = luaparse.parse(luaString);
  const matches = [];

  for (const dataLvl_1 of luaAst.body) {
    if (
      dataLvl_1.type !== 'AssignmentStatement' ||
      !dataLvl_1.variables.find((variable) => variable.type === 'Identifier' && variable.name === 'REFlexDatabase')
    ) {
      continue;
    }

    for (const dataLvl_2 of dataLvl_1.init) {
      if (dataLvl_2.type !== 'TableConstructorExpression') {
        continue;
      }

      for (const dataLvl_3 of dataLvl_2.fields) {
        try {
          if (dataLvl_3.value.type !== 'TableConstructorExpression') {
            continue;
          }

          const {fields} = dataLvl_3.value;

          const match = {
            season_id: null,
            duration: null,
            time: null,
            type: null,
            version: null,
            winner: null,
            map_id: null,
            enemy_mmr: null,
            player_index: null,
            player_side: null,
            player_stats: null,
            player_win: null,
            player_mmr: null,
            players: [],
          };

          let playersNum = null;
          let isRated = null;
          let isSoloShuffle = null;
          let isHidden = null;
          const teamsMMRs = [];

          fields.forEach((field) => {
            if (field.type !== 'TableKey' || field.key.type !== 'StringLiteral') {
              return;
            }

            const {value, key} = field;

            switch (key.raw) {
              case MATCH_FIELD_SEASON:
              case MATCH_FIELD_DURATION:
              case MATCH_FIELD_TIME:
              case MATCH_FIELD_MAP:
              case MATCH_FIELD_VERSION:
              case MATCH_FIELD_WINNER:
              case MATCH_FIELD_PLAYER_SIDE: {
                if (value.type === 'NumericLiteral') {
                  match[matchMapping[key.raw]] = value.value;
                }
                break;
              }

              case MATCH_FIELD_PLAYER_NUM: {
                if (value.type === 'NumericLiteral') {
                  match[matchMapping[key.raw]] = mapLuaIndex(value.value);
                }
                break;
              }

              case MATCH_FIELD_PLAYERS: {
                if (value.type === 'TableConstructorExpression') {
                  value.fields.forEach((player) => {
                    if (player.value.type === 'TableConstructorExpression') {
                      const playerResult = {
                        name: null,
                        realm: null,
                        region: null,
                        side: null,
                        rating_change: null,
                        rating_new: null,
                        damage: null,
                        healing: null,
                        class_id: null,
                        spec_id: null,
                        race_id: null,
                      };

                      player.value.fields.forEach((playerField, index) => {
                        const {value: playerValue} = playerField;
                        switch (index) {
                          case mapLuaIndex(1): {
                            if (playerValue.type === 'StringLiteral') {
                              const [charName, charRealm = realm] = replaceQuotes(
                                playerValue.raw
                              ).split('-');

                              playerResult.name = charName;
                              playerResult.realm = charRealm;
                            }
                            break;
                          }

                          case mapLuaIndex(7): {
                            if (playerValue.type === 'StringLiteral') {
                              const race_name = replaceQuotes(playerValue.raw);
                              playerResult.race_id = racesDictionary.getRaceByName(race_name)?.id ?? null;
                            }
                            break;
                          }
                          case mapLuaIndex(8): {
                            if (playerValue.type === 'StringLiteral') {
                              const class_name = replaceQuotes(playerValue.raw);
                              playerResult.class_id = classesDictionary.getClassByName(class_name)?.id ?? null;
                            }
                            break;
                          }
                          case mapLuaIndex(16): {
                            if (playerValue.type === 'StringLiteral') {
                              const spec_name = replaceQuotes(playerValue.raw);
                              playerResult.spec_id = classesDictionary.getSpecializationByNameAndClassId(spec_name, playerResult.class_id)?.id ?? null;
                            }
                            break;
                          }

                          case mapLuaIndex(6):
                          case mapLuaIndex(10):
                          case mapLuaIndex(11):
                          case mapLuaIndex(12):
                          case mapLuaIndex(13): {
                            const fieldName = playerMapping[index];
                            if (playerValue.type === 'NumericLiteral') {
                              playerResult[fieldName] = playerValue.value;
                            }
                            if (
                              fieldName === 'rating_change' &&
                              playerValue.type === 'UnaryExpression' &&
                              playerValue.argument.type === 'NumericLiteral'
                            ) {
                              const rating_change = Number(playerValue.operator + playerValue.argument.value);

                              if (Number.isFinite(rating_change)) {
                                playerResult[fieldName] = rating_change;
                              }
                            }
                            break;
                          }
                        }
                      });

                      match.players.push(playerResult);
                    }
                  });
                }
                break;
              }

              case MATCH_FIELD_TEAM_DATA: {
                if (value.type === 'TableConstructorExpression') {
                  value.fields.forEach((teamField) => {
                    if (teamField.value.type === 'TableConstructorExpression') {
                      const teamMMR = teamField.value.fields[mapLuaIndex(4)];

                      if (teamMMR && teamMMR.value.type === 'NumericLiteral') {
                        teamsMMRs.push(teamMMR.value.value);
                      }
                    }
                  });
                }
                break;
              }

              case MATCH_FIELD_IS_RATED: {
                if (value.type === 'BooleanLiteral') {
                  isRated = value.value;
                }
                break;
              }
              case MATCH_FIELD_PLAYERS_NUM: {
                if (value.type === 'NumericLiteral') {
                  playersNum = value.value;
                }
                break;
              }
              case MATCH_FIELD_IS_SOLO_SHUFFLE:
              case MATCH_FIELD_PLAYER_STATS: {
                if (value.type === 'BooleanLiteral') {
                  isSoloShuffle = value.value;
                }
                if (value.type === 'TableConstructorExpression') {
                  const numericFields = value.fields
                    .filter(field => field.value.type === 'NumericLiteral')
                    .map(field => field.value.value);

                  match.player_stats = numericFields.length === 1 ? numericFields[0] : null;
                }
                break;
              }
              case MATCH_FIELD_HIDDEN: {
                if (value.type === 'BooleanLiteral') {
                  isHidden = value.value;
                }
                break;
              }

              case MATCH_FIELD_IS_BRAWL:
              case MATCH_FIELD_IS_ARENA:
              case MATCH_FIELD_BG_COMPOSITION:
              case MATCH_FIELD_BG_PLACE: {
                break;
              }

              default: {
                console.info('Unknown field', key.raw);
              }
            }
          });

          if (isHidden === true) {
            continue;
          }

          let matchType = null;

          if (playersNum === 4 && isRated === true) {
            matchType = '2v2';
          } else if (playersNum === 6 && isRated === true && isSoloShuffle === false) {
            matchType = '3v3';
          } else if (playersNum === 10 && isRated === true) {
            matchType = 'rbg';
          } else if (playersNum === 6 && isSoloShuffle === true) {
            matchType = 'shuffle';
          }

          match.type = matchType;
          match.player_win = match.player_side === match.winner ? 1 : 0;
          match.player_mmr = teamsMMRs[match.player_side];
          match.enemy_mmr = teamsMMRs[match.player_side === 1 ? 0 : 1];

          match.players.forEach((player) => {
            if (region) {
              player.region = region;
            }
          });

          // cleanup match data - remove rbg and empty types
          if (!match.type || match.type === 'rbg') {
            continue;
          }

          // cleanup match data - remove if player count does not match the type
          if (playersNum !== match.players.length) {
            continue;
          }

          matches.push(match);
        } catch {
          // empty
        }
      }
    }
  }

  return matches;
};


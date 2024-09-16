import fs from 'fs/promises';
import path from 'path';

export default async function parserControler(req, res) {

  const matchData = await parseLogFile();

  res.json(matchData);
}

export async function readLogFile() {
  const logFilePath = path.join(process.cwd(), './Log teste.log');
  try {
    const data = await fs.readFile(logFilePath, 'utf-8');
    const lines = data.replace(/\r/g, '').split('\n');
    return lines;
  } catch (error) {
    console.error('Error reading log file:', error);
    return null;
  }
}

export async function parseLogFile(req, res) {
  const logLines = await readLogFile();
  if (!logLines) return res.status(500).send('Failed to read log file.');

  let matches = {};
  let currentMatch = null;
  let playerNames = {};
  let gameNumber = 1; 

  const playerInfoRegex = /ClientUserinfoChanged:\s*(\d+)\s+n\\([^\\]+)/;
  const killRegex = /^\s*[\d:]+\s+Kill:\s+(\d+)\s+(\d+)\s+\d+:\s*(?:<([^>]+)>\s+|(.+?)\s+)killed\s+(.+?)\s+by\s+(.+)$/;

  logLines.forEach(line => {

    if (line.includes('InitGame')) {
      if (currentMatch) {
        matches[`game_${gameNumber}`] = currentMatch;
        gameNumber += 1;
      }

      currentMatch = {
        totalKills: 0,
        players: [],
        kills: {},
        worldKills: 0,
        killsByMeans: {}
      };
      playerNames = {}; 

    } else if (line.includes('ShutdownGame')) {
      matches[`game_${gameNumber}`] = currentMatch;
      currentMatch = null;
      gameNumber += 1; 

    } else if (line.includes('ClientUserinfoChanged')) {
      const match = line.match(playerInfoRegex);

      if (match) {
        const playerId = match[1];
        const playerName = match[2];

        playerNames[playerId] = playerName;
        if (!currentMatch.players.includes(playerName)) {
          currentMatch.players.push(playerName);
        }
        if (!currentMatch.kills[playerName]) {
          currentMatch.kills[playerName] = 0;
        }
      }

    } else if (line.includes('Kill')) {
      const match = line.match(killRegex);
      
      if (match) {
        const killerId = match[1];
        const killedId = match[2];
        const killerName = playerNames[killerId];
        const killedName = playerNames[killedId];
        const meansOfDeath = match[6];

        if (killerId == 1022) {
          currentMatch.worldKills += 1;
          currentMatch.kills[killedName] -= 1;
          
        } else if (killerId == killedId) {
          currentMatch.kills[killedName] -= 1;
        } 
        
        else {
          currentMatch.totalKills += 1;
          currentMatch.kills[killerName] += 1;
        }

        if (!currentMatch.killsByMeans[meansOfDeath]) {
          currentMatch.killsByMeans[meansOfDeath] = 0;
        }
        currentMatch.killsByMeans[meansOfDeath] += 1;
      }
    }
  });

  return matches;
}

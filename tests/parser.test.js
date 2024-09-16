import { readLogFile, parseLogFile } from '../src/parser.js';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('readLogFile', () => {
  it('should return log lines when log file is found', async () => {
    const mockLogData = 'InitGame\nClientUserinfoChanged: 2 n\\Player1\nKill: 1022 2 22: <world> killed Player1 by MOD_FALLING';
    fs.readFile.mockResolvedValue(mockLogData);

    const lines = await readLogFile();
    expect(lines).toEqual(['InitGame', 'ClientUserinfoChanged: 2 n\\Player1', 'Kill: 1022 2 22: <world> killed Player1 by MOD_FALLING']);
  });

  it('should return null and log an error if reading fails', async () => {
    fs.readFile.mockRejectedValue(new Error('File not found'));
    const result = await readLogFile();
    expect(result).toBeNull();
  });
});

describe('parseLogFile', () => {
  it('should correctly parse the log data', async () => {
    const mockLogLines = [
      'InitGame',
      'ClientUserinfoChanged: 2 n\\Player1',
      'Kill: 1022 2 22: <world> killed Player1 by MOD_FALLING',
      'ShutdownGame'
    ];

    fs.readFile.mockResolvedValue(mockLogLines.join('\n'));

    const result = await parseLogFile();
    expect(result).toEqual({
      game_1: {
        totalKills: 0,
        players: ['Player1'],
        kills: { Player1: -1 },
        worldKills: 1,
        killsByMeans: { MOD_FALLING: 1 },
      }
    });
  });

  it('should handle multiple InitGame without ShutdownGame', async () => {
    const mockLogLines = [
      'InitGame',
      'ClientUserinfoChanged: 2 n\\Player1',
      'Kill: 1022 2 22: <world> killed Player1 by MOD_FALLING',
      'InitGame', 
      'ClientUserinfoChanged: 3 n\\Player2',
      'Kill: 1022 3 22: <world> killed Player2 by MOD_FALLING',
      'ShutdownGame',
    ];

    fs.readFile.mockResolvedValue(mockLogLines.join('\n'));

    const result = await parseLogFile();
    expect(result).toEqual({
      game_1: {
        totalKills: 0,
        players: ['Player1'],
        kills: { Player1: -1 },
        worldKills: 1,
        killsByMeans: { MOD_FALLING: 1 },
      },
      game_2: {
        totalKills: 0,
        players: ['Player2'],
        kills: { Player2: -1 },
        worldKills: 1,
        killsByMeans: { MOD_FALLING: 1 },
      },
    });
  });
});
import { readLogFile, parseLogFile } from '../src/parser.js';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('readLogFile', () => {
  let mockRes;
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })
  
  it('should return log lines when log file is found', async () => {
    const mockLogData = `
      0:00 InitGame: \\sv_hostname\\Code Miner Server\\timelimit\\15\\mapname\\q3dm17
      0:25 ClientConnect: 2
      0:27 ClientUserinfoChanged: 2 n\\Mocinha\\model\\sarge
      1:08 Kill: 3 2 6: Isgalamido killed Mocinha by MOD_ROCKET
      1:47 ShutdownGame:
    `;

    fs.readFile.mockResolvedValue(mockLogData);

    const lines = await readLogFile();
    expect(lines).toEqual([
      '0:00 InitGame: \\sv_hostname\\Code Miner Server\\timelimit\\15\\mapname\\q3dm17',
      '0:25 ClientConnect: 2',
      '0:27 ClientUserinfoChanged: 2 n\\Mocinha\\model\\sarge',
      '1:08 Kill: 3 2 6: Isgalamido killed Mocinha by MOD_ROCKET',
      '1:47 ShutdownGame:',
    ]);
  });

  it('should return null and log an error if reading fails', async () => {
    fs.readFile.mockRejectedValue(new Error('File not found'));
    const result = await readLogFile();
    expect(result).toBe(null);
  });
});

describe('parseLogFile', () => {
  it('should correctly parse the log data', async () => {
    const mockLogLines = `
      0:00 InitGame: \\sv_hostname\\Code Miner Server\\timelimit\\15\\mapname\\q3dm17
      0:25 ClientConnect: 2
      0:27 ClientUserinfoChanged: 2 n\\Mocinha\\model\\sarge
      0:59 ClientConnect: 3
      1:01 ClientUserinfoChanged: 3 n\\Isgalamido\\model\\uriel
      1:08 Kill: 3 2 6: Isgalamido killed Mocinha by MOD_ROCKET
      1:47 ShutdownGame:
    `;

    fs.readFile.mockResolvedValue(mockLogLines);

    const result = await parseLogFile();
    expect(result).toEqual({
      game_1: {
        totalKills: 1,
        players: ['Mocinha', 'Isgalamido'],
        kills: { Isgalamido: 1, Mocinha: 0 },
        worldKills: 0,
        killsByMeans: { MOD_ROCKET: 1 },
      },
    });
  });

  it('should handle multiple InitGame without ShutdownGame', async () => {
    const mockLogLines = `
      0:00 InitGame: \\sv_hostname\\Code Miner Server\\timelimit\\15\\mapname\\q3dm17
      0:25 ClientConnect: 2
      0:27 ClientUserinfoChanged: 2 n\\Mocinha\\model\\sarge
      0:59 ClientConnect: 3
      1:01 ClientUserinfoChanged: 3 n\\Isgalamido\\model\\uriel
      1:08 Kill: 3 2 6: Isgalamido killed Mocinha by MOD_ROCKET
      1:50 InitGame: \\sv_hostname\\New Game Server\\timelimit\\10\\mapname\\q3dm5
      1:55 ClientConnect: 4
      1:58 ClientUserinfoChanged: 4 n\\Zeh\\model\\sarge
      2:10 Kill: 1022 4 22: <world> killed Zeh by MOD_TRIGGER_HURT
      2:30 ShutdownGame:
    `;

    fs.readFile.mockResolvedValue(mockLogLines);

    const result = await parseLogFile();
    expect(result).toEqual({
      game_1: {
        totalKills: 1,
        players: ['Mocinha', 'Isgalamido'],
        kills: { Isgalamido: 1, Mocinha: 0 },
        worldKills: 0,
        killsByMeans: { MOD_ROCKET: 1 },
      },
      game_2: {
        totalKills: 0,
        players: ['Zeh'],
        kills: { Zeh: -1 },
        worldKills: 1,
        killsByMeans: { MOD_TRIGGER_HURT: 1 },
      },
    });
  });
});

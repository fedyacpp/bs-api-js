import axios, { AxiosInstance, AxiosError } from 'axios';
import * as T from './types';

const DEFAULT_BASE_URL = 'https://api.brawlstars.com/v1';

export class BrawlStarsApiError extends Error {
  public readonly statusCode?: number;
  public readonly errorData?: T.ClientError;

  constructor(message: string, statusCode?: number, errorData?: T.ClientError) {
    super(message);
    this.name = 'BrawlStarsApiError';
    this.statusCode = statusCode;
    this.errorData = errorData;
    Object.setPrototypeOf(this, BrawlStarsApiError.prototype);
  }
}

export class BrawlStarsClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string, baseURL: string = DEFAULT_BASE_URL) {
    if (!apiKey) {
      throw new Error('API key is required to interact with the Brawl Stars API.');
    }

    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });
  }

  private async _request<T>(method: 'get', path: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url: path,
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<T.ClientError>;
        const statusCode = axiosError.response?.status;
        const errorData = axiosError.response?.data;
        const errorMessage = errorData?.message || axiosError.message || 'An unknown API error occurred';
        throw new BrawlStarsApiError(errorMessage, statusCode, errorData);
      }
      throw error;
    }
  }

  private encodeTag(tag: string): string {
      return encodeURIComponent(tag.startsWith('#') ? tag.substring(1) : tag);
  }

  /**
   * Retrieves information about a single player by their tag.
   * @param playerTag Tag of the player (e.g., #PLAYERTAG)
   */
  async getPlayer(playerTag: string): Promise<T.Player> {
    const encodedTag = this.encodeTag(playerTag);
    return this._request<T.Player>('get', `/players/%23${encodedTag}`);
  }

  /**
   * Retrieves a log of recent battles for a player.
   * Note: It may take up to 30 minutes for a new battle to appear.
   * @param playerTag Tag of the player (e.g., #PLAYERTAG)
   */
  async getPlayerBattleLog(playerTag: string): Promise<T.BattleList> {
    const encodedTag = this.encodeTag(playerTag);
    return this._request<T.BattleList>('get', `/players/%23${encodedTag}/battlelog`);
  }

  /**
   * Retrieves information about a single club by its tag.
   * @param clubTag Tag of the club (e.g., #CLUBTAG)
   */
  async getClub(clubTag: string): Promise<T.Club> {
    const encodedTag = this.encodeTag(clubTag);
    return this._request<T.Club>('get', `/clubs/%23${encodedTag}`);
  }

  /**
   * Lists members of a specific club.
   * @param clubTag Tag of the club (e.g., #CLUBTAG)
   * @param options Optional parameters for pagination (limit, after, before)
   */
  async getClubMembers(clubTag: string, options?: T.PagingOptions): Promise<T.ClubMemberList> {
    const encodedTag = this.encodeTag(clubTag);
    return this._request<T.ClubMemberList>('get', `/clubs/%23${encodedTag}/members`, options);
  }

  /**
   * Retrieves a list of all available brawlers.
   * @param options Optional parameters for pagination (limit, after, before)
   */
  async getBrawlers(options?: T.PagingOptions): Promise<T.BrawlerList> {
    return this._request<T.BrawlerList>('get', '/brawlers', options);
  }

  /**
   * Retrieves information about a specific brawler by its ID.
   * @param brawlerId Identifier of the brawler
   */
  async getBrawler(brawlerId: number | string): Promise<T.BrawlerDefinition> {
      const idString = typeof brawlerId === 'number' ? brawlerId.toString() : brawlerId;
      return this._request<T.BrawlerDefinition>('get', `/brawlers/${idString}`);
  }

  /**
   * Retrieves player rankings for a country or global rankings.
   * @param countryCode Two-letter country code, or 'global' for global rankings.
   * @param options Optional parameters for pagination (limit, after, before)
   */
  async getPlayerRankings(countryCode: string, options?: T.PagingOptions): Promise<T.PlayerRankingList> {
    return this._request<T.PlayerRankingList>('get', `/rankings/${countryCode}/players`, options);
  }

  /**
   * Retrieves club rankings for a country or global rankings.
   * @param countryCode Two-letter country code, or 'global' for global rankings.
   * @param options Optional parameters for pagination (limit, after, before)
   */
  async getClubRankings(countryCode: string, options?: T.PagingOptions): Promise<T.ClubRankingList> {
    return this._request<T.ClubRankingList>('get', `/rankings/${countryCode}/clubs`, options);
  }

  /**
   * Retrieves brawler rankings for a country or global rankings.
   * @param countryCode Two-letter country code, or 'global' for global rankings.
   * @param brawlerId Identifier of the brawler
   * @param options Optional parameters for pagination (limit, after, before)
   */
  async getBrawlerRankings(countryCode: string, brawlerId: number | string, options?: T.PagingOptions): Promise<T.PlayerRankingList> {
      const idString = typeof brawlerId === 'number' ? brawlerId.toString() : brawlerId;
      return this._request<T.PlayerRankingList>('get', `/rankings/${countryCode}/brawlers/${idString}`, options);
  }

  /**
   * Retrieves the current event rotation.
   */
  async getEventRotation(): Promise<T.ScheduledEvents> {
    return this._request<T.ScheduledEvents>('get', '/events/rotation');
  }
} 

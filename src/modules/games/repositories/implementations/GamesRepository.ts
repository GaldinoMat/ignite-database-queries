import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const titles = this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :param", { param: `%${param}%` })
      .getMany();

    
    if ((await titles).length === 0) throw new Error("No titles found")

    return titles
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) FROM games")
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games").where("game.id === :id", {id}).relation(Game, "users").of(id).loadMany()
  }
}

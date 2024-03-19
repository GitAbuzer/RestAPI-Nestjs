import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const entity: Team = this.teamRepository.create(createTeamDto);
    const result: Team = await this.addMembersInTeam(
      entity,
      createTeamDto.selectedAppUsers,
    );
    return `${result.id} is created successfully!`;
  }

  async findAll(): Promise<Team[] | string> {
    const teams: Team[] = await this.teamRepository.find({
      relations: {
        members: true,
      },
    });

    return teams.length > 0 ? teams : `There is no team!`;
  }

  async findOne(id: number) {
    const team: Team = (
      await this.teamRepository.find({
        where: {
          id: id,
        },
        relations: {
          members: true,
        },
      })
    ).at(0);
    return team ? team : `Team not found with ${id}!`;
  }

  async addMembersInTeam(entity: Team, selectedUsers: number[]) {
    const appUsers: AppUser[] = await this.appUserRepository.find({
      where: {
        id: In(selectedUsers),
        isActive: true,
      },
    });
    if (appUsers.length === 0)
      throw new NotFoundException(
        {
          title: 'Can not Found Any User',
          message: 'There is no user with ids!',
        },
        'Please check ids you entered!',
      );
    const team: Team = {
      ...entity,
      members: appUsers,
    };
    return await this.teamRepository.save(team);
  }

  async addNewMembersInTeam(id: number, selectedUsers: number[]) {
    const team: Team = await this.teamRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        members: true,
      },
    });
    if (!team) throw new NotFoundException(`there is no team with ${id}`);

    const appUsers: AppUser[] = await this.appUserRepository.find({
      where: {
        id: In(selectedUsers),
        isActive: true,
      },
    });

    if (appUsers.length === 0)
      throw new NotFoundException(
        {
          title: 'Can not Found Any User',
          message: 'There is no user with ids!',
        },
        'Please check ids you entered!',
      );
    team.members.push(...appUsers);

    return await this.teamRepository.save(team);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const result = await this.teamRepository.update(id, updateTeamDto);
    return result.affected > 0
      ? `update operation is done successfully with ${id} `
      : `something went wrong while update ${id} Address!`;
  }

  async remove(id: number) {
    await this.teamRepository.delete(id);
    return `This action removes a #${id} Address`;
  }
}

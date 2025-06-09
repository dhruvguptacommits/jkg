import { Injectable, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async updateRole(userId: number, role: string, requestingUser: any) {
    if (requestingUser.role !== "admin") {
      throw new ForbiddenException("Only admins can update roles");
    }
    return this.usersRepository.update(userId, { role });
  }

  async delete(userId: number, requestingUser: any) {
    if (requestingUser.role !== "admin") {
      throw new ForbiddenException("Only admins can delete users");
    }
    return this.usersRepository.delete(userId);
  }
}

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";
import { RegisterDto } from "../shared/dtos/register.dto";
import { LoginDto } from "../shared/dtos/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password, role } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      username,
      password: hashedPassword,
      role,
    });
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.findOne(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async logout() {
    return { message: "Logged out successfully" };
  }
}

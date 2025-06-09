import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../../src/auth/auth.service";
import { UsersService } from "../../src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../src/users/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";

describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should register a new user", async () => {
    const registerDto = {
      username: "testuser",
      password: "password",
      role: "viewer",
    };
    jest
      .spyOn(usersService, "create")
      .mockResolvedValue({ id: 1, ...registerDto } as any);
    const result = await service.register(registerDto);
    expect(result).toEqual({ id: 1, ...registerDto });
  });

  it("should login a user and return a token", async () => {
    const loginDto = { username: "testuser", password: "password" };
    const user = {
      id: 1,
      username: "testuser",
      password: "$2b$10$hash",
      role: "viewer",
    };
    jest.spyOn(usersService, "findOne").mockResolvedValue(user as any);
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementation(() => Promise.resolve(true)); // Use mockImplementation for async
    jest.spyOn(jwtService, "sign").mockReturnValue("token");
    const result = await service.login(loginDto);
    expect(result).toEqual({ accessToken: "token" });
  });
});

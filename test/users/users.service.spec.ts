import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../../src/users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../src/users/entities/user.entity";
import { Repository } from "typeorm";

describe("UsersService", () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new user", async () => {
    const user = { username: "testuser", password: "hashed", role: "viewer" };
    jest.spyOn(repository, "create").mockReturnValue(user as any);
    jest.spyOn(repository, "save").mockResolvedValue({ id: 1, ...user } as any);
    const result = await service.create(user);
    expect(result).toEqual({ id: 1, ...user });
  });
});

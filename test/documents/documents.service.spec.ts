import { Test, TestingModule } from "@nestjs/testing";
import { DocumentsService } from "../../src/documents/documents.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Document } from "../../src/documents/entities/document.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

describe.skip("DocumentsService", () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a document", async () => {
      const createDocumentDto = { title: "Test Doc", content: "Test Content" };
      const userId = 1;
      const document = {
        id: 1,
        ...createDocumentDto,
        ownerId: userId,
        createdAt: new Date(),
      };
      jest.spyOn(repository, "create").mockReturnValue(document as any);
      jest.spyOn(repository, "save").mockResolvedValue(document as any);
      const result = await service.create(createDocumentDto, userId);
      expect(result).toEqual(document);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDocumentDto,
        ownerId: userId,
        createdAt: expect.any(Date),
      });
      expect(repository.save).toHaveBeenCalledWith(document);
    });
  });

  describe("findAll", () => {
    it("should return all documents for admin", async () => {
      const userId = 1;
      const role = "admin";
      const documents = [
        { id: 1, title: "Doc 1", content: "Content 1", ownerId: 1 },
        { id: 2, title: "Doc 2", content: "Content 2", ownerId: 2 },
      ];
      jest.spyOn(repository, "find").mockResolvedValue(documents as any);
      const result = await service.findAll(userId);
      expect(result).toEqual(documents);
      expect(repository.find).toHaveBeenCalled();
    });

    it("should return user-specific documents for non-admin", async () => {
      const userId = 1;
      const role = "viewer";
      const documents = [
        { id: 1, title: "Doc 1", content: "Content 1", ownerId: userId },
      ];
      jest.spyOn(repository, "find").mockResolvedValue(documents as any);
      const result = await service.findAll(userId);
      expect(result).toEqual(documents);
      expect(repository.find).toHaveBeenCalledWith({
        where: { ownerId: userId },
      });
    });
  });

  describe("findOne", () => {
    it("should return a document for admin", async () => {
      const id = 1;
      const userId = 2;
      const role = "admin";
      const document = { id, title: "Doc 1", content: "Content 1", ownerId: 1 };
      jest.spyOn(repository, "findOne").mockResolvedValue(document as any);
      const result = await service.findOne(id, userId);
      expect(result).toEqual(document);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it("should return a document for owner", async () => {
      const id = 1;
      const userId = 1;
      const role = "viewer";
      const document = {
        id,
        title: "Doc 1",
        content: "Content 1",
        ownerId: userId,
      };
      jest.spyOn(repository, "findOne").mockResolvedValue(document as any);
      const result = await service.findOne(id, userId);
      expect(result).toEqual(document);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it("should throw NotFoundException if document not found", async () => {
      const id = 1;
      const userId = 1;
      const role = "viewer";
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      await expect(service.findOne(id, userId)).rejects.toThrow(
        new NotFoundException(`Document with ID ${id} not found`)
      );
    });

    it("should throw NotFoundException if non-admin accesses another user's document", async () => {
      const id = 1;
      const userId = 2;
      const role = "viewer";
      const document = { id, title: "Doc 1", content: "Content 1", ownerId: 1 };
      jest.spyOn(repository, "findOne").mockResolvedValue(document as any);
      await expect(service.findOne(id, userId)).rejects.toThrow(
        new NotFoundException(`Document with ID ${id} not found`)
      );
    });
  });

  describe("update", () => {
    it("should update a document", async () => {
      const id = 1;
      const userId = 1;
      const role = "viewer";
      const updateDocumentDto = {
        title: "Updated Doc",
        content: "Updated Content",
      };
      const document = {
        id,
        title: "Doc 1",
        content: "Content 1",
        ownerId: userId,
      };
      const updatedDocument = { ...document, ...updateDocumentDto };
      jest.spyOn(service, "findOne").mockResolvedValue(document as any);
      jest.spyOn(repository, "save").mockResolvedValue(updatedDocument as any);
      const result = await service.update(id, updateDocumentDto, userId);
      expect(result).toEqual(updatedDocument);
      expect(service.findOne).toHaveBeenCalledWith(id, userId, role);
      expect(repository.save).toHaveBeenCalledWith(updatedDocument);
    });
  });
});

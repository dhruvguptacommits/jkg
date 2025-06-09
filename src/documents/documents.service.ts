import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(document: Partial<Document>, user: any): Promise<Document> {
    const newDocument = this.documentsRepository.create({ ...document, ownerId: user.userId });
    return this.documentsRepository.save(newDocument);
  }

  async findAll(user: any): Promise<Document[]> {
    if (user.role === 'admin') {
      return this.documentsRepository.find();
    }
    return this.documentsRepository.find({ where: { ownerId: user.userId } });
  }

  async findOne(id: number, user: any): Promise<Document> {
    const document = await this.documentsRepository.findOne({ where: { id } });
    if (!document || (document.ownerId !== user.userId && user.role !== 'admin')) {
      throw new ForbiddenException('Access denied');
    }
    return document;
  }

  async update(id: number, updateData: Partial<Document>, user: any) {
    const document = await this.findOne(id, user);
    return this.documentsRepository.update(id, updateData);
  }

  async delete(id: number, user: any) {
    const document = await this.findOne(id, user);
    return this.documentsRepository.delete(id);
  }

  async uploadFile(file: any, user: any) {
    const document = this.documentsRepository.create({
      title: file.originalname,
      content: '',
      filePath: `/uploads/${file.filename}`,
      ownerId: user.userId,
    });
    return this.documentsRepository.save(document);
  }
}

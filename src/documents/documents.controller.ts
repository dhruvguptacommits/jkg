import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createDocumentDto: any, @Request() req) {
    return this.documentsService.create(createDocumentDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.documentsService.findAll(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.documentsService.findOne(+id, req.user);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: any,
    @Request() req,
  ) {
    return this.documentsService.update(+id, updateDocumentDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.documentsService.delete(+id, req.user);
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Request() req) {
    return this.documentsService.uploadFile(file, req.user);
  }
}

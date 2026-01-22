// books-backend/src/books/books.controller.ts

/**
 * اسم الملف: books.controller.ts
 * الوصف: المتحكم الرئيسي الذي يدير جميع طلبات HTTP (CRUD) الخاصة بالكتب،
 * ويتعامل مع عمليات رفع الصور، الإضافة، التحديث، والحذف.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books') // تعريف المسار الأساسي لجميع الدوال (localhost:3000/books)
export class BooksController {
  
  /** حقن خدمة الكتب (Service) لاستخدامها في معالجة البيانات */
  constructor(private readonly booksService: BooksService) {}

  /**
   * إعدادات Multer:
   * تستخدم لتهيئة عملية رفع الصور، تحديد المسار، توليد أسماء فريدة للملفات،
   * والتحقق من نوع وحجم الملف قبل رفعه.
   */
  private static multerOptions = {
    storage: diskStorage({
      destination: './uploads', // المجلد الذي ستحفظ فيه الصور
      filename: (req, file, cb) => {
        // توليد اسم فريد لكل صورة لمنع تداخل الأسماء
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `book-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // السماح فقط برفع الصور ذات الصيغ المعروفة
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('يجب أن تكون الصورة بصيغة صحيحة'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // الحد الأقصى لحجم الصورة: 5 ميجابايت
  };

  /**
   * إنشاء كتاب جديد:
   * تستقبل البيانات من النوع CreateBookDto وتستقبل ملف الصورة المرفوع.
   */
  @Post()
  @UseInterceptors(FileInterceptor('image', BooksController.multerOptions))
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('صورة الكتاب مطلوبة');
    }
    // إرسال البيانات واسم الملف للخدمة لحفظها في قاعدة البيانات
    return this.booksService.create(createBookDto, file.filename);
  }

  /** جلب قائمة بجميع الكتب المتاحة */
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  /** جلب بيانات كتاب واحد بناءً على المعرف الخاص به (ID) */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  /** حذف كتاب من النظام باستخدام المعرف الخاص به */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.booksService.delete(id);
  }

  /**
   * تحديث بيانات كتاب موجود:
   * تتيح تعديل النصوص أو رفع صورة جديدة بدلاً من القديمة.
   */
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', BooksController.multerOptions))
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    // إذا قام المستخدم برفع صورة جديدة، نحدث مسار الصورة في الكائن المحدث
    if (file) {
      updateBookDto.image = file.filename;
    }
    // تمرير المعرف والبيانات الجديدة للخدمة لإتمام عملية التعديل
    return this.booksService.update(id, updateBookDto);
  }
}
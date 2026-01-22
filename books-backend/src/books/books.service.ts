// books-backend/src/books/books.service.ts

/**
 * اسم الملف: books.service.ts
 * الوصف: فئة الخدمة (Service) المسؤولة عن تنفيذ المنطق البرمجي والتعامل المباشر 
 * مع قاعدة البيانات (MongoDB) باستخدام مكتبة Mongoose.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable() // تجعل الكلاس قابلاً للحقن في أجزاء المشروع الأخرى مثل الـ Controller
export class BooksService {
  
  /**
   * المنشئ (Constructor):
   * يتم فيه حقن موديل الكتاب (BookModel) للوصول إلى دوال مكتبة Mongoose
   */
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  /**
   * إنشاء كتاب جديد:
   * @param createBookDto البيانات النصية للكتاب (الاسم، التصنيف، إلخ)
   * @param imagePath مسار الصورة الذي تم توليده في المتحكم
   * @returns الوعد (Promise) يعيد كائن الكتاب المحفوظ
   */
  async create(createBookDto: CreateBookDto, imagePath: string): Promise<Book> {
    const newBook = new this.bookModel({
      ...createBookDto,
      image: imagePath,
    });
    return newBook.save();
  }

  /**
   * جلب كافة الكتب:
   * @returns Promise يعيد مصفوفة تحتوي على جميع وثائق الكتب في قاعدة البيانات
   */
  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  /**
   * البحث عن كتاب واحد:
   * @param id المعرف الفريد للكتاب
   * @returns كائن الكتاب في حال وجد، أو يرمي خطأ NotFoundException
   */
  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`عذراً، الكتاب المطلوب غير موجود`);
    }
    return book;
  }

  /**
   * حذف كتاب:
   * @param id المعرف الفريد للكتاب المراد حذفه
   */
  async delete(id: string): Promise<void> {
    const result = await this.bookModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`فشلت عملية الحذف، الكتاب غير موجود`);
    }
  }

  /**
   * تحديث بيانات كتاب:
   * @param id المعرف الفريد للكتاب
   * @param updateBookDto البيانات الجديدة المراد تعديلها
   * @returns الكتاب بعد التحديث بفضل خيار { new: true }
   */
  async update(id: string, updateBookDto: any): Promise<any> {
    return this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true }) 
      .exec();
  }
}
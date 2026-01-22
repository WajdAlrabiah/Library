// books-backend/src/books/books.module.ts

/**
 * اسم الملف: books.module.ts
 * الوصف: ملف الوحدة (Module) الخاص بالكتب، ويعتبر حلقة الوصل التي تجمع 
 * المتحكم والخدمة ونموذج قاعدة البيانات معاً لتشكيل وحدة برمجية متكاملة.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    /** * تسجيل نموذج الكتاب (Book Schema) في وحدة Mongoose.
     * هذا يسمح لنا بحقن النموذج داخل BooksService للتعامل مع قاعدة البيانات.
     */
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  
  /** تعريف المتحكمات (Controllers) التي تتعامل مع طلبات الـ HTTP في هذه الوحدة */
  controllers: [BooksController],
  
  /** تعريف المزودات (Providers) التي تحتوي على المنطق البرمجي (الخدمات) */
  providers: [BooksService],
})
export class BooksModule {}
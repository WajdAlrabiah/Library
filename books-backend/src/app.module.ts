// books-backend/src/app.module.ts

/**
 * اسم الملف: app.module.ts
 * الوصف: الوحدة الجذرية (Root Module) لتطبيق NestJS.
 * تقوم بتكوين الروابط الأساسية للنظام مثل الاتصال بقاعدة البيانات (MongoDB)
 * وتحميل ملفات الإعدادات ودمج الوحدات الفرعية مثل BooksModule.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    /** * إعداد ConfigModule:
     * يسمح للتطبيق بقراءة ملفات الإعدادات (.env) في كافة أرجاء المشروع 
     * بفضل خيار { isGlobal: true }.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /** * الاتصال بقاعدة بيانات MongoDB:
     * يتم الاتصال عبر بروتوكول mongodb وبإستخدام اسم الحاوية 'mongodb' 
     * (كما هو محدد في ملف docker-compose) على المنفذ 27017.
     */
    MongooseModule.forRoot('mongodb://mongodb:27017/books-db'),

    /** * استيراد الوحدات الفرعية:
     * تسجيل BooksModule لتفعيل كافة المسارات (Routes) والخدمات الخاصة بالكتب.
     */
    BooksModule,
  ],
})
export class AppModule {}
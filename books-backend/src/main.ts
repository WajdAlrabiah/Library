// books-backend/src/main.ts

/**
 * اسم الملف: main.ts
 * الوصف: ملف التشغيل الرئيسي لتطبيق NestJS، يتم فيه إعداد خادم Express،
 * وتكوين السياسات الأمنية (CORS)، ومعالجة الملفات الثابتة، وأنابيب التحقق.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  /** * إنشاء نسخة التطبيق:
   * تم تحديد النوع <NestExpressApplication> للتمكن من الوصول لإعدادات 
   * خادم Express مثل التعامل مع الملفات الثابتة (Static Assets).
   */
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 
  
  /** * إعدادات مشاركة الموارد (CORS):
   * تسمح لتطبيق الأنجولار (الفرونت أند) بالاتصال بالباك أند وطلب البيانات
   * حتى لو كانا يعملان على منافذ مختلفة.
   */
  app.enableCors({
    origin: '*', // السماح بالوصول من كافة النطاقات (يمكن تخصيصه لاحقاً للأمان)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  /** * أنابيب التحقق العالمية (Global Validation Pipes):
   * تقوم بفحص البيانات القادمة في الطلبات (Requests) ومقارنتها بالـ DTOs.
   * whitelist: تحذف أي بيانات إضافية غير معرفة في الـ DTO.
   * transform: تحول البيانات إلى الأنواع المطلوبة تلقائياً.
   */
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  /** * إعداد الملفات الثابتة (Static Assets):
   * يجعل مجلد 'uploads' متاحاً للوصول عبر المتصفح، لكي تظهر صور أغلفة الكتب
   * من خلال الرابط (http://localhost:3000/uploads/filename).
   */
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  /** تشغيل الخادم على المنفذ 3000 */
  await app.listen(3000);
  console.log('🚀 Backend running on http://localhost:3000');
}

// البدء في تشغيل التطبيق
bootstrap();
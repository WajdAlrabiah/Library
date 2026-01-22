// books-backend/src/books/schemas/book.schema.ts

/**
 * اسم الملف: book.schema.ts
 * الوصف: تعريف مخطط قاعدة البيانات (Mongoose Schema) لكائن "الكتاب"، 
 * ويحدد الحقول وأنواع البيانات والقيود المفروضة عليها في MongoDB.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * تعريف النوع BookDocument:
 * يجمع بين كلاس Book وخصائص Document الخاصة بـ Mongoose،
 * مما يتيح استخدامه كنوع بيانات (Type) عند حقن النموذج في الـ Service.
 */
export type BookDocument = Book & Document;

/**
 * كلاس Book:
 * يمثل الهيكل الأساسي للبيانات. استخدام Decorator @Schema 
 * يخبر NestJS بأن هذا الكلاس سيمثل "Collection" في قاعدة البيانات.
 */
@Schema({ timestamps: true }) // أضفنا timestamps لتتبع تاريخ الإنشاء والتحديث تلقائياً
export class Book {
  
  /** اسم الكتاب: حقل نصي مطلوب */
  @Prop({ required: true })
  name: string;

  /** نوع الكتاب: حقل نصي مطلوب (عام/مخصص) */
  @Prop({ required: true })
  type: string;

  /** تصنيف الكتاب: حقل نصي مطلوب (تقني/ثقافي/إلخ) */
  @Prop({ required: true })
  category: string;

  /** وصف الكتاب: نص تفصيلي عن المحتوى */
  @Prop({ required: true })
  description: string;

  /** مسار الصورة: يخزن اسم الملف أو الرابط الخاص بغلاف الكتاب */
  @Prop({ required: true })
  image: string; 
}

/**
 * إنشاء الـ Schema الفعلي:
 * يقوم SchemaFactory بتحويل كلاس TypeScript أعلاه إلى مخطط Mongoose حقيقي 
 * ليتم استخدامه في AppModule لتعريف قاعدة البيانات.
 */
export const BookSchema = SchemaFactory.createForClass(Book);
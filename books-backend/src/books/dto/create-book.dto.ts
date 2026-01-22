// books-backend/src/books/dto/create-book.dto.ts

/**
 * اسم الملف: create-book.dto.ts
 * الوصف: تعريف هيكل البيانات (Data Transfer Object) الخاص بعملية إنشاء كتاب جديد، 
 * مع تفعيل التحقق من صحة البيانات (Validation) باستخدام مكتبة class-validator.
 */

import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateBookDto {
  
  /** * اسم الكتاب 
   * يجب ألا يكون فارغاً وأن يكون نصياً 
   */
  @IsNotEmpty({ message: 'اسم الكتاب مطلوب' })
  @IsString()
  name: string;

  /** * نوع الكتاب 
   * يحدد ما إذا كان الكتاب مخصصاً لفئة معينة أو عاماً، مع حصر الخيارات في (عام، مخصص)
   */
  @IsNotEmpty({ message: 'نوع الكتاب مطلوب' })
  @IsEnum(['عام', 'مخصص'], { message: 'نوع الكتاب يجب أن يكون عام أو مخصص' })
  type: string;

  /** * تصنيف الكتاب 
   * يضمن اختيار أحد المجالات المعتمدة في نظام المكتبة
   */
  @IsNotEmpty({ message: 'تصنيف الكتاب مطلوب' })
  @IsEnum(['ترفيهي', 'ثقافي', 'ديني', 'تقني', 'صحي', 'رياضي'], {
    message: 'يجب اختيار تصنيف صحيح للكتاب',
  })
  category: string;

  /** * وصف الكتاب 
   * نص تفصيلي يشرح محتوى الكتاب وفوائده
   */
  @IsNotEmpty({ message: 'وصف الكتاب مطلوب' })
  @IsString()
  description: string;
}
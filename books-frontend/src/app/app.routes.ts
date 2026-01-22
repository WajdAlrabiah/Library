// books-frontend/src/app/app.routes.ts

/**
 * اسم الملف: app.routes.ts
 * الوصف: ملف تعريف المسارات (Routes). يقوم بربط الروابط (URLs) بالمكونات المناسبة لها،
 * مما يتيح للمستخدم التنقل بين عرض الكتب، إضافتها، وتعديلها.
 */

import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';

export const routes: Routes = [
  /** * المسار الافتراضي: 
   * عند فتح التطبيق لأول مرة (رابط فارغ)، يتم تحويل المستخدم تلقائياً إلى صفحة الكتب.
   */
  { path: '', redirectTo: 'books', pathMatch: 'full' },

  /** صفحة عرض قائمة الكتب */
  { path: 'books', component: BookListComponent },

  /** صفحة إضافة كتاب جديد (تستخدم نفس مكون النموذج) */
  { path: 'add-book', component: BookFormComponent },

  /** * صفحة تعديل كتاب موجود: 
   * نستخدم الحقل الديناميكي ':id' لاستلام معرف الكتاب المراد تعديله من الرابط.
   */
  { path: 'edit-book/:id', component: BookFormComponent }
];
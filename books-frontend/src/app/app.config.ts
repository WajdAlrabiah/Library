// books-frontend/src/app/app.config.ts

/**
 * اسم الملف: app.config.ts
 * الوصف: ملف الإعدادات المركزي لتطبيق الأنجولار. يقوم بتعريف "المزودات" (Providers)
 * العالمية التي يحتاجها التطبيق للعمل، مثل نظام التنقل (Routing) ومكتبة طلبات HTTP.
 */

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    /** * تفعيل نظام التوجيه (Router):
     * يربط المسارات المعرفة في ملف app.routes بمكونات التطبيق، 
     * مما يسمح بالتنقل بين صفحة المكتبة وصفحة إضافة الكتب.
     */
    provideRouter(routes),

    /** * تفعيل عميل الـ HTTP:
     * يتيح للخدمات (Services) داخل التطبيق إرسال واستقبال البيانات 
     * من واجهة برمجة التطبيقات (API) الخاصة بالباك أند.
     */
    provideHttpClient()
  ]
};
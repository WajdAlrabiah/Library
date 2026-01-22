// books-frontend/src/main.ts

/**
 * اسم الملف: main.ts
 * الوصف: ملف التشغيل (Bootstrap) لتطبيق الأنجولار. يقوم ببدء تشغيل المكون 
 * الرئيسي (AppComponent) وتطبيق الإعدادات العالمية (appConfig) التي تشمل 
 * نظام التوجيه والاتصال بالخادم.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * دالة bootstrapApplication:
 * تقوم بتشغيل التطبيق بناءً على نمط Standalone Components.
 * 1. AppComponent: المكون الأساسي الذي سيبدأ به التطبيق.
 * 2. appConfig: الإعدادات والمزودات (Providers) مثل HttpClient و Router.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err: any) => {
    // رصد أي أخطاء قد تحدث أثناء عملية إقلاع التطبيق وعرضها في منصة المطور (Console)
    console.error('حدث خطأ أثناء تشغيل تطبيق الأنجولار:', err);
  });
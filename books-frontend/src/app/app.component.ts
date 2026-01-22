// books-frontend/src/app/app.component.ts

/**
 * اسم الملف: app.component.ts
 * الوصف: المكون الجذري (Root Component) للتطبيق. يعمل كحاوية رئيسية 
 * تضم شريط التنقل وتدير عملية تبديل الصفحات باستخدام الـ Router.
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root', // المعرف الذي يستخدمه المتصفح لعرض التطبيق
  standalone: true,     // استخدام نمط المكونات المستقلة (Standalone) لتقليل التعقيد
  imports: [
    RouterModule       // استيراد موديول التوجيه لتمكين استخدام <router-outlet> و routerLink
  ],
  templateUrl: './app.component.html', // ربط الواجهة الهيكلية
  styleUrls: ['./app.component.css']    // ربط ملف التنسيقات الخاص بالمكون
})
export class AppComponent {
  /**
   * في هذا المكون، نكتفي بالتعريف الأساسي لأن المنطق البرمجي 
   * موزع على المكونات الفرعية (Books, AddBook).
   */
}
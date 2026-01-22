// books-frontend/src/app/services/book.service.ts

/**
 * اسم الملف: book.service.ts
 * الوصف: الطبقة المسؤولة عن التواصل مع واجهة برمجة التطبيقات (API).
 * تقوم بإدارة عمليات الـ HTTP (GET, POST, PUT, DELETE) لتبادل بيانات الكتب مع الخادم.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root' // جعل الخدمة متاحة في كافة أرجاء التطبيق (Singleton)
})
export class BookService {
  // الرابط الخاص بـ API الكتب على السيرفر المحلي
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  /**
   * إنشاء كتاب جديد:
   * @param formData يحتوي على نصوص وبيان الملف (صورة الغلاف).
   * @returns Observable يحتوي على بيانات الكتاب الذي تم إنشاؤه.
   */
  createBook(formData: FormData): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, formData);
  }

  /**
   * جلب كافة الكتب:
   * @returns مصفوفة من الكتب (Book[]) المجلوبة من قاعدة البيانات.
   */
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  /**
   * جلب كتاب محدد:
   * @param id المعرف الفريد للكتاب.
   */
  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * تحديث بيانات كتاب:
   * @param id المعرف الفريد للكتاب المراد تعديله.
   * @param formData البيانات الجديدة (نصية أو ملفات).
   */
  updateBook(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * حذف كتاب:
   * @param id المعرف الفريد للكتاب المطلوب مسحه نهائياً.
   */
  deleteBook(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
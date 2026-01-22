// books-frontend/src/app/components/book-list/book-list.component.ts

/**
 * اسم الملف: book-list.component.ts
 * الوصف: المكون المسؤول عن عرض قائمة الكتب. يتضمن منطق جلب البيانات من 
 * السيرفر، تصفية الكتب بناءً على مدخلات البحث، وإدارة عمليات الحذف.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  
  // المصفوفة الأصلية للكتب المجلوبة من السيرفر
  books: Book[] = [];
  
  // المصفوفة التي يتم عرضها في الواجهة (تتأثر بعمليات البحث)
  filteredBooks: Book[] = []; 
  
  loading = true; // مؤشر حالة التحميل
  searchTerm: string = ''; // متغير لتخزين نص البحث المكتوب من قبل المستخدم
  
  // الرابط الأساسي لجلب صور الأغلفة من الباك أند
  baseUrl = 'http://localhost:3000/uploads/';

  constructor(private bookService: BookService) {}

  /**
   * دالة البداية (ngOnInit):
   * تُستدعى تلقائياً عند تحميل المكون لتبدأ بجلب البيانات.
   */
  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * جلب الكتب (loadBooks):
   * تتواصل مع الخدمة لطلب قائمة الكتب من قاعدة البيانات.
   */
  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = data; // في البداية، نعرض كافة الكتب المجلوبة
        this.loading = false;
      },
      error: (error) => {
        console.error('حدث خطأ أثناء تحميل الكتب:', error);
        this.loading = false;
      }
    });
  }

  /**
   * تصفية الكتب (filterBooks):
   * تعمل عند كل تغيير في حقل البحث لتقليل القائمة المعروضة بناءً على 
   * الاسم، أو التصنيف، أو الوصف.
   */
  filterBooks(): void {
    // تجهيز النص للبحث (إزالة المسافات وتحويله لأحرف صغيرة)
    const term = this.searchTerm.trim().toLowerCase(); 
    
    if (!term) {
      // إذا كان حقل البحث فارغاً، نعيد عرض كل الكتب
      this.filteredBooks = [...this.books];
      return;
    }
    
    // البحث في الحقول المختلفة للكتاب
    this.filteredBooks = this.books.filter(book => 
      book.name.toLowerCase().includes(term) || 
      book.category.toLowerCase().includes(term) ||
      book.description.toLowerCase().includes(term)
    );
  }

  /**
   * حذف كتاب (deleteBook):
   * @param id المعرف الفريد للكتاب المراد حذفه.
   * تقوم بطلب الحذف من السيرفر ثم تحديث الواجهة فوراً.
   */
  deleteBook(id: string): void {
    if (confirm('هل أنت متأكد من حذف هذا الكتاب نهائياً؟')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          // إزالة الكتاب من المصفوفة المحلية لتحديث الواجهة دون إعادة تحميل الصفحة
          this.books = this.books.filter(book => book._id !== id);
          this.filterBooks(); // إعادة تشغيل التصفية لضمان دقة القائمة المعروضة
        },
        error: (error) => {
          console.error('حدث خطأ أثناء الحذف:', error);
        }
      });
    }
  }
}
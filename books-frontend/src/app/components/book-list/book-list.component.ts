import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
  books: Book[] = [];
  filteredBooks: Book[] = []; 
  loading = true; 
  errorMessage: string = ''; // رسالة لتوضيح سبب المشكلة
  searchTerm: string = ''; 
  baseUrl = 'http://localhost:3000/uploads/';

  constructor(
    private bookService: BookService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.books = data || [];
          this.filteredBooks = [...this.books];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;
          this.errorMessage = 'تعذر الاتصال بخادم الكتب. تأكد من تشغيل الـ Backend.';
          console.error('API Error:', err);
          this.cdr.detectChanges();
        });
      }
    });
  }

  filterBooks(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredBooks = [...this.books];
    } else {
      this.filteredBooks = this.books.filter(book => 
        book.name?.toLowerCase().includes(term) || 
        book.category?.toLowerCase().includes(term)
      );
    }
    this.cdr.detectChanges();
  }

  deleteBook(id: string): void {
    if (confirm('هل أنت متأكد من الحذف؟')) {
      this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
    }
  }
}
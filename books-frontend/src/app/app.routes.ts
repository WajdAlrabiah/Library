import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';

export const routes: Routes = [
  // إذا فتح المستخدم الرابط الرئيسي، حوله للمكتبة مع التأكد من بقاء المسار "ممتلئ"
  { path: '', redirectTo: 'books', pathMatch: 'full' }, 
  { path: 'books', component: BookListComponent },
  { path: 'add-book', component: BookFormComponent },
  { path: 'edit-book/:id', component: BookFormComponent },
  { path: '**', redirectTo: 'books' }
];
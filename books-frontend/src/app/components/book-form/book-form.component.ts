import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  submitted = false;
  loading = false;
  successMessage = '';
  isEditMode = false;
  bookId: string | null = null;

  categories = ['ترفيهي', 'ثقافي', 'ديني', 'تقني', 'صحي', 'رياضي'];
  types = ['عام', 'مخصص'];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [''] 
    });
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEditMode = true;
      // في وضع التعديل، لا نحتاج لـ Validator على حقل الصورة
      this.bookForm.get('image')?.clearValidators();
      this.loadBookData();
    } else {
      // في وضع الإضافة فقط، الصورة إجبارية
      this.bookForm.get('image')?.setValidators([Validators.required]);
    }
    this.bookForm.get('image')?.updateValueAndValidity();
  }

  loadBookData(): void {
    if (!this.bookId) return;
    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          name: book.name,
          type: book.type,
          category: book.category,
          description: book.description
        });
        // عرض الصورة من السيرفر كمعاينة افتراضية
        this.imagePreview = `http://localhost:3000/uploads/${book.image}`;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      // تحديث قيمة الحقل ليتخطى الـ Validation إذا وجد
      this.bookForm.patchValue({ image: file });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';

    // المنطق الجديد للتحقق: 
    // إذا كان تعديل: يكفي أن يكون النموذج صالحاً (الصورة اختيارية)
    // إذا كان إضافة: يجب أن يكون النموذج صالحاً + تم اختيار ملف
    const isPhotoOk = this.isEditMode ? true : !!this.selectedFile;

    if (this.bookForm.invalid || !isPhotoOk) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.bookForm.value.name);
    formData.append('type', this.bookForm.value.type);
    formData.append('category', this.bookForm.value.category);
    formData.append('description', this.bookForm.value.description);
    
    // نرسل الصورة فقط إذا قام المستخدم باختيار ملف جديد
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEditMode && this.bookId 
      ? this.bookService.updateBook(this.bookId, formData) 
      : this.bookService.createBook(formData);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'تم تحديث البيانات بنجاح!' : 'تم حفظ الكتاب بنجاح!';
        this.loading = false;
        
        if (!this.isEditMode) {
            this.resetForm();
        } else {
            // توجيه للمكتبة بعد التعديل
            setTimeout(() => this.router.navigate(['/books']), 1500);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.bookForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.submitted = false;
  }

  get f() { return this.bookForm.controls; }
}
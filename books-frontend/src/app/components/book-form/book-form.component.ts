// books-frontend/src/app/components/book-form/book-form.component.ts

/**
 * اسم الملف: book-form.component.ts
 * الوصف: المكون المسؤول عن معالجة منطق نموذج الكتب. يدير التحقق من الحقول،
 * رفع الصور، التمييز بين وضعي "الإضافة" و "التعديل"، والاتصال بخدمة البيانات.
 */

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
  // تعريف متغيرات النموذج والحالة
  bookForm: FormGroup;
  selectedFile: File | null = null; // تخزين ملف الصورة المرفوع
  imagePreview: string | null = null; // تخزين رابط المعاينة للصورة
  submitted = false; // تتبع محاولة إرسال النموذج لتفعيل رسائل الخطأ
  loading = false; // تتبع حالة التحميل أثناء الاتصال بالسيرفر
  successMessage = ''; // رسالة النجاح للمستخدم
  
  // متغيرات وضع التعديل (Edit Mode)
  isEditMode = false;
  bookId: string | null = null;

  // القوائم الثابتة المستخدمة في خيارات النموذج
  categories = ['ترفيهي', 'ثقافي', 'ديني', 'تقني', 'صحي', 'رياضي'];
  types = ['عام', 'مخصص'];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    /** * بناء هيكل النموذج (Form Group):
     * تعريف الحقول وقواعد التحقق (Validators) مثل الطول الأدنى والوجوب.
     */
    this.bookForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [''] // الحقل اختياري هنا لأن التعديل لا يتطلب دائماً صورة جديدة
    });
  }

  /**
   * دالة البدء (ngOnInit):
   * تفحص الرابط (URL) لمعرفة ما إذا كان المستخدم يريد "إضافة" أم "تعديل".
   */
  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEditMode = true;
      this.loadBookData(); // جلب بيانات الكتاب الحالي إذا كان في وضع التعديل
    } else {
      // في وضع الإضافة، نجعل رفع الصورة شرطاً أساسياً للنجاح
      this.bookForm.get('image')?.setValidators(Validators.required);
    }
  }

  /** جلب بيانات الكتاب من السيرفر وتعبئتها في الحقول للتعديل */
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
        // عرض الصورة الحالية الموجودة في السيرفر للمستخدم
        this.imagePreview = `http://localhost:3000/uploads/${book.image}`;
      }
    });
  }

  /** معالجة اختيار ملف الصورة وتحويله إلى صيغة DataURL للمعاينة الفورية */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.bookForm.patchValue({ image: file });
    }
  }

  /** * معالجة إرسال النموذج (onSubmit):
   * تقوم بتجميع البيانات في FormData وإرسالها إما للإضافة أو التحديث.
   */
  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';

    // التحقق من صحة النموذج ومن وجود صورة في وضع الإضافة
    if (this.bookForm.invalid || (!this.isEditMode && !this.selectedFile)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.loading = true;
    // استخدام FormData لأننا نرسل "ملف" مع البيانات النصية
    const formData = new FormData();
    formData.append('name', this.bookForm.value.name);
    formData.append('type', this.bookForm.value.type);
    formData.append('category', this.bookForm.value.category);
    formData.append('description', this.bookForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // تحديد نوع الطلب بناءً على حالة المكون (تعديل أم إضافة)
    const request = this.isEditMode && this.bookId 
      ? this.bookService.updateBook(this.bookId, formData) 
      : this.bookService.createBook(formData);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'تم تحديث البيانات بنجاح!' : 'تم حفظ الكتاب بنجاح!';
        this.loading = false;
        
        if (!this.isEditMode) this.resetForm(); // تصفير الحقول بعد الإضافة الناجحة
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // إذا كان تعديلاً، يتم توجيه المستخدم للقائمة الرئيسية بعد ثانيتين
        if (this.isEditMode) {
          setTimeout(() => this.router.navigate(['/books']), 2000);
        }
      },
      error: (err) => {
        console.error('حدث خطأ أثناء حفظ البيانات:', err);
        this.loading = false;
      }
    });
  }

  /** تفريغ كافة الحقول وإعادة الحالة للصفر */
  resetForm(): void {
    this.bookForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.submitted = false;
  }

  /** اختصار (Getter) للوصول المباشر للحقول من ملف الـ HTML */
  get f() { return this.bookForm.controls; }
}
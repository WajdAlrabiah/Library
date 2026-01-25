import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // أضيفي RouterOutlet هنا

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet // تأكدي من إضافته هنا أيضاً
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // الكلاس يبقى كما هو
}
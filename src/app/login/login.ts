import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.email === 'admin@test.com' && this.password === '123456') {
      const user = {
        email: this.email,
        name: 'Admin User',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  constructor(private router: Router) { }

  onLogin(): void {
    // โหลดข้อมูลผู้ใช้ทั้งหมดจาก localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // หาผู้ใช้ที่มีอีเมลและรหัสผ่านตรงกัน
    const user = users.find(
      (u: any) =>
        u.email?.trim().toLowerCase() === this.email.trim().toLowerCase() &&
        u.password === this.password
    );

    if (user) {
      // ถ้าพบผู้ใช้
      alert(`ยินดีต้อนรับ ${user.fullName || user.email}!`);

      // บันทึกผู้ใช้ที่ล็อกอินไว้ใน localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));

      // ถ้าเลือกจำฉันไว้ ให้เก็บอีเมลไว้
      if (this.rememberMe) {
        localStorage.setItem('rememberEmail', user.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // ไปหน้า dashboard
      this.router.navigate(['/dashboard']);
    } else {
      alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  }

  ngOnInit(): void {
    // ถ้าเคยติ๊ก "จำฉันไว้" จะเติมอีเมลอัตโนมัติ
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  onForgotPassword(): void {
    alert('หน้านี้ยังไม่เปิดใช้งาน');
  }
}

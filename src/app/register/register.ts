import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type StoredUser = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;

  private USERS_KEY = 'users';

  constructor(private router: Router) {}

  private isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email.trim());
  }

  isFormValid(): boolean {
    return !!(
      this.fullName.trim() &&
      this.email.trim() &&
      this.phone.trim() &&
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword &&
      this.acceptTerms &&
      this.isValidEmail() 
    );
  }

  onRegister(): void {
    if (!this.isFormValid()) {
      alert('กรุณากรอกข้อมูลให้ครบและถูกต้อง');
      return;
    }

    const email = this.email.trim().toLowerCase();

    // อ่านข้อมูลเก่าจาก Local Storage
    const users: StoredUser[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');

    // เช็กอีเมลซ้ำ (ไม่สนตัวพิมพ์)
    const existed = users.some(u => (u.email || '').trim().toLowerCase() === email);
    if (existed) {
      alert('อีเมลนี้มีการสมัครแล้ว กรุณาใช้บัญชีอื่น');
      return;
    }

    // เพิ่มผู้ใช้ใหม่
    const newUser: StoredUser = {
      fullName: this.fullName.trim(),
      email,
      phone: this.phone.trim(),
      password: this.password
    };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
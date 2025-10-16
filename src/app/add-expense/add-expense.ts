import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Expense = {
  name: string;
  category: string;
  amount: number;   // บาท
  dateISO: string;  // yyyy-MM-dd (input[type=date])
  note?: string;
};

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css']
})
export class AddExpense {
  name = '';
  category = '';
  amount: any = '';     // เก็บเป็น string จาก input แล้วแปลงเป็น number ตอนบันทึก
  dateISO = '';
  note = '';

  // เก็บรายการในหน่วยความจำหน้า (array)
  expenses: Expense[] = [];

  // เพิ่มรายการลง array
  addExpense(): void {
    const amt = Number(this.amount);
    if (!this.name.trim() || !this.category.trim() || !this.dateISO || isNaN(amt) || amt <= 0) {
      alert('กรอกข้อมูลให้ครบและจำนวนเงินต้องมากกว่า 0 บาท');
      return;
    }

    const item: Expense = {
      name: this.name.trim(),
      category: this.category.trim(),
      amount: Math.round(amt * 100) / 100, // ปัดทศนิยม 2 ตำแหน่ง
      dateISO: this.dateISO,
      note: this.note?.trim() || ''
    };

    this.expenses.unshift(item); // ใส่หัวลิสต์ให้เห็นทันที

    // (ถ้าต้องการจำค่าไว้ครั้งหน้า เปิด 2 บรรทัดนี้)
    // const saved = JSON.parse(localStorage.getItem('expenses') || '[]');
    // localStorage.setItem('expenses', JSON.stringify([item, ...saved]));

    // ล้างฟอร์ม
    this.name = '';
    this.category = '';
    this.amount = '';
    this.dateISO = '';
    this.note = '';
  }

  removeAt(i: number): void {
    this.expenses.splice(i, 1);
  }

  get total(): number {
    return this.expenses.reduce((s, e) => s + e.amount, 0);
  }
}

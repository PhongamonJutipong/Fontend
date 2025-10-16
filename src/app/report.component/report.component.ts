import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Expense = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string; // yyyy-mm-dd
  note: string;
};

@Component({
  selector: 'app-report.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  private KEY = 'expenses';

  // raw data
  expenses = signal<Expense[]>([]);

  // filters
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  categoryFilter = signal<string>(''); // เว้นว่าง = ทุกประเภท
  keyword = signal<string>('');        // ค้นชื่อ/หมายเหตุ

  // load data
  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    try {
      const raw = localStorage.getItem(this.KEY) || '[]';
      const arr = JSON.parse(raw);
      this.expenses.set(Array.isArray(arr) ? arr : []);
    } catch {
      this.expenses.set([]);
    }
  }

  // filtered data
  filtered = computed(() => {
    const list = this.expenses();
    const from = this.dateFrom();
    const to = this.dateTo();
    const cat = this.categoryFilter().trim().toLowerCase();
    const kw = this.keyword().trim().toLowerCase();

    return list.filter(e => {
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      if (cat && e.category?.toLowerCase() !== cat) return false;
      if (kw) {
        const hay = `${e.name} ${e.note}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  });

  // top stats
  total = computed(() => this.filtered().reduce((s, e) => s + (Number(e.amount) || 0), 0));
  count = computed(() => this.filtered().length);
  avg = computed(() => this.count() ? this.total() / this.count() : 0);

  // unique categories (จากข้อมูลทั้งหมด เพื่อทำ dropdown)
  categories = computed(() => {
    const set = new Set(this.expenses().map(e => (e.category || '').trim()).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  // group by category (เฉพาะ filtered)
  byCategory = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.filtered()) {
      const key = (e.category || 'อื่นๆ').trim();
      map.set(key, (map.get(key) || 0) + (Number(e.amount) || 0));
    }
    // จัดเรียงมาก→น้อย
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  });

  // group by month (YYYY-MM) เฉพาะ filtered
  byMonth = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.filtered()) {
      const key = (e.date || '').slice(0, 7) || 'ไม่ทราบเดือน';
      map.set(key, (map.get(key) || 0) + (Number(e.amount) || 0));
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  });

  // สำหรับ bar chart (normalize 0..100)
  maxCategory = computed(() => {
    const arr = this.byCategory();
    return arr.length ? Math.max(...arr.map(([, sum]) => sum)) : 0;
  });
  barWidth(v: number): string {
    const max = this.maxCategory();
    if (!max) return '0%';
    return `${Math.round((v / max) * 100)}%`;
  }

  // CSV Export (เฉพาะ filtered)
  exportCSV(): void {
    const rows = [
      ['Date', 'Name', 'Category', 'Amount', 'Note'],
      ...this.filtered().map(e => [
        e.date, e.name, e.category, String(e.amount), (e.note || '').replace(/\n/g, ' ')
      ])
    ];
    const csv = rows.map(r =>
      r.map(field => {
        const needsQuote = /[",\n]/.test(field);
        const escaped = field.replace(/"/g, '""');
        return needsQuote ? `"${escaped}"` : escaped;
      }).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  clearFilters(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.categoryFilter.set('');
    this.keyword.set('');
  }
}

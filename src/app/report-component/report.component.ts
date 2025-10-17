import { Component, computed, signal, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartType, ChartData ,registerables } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

Chart.register(...registerables);  

type Expense = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  note: string;
};

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule,NgChartsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  private KEY = 'expenses';

  expenses = signal<Expense[]>([]);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  categoryFilter = signal<string>('');
  keyword = signal<string>('');

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

  total = computed(() => this.filtered().reduce((s, e) => s + (Number(e.amount) || 0), 0));
  count = computed(() => this.filtered().length);
  avg = computed(() => (this.count() ? this.total() / this.count() : 0));

  categories = computed(() => {
    const set = new Set(this.expenses().map(e => (e.category || '').trim()).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  byCategory = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.filtered()) {
      const key = (e.category || 'อื่นๆ').trim();
      map.set(key, (map.get(key) || 0) + (Number(e.amount) || 0));
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  });

  byMonth = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.filtered()) {
      const key = (e.date || '').slice(0, 7) || 'ไม่ทราบเดือน';
      map.set(key, (map.get(key) || 0) + (Number(e.amount) || 0));
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  });

  // ---------- กราฟ ----------
  pieChartType: ChartType = 'pie';
  lineChartType: ChartType = 'line';

  pieChartData = computed<ChartData<'pie'>>(() => {
    const data = this.byCategory();
    return {
      labels: data.map(([category]) => category),
      datasets: [
        {
          data: data.map(([, sum]) => sum),
          backgroundColor: this.getChartColors(data.length)
        }
      ]
    };
  });

  lineChartData = computed<ChartData<'line'>>(() => {
    const data = this.byMonth();
    return {
      labels: data.map(([month]) => month),
      datasets: [
        {
          data: data.map(([, sum]) => sum),
          label: 'ยอดรวมรายเดือน (บาท)',
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.3)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  });

  getChartColors(count: number): string[] {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#E7E9ED', '#4CAF50', '#FFC107', '#2196F3'
    ];
    return Array(count).fill(null).map((_, i) => colors[i % colors.length]);
  }

  maxCategory = computed(() => {
    const arr = this.byCategory();
    return arr.length ? Math.max(...arr.map(([, sum]) => sum)) : 0;
  });
  barWidth(v: number): string {
    const max = this.maxCategory();
    if (!max) return '0%';
    return `${Math.round((v / max) * 100)}%`;
  }

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

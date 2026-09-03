'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';

export default function CategoriaBarChart({ data }) {
  // data: [{ name: 'Categoría', value: N }, ...] ya ordenado de mayor a menor
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '30px 0' }}>
        Aún no hay categorías registradas.
      </div>
    );
  }

  const rowHeight = 34;
  const height = Math.max(data.length * rowHeight, 120);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 34, left: 4, bottom: 4 }}
          barCategoryGap={10}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={170}
            tick={{ fontSize: 12, fill: 'var(--text-soft)', fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'var(--brand-soft)' }}
            formatter={(value) => [`${value} libros`, '']}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={18}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={i === 0 ? '#2953a6' : '#7fa1d6'} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fontSize: 12, fontWeight: 700, fill: 'var(--text)' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

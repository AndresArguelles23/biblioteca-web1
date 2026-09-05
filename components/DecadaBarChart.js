'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DecadaBarChart({ data }) {
  // data: [{ name: '1990', value: N }, ...] ya ordenado cronológicamente
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '30px 0' }}>
        No hay suficientes años detectados para mostrar esta gráfica.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minWidth: 0, height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--text-soft)', fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'var(--brand-soft)' }}
            formatter={(value) => [`${value} libros`, '']}
            labelFormatter={(label) => `Década de ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
            }}
          />
          <Bar dataKey="value" fill="#2953a6" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

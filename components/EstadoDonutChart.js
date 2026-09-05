'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { Bueno: '#0d9165', Regular: '#b7791f', Malo: '#c0362c' };

export default function EstadoDonutChart({ data }) {
  // data: [{ name: 'Bueno', value: N }, ...]
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '30px 0' }}>
        Aún no hay estados registrados.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minWidth: 0, height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#98a2b3'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} libros`, name]}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={28}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

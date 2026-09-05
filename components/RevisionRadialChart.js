'use client';

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function RevisionRadialChart({ porcentaje, pendientes }) {
  const data = [{ name: 'Revisado', value: porcentaje, fill: '#2953a6' }];

  return (
    <div style={{ width: '100%', minWidth: 0, height: 220, position: 'relative' }}>
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={18}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--bg)' }}
            dataKey="value"
            cornerRadius={10}
            angleAxisId={0}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)' }}>
          {porcentaje}%
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)' }}>
          {pendientes.toLocaleString('es-CO')} pendientes
        </div>
      </div>
    </div>
  );
}

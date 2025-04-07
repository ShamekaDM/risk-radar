import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const severityLabels = ['Low', 'Medium', 'High'];

const formatSeverity = (value) => severityLabels[value] || `Level ${value}`;

const ClusterChart = ({ data }) => {
  const clusterIds = [...new Set(data.map((d) => d.cluster))].sort((a, b) => a - b);
  const clusterMap = clusterIds.reduce((acc, id) => {
    acc[id] = `Cluster ${id}`;
    return acc;
  }, {});

  const formatCluster = (value) => clusterMap[value] || `Cluster ${value}`;

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
      <ResponsiveContainer height={500}>
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="severity"
            name="Severity"
            tickFormatter={formatSeverity}
            domain={[0, 2]}
            label={{ value: 'Severity', position: 'bottom', offset: 10 }}
          />
          <YAxis
            type="number"
            dataKey="cluster"
            name="Cluster"
            tickFormatter={formatCluster}
            allowDecimals={false}
            label={{
              value: 'Cluster',
              angle: -90,
              position: 'left',
              offset: 0,
            }}
          />
         <Tooltip
  cursor={{ strokeDasharray: '3 3' }}
  content={({ active, payload }) => {
    if (active && payload?.length) {
      const point = payload[0].payload;
      const { severity, cluster } = point;

      // Count all points that share the same severity and cluster
      const overlapping = data.filter(
        (d) => d.severity === severity && d.cluster === cluster
      );

      return (
        <div style={{ background: '#fff', padding: '10px', border: '1px solid #ccc', fontSize: '14px' }}>
          <strong>{point.title}</strong>
          <div>Severity: {formatSeverity(severity)}</div>
          <div>Cluster: {formatCluster(cluster)}</div>
          <div>Type: {point.type}</div>
          <div>Location: {point.location}</div>
          <hr />
          <div><strong>Overlapping Threats:</strong> {overlapping.length}</div>
        </div>
      );
    }
    return null;
  }}
/>
          {clusterIds.map((clusterId, idx) => (
            <Scatter
              key={idx}
              name={`Cluster ${clusterId}`}
              data={data.filter((d) => d.cluster === clusterId)}
              fill={`hsl(${clusterId * 80}, 70%, 50%)`}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClusterChart;
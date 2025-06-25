import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import { Bar, Line, Scatter, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ThreeDChart from '../../components/ThreeDChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analysis = () => {
  const { id } = useParams();
  const chartRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [zKey, setZKey] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axios.get('/user/history');
        const a = res.data.analyses.find((a) => a._id === id);
        setAnalysis(a);
      } catch {
        alert('Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  useEffect(() => {
    const isNumeric = (col) =>
      analysis?.parsedData?.every((row) => !isNaN(parseFloat(row[col])));
    if (xKey && yKey && zKey && isNumeric(xKey) && isNumeric(yKey) && isNumeric(zKey)) {
      setChartType('3d');
    }
  }, [xKey, yKey, zKey, analysis]);

  const downloadChart = async (format) => {
    try {
      const chart = chartRef.current;
      if (!chart) {
        alert('Chart instance not available');
        return;
      }

      const canvas = chart.canvas;

      if (!canvas || typeof canvas.toDataURL !== 'function') {
        alert('Chart canvas not found or invalid.');
        return;
      }

      const base64Image = canvas.toDataURL('image/png');

      const response = await axios.post(
        `/export/${format}`,
        {
          base64Image,
          fileName: `chart-${xKey}-vs-${yKey}`,
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'image/png',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chart-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Check console for details.');
    }
  };

  const renderChart = () => {
    if (!xKey || !yKey || !analysis?.parsedData) {
      return <p className="text-[#A9D08E] text-center">Select X and Y axes to view chart</p>;
    }

    const labels = analysis.parsedData.map((row) => row[xKey]);
    const values = analysis.parsedData.map((row) => parseFloat(row[yKey]));

    const chartData = {
      labels,
      datasets: [
        {
          label: `${yKey}`,
          data: values,
          backgroundColor: labels.map((_, i) => `hsl(${(i * 360) / labels.length + 100}, 70%, 60%)`),
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#A9D08E' } },
      },
      scales: {
        x: { ticks: { color: '#A9D08E' } },
        y: { ticks: { color: '#A9D08E' } },
      },
    };

    const props = { ref: chartRef, data: chartData, options };

    if (chartType === '3d') {
      return (
        <ThreeDChart
          data={analysis.parsedData}
          xKey={xKey}
          yKey={yKey}
          zKey={zKey}
        />
      );
    }

    switch (chartType) {
      case 'bar':
        return <Bar {...props} />;
      case 'line':
        return <Line {...props} />;
      case 'scatter':
        return <Scatter {...props} />;
      case 'pie':
        return <Pie {...props} />;
      default:
        return <Bar {...props} />;
    }
  };

  if (loading) return <div className="text-center text-white pt-24">Loading...</div>;
  if (!analysis) return <div className="text-center text-red-500 pt-24">Analysis not found</div>;

  const columns = Object.keys(analysis.parsedData[0] || {});

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-tr from-[#102a1f] via-[#0b1f16] to-[#163c2a] text-white p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-4 bg-[#1b3c2c]/60 backdrop-blur-md p-6 rounded-lg border border-[#a9d08e40] shadow-lg">
          <h2 className="text-xl font-bold text-[#A9D08E] mb-4">Chart Settings</h2>

          <div>
            <label className="block mb-1 text-[#A9D08E]">X-Axis</label>
            <select
              value={xKey}
              onChange={(e) => setXKey(e.target.value)}
              className="w-full bg-[#143424] border border-[#A9D08E]/30 text-white rounded px-4 py-2"
            >
              <option value="">Select X</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-[#A9D08E]">Y-Axis</label>
            <select
              value={yKey}
              onChange={(e) => setYKey(e.target.value)}
              className="w-full bg-[#143424] border border-[#A9D08E]/30 text-white rounded px-4 py-2"
            >
              <option value="">Select Y</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-[#A9D08E]">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full bg-[#143424] border border-[#A9D08E]/30 text-white rounded px-4 py-2"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="scatter">Scatter</option>
              <option value="pie">Pie</option>
              <option value="3d">3D Chart</option>
            </select>
          </div>

          {chartType === '3d' && (
            <div>
              <label className="block mb-1 text-[#A9D08E]">Z-Axis</label>
              <select
                value={zKey}
                onChange={(e) => setZKey(e.target.value)}
                className="w-full bg-[#143424] border border-[#A9D08E]/30 text-white rounded px-4 py-2"
              >
                <option value="">Select Z</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          {xKey && yKey && chartType !== '3d' && (
            <div className="space-y-2">
              <button onClick={() => downloadChart('png')} className="bg-[#3A8C57] w-full py-2 rounded">
                Download PNG
              </button>
              <button onClick={() => downloadChart('pdf')} className="bg-[#4CAF50] w-full py-2 rounded">
                Download PDF
              </button>
            </div>
          )}
        </div>

        {/* Chart + Summary */}
        <div className="lg:col-span-3 bg-[#1e4231]/60 p-6 rounded-lg border border-[#a9d08e40] shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">{analysis.file.originalname}</h2>
          <div className="min-h-[400px] h-[60vh] relative">{renderChart()}</div>

          <div className="mt-8 bg-[#2D7D4A]/30 p-4 rounded border border-[#A9D08E]/30">
            <h3 className="text-lg font-semibold text-[#A9D08E] mb-2">AI Summary</h3>
            <p>{analysis.summary || 'No summary available yet.'}</p>
            {!analysis.summary && (
              <button
                onClick={async () => {
                  try {
                    await axios.post(`/ai/summary/${analysis._id}`);
                    alert('AI summary generated');
                    window.location.reload();
                  } catch {
                    alert('AI generation failed');
                  }
                }}
                className="mt-4 bg-[#3A8C57] hover:bg-[#4CAF50] text-white px-4 py-2 rounded"
              >
                Generate AI Summary
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;

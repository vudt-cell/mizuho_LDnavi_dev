const Utils = {
  CHART_COLORS: {
    blue: '#285AE1',
    green: '#329664',
    white: '#FFFFFF',
  },
  withAlpha(hex, alpha) {
    return hexToRgba(hex, alpha);
  },
  fontFamily: 'Roboto',
  fontSize: 12,
  fontWeight: '400'
};

const DATA_COUNT = 100;
const labels = [];
for (let i = 30; i <= DATA_COUNT; i += 10) {
  if (i == DATA_COUNT) {
    labels.push(i.toString() + "歳");
  }
  else {
    labels.push(i.toString());
  };
}

const greenDataPoints = [0, 1500, 2200, 2400, 2100, 1500, 980, 680];
const blueDataPoints = [0, 500, 650, 1100, 500, 0, -500, -680];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Green line',
      data: greenDataPoints,
      borderColor: Utils.CHART_COLORS.green,
      fill: true,
      backgroundColor: Utils.withAlpha(Utils.CHART_COLORS.green, 0.1),
    },
    {
      label: 'Blue line',
      data: blueDataPoints,
      borderColor: Utils.CHART_COLORS.blue,
      fill: true,
      backgroundColor: Utils.withAlpha(Utils.CHART_COLORS.blue, 0.1),
    },
  ]
};

const ctx = document.getElementById('assetChart').getContext('2d');

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 1,
    plugins: {
      title: {
        display: true,
        text: '(万円)',
        align: 'start',
        font: {
          size: Utils.fontSize,
          weight: Utils.fontWeight
        },
      },
      legend: {
        display: false
      },
    },
    interaction: {
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.7
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          drawTicks: false,
          lineWidth: 2,
        },
        border: {
          display: false,
          dash: [3, 3]
        },
        ticks: {
          //padding: 6,
          font: {
            size: Utils.fontSize,
            weight: Utils.fontWeight

          },
        }
      },
      y: {
        display: true,
        min: -3000,
        max: 3000,
        ticks: {
          //padding: 6,
          font: {
            family: Utils.fontFamily,
            size: Utils.fontSize,
            weight: Utils.fontWeight
          },
          stepSize: 500,
          callback(value) {
            if (value % 1000 === 0) {
              return value.toLocaleString();
            }
            return "";
          }
        },
        grid: {
          drawTicks: false,
          lineWidth: 2,
        },
        border: {
          display: false,
          dash: [3, 3]
        }
      }
    },
  },
  plugins: [{
    afterDatasetsDraw: chart => {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        const lastPoint = meta.data[meta.data.length - 1];
        const x = lastPoint.x;
        const y = lastPoint.y;

        if (datasetIndex === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = Utils.CHART_COLORS.white;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = dataset.borderColor;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = dataset.borderColor;
          ctx.fill();
        } else if (datasetIndex === 1) {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = Utils.CHART_COLORS.white;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = dataset.borderColor;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = dataset.borderColor;
          ctx.fill();
        }
      });
    }
  }]
};

const chartInstance = new Chart(ctx, config);

function alpha(color, a) {
  return color.replace('rgb', 'rgba').replace(')', `, ${a})`);
}

function hexToRgba(hex, alpha = 1) {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map(ch => ch + ch).join('');
  } else if (h.length === 4) {
    h = h.split('').map(ch => ch + ch).join('');
  }

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  let a = alpha;
  if (h.length === 8) {
    const hexA = parseInt(h.slice(6, 8), 16) / 255;
    a = typeof alpha === 'number' ? alpha : hexA;
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function startCount() {
  let i = 1;
  const counter = document.getElementById("counter");

  const timer = setInterval(() => {
    counter.textContent = i.toLocaleString();
    if (i >= 1200) {
      clearInterval(timer);
    }
    i++;
  }, 0);
}

window.calculateAsset = function () {
  const age = document.getElementById("age").value;
  const rate = parseFloat(document.getElementById("rate").value);

  let green, blue;
  if (rate === 0) {
    green = [0, 100, 400, 900, 1200, 1000, 500, 200];
    blue = [0, -200, -300, -100, 0, 200, 300, 400];
  } else if (rate === 2) {
    green = [0, 2000, 2500, 2000, 1500, 1000, 800, 500];
    blue = [0, 300, 600, 800, 600, 200, -100, -300];
  } else {
    green = greenDataPoints;
    blue = blueDataPoints;
  }

  chartInstance.data.datasets[0].data = green;
  chartInstance.data.datasets[1].data = blue;

  chartInstance.update();
  startCount();

  document.getElementById("label-age").textContent = age;
}

const assetModalElement = document.getElementById('assetModal');
assetModalElement.addEventListener('hide.bs.modal', () => {
  if (assetModalElement.contains(document.activeElement)) {
    document.activeElement.blur();
  }
});
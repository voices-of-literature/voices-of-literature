(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.citation-bar[data-pct]').forEach((b) => {
          b.style.width = b.dataset.pct + '%';
        });
        e.target.querySelectorAll('.theme-bar-fill[data-pct]').forEach((b) => {
          b.style.width = b.dataset.pct + '%';
        });
        e.target.querySelectorAll('.theme-evo-bar').forEach((b) => {
          setTimeout(() => b.classList.add('anim'), 300);
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .timeline-entry, .theme-evo-row').forEach((el) => observer.observe(el));

  document.querySelectorAll('.theme-evo-row').forEach((row, i) => {
    row.style.transitionDelay = `${i * 0.13}s`;
  });

  document.querySelectorAll('#tab-nlvh .theme-bar-fill').forEach((b) => {
    setTimeout(() => {
      b.style.width = b.dataset.pct + '%';
    }, 700);
  });

  function switchTab(tab) {
    document.querySelectorAll('.theme-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('.theme-content').forEach((c) => c.classList.remove('active'));
    const content = document.getElementById('tab-' + tab);
    if (!content) return;
    content.classList.add('active');
    setTimeout(() => {
      content.querySelectorAll('.theme-bar-fill[data-pct]').forEach((b) => {
        b.style.width = '0%';
        setTimeout(() => {
          b.style.width = b.dataset.pct + '%';
        }, 50);
      });
    }, 50);
  }

  document.querySelectorAll('.theme-tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Source PDF viewer
  const sourceFrame = document.getElementById('sourcePdfFrame');
  const sourcePdfTitle = document.getElementById('sourcePdfTitle');
  const sourceTitles = {
    'assets/source1_text_based.pdf': 'Source 1 — Text-Based',
    'assets/source2_text_based.pdf': 'Source 2 — Text-Based',
    'assets/source3_image_based.pdf': 'Source 3 — Image-Based',
  };
  document.querySelectorAll('.source-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.source-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const src = tab.dataset.src;
      if (sourceFrame) sourceFrame.src = src;
      if (sourcePdfTitle) sourcePdfTitle.textContent = sourceTitles[src] || src;
    });
  });

  const chartDefaults = {
    layout: {
      padding: { top: 24 } // Extra space above bars for medals
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1713',
        titleFont: { family: 'Playfair Display', size: 13 },
        bodyFont: { family: 'Crimson Pro', size: 13 },
        padding: 12,
        cornerRadius: 0,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Spectral SC', size: 11 }, color: '#7a6a58' },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { family: 'Crimson Pro', size: 12 }, color: '#7a6a58' },
        beginAtZero: true,
      },
    },
  };

  const medalPlugin = {
    id: 'medalPlugin',
    afterDatasetsDraw(chart, args, options) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const medals = ['🥇', '🥈', '🥉'];
      
      ctx.save();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      
      meta.data.forEach((bar, index) => {
        const medal = medals[index];
        if (medal) {
          ctx.fillText(medal, bar.x, bar.y - 6);
        }
      });
      ctx.restore();
    }
  };

  if (typeof Chart !== 'undefined') {
    new Chart(document.getElementById('chartNLVH'), {
      type: 'bar',
      data: {
        labels: ['First Prize', 'Second Prize', 'Third Prize'],
        datasets: [{
          data: [2877, 2524, 2908],
          backgroundColor: ['#c9922a', '#a5a5a5', '#b0704d'],
          borderRadius: 0,
          borderSkipped: false,
        }],
      },
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} words`,
            },
          },
        },
      },
      plugins: [medalPlugin]
    });

    new Chart(document.getElementById('chartNLXH'), {
      type: 'bar',
      data: {
        labels: ['First Prize', 'Second Prize', 'Third Prize'],
        datasets: [{
          data: [1511, 1525, 2850],
          backgroundColor: ['#c9922a', '#a5a5a5', '#b0704d'],
          borderRadius: 0,
          borderSkipped: false,
        }],
      },
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} words`,
            },
          },
        },
      },
      plugins: [medalPlugin]
    });
  }
})();

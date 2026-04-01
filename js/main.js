document.addEventListener('DOMContentLoaded', function () {
  function showModal(title, message, actions) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = '<h3>' + title + '</h3><p>' + message + '</p>';
    const act = document.createElement('div');
    act.className = 'actions';
    (actions || []).forEach(a => {
      const el = document.createElement('a');
      el.href = a.href || '#';
      el.textContent = a.label;
      el.className = a.class || '';
      if (a.onClick) el.addEventListener('click', a.onClick);
      act.appendChild(el);
    });
    const close = document.createElement('a');
    close.href = '#';
    close.textContent = 'Close';
    close.addEventListener('click', function (e) { e.preventDefault(); overlay.remove(); });
    act.appendChild(close);
    modal.appendChild(act);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function handleActivity(key) {
    switch (key) {
      case 'cpu':
        showModal('Open CPU Emulator', 'Opening the CPU emulator workspace. You will be taken to Missions.', [{ label: 'Go', href: '/site/missions.html#cpu', class: 'btn-primary' }]);
        break;
      case 'punch':
        showModal('Punch-card Simulator', 'Open the punch-card simulator example in Missions.', [{ label: 'Go', href: '/site/missions.html#punch', class: 'btn-primary' }]);
        break;
      case 'circuit':
        showModal('Circuit Visualizer', 'Open the Circuit Visualizer sandbox in Missions.', [{ label: 'Go', href: '/site/missions.html#circuit', class: 'btn-primary' }]);
        break;
      case 'explore':
        showModal('Explore Demos', 'Jump to the active workspace where modules run.', [{ label: 'Go', href: '/site/missions.html', class: 'btn-primary' }]);
        break;
      default:
        showModal('Coming soon', 'This activity will be available in the interactive prototype soon.');
    }
  }

  document.querySelectorAll('[data-activity]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const key = el.getAttribute('data-activity');
      handleActivity(key);
    });
  });
  // --- MODULE MOCK INTERACTIONS ---

  // CPU stepper mock
  function cpuReset(state) {
    state.pc = 0;
    state.registers = { R0: 0, R1: 0, R2: 0 };
    state.memory = [3, 5, 0, 0];
    state.running = false;
    updateCpuUI(state);
  }

  function updateCpuUI(state) {
    const regs = document.querySelectorAll('.cpu-reg');
    regs.forEach(el => {
      const r = el.dataset.reg;
      el.textContent = state.registers[r];
    });
    const mem = document.querySelector('.cpu-memory');
    if (mem) mem.textContent = JSON.stringify(state.memory);
    const pc = document.querySelector('.cpu-pc');
    if (pc) pc.textContent = state.pc;
  }

  function cpuStep(state, program) {
    if (state.pc >= program.length) return;
    const line = program[state.pc].trim();
    const parts = line.replace(/,/g,'').split(/\s+/);
    const op = parts[0];
    if (op === 'LOAD') {
      const reg = parts[1].replace(/,/g,'');
      const addr = parts[2].replace(/\[|\]/g,'');
      state.registers[reg] = Number(state.memory[Number(addr)] || 0);
    } else if (op === 'ADD') {
      const r1 = parts[1].replace(/,/g,'');
      const r2 = parts[2].replace(/,/g,'');
      state.registers[r1] = Number(state.registers[r1] || 0) + Number(state.registers[r2] || 0);
    } else if (op === 'STORE') {
      const reg = parts[1].replace(/,/g,'');
      const addr = parts[2].replace(/\[|\]/g,'');
      state.memory[Number(addr)] = Number(state.registers[reg] || 0);
    }
    state.pc += 1;
    updateCpuUI(state);
  }

  // Punch-card mock: echo and basic transform
  function runPunch(text) {
    // simulate reading cards: uppercase and replace spaces with ·
    const out = text.split('\n').map(line => line.toUpperCase().replace(/ /g,'·')).join('\n');
    return out;
  }

  // Circuit mock: simple flip-flop-like state
  const circuitState = { q: false };
  function updateCircuitUI() {
    const led = document.querySelector('.circuit-led');
    if (!led) return;
    led.style.background = circuitState.q ? 'var(--accent-3)' : '#ddd';
    led.textContent = circuitState.q ? '1' : '0';
  }

  // Wire up missions page controls (if present)
  const cpuState = { pc:0, registers:{}, memory:[], running:false };
  const cpuSection = document.getElementById('cpu');
  if (cpuSection) {
    cpuReset(cpuState);
    const programEl = cpuSection.querySelector('.cpu-program');
    const stepBtn = cpuSection.querySelector('.cpu-step');
    const runBtn = cpuSection.querySelector('.cpu-run');
    const resetBtn = cpuSection.querySelector('.cpu-reset');
    stepBtn && stepBtn.addEventListener('click', function () {
      const program = programEl.textContent.trim().split('\n').map(l=>l.trim()).filter(Boolean);
      cpuStep(cpuState, program);
    });
    resetBtn && resetBtn.addEventListener('click', function () { cpuReset(cpuState); });
    runBtn && runBtn.addEventListener('click', function () {
      const program = programEl.textContent.trim().split('\n').map(l=>l.trim()).filter(Boolean);
      // run to completion with small delay
      cpuState.running = true;
      function loop() {
        if (!cpuState.running || cpuState.pc >= program.length) { cpuState.running = false; return; }
        cpuStep(cpuState, program);
        setTimeout(loop, 450);
      }
      loop();
    });
  }

  const punchSection = document.getElementById('punch');
  if (punchSection) {
    const input = punchSection.querySelector('.punch-input');
    const out = punchSection.querySelector('.punch-output');
    const run = punchSection.querySelector('.punch-run');
    run && run.addEventListener('click', function () {
      out.textContent = runPunch(input.value || '');
    });
  }

  const circuitSection = document.getElementById('circuit');
  if (circuitSection) {
    const setBtn = circuitSection.querySelector('.circuit-set');
    const resetBtn = circuitSection.querySelector('.circuit-reset');
    const toggleBtn = circuitSection.querySelector('.circuit-toggle');
    setBtn && setBtn.addEventListener('click', function () { circuitState.q = true; updateCircuitUI(); });
    resetBtn && resetBtn.addEventListener('click', function () { circuitState.q = false; updateCircuitUI(); });
    toggleBtn && toggleBtn.addEventListener('click', function () { circuitState.q = !circuitState.q; updateCircuitUI(); });
    updateCircuitUI();
  }

});

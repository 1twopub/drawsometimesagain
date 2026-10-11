(function () {
  'use strict';

  var SPEED = 420;      // canvas pixels per second at full joystick tilt
  var LINE_WIDTH = 4;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var cursor = document.getElementById('cursor');
  var joystick = document.getElementById('joystick');
  var knob = document.getElementById('knob');
  var penBtn = document.getElementById('penBtn');
  var clearBtn = document.getElementById('clearBtn');
  var saveBtn = document.getElementById('saveBtn');
  var galleryBtn = document.getElementById('galleryBtn');

  var gallery = document.getElementById('gallery');
  var galleryTitle = document.getElementById('galleryTitle');
  var grid = document.getElementById('grid');
  var emptyMsg = document.getElementById('emptyMsg');
  var viewer = document.getElementById('viewer');
  var backBtn = document.getElementById('backBtn');
  var closeBtn = document.getElementById('closeBtn');
  var downloadLink = document.getElementById('downloadLink');

  var W = canvas.width;
  var H = canvas.height;

  var pos = { x: W / 2, y: H / 2 };   // pointer position in canvas pixels
  var stick = { x: 0, y: 0 };         // joystick tilt, each axis -1..1
  var keys = {};                      // arrow keys currently held
  var penDown = true;
  var drawings = [];                  // PNG data URLs, kept in memory only

  // ---------- Whiteboard ----------

  function clearBoard() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);
  }

  function updateCursor() {
    cursor.style.left = (pos.x / W * 100) + '%';
    cursor.style.top = (pos.y / H * 100) + '%';
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  ctx.strokeStyle = '#000';
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  clearBoard();
  updateCursor();

  // ---------- Joystick ----------

  var stickActive = false;

  function moveStick(e) {
    var rect = joystick.getBoundingClientRect();
    var max = (rect.width - knob.offsetWidth) / 2;
    var dx = e.clientX - (rect.left + rect.width / 2);
    var dy = e.clientY - (rect.top + rect.height / 2);
    var dist = Math.hypot(dx, dy);
    if (dist > max) {
      dx *= max / dist;
      dy *= max / dist;
    }
    knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    stick.x = dx / max;
    stick.y = dy / max;
  }

  function releaseStick() {
    stickActive = false;
    stick.x = 0;
    stick.y = 0;
    knob.style.transform = '';
  }

  joystick.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    stickActive = true;
    joystick.setPointerCapture(e.pointerId);
    moveStick(e);
  });
  joystick.addEventListener('pointermove', function (e) {
    if (stickActive) moveStick(e);
  });
  joystick.addEventListener('pointerup', releaseStick);
  joystick.addEventListener('pointercancel', releaseStick);

  // ---------- Keyboard (arrow keys, optional) ----------

  var ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !gallery.hidden) closeGallery();
    if (ARROWS.indexOf(e.key) !== -1 && gallery.hidden) {
      keys[e.key] = true;
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', function (e) {
    delete keys[e.key];
  });
  window.addEventListener('blur', function () {
    keys = {};
  });

  // ---------- Main loop ----------

  var last = performance.now();

  function tick(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    var vx = stick.x;
    var vy = stick.y;

    var kx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
    var ky = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
    if (kx || ky) {
      var len = Math.hypot(kx, ky);
      vx = kx / len;
      vy = ky / len;
    }

    if ((vx || vy) && gallery.hidden) {
      var nx = clamp(pos.x + vx * SPEED * dt, 0, W);
      var ny = clamp(pos.y + vy * SPEED * dt, 0, H);
      if (penDown) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }
      pos.x = nx;
      pos.y = ny;
      updateCursor();
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---------- Buttons ----------

  penBtn.addEventListener('click', function () {
    penDown = !penDown;
    penBtn.textContent = penDown ? 'Pen: down' : 'Pen: up';
    cursor.classList.toggle('up', !penDown);
  });

  clearBtn.addEventListener('click', clearBoard);

  saveBtn.addEventListener('click', function () {
    drawings.push(canvas.toDataURL('image/png'));
    galleryBtn.textContent = 'Gallery (' + drawings.length + ')';
    saveBtn.textContent = 'Saved!';
    setTimeout(function () { saveBtn.textContent = 'Save'; }, 900);
  });

  // ---------- Gallery ----------

  function showGrid() {
    galleryTitle.textContent = 'Gallery';
    viewer.hidden = true;
    backBtn.hidden = true;
    downloadLink.hidden = true;
    grid.hidden = false;
    emptyMsg.hidden = drawings.length > 0;

    grid.innerHTML = '';
    drawings.forEach(function (src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Drawing ' + (i + 1);
      img.addEventListener('click', function () { showDrawing(i); });
      grid.appendChild(img);
    });
  }

  function showDrawing(i) {
    galleryTitle.textContent = 'Drawing ' + (i + 1);
    viewer.src = drawings[i];
    downloadLink.href = drawings[i];
    downloadLink.download = 'drawing-' + (i + 1) + '.png';
    viewer.hidden = false;
    backBtn.hidden = false;
    downloadLink.hidden = false;
    grid.hidden = true;
    emptyMsg.hidden = true;
  }

  function closeGallery() {
    gallery.hidden = true;
  }

  galleryBtn.addEventListener('click', function () {
    showGrid();
    gallery.hidden = false;
  });
  backBtn.addEventListener('click', showGrid);
  closeBtn.addEventListener('click', closeGallery);
})();

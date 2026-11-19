(function () {
    /* ==========================================================
       YOUR 360° PHOTOS
       To add a room, copy one line. To use your own photo, change
       the path, for example: ./assets/images/tour/reception-360.jpg
       These are Pannellum sample photos for testing only.
       ========================================================== */
    const ROOMS = [
        { id: 'reception', name: 'Reception', photo: 'https://pannellum.org/images/bma-1.jpg' },
        { id: 'hair', name: 'Hair Studio', photo: 'https://pannellum.org/images/bloomberg.jpg' },
        { id: 'skin', name: 'Skin & Facial Room', photo: 'https://pannellum.org/images/bma-0.jpg' },
        { id: 'makeup', name: 'Makeup Studio', photo: 'https://pannellum.org/images/from-tree.jpg' },
        { id: 'bridal', name: 'Bridal Suite', photo: 'https://pannellum.org/images/alma.jpg' },
    ];

    const nameEl = document.getElementById('tour-room-name');
    const statusEl = document.getElementById('tour-status');
    const roomsEl = document.getElementById('tour-rooms');
    const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const roomAt = (i) => ROOMS[(i + ROOMS.length) % ROOMS.length];
    const ROOM_ON = ['border-amberpurple-rich', 'bg-amberpurple-rich', 'text-white'];
    const ROOM_OFF = ['border-amberpurple-rich/20', 'bg-white/75', 'text-amberpurple-rich', 'hover:border-amberpurple-rich'];

    /* Each room links to the previous and next room inside the 360° view */
    const scenes = {};
    ROOMS.forEach((room, i) => {
        scenes[room.id] = {
            type: 'equirectangular',
            panorama: room.photo,
            hotSpots: [
                { type: 'scene', pitch: -8, yaw: -35, text: roomAt(i - 1).name, sceneId: roomAt(i - 1).id },
                { type: 'scene', pitch: -8, yaw: 35, text: roomAt(i + 1).name, sceneId: roomAt(i + 1).id },
            ],
        };
    });

    const viewer = pannellum.viewer('panorama', {
        default: {
            firstScene: ROOMS[0].id,
            autoLoad: true,
            sceneFadeDuration: calmMotion ? 0 : 700,
            hfov: window.innerWidth < 640 ? 75 : 100,
            mouseZoom: false, /* lets visitors scroll the page over the photo */
            autoRotate: calmMotion ? 0 : -1.5,
            autoRotateInactivityDelay: 4000,
        },
        scenes,
    });

    roomsEl.innerHTML = ROOMS.map((room) =>
        `<button type="button" class="min-h-[52px] cursor-pointer rounded-[0.875rem] border px-3 py-2 text-sm font-semibold leading-tight transition last:odd:col-span-2 sm:last:odd:col-span-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amberpurple-rich" data-room="${room.id}" aria-pressed="false">${room.name.replace('&', '&amp;')}</button>`
    ).join('');

    function showRoom(id) {
        nameEl.textContent = ROOMS.find((room) => room.id === id).name;
        statusEl.textContent = '';
        roomsEl.querySelectorAll('[data-room]').forEach((button) => {
            const active = button.dataset.room === id;
            button.setAttribute('aria-pressed', String(active));
            button.classList.remove(...(active ? ROOM_OFF : ROOM_ON));
            button.classList.add(...(active ? ROOM_ON : ROOM_OFF));
        });
    }

    function goTo(id) {
        if (id !== viewer.getScene()) viewer.loadScene(id);
    }

    function step(by) {
        const current = ROOMS.findIndex((room) => room.id === viewer.getScene());
        goTo(roomAt(current + by).id);
    }

    roomsEl.addEventListener('click', (event) => {
        const button = event.target.closest('[data-room]');
        if (button) goTo(button.dataset.room);
    });
    document.getElementById('tour-prev').addEventListener('click', () => step(-1));
    document.getElementById('tour-next').addEventListener('click', () => step(1));

    viewer.on('scenechange', showRoom);
    viewer.on('error', () => {
        statusEl.textContent = 'This 360° photo did not load. Check its file path, or choose another room.';
    });

    showRoom(ROOMS[0].id);
})();

//     <!-- ═══════════════════════════════════════════════════════════
//        PAGE ANIMATIONS (shows the hero and CTA that start hidden)
//   ═══════════════════════════════════════════════════════════ -->

(function () {
    const hidden = document.querySelectorAll('[data-hero].opacity-0, [data-anim].opacity-0');
    const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!window.gsap || !window.ScrollTrigger || calmMotion) {
        hidden.forEach((el) => el.classList.remove('opacity-0'));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('[data-hero]', { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
    });

    gsap.utils.toArray('[data-anim="fade-up"]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
})();
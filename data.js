// Sample data for Creator Launchpad. Covers are CSS-generated (no remote images => never broken).
window.CATEGORIES = [
  { id: 'ai', name: 'AI / ML', blurb: 'Models, agents and data-driven tools', hue: 340 },
  { id: 'web', name: 'Web Development', blurb: 'Platforms, apps and developer tools', hue: 12 },
  { id: 'iot', name: 'IoT', blurb: 'Connected sensors and smart devices', hue: 28 },
  { id: 'security', name: 'Cybersecurity', blurb: 'Privacy, defence and safe systems', hue: 350 },
  { id: 'robotics', name: 'Robotics', blurb: 'Machines that sense, move and decide', hue: 20 },
  { id: 'sustain', name: 'Sustainability', blurb: 'Tech for a healthier planet', hue: 40 },
  { id: 'mobile', name: 'Mobile Apps', blurb: 'Android, iOS and cross-platform', hue: 330 }
];

window.CREATORS = [
  { id: 'aanya', name: 'Aanya Sharma', college: 'IIT Delhi', bio: 'Third-year CS student building ML tools for Indian languages. Believes good models should speak your mother tongue.', skills: ['Python', 'PyTorch', 'NLP', 'FastAPI'], interests: ['Low-resource languages', 'Open source'], badges: ['Star Creator', 'Hackathon Winner'], followers: 1280 },
  { id: 'rohan', name: 'Rohan Mehta', college: 'BITS Pilani', bio: 'Full-stack developer and design nerd. Ships weekend projects that turn into semester-long obsessions.', skills: ['React', 'TypeScript', 'Node.js', 'Figma'], interests: ['Developer tools', 'UI craft'], badges: ['Top Contributor'], followers: 940 },
  { id: 'ishita', name: 'Ishita Rao', college: 'NIT Trichy', bio: 'Embedded systems enthusiast working on affordable agri-tech for small farms.', skills: ['Arduino', 'ESP32', 'C++', 'MQTT'], interests: ['Agri-tech', 'Sensors'], badges: ['Star Creator', 'Impact Award'], followers: 1105 },
  { id: 'kabir', name: 'Kabir Nair', college: 'VIT Vellore', bio: 'Security researcher in training. Spends nights on CTFs and days explaining phishing to relatives.', skills: ['Python', 'Wireshark', 'Burp Suite', 'Linux'], interests: ['CTF', 'Privacy'], badges: ['Bug Hunter'], followers: 612 },
  { id: 'meera', name: 'Meera Iyer', college: 'IIIT Hyderabad', bio: 'Robotics undergrad fascinated by soft grippers and low-cost manipulation.', skills: ['ROS2', 'C++', 'CAD', 'OpenCV'], interests: ['Manipulation', 'Assistive tech'], badges: ['Star Creator'], followers: 877 },
  { id: 'arjun', name: 'Arjun Verma', college: 'DTU Delhi', bio: 'Mobile developer making campus life simpler, one tiny app at a time.', skills: ['Flutter', 'Dart', 'Firebase', 'Kotlin'], interests: ['Campus tech', 'Productivity'], badges: ['Rising Star'], followers: 523 },
  { id: 'tara', name: 'Tara Kapoor', college: 'Ashoka University', bio: 'Climate-tech tinkerer combining satellite data with community action.', skills: ['Python', 'GIS', 'Pandas', 'Leaflet'], interests: ['Climate', 'Open data'], badges: ['Impact Award'], followers: 701 },
  { id: 'dev', name: 'Dev Malhotra', college: 'IIT Bombay', bio: 'Systems programmer who likes making hard things feel effortless.', skills: ['Rust', 'Go', 'Docker', 'Postgres'], interests: ['Infra', 'Performance'], badges: ['Top Contributor'], followers: 689 }
];

window.PROJECTS = [
  {
    id: 'bhasha-bridge', title: 'BhashaBridge', creator: 'aanya', category: 'ai', featured: true, hue: 340,
    short: 'Real-time translation for 12 Indian languages that works offline on a basic phone.',
    problem: 'Over 60% of rural students study from English-only material. Existing translators need constant internet and mangle regional idioms.',
    story: 'It started in a hostel room when Aanya tried to help a friend from Odisha understand a physics lecture. Translating with online tools failed halfway through, with no signal. Over three months the team distilled a large multilingual model into a 90 MB quantized version, then spent weeks collecting idiom pairs from classmates and teachers.',
    solution: 'A distilled, quantized translation model that runs fully on-device, with a cache of domain-specific vocabulary for science and maths.',
    features: ['Offline translation across 12 languages', 'Camera mode for textbook pages', 'Teacher-contributed glossary', 'Under 100 MB install'],
    stack: ['Python', 'PyTorch', 'ONNX', 'Flutter'], team: ['Aanya Sharma', 'Pranav Joshi', 'Sneha Das'],
    challenges: 'Shrinking the model without losing quality for low-resource languages was brutal. Early versions confused gendered verb forms.',
    lessons: 'Real users beat benchmarks. Testing with 20 students in a classroom exposed more bugs than a month of metrics.',
    demo: 'https://example.com/bhashabridge', source: 'https://github.com/example/bhashabridge',
    likes: 342, views: 5120, created: '2026-09-02'
  },
  {
    id: 'pulse-board', title: 'PulseBoard', creator: 'rohan', category: 'web', featured: true, hue: 12,
    short: 'A live dashboard that turns messy student-club data into clear weekly insights.',
    problem: 'Clubs track attendance, budgets and events in five different spreadsheets, so leaders never see the full picture.',
    story: 'Rohan was treasurer of the design society and spent every Sunday merging sheets by hand. He prototyped a one-page dashboard in a weekend, and three other clubs asked for it by Monday.',
    solution: 'A web app that connects club spreadsheets, normalises them and shows attendance, budget burn and engagement trends in real time.',
    features: ['Spreadsheet import with column mapping', 'Weekly digest emails', 'Role-based access for leaders', 'Shareable read-only links'],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], team: ['Rohan Mehta', 'Kavya Singh'],
    challenges: 'Every club formats dates differently. Building a forgiving importer took longer than the whole UI.',
    lessons: 'Boring problems make great products. Ship the importer first, polish the charts later.',
    demo: 'https://example.com/pulseboard', source: 'https://github.com/example/pulseboard',
    likes: 276, views: 4310, created: '2026-09-18'
  },
  {
    id: 'krishi-sense', title: 'KrishiSense', creator: 'ishita', category: 'iot', featured: true, hue: 28,
    short: 'Low-cost soil sensors that tell small farmers exactly when to irrigate.',
    problem: 'Small farms over-water by up to 40% because commercial moisture systems cost more than a season of crops.',
    story: 'During a village visit Ishita watched a farmer irrigate by pushing a finger into the soil. She built a sensor node for under 600 rupees and tested it on three plots for a full monsoon cycle.',
    solution: 'Solar-powered ESP32 nodes send soil moisture and temperature over LoRa to a village gateway, which texts farmers when to irrigate.',
    features: ['Under 600 rupee node cost', 'SMS alerts in local languages', 'Solar powered, 3-month battery backup', 'Offline village gateway'],
    stack: ['ESP32', 'C++', 'MQTT', 'LoRa'], team: ['Ishita Rao', 'Harsh Patel', 'Nisha Reddy', 'Omkar Jadhav'],
    challenges: 'Sensor corrosion destroyed our first batch within weeks. We switched to capacitive probes with a conformal coating.',
    lessons: 'Hardware fails in the field in ways it never does on a desk. Pilot early, pilot ugly.',
    demo: 'https://example.com/krishisense', source: 'https://github.com/example/krishisense',
    likes: 418, views: 6890, created: '2026-08-21'
  },
  {
    id: 'phish-lens', title: 'PhishLens', creator: 'kabir', category: 'security', featured: false, hue: 350,
    short: 'A browser extension that explains why a link looks suspicious, in plain language.',
    problem: 'Phishing warnings say "dangerous site" but never why, so people click through anyway.',
    story: 'After his grandfather nearly lost savings to a fake bank SMS, Kabir wanted a tool that teaches instead of just blocking.',
    solution: 'An extension that scores URLs locally and highlights the specific red flags, such as lookalike domains and urgent wording.',
    features: ['Local-only analysis, no browsing data leaves the device', 'Plain-language explanations', 'Lookalike domain detection', 'Family mode with simple alerts'],
    stack: ['JavaScript', 'WebExtensions', 'Python', 'scikit-learn'], team: ['Kabir Nair', 'Ananya Bose'],
    challenges: 'Keeping false positives low on legitimate shortened links.',
    lessons: 'Explaining a decision builds more trust than making it silently.',
    demo: 'https://example.com/phishlens', source: 'https://github.com/example/phishlens',
    likes: 189, views: 2740, created: '2026-10-04'
  },
  {
    id: 'grip-lab', title: 'GripLab', creator: 'meera', category: 'robotics', featured: true, hue: 20,
    short: 'A 3D-printed soft robotic hand that can pick up an egg or a coin.',
    problem: 'Adaptive prosthetic and assistive grippers cost lakhs of rupees, far beyond most students and clinics.',
    story: 'Meera spent a semester iterating silicone finger designs in the college makerspace, breaking 14 prototypes before the fifth-generation finger finally curled smoothly.',
    solution: 'A pneumatic soft gripper built from printable moulds and cheap silicone, controlled by a small Arduino pump system.',
    features: ['Under 8,000 rupee build cost', 'Open-source CAD and moulds', 'Force-sensitive grip', 'Camera-guided object detection'],
    stack: ['ROS2', 'C++', 'OpenCV', 'Fusion 360'], team: ['Meera Iyer', 'Siddharth Rao', 'Pooja Menon'],
    challenges: 'Silicone moulds kept trapping air bubbles that weakened the fingers.',
    lessons: 'Document failures as carefully as successes. Our failure log became the best part of the repo.',
    demo: 'https://example.com/griplab', source: 'https://github.com/example/griplab',
    likes: 301, views: 4980, created: '2026-09-27'
  },
  {
    id: 'green-route', title: 'GreenRoute', creator: 'tara', category: 'sustain', featured: false, hue: 40,
    short: 'Campus commute planner that shows the carbon cost of every route.',
    problem: 'Students choose rides by price and time alone because the emissions impact is invisible.',
    story: 'Tara combined open transit feeds with emission factors and found that the bus was both cheaper and 4x cleaner for 70% of campus trips.',
    solution: 'A map-based planner comparing walking, cycling, bus, metro and cab by time, cost and CO2, with a campus leaderboard.',
    features: ['Route comparison with CO2 per trip', 'Weekly personal impact summary', 'Department leaderboard', 'Open data export'],
    stack: ['Python', 'Leaflet', 'Pandas', 'Flask'], team: ['Tara Kapoor', 'Vivaan Gupta'],
    challenges: 'Transit data was incomplete, so we crowdsourced missing bus stops.',
    lessons: 'Gamification works, but only when the numbers are honest.',
    demo: 'https://example.com/greenroute', source: 'https://github.com/example/greenroute',
    likes: 214, views: 3320, created: '2026-10-11'
  },
  {
    id: 'class-sync', title: 'ClassSync', creator: 'arjun', category: 'mobile', featured: false, hue: 330,
    short: 'A campus app that merges timetables, assignments and exam dates into one calm view.',
    problem: 'Students juggle timetables on PDFs, deadlines on WhatsApp and exams on notice boards.',
    story: 'Arjun built a first version for his own batch during exam week. Within a month 900 students on campus were using it.',
    solution: 'A Flutter app that syncs timetables, deadlines and room changes, and nudges you before things are due.',
    features: ['Unified timetable and deadlines', 'Room-change push alerts', 'Study group scheduler', 'Works offline'],
    stack: ['Flutter', 'Dart', 'Firebase', 'Kotlin'], team: ['Arjun Verma', 'Ritika Sen', 'Aditya Kumar'],
    challenges: 'Parsing wildly inconsistent timetable PDFs from different departments.',
    lessons: 'Distribution beats features. A single WhatsApp group drove more installs than any launch post.',
    demo: 'https://example.com/classsync', source: 'https://github.com/example/classsync',
    likes: 167, views: 2210, created: '2026-10-15'
  },
  {
    id: 'edge-cache', title: 'EdgeCache', creator: 'dev', category: 'web', featured: false, hue: 8,
    short: 'A tiny Rust caching proxy that makes slow campus portals feel instant.',
    problem: 'The college portal takes 8+ seconds to load on peak days, mostly because of repeated identical requests.',
    story: 'Dev profiled the portal traffic and found 70% of requests were identical. A small caching layer in front dropped median latency from seconds to milliseconds.',
    solution: 'A memory-safe reverse proxy with smart per-route cache rules and live metrics.',
    features: ['Per-route cache policies', 'Live latency dashboard', 'Zero-downtime reload', 'Single 4 MB binary'],
    stack: ['Rust', 'Tokio', 'Docker', 'Prometheus'], team: ['Dev Malhotra'],
    challenges: 'Cache invalidation on authenticated pages without leaking data between users.',
    lessons: 'Correctness first. A fast cache that serves the wrong user is a vulnerability, not a feature.',
    demo: 'https://example.com/edgecache', source: 'https://github.com/example/edgecache',
    likes: 143, views: 1980, created: '2026-10-19'
  },
  {
    id: 'sign-speak', title: 'SignSpeak', creator: 'aanya', category: 'ai', featured: false, hue: 345,
    short: 'Camera-based sign language to text, tuned for Indian Sign Language.',
    problem: 'Most sign recognition research targets ASL, leaving Indian Sign Language users with almost no tools.',
    story: 'Working with a local deaf school, the team recorded hundreds of volunteer clips and trained a lightweight landmark-based classifier.',
    solution: 'A mobile-friendly web app that tracks hand landmarks and predicts common ISL phrases in real time.',
    features: ['Real-time landmark tracking', '120 common ISL phrases', 'Teacher mode for adding new signs', 'Runs in the browser'],
    stack: ['Python', 'MediaPipe', 'TensorFlow.js', 'React'], team: ['Aanya Sharma', 'Dhruv Khanna'],
    challenges: 'Lighting and skin tone variation hurt accuracy until we diversified the dataset.',
    lessons: 'Build with the community, not for it.',
    demo: 'https://example.com/signspeak', source: 'https://github.com/example/signspeak',
    likes: 256, views: 3870, created: '2026-10-07'
  }
];

// Seed comments
window.SEED_COMMENTS = {
  'bhasha-bridge': [
    { name: 'Prof. Rao', text: 'Impressive on-device quantization. Have you benchmarked against Bhashini on idiom-heavy text?', t: '2026-10-01' },
    { name: 'Neha', text: 'My cousin in Bhubaneswar tried it and cried a little. This is huge.', t: '2026-10-03' }
  ],
  'krishi-sense': [
    { name: 'Farmer Co-op Lead', text: 'Would love to pilot 20 nodes this season. Can you share a bill of materials?', t: '2026-09-25' }
  ],
  'pulse-board': [
    { name: 'Siddhi', text: 'The import mapping UX is delightful. Please add Notion as a source!', t: '2026-09-30' }
  ]
};

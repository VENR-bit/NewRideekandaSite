/* ──────────────────────────────────────────────────────────────
   News & Events data.
   To publish: add an object to the TOP of this array.

   Fields:
     title   — headline (always shown on the card)
     date    — "YYYY-MM-DD" (sorts newest first + shown)
     type    — "Event" | "News" | "Notice" | "Dhamma"
     when    — event date text (optional)
     excerpt — short card summary
     body    — full text shown in the reader (optional)
     image   — lead/thumbnail file in assets/ (optional)
     youtube — a YouTube link (optional). When set, the video plays inside the
               on-site reader and its thumbnail (with a play badge) is used on
               the card. Any of the usual link forms works, e.g.
                 youtube: "https://youtu.be/VIDEOID"
     images  — array of extra photo files in assets/ (optional). All photos
               are shown in the on-site reader gallery, so the full post —
               text + every photo — reads on the site itself (works on the
               kiosk too, with no Facebook navigation).
               Example:
                 image: "post-40.jpg",
                 images: ["post-40.jpg", "post-40b.jpg", "post-40c.jpg"]

   To publish from a Facebook post: send the FB post link and its photos;
   the text + images get saved here as hosted content (assets/). The live
   "From our Facebook" wall on the page already mirrors the page feed.
   ────────────────────────────────────────────────────────────── */
window.NEWS_POSTS = [
  {
    title: "Inaugural Opening of the New Meditation Kuti",
    date: "2026-10-02",
    type: "Event",
    when: "2 October 2026",
    excerpt: "A simple and solemn ceremony marked the opening and offering of a newly built meditation shelter, nestled in the forest canopy — a dedicated, serene space for resident monks to engage in intensive meditation practice.",
    body: "On October 2, 2026, Rideekanda Forest Monastery hosted a simple and solemn religious ceremony to mark the inaugural opening and offering of a newly constructed meditation shelter (kuti).\n\nNestled amidst the natural tranquility of the forest canopy, this new shelter offers a dedicated, serene space for resident monks to engage in intensive meditation practice.\n\nA Sacred Offering to the Sangha\n\nThe event was led by Venerable Bhante Rewatha, who conducted the traditional Buddhist rites to formally offer the kuti to the Maha Sangha. The ceremony was attended by the primary supporters who made this project possible — especially Miss S — alongside local meditation practitioners and the dedicated construction team whose hard work brought this vision to life.\n\nMay the merit generated from offering this shelter bring peace, happiness, and progress on the Dhamma path to all who contributed to its realization.",
    image: "post-42c.jpg",
    images: ["post-42c.jpg", "post-42.jpg", "post-42b.jpg", "post-42d.jpg", "post-42e.jpg", "post-42f.jpg", "post-42g.jpg", "post-42h.jpg", "post-42i.jpg", "post-42j.jpg"]
  },
  {
    title: "Two 7-Day Retreats — September 2026",
    date: "2026-09-22",
    type: "Event",
    when: "September 2026 · two 7-day retreats",
    excerpt: "Two separate 7-day retreats were held at Rideekanda Forest Monastery during September. Practitioners from all walks of life gathered in the hills of Matale to embrace noble silence and immerse themselves in the Buddha’s teachings of Concentration & Vipassanā.",
    body: "🌸 Reflecting on a Month of Peace, Stillness, and Inner Transformation 🌿\n\nWe are deeply grateful to share that Rideekanda Forest Monastery successfully conducted two separate retreats, each lasting 7 days, during the month of September.\n\nOver these two distinct programs, practitioners from all walks of life gathered in the tranquil hills of Matale to step away from daily distractions, embrace noble silence, and immerse themselves in the Buddha’s timeless teachings of Concentration & Vipassana (insight meditation).\n\nFrom peaceful sunrise reflections overlooking the mist-covered valleys to guided Dhamma sessions, mindful walking, yoga/stretching, and community meals, each retreat was a testament to the dedication and effort of all participants.\n\n🙏 Sincere Gratitude:\n· To the venerable monks for their compassionate guidance and wisdom.\n· To our retreat participants for their sincere dedication, patience, and practice.\n· To all volunteers, donors, and supporters whose generosity (dāna) made both retreats possible.\n\nMay the merit gathered during these retreats bring peace, clarity, and liberation to all beings. ✨\n\n📌 Join Us for Upcoming Retreats\nAre you ready to step into the forest and deepen your practice? We host monthly 7-day residential retreats.\n\n🌐 Learn More & Book: www.rideekanda.com/retreat-center\n💬 WhatsApp: +94 74 225 2980\n📧 Email: rideekanda@gmail.com",
    image: "post-41b.jpg",
    images: ["post-41b.jpg", "post-41.jpg", "post-41c.jpg", "post-41d.jpg", "post-41e.jpg", "post-41f.jpg", "post-41g.jpg", "post-41h.jpg", "post-41i.jpg", "post-41j.jpg", "post-41k.jpg"]
  },
  {
    title: "7-Day Vipassanā Retreat — August 2026",
    date: "2026-08-23",
    type: "Event",
    when: "Late August 2026 · 7 days",
    excerpt: "Our late August Vipassanā & Concentration Meditation Retreat has concluded. Over seven days of immersive practice amidst the misty mountaintops of Matale, local and international practitioners came together to explore the Dhamma, cultivate concentration (Samādhi), and gain direct insight (Vipassanā) into the nature of mind and body.",
    body: "Finding peace in the present moment. 🌿✨\nOur late August Vipassana & Concentration Meditation Retreat at Rideekanda Forest Monastery has officially concluded! Over seven days of immersive practice amidst the misty mountaintops of Matale, local and international practitioners came together to explore the Dhamma, cultivate concentration (Samādhi), and gain direct insight (Vipassanā) into the nature of mind and body.\nFrom peaceful sunrise sessions overlooking the forest canopy to small-group Dhamma discussions with our venerated monks, every moment was an opportunity to pause, look inward, and nourish the soul. 🧘‍♂️🧘‍♀️\nA deep Bow of gratitude to our resident monks, dedicated volunteers, generous Dāna supporters, and every practitioner who brought their sincere effort and quiet mindfulness to this retreat. May the peace, clarity, and merit cultivated here continue to light your path forward! 🙏✨\n📍 Rideekanda Forest Monastery | Matale, Sri Lanka\n✨ Offered freely in the ancient tradition of Dāna.\n📩 Interested in joining our next monthly residential retreat? A seven-day retreat is held every month — write to rideekanda@gmail.com or call +94 74 225 2980 to book your stay.\n#RideekandaForestMonastery #VipassanaRetreat #Dhamma #MeditationSriLanka #Mindfulness #SamathaVipassana #TheravadaBuddhism #SilentRetreat #Matale #InnerPeace #MeditationPractice",
    image: "post-40.jpg",
    images: ["post-40.jpg", "post-40b.jpg", "post-40c.jpg", "post-40d.jpg", "post-40e.jpg", "post-40f.jpg", "post-40g.jpg", "post-40h.jpg", "post-40i.jpg", "post-40j.jpg"]
  },
  {
    title: "7-Day Vipassanā Retreat — July 2026",
    date: "2026-07-26",
    type: "Event",
    when: "July 2026 · 7 days",
    excerpt: "Practitioners from Sri Lanka and abroad gathered at Rideekanda Forest Monastery for a 7-day residential retreat on Concentration and Vipassanā meditation — silence, simplicity, and deep practice in the forest.",
    body: "In July, meditators from Sri Lanka and around the world came together at Rideekanda Forest Monastery for a seven-day residential retreat on Concentration and Vipassanā Meditation.\n\nAcross seven days of noble silence, practitioners followed a gradual path — settling the mind with mindfulness of breathing, turning attention to the body, and opening to direct insight into impermanence through Vipassanā.\n\nFrom the first sitting before dawn to evening Dhamma discussions, each day unfolded in simplicity and stillness — meditation on the hillside deck overlooking the mist and mountains, walking meditation along the forest paths, chanting, and quiet, mindful work.\n\nThe retreat welcomed practitioners of every level, from first-time meditators to those deepening a long-established practice. What they shared was sincerity and a willingness to look within.\n\nDeep gratitude to everyone who walked this path with such dedication, and to all who supported the retreat. May the merit of this practice bring peace, clarity, and progress on the path to all beings.\n\n📍 Rideekanda Forest Monastery, Udasgiriya, Matale, Sri Lanka\n🌐 www.rideekanda.com\n📩 rideekanda@gmail.com\n📞 +94 74 225 2980\n\n🧘 A seven-day Vipassanā retreat is held every month — reach out to reserve your place.",
    image: "post-39i.jpg",
    images: ["post-39i.jpg", "post-39.jpg", "post-39b.jpg", "post-39c.jpg", "post-39d.jpg", "post-39k.jpg", "post-39f.jpg", "post-39g.jpg", "post-39h.jpg", "post-39j.jpg"]
  },
  {
    title: "7-Day Residential Retreat",
    date: "2026-03-12",
    type: "Event",
    when: "Early March 2026 · 7 days",
    excerpt: "A 7-day residential retreat on Concentration and Vipassana meditation at Rideekanda Forest Monastery — silence, simplicity, and deep practice in the forest.",
    body: "In early March, a group of dedicated meditation practitioners came together at Rideekanda Forest Monastery for a 7-day residential retreat on Concentration and Vipassana Meditation.\n\nOver seven days, practitioners followed a progressive path — starting with breath meditation to calm and focus the mind, then moving into body contemplation, and finally developing direct insight into impermanence through Vipassana practice.\n\nFrom early morning sitting sessions to evening discussions, each day was spent in silence, simplicity, and deep practice — surrounded by ancient forest, golden sunsets, and the stillness of the mountains.\n\nThe retreat welcomed practitioners from all levels of experience — from complete beginners to those deepening an existing practice. What united everyone was sincerity and a willingness to look within.\n\nGrateful to every practitioner who walked this path with dedication, and to Rideekanda Forest Monastery for continuing to offer this sacred space in the Sri Lankan Forest Tradition.\n\n📍 Rideekanda Forest Monastery, Udasgiriya, Matale, Sri Lanka\n🌐 www.rideekanda.com\n📩 rideekanda@gmail.com\n📞 +94 74 225 2980\n\n🧘 Upcoming retreats — reach out to reserve your place.",
    image: "post-38.jpg",
    images: ["post-38.jpg", "post-38b.jpg", "post-38c.jpg", "post-38d.jpg", "post-38e.jpg", "post-38f.jpg", "post-38g.jpg", "post-38h.jpg"]
  },
  {
    title: "Offering of the New Meditation-Kuṭi Complex to the Sangha",
    date: "2026-03-03",
    type: "Event",
    when: "Medin Full Moon Poya Day",
    excerpt: "The newly built meditation-kuṭi complex at Udasgiriya Rideekanda Forest Monastery was formally offered to the Mahā Sangha.",
    body: "The newly constructed meditation-kuṭi (cottage) complex at Udasgiriya Rideekanda Forest Monastery was formally offered to the Sangha on the recent Medin Full Moon Poya day.\n\nBuilt through the generous dāna of the Bōyagoda and Pādeniya families together with their friends and well-wishers, it was offered with deep reverence for the Sāsana, for the use of the Mahā Sangha.\n\nMay all rejoice in this meritorious deed — sādhu!",
    image: "post-37.jpg",
    images: ["post-37.jpg", "post-37b.jpg", "post-37c.jpg", "post-37d.jpg", "post-37e.jpg"]
  },
  {
    title: "The 2025 Katina Pooja Ceremony (Robe Offering)",
    date: "2025-11-09",
    type: "Event",
    when: "2025-11-02 to 2025-11-03",
    excerpt: "Katina robe offering ceremony and dedication of the new monastery building complex.",
    body: "The 2025 Katina Pooja Ceremony at Udasgiriya Rideekanda Forest Monastery, Matale, was held on 2–3 November 2025. During the ceremony, the newly built complex with the Dana Shala, kitchen, and residential facilities was formally offered to the Sangha.",
    image: "post-36a.jpg",
    images: ["post-36a.jpg", "post-36b.jpg", "post-36c.jpg", "post-36d.jpg", "post-36e.jpg", "post-36f.jpg", "post-36g.jpg", "post-36h.jpg", "post-36i.jpg", "post-36.jpeg"]
  },
  {
    title: "Meditation Retreat at Toggenburg, Switzerland",
    date: "2025-08-20",
    type: "Event",
    excerpt: "Meditation retreat in Toggenburg with participants from several European countries.",
    body: "A meditation retreat in Toggenburg, Switzerland brought together practitioners from Switzerland, Germany, France, and Italy. Under the guidance of Bhante Rewatha Thero, participants spent time in silence, reflection, mindfulness, and Dhamma practice.",
    image: "post-35.jpg"
  },
  {
    title: "Talk on Meditation and Ancient Eastern Wisdom for Modern Life at EPFL",
    date: "2025-08-20",
    type: "Event",
    when: "2025-06-27",
    excerpt: "EPFL public talk on meditation, ancient wisdom, science, and modern life.",
    body: "More than 200 participants attended a public talk at EPFL on 27 June 2025 by Ven. Homagama Rewatha Thero. The session explored meditation, ancient Eastern wisdom, mental clarity, well-being, and the connection between inner development and modern science.",
    image: "post-34.jpg"
  },
  {
    title: "Meditation workshop at EPFL University in Switzerland",
    date: "2025-08-20",
    type: "Event",
    when: "2025-06-02 to 2025-06-06",
    excerpt: "Five-day EPFL meditation workshop led by Ven. Homagama Rewatha Thero.",
    body: "Following the EPFL public talk, a five-day meditation workshop was held from 2–6 June 2025 under the guidance of Ven. Homagama Rewatha Thero. Participants explored concentration, awareness, self-understanding, and mindfulness in science and technology.",
    image: "post-33.jpg"
  },
  {
    title: "7-Day Vipassana Retreat – Every Month at Rideekanda Forest Monastery",
    date: "2025-08-20",
    type: "Event",
    when: "Monthly / ongoing",
    excerpt: "Monthly seven-day Vipassana retreat at Rideekanda Forest Monastery.",
    body: "Rideekanda Forest Monastery conducts monthly seven-day Vipassana retreats for local and international practitioners. The retreat includes silence, meditation, chanting, Dhamma discussions, personal reflection, and guidance in the Theravāda Buddhist tradition.",
    image: "post-32.jpg"
  },
  {
    title: "Residential Retreat",
    date: "2025-08-20",
    type: "Event",
    when: "Ongoing / by booking",
    excerpt: "Residential meditation retreats in the forest setting of Rideekanda Monastery.",
    body: "Rideekanda Forest Monastery offers residential retreats in the forests of Matale for monks, nuns, and lay practitioners. The programme supports mindful living, daily meditation, walking meditation, Dhamma discussions, chanting, vegetarian meals, silence, and personal guidance.",
    image: "post-31.jpg"
  },
  {
    title: "Introduction to Meditation with Bhante Rewatha in Johanneskirche, Zürich, Switzerland",
    date: "2025-05-11",
    type: "Event",
    when: "2025-05-21 and 2025-05-28",
    excerpt: "Two evening meditation introduction sessions in Zürich, Switzerland.",
    body: "Bhante Rewatha introduced Buddhist teachings and guided concentration and Vipassana meditation over two Wednesday evening sessions at Johanneskirche, Limmatstrasse 112, 8005 Zürich, Switzerland. The sessions were scheduled for 21 and 28 May 2025.",
    image: "post-30.jpeg"
  },
  {
    title: "Vipassana Meditation Retreat with Bhante Homagama Rewatha in Toggenburg Switzerland",
    date: "2025-05-11",
    type: "Event",
    when: "2025-05-22 to 2025-05-26",
    excerpt: "Toggenburg Vipassana retreat scheduled for 22–26 May 2025.",
    body: "A Vipassana meditation retreat with Bhante Homagama Rewatha was scheduled in Toggenburg, Oberdickenstrasse 9, 9115 Dicken, Switzerland, from 22–26 May 2025. The retreat invited new and returning practitioners to join for meditation, shared practice, and simple residential living.",
    image: "post-29.jpeg"
  },
  {
    title: "Wisdom in Silence",
    date: "2025-05-05",
    type: "Dhamma",
    excerpt: "Documentary short supporting the mission of Rideekanda Forest Monastery.",
    body: "Wisdom in Silence is a short documentary created as a donation to support Rideekanda Forest Monastery. The documentary features Bhante Rewatha, Bhante Sumedha, Dinesh Nandana Kumara, and international contributors who supported the film-making process.",
    image: "",
    youtube: "https://youtu.be/toTmlQMYw-A"
  },
  {
    title: "07 days Vipassana Retreats @ Rideekanda",
    date: "2025-05-05",
    type: "Dhamma",
    excerpt: "Completion of seven-day Vipassana retreats for local and international practitioners.",
    body: "Rideekanda Forest Monastery successfully completed seven-day Vipassana retreats for foreign and local meditation practitioners at Udasgiriya, Matale, Sri Lanka.",
    image: "post-27.jpg"
  },
];

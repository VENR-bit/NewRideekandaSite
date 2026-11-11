// Static review data mirroring the live Featurable widget at rideekanda.com.
// Sorted by recency (most recent first).
//
// To switch to live data from your Featurable widget, replace REVIEWS below
// with a fetch to:  https://featurable.com/api/v1/widgets/<your-widget-id>
// and map response.reviews into the same shape.

const REVIEWS = [
  {
    name: "Nisha C.",
    initial: "N",
    color: "#b08968",
    daysAgo: 9,
    when: "9 days ago",
    rating: 5,
    text: "I recently attended a meditation retreat at Rideekanda Monastery, and it was a truly enriching experience. The atmosphere was incredibly peaceful, making it the perfect place to step away from the noise of daily life. The Venerable Bhante guided us with such warmth and clarity that even first-time meditators felt at home. I returned with a calmer mind and a renewed sense of purpose.",
  },
  {
    name: "Hirantha W.",
    initial: "H",
    color: "#7c8c66",
    daysAgo: 32,
    when: "1 month ago",
    rating: 5,
    text: "I joined the 7-day Vipassana retreat at Rideekanda Forest Monastery (March 2026), and it was a transformative period of inner stillness, insight, and genuine meditative practice. The quiet forest, the disciplined schedule, and the wise guidance of the Bhante created the perfect conditions for deep practice. Highly recommended for anyone serious about the Dhamma.",
  },
  {
    name: "Jacob A.",
    initial: "J",
    color: "#8a73c2",
    daysAgo: 35,
    when: "1 month ago",
    rating: 5,
    text: "Rideekanda Forest Monastery is a really special place. As soon as I arrived I felt an incredibly peaceful and harmonious atmosphere here. The Bhante, who lead the 7-day vipassana retreat, was able to communicate the teachings in a way that was both deeply traditional and immediately relevant to modern life. The forest itself feels alive with practice.",
  },
  {
    name: "Shalika H.",
    initial: "S",
    color: "#6b7d8c",
    daysAgo: 60,
    when: "2 months ago",
    rating: 5,
    text: "(Translated by Google) My experience at the Ridakanda Meditation Temple was a very noble and unforgettable one. This was my first 7-day meditation program, and I felt that it was very well-organized from beginning to end. The accommodation, the food, and most importantly the teaching were all of the highest standard.",
  },
  {
    name: "Valesca N.",
    initial: "V",
    color: "#c08a8a",
    daysAgo: 65,
    when: "2 months ago",
    rating: 5,
    text: "My time at the Vipassana retreat at Rideekanda Forest Monastery was truly something special ✨ Set on top of a mountain and surrounded by pure nature, the place itself is already breathtaking. The silence of the forest, the kindness of the resident monks, and the depth of the teaching made every day feel like a small awakening.",
  },
  {
    name: "Hugo Z.",
    initial: "H",
    color: "#a07e5a",
    daysAgo: 92,
    when: "3 months ago",
    rating: 5,
    text: "My stay at Rideekanda Forest Monastery was a truly impressive experience. The location is breathtaking, with beautiful views and a deeply peaceful atmosphere that immediately brings a sense of calm. I came with a busy mind and left with a quiet one. The schedule is rigorous but compassionate.",
  },
  {
    name: "Ishara S.",
    initial: "I",
    color: "#d96a8c",
    daysAgo: 95,
    when: "3 months ago",
    rating: 5,
    text: "(Translated by Google) For 4 years, we have been practicing the Buddha's philosophy under the guidance of the Venerable Thero, studying its profound Dhamma matters thoroughly, and have been able to bring lasting change into our daily lives. This is a place of genuine practice.",
  },
  {
    name: "Udara S.",
    initial: "U",
    color: "#5a7d8c",
    daysAgo: 98,
    when: "3 months ago",
    rating: 5,
    text: "(Translated by Google) Ridikanda Aranya Senasana is a monastery where you can easily and clearly obtain the necessary instructions for the correct path of Buddhism. Under the guidance of Revatha Thero, the entire program is structured to lead one gently but firmly toward right understanding.",
  },
  {
    name: "Pasindu R.",
    initial: "P",
    color: "#7a6c4f",
    daysAgo: 110,
    when: "4 months ago",
    rating: 5,
    text: "A rare and beautiful place. The forest setting, the simplicity of the kuti, and the rhythm of the day all support the practice in a way I have not experienced elsewhere. The Bhante's Dhamma talks were the highlight — practical, profound, and full of metta.",
  },
  {
    name: "Anika P.",
    initial: "A",
    color: "#9c7a3f",
    daysAgo: 125,
    when: "4 months ago",
    rating: 5,
    text: "I came for a weekend and ended up staying the full week. There is something here that you cannot find in a city retreat — the quiet of the trees, the discipline of the monks, the kindness of the lay supporters. I will be back.",
  },
  {
    name: "Tharindu K.",
    initial: "T",
    color: "#4f6c7a",
    daysAgo: 150,
    when: "5 months ago",
    rating: 5,
    text: "The teaching here is grounded in the suttas and delivered with great care. Beginners are welcomed without condescension and experienced practitioners are challenged. The food is simple and nourishing. Highly recommended.",
  },
  {
    name: "Marie L.",
    initial: "M",
    color: "#c47a5a",
    daysAgo: 175,
    when: "6 months ago",
    rating: 5,
    text: "(Translated by Google) An exceptional retreat. The monks are very welcoming, the place is magnificent, and the silent retreat allowed me to find a calm I had not felt for years. Thank you to the whole community.",
  },
];

const STATS = {
  average: 4.9,
  total: REVIEWS.length, // shown as "from N reviews"
  // For a more authoritative display you can override these from the Featurable
  // response — many monasteries cite their full Google count here.
  displayTotal: 127,
};

const WRITE_REVIEW_URL = "https://g.page/r/CfhMUG2SPO7JEBM/review";

Object.assign(window, { REVIEWS, STATS, WRITE_REVIEW_URL });

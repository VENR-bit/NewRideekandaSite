/* Rideekanda — the retreat day.

   THE ONE PLACE THE DAILY ROUTINE IS WRITTEN DOWN. Three things read it:
     * this folder's page (both languages side by side),
     * ../retreat-docs/tools/build-pdf.py, which renders the two PDFs, and
     * nothing else — the Daily Rhythm timeline on the retreat programme page
       is hand-written in that page's own markup, so if you change a time
       here, change it there too (retreat-center/index.html and si/index.html).

   Each row: t = time as printed (en / si), a = what happens (en / si),
   and from/to, the same period on a 24-hour clock so the page can mark
   whichever one is under way. The last row wraps past midnight.
   Times are written the same way throughout: "5.30", never "5:30". */
window.RK_ROUTINE = {
  title: {
    en: "Daily Routine of the Retreat",
    si: "ආරණ්‍යයේ දින චර්යාව",
    sub_en: "Rideekanda Forest Monastery",
    sub_si: "රිදීකන්ද ආරණ්‍ය සේනාසනය"
  },
  rows: [
    { t: { en: "5.30 AM",               si: "පෙ.ව. 5.30" },
      from: "05:30", to: "07:00",
      a: { en: "Waking up & Getting Ready",
           si: "අවදි වී සූදානම් වීම" } },

    { t: { en: "7.00 AM - 8.00 AM",     si: "පෙ.ව. 7.00 - පෙ.ව. 8.00" },
      from: "07:00", to: "08:00",
      a: { en: "Breakfast",
           si: "උදේ ආහාරය" } },

    { t: { en: "8.00 AM - 9.00 AM",     si: "පෙ.ව. 8.00 - පෙ.ව. 9.00" },
      from: "08:00", to: "09:00",
      a: { en: "Morning Dhamma Session/ Learning Session",
           si: "උදෑසන ධර්ම සැසිය/ ඉගෙනුම් සැසිය" } },

    { t: { en: "9.00 AM - 12.00 Noon",  si: "පෙ.ව. 9.00 - දහවල් 12.00" },
      from: "09:00", to: "12:00",
      a: { en: "Meditation Practice",
           si: "භාවනා අභ්‍යාසය" } },

    { t: { en: "12.00 Noon - 1.00 PM",  si: "දහවල් 12.00 - ප.ව. 1.00" },
      from: "12:00", to: "13:00",
      a: { en: "Lunch",
           si: "දිවා ආහාරය" } },

    { t: { en: "1.00 PM - 2.00 PM",     si: "ප.ව. 1.00 - ප.ව. 2.00" },
      from: "13:00", to: "14:00",
      a: { en: "Afternoon Rest",
           si: "දහවල් විවේකය" } },

    { t: { en: "2.00 PM - 4.30 PM",     si: "ප.ව. 2.00 - ප.ව. 4.30" },
      from: "14:00", to: "16:30",
      a: { en: "Meditation Practice",
           si: "භාවනා අභ්‍යාසය" } },

    { t: { en: "4.30 PM - 6.00 PM",     si: "ප.ව. 4.30 - ප.ව. 6.00" },
      from: "16:30", to: "18:00",
      a: { en: "Evening Dhamma Session/ Learning Session",
           si: "සවස ධර්ම සැසිය/ ඉගෙනුම් සැසිය" } },

    { t: { en: "6.00 PM - 7.00 PM",     si: "ප.ව. 6.00 - ප.ව. 7.00" },
      from: "18:00", to: "19:00",
      a: { en: "Chanting Session & Evening Dhamma Discussion",
           si: "සජ්ඣායනා සැසිය සහ සන්ධ්‍යා ධර්ම සාකච්ඡාව" } },

    { t: { en: "7.00 PM - 10.00 PM",    si: "ප.ව. 7.00 - ප.ව. 10.00" },
      from: "19:00", to: "22:00",
      a: { en: "Meditation Practice",
           si: "භාවනා අභ්‍යාසය" } },

    { t: { en: "10.00 PM",              si: "ප.ව. 10.00" },
      from: "22:00", to: "05:30",
      a: { en: "Night Rest",
           si: "රාත්‍රී විවේකය" } }
  ]
};

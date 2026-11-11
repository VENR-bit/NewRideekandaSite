/* global React */
const { useState, useEffect, useRef, useMemo, useContext, createContext } = React;

/* ======================= i18n: English + Sinhala ======================= */
const STR = {
  en: {
    /* hero */
    hero_kicker: "A Path to Stillness",
    hero_h1_a: "Paving the road in concrete to the ",
    hero_h1_em: "forest monastery",
    hero_h1_b: ".",
    hero_lede: "A quiet gravel track winds 1.9 km (1,890 m) through the forest to Rideekanda Monastery. Help us lay 610 meters of concrete — one linear meter at a time — so that meditation practitioners may walk and travel in peace.",
    btn_pledge_meter: "Pledge a linear meter",
    btn_learn: "Learn about the project",
    stat_fulllen: "Full length · 1,890 m",
    stat_concrete: "Concrete to be laid",
    stat_pledged: "Pledged so far",
    stat_oftheway: "Of the goal",
    /* about */
    about_kicker: "The Project",
    about_title_a: "A proper way through the ",
    about_title_em: "forest",
    about_title_b: ".",
    about_lede: "The only access to Rideekanda Forest Monastery is an unpaved gravel track — severely uneven, rutted, and barely passable for ordinary vehicles. This project lays a durable concrete road so monastics, visitors, and meditators can reach this place of practice with ease and safety.",
    fact_purpose_k: "Purpose",
    fact_purpose_v: "Reliable road access to the monastery for meditation practitioners and supply vehicles.",
    fact_len_k: "Full Length",
    fact_len_v: "1.9 km (1,890 m) of forest track",
    fact_critical_k: "Critical Phase",
    fact_critical_v: "610 m of concrete road repair — the steepest, most damaged stretch.",
    fact_cond_k: "Condition",
    fact_cond_v: "Unpaved gravel, severe unevenness and off-road ruts — highly difficult for standard vehicles.",
    fact_loc_k: "Location",
    fact_loc_link: "View the site on Google Maps ↗",
    aside_quote: "“A road is not only a way for vehicles — it is a way for the Dhamma to reach those who seek it.”",
    aside_p1: "For years, the journey to Rideekanda has tested every visitor. In the monsoon, the gravel turns to mud; in the dry season, the ruts jar every wheel. Elderly practitioners and those carrying alms have struggled to make the climb.",
    aside_p2: "This concrete road — built to a verified 1:3:5 structural mix — will last for decades, carrying generations of practitioners quietly into the forest.",
    callout_kicker: "The Critical 610 Meters",
    callout_h3_a: "One meter of road, ",
    callout_h3_em: "one act of generosity.",
    callout_h3_b: "",
    callout_p: "Each linear meter of finished concrete costs LKR 8,878. Choose how many meters you wish to pave — and join the supporters who carry this road to the forest.",
    /* tech */
    tech_kicker: "Engineering & Cost",
    tech_title_a: "Built to a verified ",
    tech_title_em: "1:3:5 mix",
    tech_title_b: ".",
    tech_lede: "Every rupee is grounded in a structural engineering estimate. The lean mix was revised to a stable 1:3:5 volumetric ratio for safe compressive tolerance under standard traffic loads.",
    spec1: "Project scope — linear meters of concrete",
    spec2: "Cross-section — width × slab thickness",
    spec3: "Cement : sand : metal volumetric ratio",
    spec4: "Cement allocation across the full 610 m",
    mat_req_kicker: "Total Material Requirement",
    mat_cement: "Cement", mat_cement_sub: "50 kg standard bags",
    mat_sand: "River Sand", mat_sand_sub: "Fine aggregate",
    mat_agg: "Coarse Aggregate", mat_agg_sub: "Crushed metal",
    unit_bags: "bags", unit_cubes: "cubes",
    total_mat_cost: "Total material cost",
    labour_kicker: "Total Cost of Labour",
    labour_note: "Direct on-site labour for the full 610 m concrete scope — mixing, laying, levelling and finishing the 1:3:5 slab across the uneven terrain.",
    total_labour_cost: "Total labour cost",
    grandtotal: "Master project budget · 610 m concrete scope",
    /* pledge */
    pledge_h3: "Pave a stretch of road",
    pledge_hint: "Choose how many linear meters to pledge. Each meter is LKR 8,878 of finished concrete.",
    pledge_name_label: "Your name — as it appears in the supporters list",
    pledge_name_ph: "e.g. The Perera Family",
    pledge_meters_label: "Linear meters to pledge",
    pledge_meters_suffix: "linear meters",
    aria_meters: "Number of linear meters to pledge",
    err_name: "Please add the name for the supporters list.",
    err_full: "The road is fully pledged — thank you!",
    pledge_cost_l: "{n} m × LKR 8,878",
    btn_full: "Road fully pledged 🙏",
    btn_pledge_these: "Pledge these {n} meters",
    note_open: "{n} m of road still open to pledge.",
    note_done: "Every meter has found a donor.",
    jp_h3: "Your stretch is reserved.",
    jp_hint: "You’ve pledged {n} linear meters. Complete your donation to lay the concrete — and join the supporters of this road.",
    jp_amount_l: "Amount to donate",
    btn_donate: "Donate {amount}",
    btn_pledge_another: "Pledge another stretch",
    jp_note: "Your name appears in the supporters list below once your stretch is pledged.",
    /* paver */
    paver_kicker: "Pave the Road",
    paver_title_a: "",
    paver_title_em: "Generosity",
    paver_title_b: ", set in concrete.",
    paver_lede: "Each pledge lays a real stretch of the 610-meter road. Watch it pave, meter by meter, as the community comes together. The rough gravel that remains is the work still to be done.",
    prog_kicker: "Road Progress",
    watch_a: "Watch the road ",
    watch_em: "roll out",
    watch_b: "",
    prog_big: "{n} of 610 m pledged · {pct}% complete",
    /* donors */
    donors_h4: "Those who have pledged",
    donors_count: "{n} supporters",
    donor_unit: "meters",
    /* budget */
    budget_kicker: "Transparency",
    budget_title_a: "Every rupee, ",
    budget_title_em: "accounted for",
    budget_title_b: ".",
    budget_lede: "This is a community offering. The budget below moves the moment a pledge is made — what has been pledged, and what is still needed to finish the 610 m of concrete road.",
    budget_pct_pledged: "{pct}% pledged",
    budget_goal: "Goal · ",
    budget_total_k: "Total project budget",
    budget_total_sub: "610 m · full 1:3:5 concrete scope",
    budget_pledged_k: "Pledged so far",
    budget_pledged_sub: "{n} m reserved by supporters",
    budget_remaining_k: "Still to be raised",
    budget_remaining_sub: "{n} m of road remaining",
    /* cta */
    cta_kicker: "An Act of Generosity",
    cta_h2_a: "Lay one meter of the path, ",
    cta_h2_em: "and walk it forever.",
    cta_h2_b: "",
    cta_lede: "Whether you pave a single meter or a hundred, every contribution carries practitioners quietly into the forest at Rideekanda. May your generosity bear fruit.",
    /* toast */
    toast_reserved: "{n} m reserved on the road — complete your donation below.",
    /* vroad */
    vleg_pledged: "Pledge to support",
    vleg_open: "To be paved",
    /* fab + modal */
    fab_title: "Road progress",
    fab_sub: "Tap to see the road",
    fab_aria: "View road progress",
    modal_kicker: "The Road So Far",
    modal_close_aria: "Close",
  },
  si: {
    /* hero */
    hero_kicker: "වන අරණට මාවතක්",
    hero_h1_a: "",
    hero_h1_em: "ආරණ්‍ය ප්‍රවේශ මාර්ගය",
    hero_h1_b: " කොන්ක්‍රීට් කිරීම",
    hero_lede: "කිලෝමීටර් 1.9ක් (මීටර් 1,890ක්) වූ රිදීකන්ද ආරණ්‍ය සේනාසනයේ ප්‍රවේශ මාර්ගයේ, මීටර් 610ක ඉතා අබලන් වූ කොටසක් කොන්ක්‍රීට් කොට සංවර්ධනය කිරීම. සැදැහැවත් ඔබ සැමට එක් මීටරය බැගින් හෝ දායක වීමට හැකියි.",
    btn_pledge_meter: "එක මීටරයක් සඳහා දායකත්වය",
    btn_learn: "ව්‍යාපෘතිය ගැන දැනගන්න",
    stat_fulllen: "සම්පූර්ණ දිග · 1,890 m",
    stat_concrete: "කොන්ක්‍රීට් කළ යුතු",
    stat_pledged: "මේ දක්වා පරිත්‍යාග",
    stat_oftheway: "ඉලක්කයෙන්",
    /* about */
    about_kicker: "ව්‍යාපෘතිය",
    about_title_a: "වනය හරහා ",
    about_title_em: "සුදුසු මගක්",
    about_title_b: ".",
    about_lede: "රිදීකන්ද ආරණ්‍ය සේනාසනයට ඇති එකම ප්‍රවේශය වන්නේ තාර නොකළ බොරළු මාර්ගයකි — දැඩි ලෙස අසමතල, වළවල් සහිත හා සාමාන්‍ය වාහනවලට යාමට අසීරුය. මෙම ව්‍යාපෘතිය මගින් කල් පවතින කොන්ක්‍රීට් මාර්ගයක් තනා, භික්ෂූන්, පැමිණෙන්නන් හා භාවනා කරන්නන්ට මෙම පුණ්‍ය භූමියට පහසුවෙන් හා සුරක්ෂිතව ළඟාවිය හැකි කරයි.",
    fact_purpose_k: "අරමුණ",
    fact_purpose_v: "භාවනා යෝගාවචරයන්ට හා සැපයුම් වාහනවලට සේනාසනයට විශ්වාසනීය මාර්ග ප්‍රවේශය.",
    fact_len_k: "සම්පූර්ණ දිග",
    fact_len_v: "වන මාර්ගයේ 1.9 km (1,890 m)",
    fact_critical_k: "තීරණාත්මක අදියර",
    fact_critical_v: "කොන්ක්‍රීට් මාර්ග අලුත්වැඩියාව මීටර් 610ක් — වඩාත්ම බෑවුම් සහිත හා හානි වූ කොටස.",
    fact_cond_k: "තත්ත්වය",
    fact_cond_v: "තාර නොකළ බොරළු, දැඩි අසමතලභාවය හා වළවල් — සාමාන්‍ය වාහනවලට ඉතා අසීරුයි.",
    fact_loc_k: "ස්ථානය",
    fact_loc_link: "Google සිතියමේ ස්ථානය බලන්න ↗",
    aside_quote: "“මාර්ගයක් යනු වාහන සඳහා පමණක් මගක් නොවේ — එය සොයන්නන් වෙත දහම ළඟාවන මගකි.”",
    aside_p1: "වසර ගණනාවක් තිස්සේ රිදීකන්දට යන ගමන සෑම අමුත්තෙකුම අසීරුතාවට පත් කර ඇත. වැසි කාලයේ බොරළු මඩ බවට පත් වේ; නියං කාලයේ වළවල් සෑම රෝදයක්ම කම්පා කරයි. වැඩිහිටි යෝගාවචරයන්ට හා පිණ්ඩපාතය වඩින අයට මෙම නැගීම අසීරු වී ඇත.",
    aside_p2: "තහවුරු කළ 1:3:5 ව්‍යූහාත්මක මිශ්‍රණයකින් තැනෙන මෙම කොන්ක්‍රීට් මාර්ගය දශක ගණනාවක් පවතිමින්, පරම්පරා ගණනාවක යෝගාවචරයන් නිහඬව වනය තුළට රැගෙන යනු ඇත.",
    callout_kicker: "තීරණාත්මක මීටර් 610",
    callout_h3_a: "මාර්ගයේ එක් මීටරයක්, ",
    callout_h3_em: "එක් පරිත්‍යාග ක්‍රියාවක්.",
    callout_h3_b: "",
    callout_p: "නිම කළ කොන්ක්‍රීට් රේඛීය මීටරයක් සඳහා වැය වන්නේ රු. 8,878කි. ඔබ කොපමණ මීටර් ගණනක් කොන්ක්‍රීට් කිරීමට කැමතිද යන්න තෝරන්න — මෙම මාර්ගය වනයට රැගෙන යන දායකයින් අතරට එක්වන්න.",
    /* tech */
    tech_kicker: "ඉංජිනේරු හා පිරිවැය",
    tech_title_a: "තහවුරු කළ ",
    tech_title_em: "1:3:5 මිශ්‍රණයකින්",
    tech_title_b: " තනා ඇත.",
    tech_lede: "සෑම රුපියලක්ම ව්‍යූහාත්මක ඉංජිනේරු ඇස්තමේන්තුවක් මත පදනම් වේ. සාමාන්‍ය ගමනාගමන බරට ආරක්ෂිතව ඔරොත්තු දීම සඳහා මිශ්‍රණය ස්ථායී 1:3:5 පරිමා අනුපාතයකට සංශෝධනය කරන ලදී.",
    spec1: "ව්‍යාපෘති විෂය පථය — කොන්ක්‍රීට් රේඛීය මීටර්",
    spec2: "හරස්කඩ — පළල × තහඩු ඝණකම",
    spec3: "සිමෙන්ති : වැලි : ගල් පරිමා අනුපාතය",
    spec4: "සම්පූර්ණ මීටර් 610 සඳහා සිමෙන්ති ප්‍රමාණය",
    mat_req_kicker: "මුළු ද්‍රව්‍ය අවශ්‍යතාව",
    mat_cement: "සිමෙන්ති", mat_cement_sub: "කිලෝ 50 සම්මත බෑග්",
    mat_sand: "ගංගා වැලි", mat_sand_sub: "සියුම් සමස්තය",
    mat_agg: "රළු සමස්තය", mat_agg_sub: "කුඩු කළ ගල්",
    unit_bags: "බෑග්", unit_cubes: "කියුබ්",
    total_mat_cost: "මුළු ද්‍රව්‍ය පිරිවැය",
    labour_kicker: "මුළු කම්කරු පිරිවැය",
    labour_note: "සම්පූර්ණ මීටර් 610 කොන්ක්‍රීට් වැඩ සඳහා සෘජු ස්ථානීය කම්කරු — අසමතල භූමියේ 1:3:5 තහඩුව මිශ්‍ර කිරීම, දැමීම, සමතල කිරීම හා නිම කිරීම.",
    total_labour_cost: "මුළු කම්කරු පිරිවැය",
    grandtotal: "ප්‍රධාන ව්‍යාපෘති අයවැය · මීටර් 610 කොන්ක්‍රීට්",
    /* pledge */
    pledge_h3: "මාර්ගයේ කොටසක් කොන්ක්‍රීට් කරන්න",
    pledge_hint: "පරිත්‍යාග කිරීමට රේඛීය මීටර් කීයක්දැයි තෝරන්න. එක් මීටරයක් නිම කළ කොන්ක්‍රීට් රු. 8,878කි.",
    pledge_name_label: "ඔබේ නම — දායක ලැයිස්තුවේ පෙනෙන පරිදි",
    pledge_name_ph: "උදා. පෙරේරා පවුල",
    pledge_meters_label: "පරිත්‍යාග කරන රේඛීය මීටර්",
    pledge_meters_suffix: "රේඛීය මීටර්",
    aria_meters: "පරිත්‍යාග කරන රේඛීය මීටර් ගණන",
    err_name: "කරුණාකර දායක ලැයිස්තුව සඳහා නම ඇතුළත් කරන්න.",
    err_full: "මාර්ගය සම්පූර්ණයෙන් පරිත්‍යාග වී ඇත — ස්තූතියි!",
    pledge_cost_l: "{n} m × රු. 8,878",
    btn_full: "මාර්ගය සම්පූර්ණයි 🙏",
    btn_pledge_these: "මෙම මීටර් {n} පරිත්‍යාග කරන්න",
    note_open: "තවමත් මීටර් {n}ක් පරිත්‍යාගයට විවෘතයි.",
    note_done: "සෑම මීටරයක්ම දායකයෙකු ලබා ඇත.",
    jp_h3: "ඔබේ කොටස වෙන් කර ඇත.",
    jp_hint: "ඔබ රේඛීය මීටර් {n}ක් පරිත්‍යාග කර ඇත. කොන්ක්‍රීට් දැමීමට ඔබේ පරිත්‍යාගය සම්පූර්ණ කර — මෙම මාර්ගයේ දායකයින් අතරට එක්වන්න.",
    jp_amount_l: "පරිත්‍යාග කළ යුතු මුදල",
    btn_donate: "පරිත්‍යාග කරන්න {amount}",
    btn_pledge_another: "තවත් කොටසක් පරිත්‍යාග කරන්න",
    jp_note: "ඔබේ කොටස පරිත්‍යාග කළ පසු, පහත දායක ලැයිස්තුවේ ඔබේ නම පෙනෙනු ඇත.",
    /* paver */
    paver_kicker: "මාර්ගය කොන්ක්‍රීට් කරමු",
    paver_title_a: "",
    paver_title_em: "පරිත්‍යාගශීලීත්වය",
    paver_title_b: " කොන්ක්‍රීට්හි සටහන් වේ.",
    paver_lede: "සෑම පරිත්‍යාගයක්ම මීටර් 610 මාර්ගයේ සැබෑ කොටසක් කොන්ක්‍රීට් කරයි. ප්‍රජාව එක්ව සිටින විට, මීටරයෙන් මීටරය එය කොන්ක්‍රීට් වනු බලන්න. ඉතිරිව ඇති රළු බොරළු තවමත් කළ යුතු වැඩයි.",
    prog_kicker: "මාර්ග ප්‍රගතිය",
    watch_a: "මාර්ගය ",
    watch_em: "දිගහැරෙනු",
    watch_b: " බලන්න",
    prog_big: "මීටර් 610න් {n}ක් පරිත්‍යාග · {pct}% සම්පූර්ණයි",
    /* donors */
    donors_h4: "පරිත්‍යාග කළ අය",
    donors_count: "දායකයින් {n}",
    donor_unit: "මීටර්",
    /* budget */
    budget_kicker: "විනිවිදභාවය",
    budget_title_a: "සෑම රුපියලක්ම, ",
    budget_title_em: "ගණන් දී ඇත",
    budget_title_b: ".",
    budget_lede: "මෙය ප්‍රජා පරිත්‍යාගයකි. පරිත්‍යාගයක් කළ සැණින් පහත අයවැය වෙනස් වේ — පරිත්‍යාග කර ඇති ප්‍රමාණය හා මීටර් 610 කොන්ක්‍රීට් මාර්ගය නිම කිරීමට තවමත් අවශ්‍ය ප්‍රමාණය.",
    budget_pct_pledged: "{pct}% පරිත්‍යාග",
    budget_goal: "ඉලක්කය · ",
    budget_total_k: "මුළු ව්‍යාපෘති අයවැය",
    budget_total_sub: "මීටර් 610 · සම්පූර්ණ 1:3:5 කොන්ක්‍රීට්",
    budget_pledged_k: "මේ දක්වා පරිත්‍යාග",
    budget_pledged_sub: "දායකයින් විසින් මීටර් {n}ක් වෙන් කර ඇත",
    budget_remaining_k: "තවම රැස් කළ යුතු",
    budget_remaining_sub: "මාර්ගයෙන් මීටර් {n}ක් ඉතිරියි",
    /* cta */
    cta_kicker: "පරිත්‍යාග ක්‍රියාවක්",
    cta_h2_a: "මාවතේ එක් මීටරයක් තනා, ",
    cta_h2_em: "සදහටම එහි ගමන් කරන්න.",
    cta_h2_b: "",
    cta_lede: "සැදැහැවත් ඔබගේ මෙම මාර්ගය සඳහා දායකත්වය, ඔබට ආර්ය මාර්ගය තුල ගමන් කිරීමට ශක්තිය ධෛර්ය ලැබේවා!",
    /* toast */
    toast_reserved: "මාර්ගයේ මීටර් {n}ක් වෙන් කරන ලදී — පහතින් ඔබේ පරිත්‍යාගය සම්පූර්ණ කරන්න.",
    /* vroad */
    vleg_pledged: "පරිත්‍යාග කළ",
    vleg_open: "කොන්ක්‍රීට් කළ යුතු",
    /* fab + modal */
    fab_title: "මාර්ග ප්‍රගතිය",
    fab_sub: "මාර්ගය බැලීමට tap කරන්න",
    fab_aria: "මාර්ග ප්‍රගතිය බලන්න",
    modal_kicker: "මේ දක්වා මාර්ගය",
    modal_close_aria: "වසන්න",
  },
};

function makeT(lang) {
  const dict = STR[lang] || STR.en;
  return function (key, vars) {
    let s = dict[key] != null ? dict[key] : (STR.en[key] != null ? STR.en[key] : key);
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  };
}
const LangContext = createContext({ lang: "en", t: makeT("en"), setLang: function () {} });
function useT() { return useContext(LangContext); }
// Heading with a highlighted middle segment, assembled from 3 translated parts.
function Em({ k, t, cls, italic }) {
  const style = italic ? { fontStyle: "italic" } : undefined;
  return (
    <React.Fragment>
      {t(k + "_a")}
      <span className={cls || undefined} style={style}>{t(k + "_em")}</span>
      {t(k + "_b")}
    </React.Fragment>
  );
}

/* ----------------------------- Project data ----------------------------- */
const PROJECT = {
  totalFeet: 610,
  costPerFoot: 8878,            // LKR per linear metre
  totalBudget: 5412000,        // LKR (610 m × 8,878)
  fullLengthKm: 1.9,
  fullLengthFt: 1890,          // 1.9 km ≈ 1,890 m (full road length)
  width: 2.4,                  // m
  thickness: 100,              // mm
  mapUrl: "https://maps.app.goo.gl/ZbSeubxqA7pg2tbQ6",
};

// Where the "Donate" button sends supporters — the site's donate page.
const DONATE_URL = "../../donate/";

// Material requirement for the 610 m concrete scope (1:3:5 mix); text via i18n keys.
const MATERIALS = [
  { key: "cement", qty: "880", unit: "unit_bags" },
  { key: "sand", qty: "32", unit: "unit_cubes" },
  { key: "agg", qty: "56", unit: "unit_cubes" },
];
const MATERIAL_COST = 3812000;   // LKR — total materials across 610 m
const LABOUR_COST = 1600000;     // LKR — total direct on-site labour


/* ----------------------------- Formatting ------------------------------- */
const fmt = (n) => Math.round(n).toLocaleString("en-US");
const LKR = ({ children }) => (<span><span className="lkr">LKR</span> {children}</span>);

/* ----------------------------- Icons ------------------------------------ */
function Lotus({ className }) {
  // Shared Rideekanda brand lotus (matches the rest of the site).
  return <img className={"lotus " + (className || "")} src="/assets/lotus-logo.png" alt="Rideekanda Forest Monastery" />;
}
function Ico({ d, className, style }) {
  return (<svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>);
}
const ICONS = {
  ruler: "M3 9l3-3 12 12-3 3zM9 6l1.5 1.5M12 9l1.5 1.5M15 12l1.5 1.5",
  width: "M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  mix: "M5 22V8l7-5 7 5v14M5 12h14M9 22v-6h6v6",
  pin: "M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z M12 10a0 0 0 100 0",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  heart: "M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 000-7.8z",
};

/* ----------------------------- NAV (unused; eco-header replaces it) ------ */
function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a className="brand" href="#top">
          <Lotus className="brand__mark" />
          <span className="brand__txt">
            <span className="brand__name">Rideekanda</span>
            <span className="brand__sub">Forest Monastery</span>
          </span>
        </a>
        <nav className="nav__links">
          <a href="#about">The Project</a>
          <a href="#specs">Engineering</a>
          <a href="#road">Pave the Road</a>
          <a href="#budget">Budget</a>
          <a className="btn btn--saffron nav__cta" href="#road">Pledge a Foot</a>
        </nav>
      </div>
    </header>
  );
}

/* ----------------------------- HERO ------------------------------------- */
function Hero({ stats }) {
  const { t } = useT();
  return (
    <section className="hero" id="top">
      <div className="wrap hero__inner center">
        <div className="hero__lotus"><Lotus /></div>
        <p className="kicker kicker--center">{t("hero_kicker")}</p>
        <h1><Em k="hero_h1" t={t} cls="h-em" /></h1>
        <p className="hero__lede">{t("hero_lede")}</p>
        <div className="hero__cta">
          <a className="btn btn--saffron" href="#road">{t("btn_pledge_meter")} <Ico d={ICONS.arrow} className="btn__ico" style={{width:18,height:18}}/></a>
          <a className="btn btn--ghost" href="#about">{t("btn_learn")}</a>
        </div>
        <div className="hero__stats">
          <div className="hero__stat"><div className="num">1.9<small style={{fontSize:18}}>km</small></div><div className="lbl">{t("stat_fulllen")}</div></div>
          <div className="hero__stat"><div className="num">610<small style={{fontSize:18}}>m</small></div><div className="lbl">{t("stat_concrete")}</div></div>
          <div className="hero__stat"><div className="num">{stats.pavedFeet}<small style={{fontSize:18}}>m</small></div><div className="lbl">{t("stat_pledged")}</div></div>
          <div className="hero__stat"><div className="num">{stats.pct}<small style={{fontSize:18}}>%</small></div><div className="lbl">{t("stat_oftheway")}</div></div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- ABOUT ------------------------------------ */
function About() {
  const { t } = useT();
  return (
    <section className="section about" id="about">
      <div className="wrap about__grid">
        <div>
          <p className="kicker">{t("about_kicker")}</p>
          <h2 className="title"><Em k="about_title" t={t} cls="h-em" /></h2>
          <p className="lede" style={{marginBottom: 30}}>{t("about_lede")}</p>
          <div className="factsheet">
            <div className="fact"><div className="fact__k">{t("fact_purpose_k")}</div><div className="fact__v">{t("fact_purpose_v")}</div></div>
            <div className="fact"><div className="fact__k">{t("fact_len_k")}</div><div className="fact__v">{t("fact_len_v")}</div></div>
            <div className="fact"><div className="fact__k">{t("fact_critical_k")}</div><div className="fact__v">{t("fact_critical_v")}</div></div>
            <div className="fact"><div className="fact__k">{t("fact_cond_k")}</div><div className="fact__v">{t("fact_cond_v")}</div></div>
            <div className="fact"><div className="fact__k">{t("fact_loc_k")}</div><div className="fact__v"><a href={PROJECT.mapUrl} target="_blank" rel="noopener">{t("fact_loc_link")}</a></div></div>
          </div>
        </div>
        <aside className="about__aside">
          <p style={{fontFamily:"var(--display)", fontSize:24, color:"var(--ink)", lineHeight:1.4, fontStyle:"italic"}}>{t("aside_quote")}</p>
          <p>{t("aside_p1")}</p>
          <p>{t("aside_p2")}</p>
          <div className="callout">
            <p className="kicker">{t("callout_kicker")}</p>
            <h3><Em k="callout_h3" t={t} italic /></h3>
            <p>{t("callout_p")}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ----------------------------- TECH SPECS ------------------------------- */
function Tech() {
  const { t } = useT();
  return (
    <section className="section tech" id="specs">
      <div className="wrap">
        <div className="center" style={{maxWidth:720, margin:"0 auto 8px"}}>
          <p className="kicker kicker--center">{t("tech_kicker")}</p>
        </div>

        <div className="spec-cards" style={{marginTop:48}}>
          <div className="spec"><Ico d={ICONS.ruler} className="spec__ico"/><div className="spec__v">610<small> m</small></div><div className="spec__k">{t("spec1")}</div></div>
          <div className="spec"><Ico d={ICONS.width} className="spec__ico"/><div className="spec__v">2.4<small> m</small> × 100<small> mm</small></div><div className="spec__k">{t("spec2")}</div></div>
          <div className="spec"><Ico d={ICONS.mix} className="spec__ico"/><div className="spec__v">1 : 3 : 5</div><div className="spec__k">{t("spec3")}</div></div>
          <div className="spec"><Ico d={ICONS.layers} className="spec__ico"/><div className="spec__v">880<small> {t("unit_bags")}</small></div><div className="spec__k">{t("spec4")}</div></div>
        </div>

        <div className="totals">
          <div className="totals__card">
            <p className="kicker">{t("mat_req_kicker")}</p>
            <ul className="mreq">
              {MATERIALS.map((m,i)=>(
                <li key={i}>
                  <span className="mreq__mat">{t("mat_" + m.key)}<small>{t("mat_" + m.key + "_sub")}</small></span>
                  <b className="mreq__qty">{m.qty}<small> {t(m.unit)}</small></b>
                </li>
              ))}
            </ul>
            <div className="totals__sum"><span>{t("total_mat_cost")}</span><b><LKR>{fmt(MATERIAL_COST)}</LKR></b></div>
          </div>
          <div className="totals__card">
            <p className="kicker">{t("labour_kicker")}</p>
            <p className="totals__note">{t("labour_note")}</p>
            <div className="totals__sum"><span>{t("total_labour_cost")}</span><b><LKR>{fmt(LABOUR_COST)}</LKR></b></div>
          </div>
        </div>
        <div className="grandtotal">
          <span>{t("grandtotal")}</span>
          <b><LKR>{fmt(PROJECT.totalBudget)}</LKR></b>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  React, useState, useEffect, useRef, useMemo, useContext, createContext,
  STR, makeT, LangContext, useT, Em,
  PROJECT, DONATE_URL, MATERIALS, MATERIAL_COST, LABOUR_COST, fmt, LKR, Lotus, Ico, ICONS, Nav, Hero, About, Tech,
});

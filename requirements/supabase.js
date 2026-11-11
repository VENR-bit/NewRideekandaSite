// Supabase client configuration
const SUPABASE_URL = "https://megebtfqaovaciovrzyb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZ2VidGZxYW92YWNpb3ZyenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzMwMjEsImV4cCI6MjA4OTUwOTAyMX0.HTIS6kM0XOfhbaor8kfybTHc-YbYB3BYRiCoJd-YHSU";

window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function dbToItem(row) {
  return {
    id: row.id,
    en: row.en || "",
    si: row.si || "",
    desc: row.description || "",
    price: row.price || 0,
    qty: row.qty || 1,
    pledged: row.pledged || 0,
    category: row.category || "",
    priority: row.priority || "routine",
    icon: row.icon || "bowl",
    photo: row.photo || "",
    addedDays: daysSince(row.added_at),
  };
}

function itemToDb(item) {
  const row = {
    en: item.en,
    si: item.si || "",
    description: item.desc || "",
    price: item.price || 0,
    qty: item.qty || 1,
    pledged: item.pledged || 0,
    category: item.category || null,
    priority: item.priority || "routine",
    icon: item.icon || "bowl",
    photo: item.photo || "",
  };
  return row;
}

async function sbFetchItems() {
  const { data, error } = await window.sbClient
    .from("items")
    .select("*")
    .order("id", { ascending: true });
  if (error) { console.error("sbFetchItems:", error); return []; }
  return data.map(dbToItem);
}

// ── Writes go through database functions, never straight at the tables ──
// The anon key below is in every visitor's browser, so anything the key may
// do, anyone may do. It can now only read `items`; each write is a function
// that validates server-side, and the admin ones demand a passcode checked
// in the database rather than in this file.

// The admin passcode, typed by whoever is using the admin page. Held for the
// tab's lifetime only — never written to the source, never to localStorage.
let adminCode = null;
function sbSetAdminCode(code) { adminCode = code; }
async function sbCheckAdminCode(code) {
  const { data, error } = await window.sbClient.rpc("admin_ok", { p_code: code });
  if (error) { console.error("admin_ok:", error.message); return false; }
  return data === true;
}

async function sbInsertItem(item) {
  const patch = itemToDb(item);
  const { data, error } = await window.sbClient
    .rpc("admin_insert_item", { p_code: adminCode, p_patch: patch });
  if (error) { console.error("sbInsertItem:", error.message); return null; }
  return data && data[0] ? dbToItem(data[0]) : null;
}

async function sbUpdateItem(id, updates) {
  const patch = {};
  if (updates.en !== undefined)       patch.en = updates.en;
  if (updates.si !== undefined)       patch.si = updates.si;
  if (updates.desc !== undefined)     patch.description = updates.desc;
  if (updates.price !== undefined)    patch.price = updates.price;
  if (updates.qty !== undefined)      patch.qty = updates.qty;
  if (updates.pledged !== undefined)  patch.pledged = updates.pledged;
  if (updates.category !== undefined) patch.category = updates.category || null;
  if (updates.priority !== undefined) patch.priority = updates.priority;
  if (updates.icon !== undefined)     patch.icon = updates.icon;
  if (updates.photo !== undefined)    patch.photo = updates.photo;
  const { data, error } = await window.sbClient
    .rpc("admin_update_item", { p_code: adminCode, p_id: id, p_patch: patch });
  if (error) { console.error("sbUpdateItem:", error.message); return null; }
  return data && data[0] ? dbToItem(data[0]) : null;
}

async function sbDeleteItem(id) {
  const { data, error } = await window.sbClient
    .rpc("admin_delete_item", { p_code: adminCode, p_id: id });
  if (error) { console.error("sbDeleteItem:", error.message); return false; }
  return data === true;
}

// One call: records the pledge AND moves the item's total, with the quantity
// clamped to what is actually left. The browser no longer needs permission to
// touch either table.
async function sbInsertPledge(itemId, name, qty) {
  const { data, error } = await window.sbClient
    .rpc("make_pledge", { p_item_id: itemId, p_name: name || "Anonymous", p_qty: qty });
  if (error) { console.error("sbInsertPledge:", error.message); return null; }
  return data;            // the item's new pledged total
}

window.sbFetchItems = sbFetchItems;
window.sbInsertItem = sbInsertItem;
window.sbUpdateItem = sbUpdateItem;
window.sbDeleteItem = sbDeleteItem;
window.sbInsertPledge = sbInsertPledge;
window.sbSetAdminCode = sbSetAdminCode;
window.sbCheckAdminCode = sbCheckAdminCode;

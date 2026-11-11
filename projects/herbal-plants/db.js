/* ──────────────────────────────────────────────────────────────
   Rideekanda — Herbal Plant Planting Programme
   Supabase access layer, shared by the public page and the admin page.

   The schema lives in supabase-setup.sql. Reads go through the
   plant_pledges_public view (which omits the private token); photo
   uploads go through the attach_plant_photo() function, which checks
   the token server-side.
   ────────────────────────────────────────────────────────────── */
(function () {
  var SUPABASE_URL = "https://megebtfqaovaciovrzyb.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZ2VidGZxYW92YWNpb3ZyenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzMwMjEsImV4cCI6MjA4OTUwOTAyMX0.HTIS6kM0XOfhbaor8kfybTHc-YbYB3BYRiCoJd-YHSU";
  var BUCKET = "plant-photos";

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // True once we know the tables exist; the page degrades politely if the
  // SQL setup hasn't been run yet rather than throwing at every click.
  var ready = null;

  function fetchPledges() {
    return sb.from("plant_pledges_public")
      .select("*")
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.error) { ready = false; console.error("fetchPledges:", res.error.message); return null; }
        ready = true;
        return res.data || [];
      });
  }

  // Writes go through a security-definer function: the anon role has no
  // rights on the table itself, so the caller gets back only its own token
  // and nobody can read anyone else's.
  function createPledge(p) {
    return sb.rpc("create_plant_pledge", {
      p_plant_no: p.no || null,
      p_plant_list: p.list,
      p_sinhala: p.sinhala || null,
      p_sinhala_script: p.script || null,
      p_english: p.english || null,
      p_scientific: p.scientific,
      p_name: p.name,
      p_contact: p.contact || null,
      p_qty: p.qty || 1,
      p_note: p.note || null
    }).then(function (res) {
      if (res.error) {
        console.error("createPledge:", res.error.message);
        // The unique index fired — someone claimed this plant first.
        if ((res.error.message || "").indexOf("ALREADY_CLAIMED") !== -1) return { claimed: true };
        return null;
      }
      return { token: res.data };
    });
  }

  // Upload the photo under a RANDOM name, then let the DB verify the token
  // and link the two. The token travels in the request body, never in the
  // public URL — a photo URL must not leak the key to its own pledge.
  function putFile(file) {
    var ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["jpg", "jpeg", "png", "webp", "heic"].indexOf(ext) === -1) ext = "jpg";
    var rand = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : (Date.now().toString(36) + Math.random().toString(36).slice(2, 12));
    var path = "pledges/" + rand + "." + ext;
    return sb.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type || "image/jpeg" })
      .then(function (res) {
        if (res.error) throw new Error(res.error.message);
        return path;
      });
  }

  // Older private ?claim=<token> links still work.
  function uploadPhoto(token, file) {
    return putFile(file).then(function (path) {
      return sb.rpc("attach_plant_photo", { p_token: token, p_path: path });
    }).then(function (res) {
      if (res.error) throw new Error(res.error.message);
      if (res.data !== true) throw new Error("That link is not valid. Please check you copied all of it.");
      return true;
    });
  }

  // Upload straight from the plant's tile. No token: the pledger returns to
  // the page and presses Upload. The photo still lands as 'pending', so a
  // monk sees it before anyone else does.
  function uploadPhotoForPledge(id, file) {
    return putFile(file).then(function (path) {
      return sb.rpc("attach_plant_photo_by_id", { p_id: id, p_path: path });
    }).then(function (res) {
      if (res.error) throw new Error(res.error.message);
      if (res.data !== true) throw new Error("NOT_ATTACHED");
      return true;
    });
  }

  function publicUrl(path) {
    if (!path) return "";
    return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  // Admin: change a submitted photo's moderation state.
  function setPhotoStatus(id, status) {
    return sb.rpc("set_plant_photo_status", { p_id: id, p_status: status })
      .then(function (res) {
        if (res.error) { console.error("setPhotoStatus:", res.error.message); return false; }
        return res.data === true;
      });
  }

  window.RK_PLANTS_DB = {
    fetchPledges: fetchPledges,
    createPledge: createPledge,
    uploadPhoto: uploadPhoto,
    uploadPhotoForPledge: uploadPhotoForPledge,
    publicUrl: publicUrl,
    setPhotoStatus: setPhotoStatus,
    isReady: function () { return ready; }
  };
})();

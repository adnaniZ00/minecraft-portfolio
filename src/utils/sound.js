// Sound manager for playing Minecraft effects across components
const SOUND_PATHS = {
  walking: [
    "/audio/walking/grass1.ogg",
    "/audio/walking/grass2.ogg",
    "/audio/walking/grass3.ogg",
    "/audio/walking/grass4.ogg",
    "/audio/walking/grass5.ogg",
    "/audio/walking/grass6.ogg",
  ],
  button: "/audio/button.mp3",
  chest: "/audio/minecraft_chest.mp3",
  skeleton: "/audio/minecraft_skeleton.mp3",
  pig: "/audio/pig.mp3",
  enchant: "/audio/enchantment_book/minecraft_enchant.mp3",
  portal: "/audio/portal/portal.ogg",
  portalTrigger: "/audio/portal/trigger.ogg",
  portalTravel: "/audio/portal/travel.ogg",
  zombie: [
    "/audio/zombie/say1.ogg",
    "/audio/zombie/say2.ogg",
    "/audio/zombie/say3.ogg",
  ],
};

// Cache loaded HTMLAudioElements so sound plays instantaneously with no lag
const audioPool = {};

function getAudio(url) {
  if (!audioPool[url]) {
    audioPool[url] = [];
  }
  // Find an audio instance that is paused or finished
  let inst = audioPool[url].find((a) => a.paused || a.ended);
  if (!inst) {
    inst = new Audio(url);
    audioPool[url].push(inst);
  }
  return inst;
}

export function playSound(name, options = {}) {
  try {
    const { volume = 0.5, playbackRate = 1.0 } = options;
    let url;

    if (Array.isArray(SOUND_PATHS[name])) {
      const list = SOUND_PATHS[name];
      url = list[Math.floor(Math.random() * list.length)];
    } else {
      url = SOUND_PATHS[name];
    }

    if (!url) return null;

    const audio = getAudio(url);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.playbackRate = playbackRate;
    audio.currentTime = 0;
    
    // Play with catch to ignore browser autoplay policy restrictions prior to user gesture
    audio.play().catch(() => {});
    return audio;
  } catch {
    // Graceful fallback
    return null;
  }
}

// Random step sound helper for Steve
export function playStepSound(volume = 0.35) {
  // Slight pitch variation like Minecraft
  const pitch = 0.9 + Math.random() * 0.2;
  return playSound("walking", { volume, playbackRate: pitch });
}

// Jump / landing step sound
export function playJumpSound(volume = 0.5) {
  const pitch = 0.85 + Math.random() * 0.15;
  return playSound("walking", { volume, playbackRate: pitch });
}

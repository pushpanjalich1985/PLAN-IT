import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface Track {
  name: string;
  emoji: string;
  src: string;
}

const tracks: Track[] = [
  { name: "Binaural Focus (40Hz)", emoji: "🧠", src: "/music/binaural-beats-40hz.mp3" },
  { name: "Binaural Deep Focus (14Hz)", emoji: "🎯", src: "/music/Deepfocus.mpeg" },
  { name: "White Noise", emoji: "⚪", src: "/music/01-White-Noise-10min.mp3" },
  { name: "Pink Noise", emoji: "🩷", src: "/music/Pink.mpeg" },
  { name: "Brown Noise", emoji: "🟤", src: "/music/Brown noise.mp3" },
  { name: "Rain Ambience", emoji: "🌧️", src: "/music/Rain Ambience.mp3" },
  { name: "Ocean Waves", emoji: "🌊", src: "/music/Ocean waves.mp3" },
  { name: "Forest Birds", emoji: "🌲", src: "/music/Forest birds.mp3" },
];


const MusicSection = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
   if(audioRef.current){
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
   }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);


    const playTrack = async (index: number) => {
    if (playingIndex === index) {
      stopAudio();
      setPlayingIndex(null);
      return;
    }

    stopAudio();

    const audio = new Audio(tracks[index].src);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;

    try {
      await audio.play(); // 👈 IMPORTANT
      audioRef.current = audio;
      setPlayingIndex(index);
    } catch (err) {
      console.error("Audio play blocked:", err);
    }
  };
return (
    <div className="animate-slide-in space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Study Music 🎵
      </h2>
      <p className="text-sm text-muted-foreground">
        Focus-enhancing sounds to boost your concentration
      </p>

      {/* Volume Control */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-primary h-1.5"
        />

        <span className="text-xs text-muted-foreground w-10 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Track List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tracks.map((track, i) => (
          <button
            key={i}
            onClick={() => playTrack(i)}
            className={`glass-card rounded-xl p-4 flex items-center gap-3 text-left hover:scale-[1.02] transition-all duration-200 ${
              playingIndex === i ? "ring-2 ring-primary shadow-glow" : ""
            }`}
          >
            <span className="text-2xl">{track.emoji}</span>

            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">
                {track.name}
              </p>
              <p className="text-xs text-muted-foreground">Audio Track</p>
            </div>

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                playingIndex === i
                  ? "gradient-primary"
                  : "bg-muted"
              }`}
            >
              {playingIndex === i ? (
                <Pause size={14} className="text-primary-foreground" />
              ) : (
                <Play size={14} className="text-muted-foreground ml-0.5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicSection;

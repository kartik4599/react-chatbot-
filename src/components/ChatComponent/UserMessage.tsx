import { AudioLines, PlayCircle, StopCircle } from "lucide-react/icons";
import { useEffect, useRef, useState } from "react";

const UserMessage = ({
  content,
  type,
  file,
}: {
  content: string;
  type: "text" | "audio";
  file?: string;
}) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async () => {
    if (!audioRef.current) return;
    setPlaying(true);
    await audioRef.current?.play();
    audioRef.current.onpause = () => {
      setPlaying(false);
    };
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  useEffect(() => {
    if (type !== "audio" || !file) return;
    audioRef.current = new Audio(file);
  }, [type, file]);

  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] rounded-t-3xl rounded-bl-3xl p-3 bg-gradient-to-r from-[#00CDAC] from-50% to-[#02AABD] text-white">
        {type === "text" && content}
        {type === "audio" && (
          <div className="flex items-center justify-end">
            {playing ? (
              <StopCircle
                className="mr-3 cursor-pointer"
                onClick={pauseAudio}
                size={25}
              />
            ) : (
              <PlayCircle
                className="mr-3 cursor-pointer"
                onClick={playAudio}
                size={25}
              />
            )}
            <AudioLines />
            <AudioLines />
            <AudioLines />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessage;

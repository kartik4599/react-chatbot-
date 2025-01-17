import { Mic, Mic2Icon, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader?.result as string);
    reader.readAsDataURL(blob);
  });
}

const AudioRecord = ({
  audioHandler,
}: {
  audioHandler: (url: string, prompt: string) => void;
}) => {
  // states
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStart, setRecordingStart] = useState(false);
  const [secounds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordRef = useRef<MediaRecorder | null>(null);
  const chuckRef = useRef<Blob[]>([]);

  // functions
  const getPermissionandStream = async (open: boolean) => {
    setOpen(open);
    if (!open) {
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
    } catch (e) {
      console.log(e);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    console.log("start recording");
    setSeconds(0);
    setRecordingStart(true);

    recordRef.current = new MediaRecorder(stream);
    recordRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chuckRef.current.push(e.data);
    };
    recordRef.current.onstop = () => {
      const recordBlob = new Blob(chuckRef.current, { type: "audio/mp3" });
      chuckRef.current = [];
      if (recordBlob.size > 1) getTranscript(recordBlob);
    };
    recordRef.current.start();
  };

  const stopRecording = async () => {
    if (!stream) return;
    console.log("stop recording");
    setRecordingStart(false);
    if (recordRef?.current?.state === "recording") recordRef.current.stop();
  };

  const getTranscript = async (recordBlob: Blob) => {
    try {
      setLoading(true);
      console.log(recordBlob);
      const url = await blobToBase64(recordBlob);
      const {
        data: { output },
      } = await axios.post("http://localhost:4999/audio", {
        data: url.split(",")[1],
      });
      getPermissionandStream(false);
      audioHandler(url, output);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // side-effects
  useEffect(() => {
    if (recordingStart) {
      intervalRef.current = setInterval(() => {
        setSeconds((pre) => pre + 1);
      }, 1000);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [recordingStart]);

  // variables
  const min = useMemo(
    () =>
      Math.floor(secounds / 60)
        .toString()
        .padStart(2, "0"),
    [secounds]
  );
  const sec = useMemo(
    () => (secounds % 60).toString().padStart(2, "0"),
    [secounds]
  );

  return (
    <Dialog onOpenChange={getPermissionandStream} open={open}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="rounded-full border-green-500"
          variant={"outline"}
        >
          <Mic2Icon className=" text-green-500 font-bold" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Talk with Mind AI</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col justify-center items-center space-y-4">
          <div
            className={cn(
              "bg-red-500 p-5 rounded-full text-white cursor-pointer shadow-lg",
              recordingStart && "bg-green-500"
            )}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
          >
            {loading ? (
              <LoaderCircle size={50} className="animate-spin" />
            ) : (
              <Mic size={50} />
            )}
          </div>
          {stream && (
            <>
              <p>
                {loading ? "Loading" : recordingStart ? "Recording" : "Record"}
              </p>
              <div className="text-2xl">
                {min}:{sec}
              </div>
              <p>Hold The Mic To Speak</p>
            </>
          )}
          {!stream && <p>Allow Permission To Speak</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioRecord;

import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import ModelMessage from "./ModelMessage";
import UserMessage from "./UserMessage";
import Loading from "./Loading";
import axios from "axios";
import Welcome from "./Welcome";
import AudioRecord from "./AudioRecord";

const MindAIChat = () => {
  const [chats, setChats] = useState<
    {
      id: string;
      role: string;
      content: string;
      type: "text" | "audio";
      file?: string;
    }[]
  >([]);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    try {
      setIsLoading(true);
      const history = chats.map(({ role, content }) => ({ role, content }));
      const prompt = value;
      setChats((previousChat) => [
        ...previousChat,
        {
          id: previousChat.length.toString(),
          role: "user",
          content: value,
          type: "text",
        },
      ]);
      setValue("");
      const { data } = await axios.post("http://localhost:4999/chat", {
        history,
        prompt,
      });

      setChats((previousChat) => [
        ...previousChat,
        {
          id: (previousChat.length + 1).toString(),
          role: "model",
          content: data?.response,
          type: "text",
        },
      ]);
    } catch (e) {
      console.log("[Error]", e);
    } finally {
      setIsLoading(false);
    }
  };

  const initSubmit = async (prompt: string) => {
    try {
      setIsLoading(true);
      setChats([
        {
          id: chats.length.toString(),
          role: "user",
          content: prompt,
          type: "text",
        },
      ]);
      const { data } = await axios.post("http://localhost:5000/chat", {
        history: [],
        prompt,
      });

      setChats((previousChat) => [
        ...previousChat,
        {
          id: chats.length.toString(),
          role: "model",
          content: data?.response,
          type: "text",
        },
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const audioHandler = async (url: string, prompt: string) => {
    try {
      if (!prompt) return;
      setIsLoading(true);
      const history = chats.map(({ role, content }) => ({ role, content }));
      setChats((previousChat) => [
        ...previousChat,
        {
          id: previousChat.length.toString(),
          role: "user",
          content: prompt,
          type: "audio",
          file: url,
        },
      ]);

      const { data } = await axios.post("http://localhost:4999/chat", {
        history,
        prompt,
      });

      setChats((previousChat) => [
        ...previousChat,
        {
          id: (previousChat.length + 1).toString(),
          role: "model",
          content: data?.response,
          type: "text",
        },
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatRef?.current?.scrollTo({
      left: 0,
      top: chatRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [isLoading, chatRef?.current]);

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-xl">
      <CardHeader className="flex justify-center items-start">
        <CardTitle className="text-4xl text-transparent bg-clip-text font-mono font-extrabold bg-gradient-to-r from-green-500 to-indigo-400">
          Mind AI ...
        </CardTitle>
      </CardHeader>
      <div className="h-px bg-border" />
      <CardContent
        ref={chatRef}
        className="h-[60vh] overflow-y-auto p-4 space-y-4 my-2"
      >
        {!chats.length && <Welcome submit={initSubmit} />}
        {chats.map((message) =>
          message.role === "user" ? (
            <UserMessage
              content={message.content}
              key={message.id}
              type={message.type}
              file={message.file}
            />
          ) : (
            <ModelMessage content={message.content} key={message.id} />
          )
        )}
        {isLoading && <Loading />}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            autoFocus
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            placeholder="Type your message..."
            className="flex-grow rounded-full"
          />
          <Button type="submit" className="rounded-full">
            Send
          </Button>
          <AudioRecord audioHandler={audioHandler} />
        </form>
      </CardFooter>
    </Card>
  );
};

export default MindAIChat;

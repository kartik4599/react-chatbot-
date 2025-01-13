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

const MindAIChat = () => {
  const [chats, setChats] = useState<
    {
      id: string;
      role: string;
      content: string;
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
      const history = [...chats];
      const prompt = value;
      setChats((previousChat) => [
        ...previousChat,
        {
          id: chats.length.toString(),
          role: "user",
          content: value,
        },
      ]);
      setValue("");
      const { data } = await axios.post("http://localhost:5000/chat", {
        history,
        prompt,
      });

      setChats((previousChat) => [
        ...previousChat,
        {
          id: (previousChat.length + 1).toString(),
          role: "model",
          content: data?.response,
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
        },
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatRef?.current?.scrollTo(0, chatRef?.current?.scrollHeight);
  }, [isLoading, chatRef?.current]);

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-start text-3xl font-extrabold">
          Mind AI
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
            <UserMessage content={message.content} key={message.id} />
          ) : (
            <ModelMessage content={message.content} key={message.id} />
          )
        )}
        {isLoading && <Loading />}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            placeholder="Type your message..."
            className="flex-grow rounded-full"
          />
          <Button type="submit" className="rounded-full">
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default MindAIChat;

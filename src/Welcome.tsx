import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";

const promptOptions = [
  "Apply for leave",
  "See leave balance",
  "Apply for WFH",
  "Get my last pay slip",
  "Request IT support",
  "Book a meeting room",
];

const Welcome = ({ submit }: { submit: (prompt: string) => Promise<void> }) => {
  return (
    <Card className="border-none">
      <CardHeader className="flex flex-col justify-center items-center space-y-4">
        <CardTitle className="text-4xl text-transparent bg-clip-text font-mono font-extrabold bg-gradient-to-r from-green-500 to-indigo-400">
          Mind AI
        </CardTitle>
        <CardDescription className="text-center text-xl /80">
          Your AI-powered HR assistant. How can I help you today?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {promptOptions.map((prompt, index) => (
          <Button
            key={index}
            onClick={submit.bind(null, prompt)}
            variant="secondary"
            className="h-auto shadow-xl rounded-t-full rounded-bl-full border-2 py-4 px-6 text-left bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            {prompt}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default Welcome;

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
    <Card className="bg-white/10 backdrop-blur-md border-none">
      <CardHeader className="space-y-4">
        <CardTitle className="text-center text-4xl font-bold ">
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
            className="h-auto shadow-xl rounded-xl border-2 py-4 px-6 text-left bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            {prompt}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default Welcome;

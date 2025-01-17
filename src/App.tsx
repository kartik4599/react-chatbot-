import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import MindAIChat from "./components/ChatComponent/MindAIChat";
import Form from "./components/FormComponent/Form";

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Switch
        checked={showForm}
        className="shadow-xl absolute top-4 right-4"
        onCheckedChange={setShowForm}
      />
      <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-2">
        {showForm ? <Form /> : <MindAIChat />}
      </main>
    </>
  );
}

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import Index from "./pages/Index";
import ThoughtDump from "./pages/ThoughtDump";
import RootCause from "./pages/RootCause";
import SavedEntries from "./pages/SavedEntries";
import Todo from "./pages/Todo";
import NotFound from "./pages/NotFound";
import { useMoodCheckIn } from "./hooks/useMoodCheckIn";
import MoodCheckInOverlay from "./components/mood/MoodCheckInOverlay";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showMoodCheckIn, closeMoodCheckIn } = useMoodCheckIn();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/thought-dump" element={<ThoughtDump />} />
        <Route path="/root-cause" element={<RootCause />} />
        <Route path="/saved-entries" element={<SavedEntries />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showMoodCheckIn && <MoodCheckInOverlay onClose={closeMoodCheckIn} />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

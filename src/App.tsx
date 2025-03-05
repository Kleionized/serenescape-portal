
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import Index from "./pages/Index";
import Distraction from "./pages/Distraction";
import ThoughtDump from "./pages/ThoughtDump";
import RootCause from "./pages/RootCause";
import SavedEntries from "./pages/SavedEntries";
import Todo from "./pages/Todo";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/distraction" element={<Distraction />} />
          <Route path="/thought-dump" element={<ThoughtDump />} />
          <Route path="/root-cause" element={<RootCause />} />
          <Route path="/saved-entries" element={<SavedEntries />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn as ClerkSignIn, SignUp as ClerkSignUp } from "@clerk/clerk-react";
import NavBar from "./components/layout/NavBar";
import Index from "./pages/Index";
import Distraction from "./pages/Distraction";
import ThoughtDump from "./pages/ThoughtDump";
import RootCause from "./pages/RootCause";
import SavedEntries from "./pages/SavedEntries";
import Todo from "./pages/Todo";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import { useMoodCheckIn } from "./hooks/useMoodCheckIn";
import MoodCheckInOverlay from "./components/mood/MoodCheckInOverlay";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

const AppContent = () => {
  const { showMoodCheckIn, closeMoodCheckIn } = useMoodCheckIn();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/distraction" element={<Distraction />} />
        <Route path="/thought-dump" element={<ThoughtDump />} />
        <Route path="/root-cause" element={<RootCause />} />
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />
        
        {/* Protected routes */}
        <Route path="/saved-entries" element={
          <ProtectedRoute>
            <SavedEntries />
          </ProtectedRoute>
        } />
        <Route path="/todo" element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
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

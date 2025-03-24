"use client";

import type { DifficultyLevel } from "~/server/db/schema";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { addNoteAction } from "~/server/db/actions/AddNote";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useDebounce } from "~/lib/hooks/useDebounce";

export default function AddNote() {
  const [noteToAdd, setNoteToAdd] = useState({
    problem: "",
    solution: "",
    lcUrl: "",
    difficulty: "Easy",
  });
  const [activeTab, setActiveTab] = useState<"search" | "add">("search");
  const [suggestions, setSuggestions] = useState<
    {
      id: number;
      title: string;
      difficulty: "Easy" | "Medium" | "Hard";
      url: string;
      free: number;
    }[]
  >([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // SEARCH
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchQuery.length < 2) {
        setSuggestions([]);
        setShowNoResults(false);
        return;
      }

      setShowNoResults(false);
      try {
        const response = await fetch(
          `/api/search?query=${debouncedSearchQuery}`,
        );
        const data = await response.json();
        setSuggestions(data);

        setTimeout(() => {
          if (data.length === 0) {
            setShowNoResults(true);
          }
        }, 250);
      } catch (error) {
        console.error("Search error:", error);
        setShowNoResults(true);
      }
    };

    fetchResults();
  }, [debouncedSearchQuery]);

  const handleSuggestionSelect = (suggestion: {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    url: string;
  }) => {
    setNoteToAdd({
      problem: suggestion.title,
      solution: "",
      difficulty: suggestion.difficulty,
      lcUrl: suggestion.url,
    });

    setActiveTab("add");
    setSearchQuery("");
  };

  const handleAddNote = async () => {
    if (noteToAdd.problem.trim() === "" || noteToAdd.solution.trim() === "") {
      toast.error("Please enter a problem and solution");
      return;
    }
    const result = await addNoteAction(
      noteToAdd.problem,
      noteToAdd.solution,
      noteToAdd.lcUrl,
      noteToAdd.difficulty as DifficultyLevel,
    );

    if (!result.success) {
      console.error(result.error);
      return;
    }
    toast.success("Note added successfully");

    setNoteToAdd({ problem: "", solution: "", lcUrl: "", difficulty: "Easy" });
  };

  // Reset state when dialog is closed
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Weird visual if I don't add timeout before resetting state
      setTimeout(() => {
        setNoteToAdd({ problem: "", solution: "", lcUrl: "", difficulty: "Easy" });
        setActiveTab("search");
        setSearchQuery("");
        setSuggestions([]);
        setShowNoResults(false);
      }, 250);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4">
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button className="mb-4 cursor-pointer" variant="default">
            Add problem
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add problem</DialogTitle>
            <DialogDescription>
              Fill out form to add a problem to your notes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant={activeTab === "search" ? "default" : "outline"}
              onClick={() => setActiveTab("search")}
            >
              Search
            </Button>
            <Button
              variant={activeTab === "add" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("add");
                setSearchQuery("");
              }}
            >
              Manual
            </Button>
          </div>

          {activeTab === "add" ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="problem" className="text-right">
                  Problem
                </Label>
                <Input
                  id="problem"
                  placeholder="Enter problem (max 25 characters)"
                  value={noteToAdd.problem}
                  onChange={(e) =>
                    setNoteToAdd({ ...noteToAdd, problem: e.target.value })
                  }
                  className="col-span-3"
                  maxLength={25}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="solution" className="text-right">
                  Solution
                </Label>
                <Textarea
                  id="solution"
                  placeholder="Enter solution (max 200 characters)"
                  value={noteToAdd.solution}
                  onChange={(e) => {
                    setNoteToAdd({ ...noteToAdd, solution: e.target.value });
                  }}
                  className="col-span-3 max-h-[200px]"
                  maxLength={200}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lcUrl" className="text-right">
                  URL
                </Label>
                <Input
                  id="lcUrl"
                  placeholder="Enter Leetcode URL"
                  value={noteToAdd.lcUrl}
                  onChange={(e) => {
                    setNoteToAdd({ ...noteToAdd, lcUrl: e.target.value });
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                </Label>
                <Select
                  value={noteToAdd.difficulty}
                  onValueChange={(value) =>
                    setNoteToAdd({
                      ...noteToAdd,
                      difficulty: value as DifficultyLevel,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <Command className="col-span-3 outline-1">
                <CommandInput
                  id="problem"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  placeholder="Search problem... (min 2 characters)"
                />
                <CommandList>
                  {suggestions.length > 0 &&
                    suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.id}
                        onSelect={() => {
                          handleSuggestionSelect({
                            id: suggestion.id,
                            title: suggestion.title,
                            difficulty: suggestion.difficulty,
                            url: suggestion.url,
                          });
                        }}
                      >
                        {suggestion.title}
                      </CommandItem>
                    ))}
                  {searchQuery.length >= 2 && showNoResults && (
                    <CommandEmpty>
                      No matching problems found. Try adding from scratch.
                      <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() => setActiveTab("add")}
                      >
                        Add from scratch
                      </Button>
                    </CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleAddNote} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

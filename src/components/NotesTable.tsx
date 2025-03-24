"use client";

import type { Note, DifficultyLevel } from "~/server/db/schema";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { addNoteAction } from "~/server/db/actions/AddNote";
import { toast } from "sonner";
import { updateNoteAction } from "~/server/db/actions/UpdateNote";
import { deleteNoteAction } from "~/server/db/actions/DeleteNote";
import { Link, Link2, Trash2Icon } from "lucide-react";

export default function NoteRow(props: { notes: Note[] }) {
  const { notes } = props;
  const [noteToAdd, setNoteToAdd] = useState({
    problem: "",
    solution: "",
    lcUrl: "",
    difficulty: "Easy",
  });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedProblem, setEditedProblem] = useState("");
  const [editedSolution, setEditedSolution] = useState("");
  const [editedDifficulty, setEditedDifficulty] =
    useState<DifficultyLevel>("Easy");
  const [focusInput, setFocusInput] = useState<
    "problem" | "solution" | "difficulty" | null
  >(null);

  const handleEdit = (
    note: {
      id: number;
      problem: string;
      solution: string;
      difficulty: DifficultyLevel;
    },
    input: "problem" | "solution" | "difficulty",
  ) => {
    setEditingNoteId(note.id);
    setEditedProblem(note.problem);
    setEditedSolution(note.solution);
    setEditedDifficulty(note.difficulty);
    setFocusInput(input || null);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const result = await updateNoteAction(
        id,
        editedProblem,
        editedSolution,
        editedDifficulty,
      );

      if (!result.success) {
        toast.error(result.error || "Failed to update note");
        return;
      }

      toast.success("Note updated successfully");
      setEditingNoteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    }
  };

  const handleEnterSaveKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit(id);
    } else if (e.key === "Escape") {
      setEditingNoteId(null);
    }
  };

  const handleAddNote = async () => {
    if (noteToAdd.problem.trim() === "" && noteToAdd.solution.trim() === "") {
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
    }

    setNoteToAdd({ problem: "", solution: "", lcUrl: "", difficulty: "Easy" });
  };

  const handleInputBlur = (note: {
    id: number;
    problem: string;
    solution: string;
    difficulty: DifficultyLevel;
  }) => {
    setTimeout(() => {
      const isAnyInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.getAttribute("role") === "combobox" ||
        document.activeElement?.closest('[role="listbox"]') !== null;

      if (!isAnyInputFocused) {
        const isNoteDifferent =
          note.problem !== editedProblem ||
          note.solution !== editedSolution ||
          note.difficulty !== editedDifficulty;

        if (isNoteDifferent) {
          handleSaveEdit(note.id);
        } else {
          setEditingNoteId(null);
        }
      }
    }, 0);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteNoteAction(id);

    if (!result.success) {
      toast.error(result.error || "Failed to delete note");
      return;
    } else {
      toast.success("Note deleted successfully");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4">
      <Table className="w-full table-fixed">
        <TableCaption>A list of lc notes.</TableCaption>
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead className="w-[15%] text-center">Difficulty</TableHead>
            <TableHead className="w-[35%] text-left">Problem</TableHead>
            <TableHead className="w-[40%] text-left">Solution</TableHead>
            <TableHead className="w-[10%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => (
            <TableRow key={note.id}>
              <TableCell
                className="cursor-pointer text-center font-normal"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(
                    {
                      id: note.id,
                      problem: note.title,
                      solution: note.content,
                      difficulty: note.difficulty as DifficultyLevel,
                    },
                    "difficulty",
                  );
                }}
              >
                {editingNoteId === note.id ? (
                  <Select
                    value={editedDifficulty}
                    onValueChange={(value) => {
                      setEditedDifficulty(value as DifficultyLevel);
                    }}
                  >
                    <SelectTrigger
                      className="w-full"
                      onBlur={() =>
                        handleInputBlur({
                          id: note.id,
                          problem: note.title,
                          solution: note.content,
                          difficulty: note.difficulty as DifficultyLevel,
                        })
                      }
                    >
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${note.difficulty === "Easy" ? "bg-green-500/20 text-green-500" : ""} ${note.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-500" : ""} ${note.difficulty === "Hard" ? "bg-red-500/20 text-red-500" : ""} `}
                  >
                    {note.difficulty}
                  </span>
                )}
              </TableCell>

              <TableCell
                className="cursor-pointer text-left font-normal truncate overflow-hidden break-words whitespace-normal"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(
                    {
                      id: note.id,
                      problem: note.title,
                      solution: note.content,
                      difficulty: note.difficulty as DifficultyLevel,
                    },
                    "problem",
                  );
                }}
              >
                {editingNoteId === note.id ? (
                  <Input
                    value={editedProblem}
                    onBlur={() =>
                      handleInputBlur({
                        id: note.id,
                        problem: note.title,
                        solution: note.content,
                        difficulty: note.difficulty as DifficultyLevel,
                      })
                    }
                    onChange={(e) => setEditedProblem(e.target.value)}
                    onKeyDown={(e) => handleEnterSaveKey(e, note.id)}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={25}
                    autoFocus={focusInput === "problem"}
                  />
                ) : (
                  <div className="truncate overflow-hidden break-words whitespace-normal">
                    {note.title}
                  </div>
                )}
              </TableCell>
              <TableCell
                className="cursor-pointer text-left font-normal truncate overflow-hidden break-words whitespace-normal"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(
                    {
                      id: note.id,
                      problem: note.title,
                      solution: note.content,
                      difficulty: note.difficulty as DifficultyLevel,
                    },
                    "solution",
                  );
                }}
              >
                {editingNoteId === note.id ? (
                  <Input
                    value={editedSolution}
                    onBlur={() => {
                      handleInputBlur({
                        id: note.id,
                        problem: note.title,
                        solution: note.content,
                        difficulty: note.difficulty as DifficultyLevel,
                      });
                    }}
                    onChange={(e) => setEditedSolution(e.target.value)}
                    onKeyDown={(e) => handleEnterSaveKey(e, note.id)}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={200}
                    autoFocus={focusInput === "solution"}
                  />
                ) : (
                  <div className="truncate overflow-hidden break-words whitespace-normal">
                    {note.content}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-8 w-8 p-0 cursor-pointer" 
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                    onClick={() => {
                      window.open(note.url, "_blank");
                    }}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right">
              <p className="text-sm text-gray-500">
                Total: {notes.length > 1 || notes.length === 0 ? `${notes.length} problems` : `${notes.length} problem`}
              </p>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

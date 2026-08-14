import { supabase } from "@/integrations/supabase/client";

export type StudySession = {
  id: string;
  created_at: string;
  multiplier: number;
  duration_minutes: number;
  total_solved: number;
};

export async function fetchHistory(): Promise<StudySession[]> {
  const { data, error } = await supabase
    .from("study_history")
    .select("id, created_at, multiplier, duration_minutes, total_solved")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as StudySession[];
}

export async function saveSession(input: {
  multiplier: number;
  duration_minutes: number;
  total_solved: number;
}): Promise<void> {
  const { error } = await supabase.from("study_history").insert(input);
  if (error) throw error;
}

import React, { useState } from 'react';
import { Plus, Loader2, Sparkles } from 'lucide-react';

interface TaskInputProps {
  onTaskCreated: (task: any) => void;
  loading?: boolean;
}

interface ParsedTask {
  title: string;
  dueDate: string | null;
  category: string;
}

const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreated, loading = false }) => {
  const [taskInput, setTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const parseTaskWithGPT = async (input: string): Promise<ParsedTask> => {
    // Simulate GPT API call - In production, this would call OpenAI API
    // For now, we'll use a simple parser with some intelligence
    
    const prompt = `Extract structured task data from the following text. Return a JSON with the keys: title, dueDate (ISO format), and category.

Text: "${input}"

Rules:
- If no date is mentioned, set dueDate to null
- Common categories: Work, Personal, Health, Learning, Shopping, Social
- Extract the main action as the title
- For relative dates like "tomorrow", "next week", calculate the actual date
- For times like "at 3pm", "by 5:30", include in the ISO date format`;

    // Simple parsing logic (in production, replace with actual GPT API call)
    const today = new Date();
    let dueDate: string | null = null;
    let category = 'General';
    let title = input.trim();

    // Extract date patterns
    const datePatterns = [
      { pattern: /tomorrow/i, days: 1 },
      { pattern: /next week/i, days: 7 },
      { pattern: /monday/i, days: getNextWeekday(1) },
      { pattern: /tuesday/i, days: getNextWeekday(2) },
      { pattern: /wednesday/i, days: getNextWeekday(3) },
      { pattern: /thursday/i, days: getNextWeekday(4) },
      { pattern: /friday/i, days: getNextWeekday(5) },
      { pattern: /saturday/i, days: getNextWeekday(6) },
      { pattern: /sunday/i, days: getNextWeekday(0) },
    ];

    for (const { pattern, days } of datePatterns) {
      if (pattern.test(input)) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + days);
        dueDate = targetDate.toISOString();
        break;
      }
    }

    // Extract time patterns
    const timeMatch = input.match(/(?:at|by)\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (timeMatch && dueDate) {
      const date = new Date(dueDate);
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2] || '0');
      const ampm = timeMatch[3]?.toLowerCase();

      if (ampm === 'pm' && hours !== 12) hours += 12;
      if (ampm === 'am' && hours === 12) hours = 0;

      date.setHours(hours, minutes, 0, 0);
      dueDate = date.toISOString();
    }

    // Extract category patterns
    const categoryPatterns = [
      { pattern: /work|job|meeting|project|deadline|office/i, category: 'Work' },
      { pattern: /gym|exercise|workout|health|doctor|medical/i, category: 'Health' },
      { pattern: /learn|study|course|read|book|tutorial/i, category: 'Learning' },
      { pattern: /buy|shop|grocery|store|purchase/i, category: 'Shopping' },
      { pattern: /friend|family|call|visit|social|party/i, category: 'Social' },
      { pattern: /personal|home|clean|organize/i, category: 'Personal' },
    ];

    for (const { pattern, category: cat } of categoryPatterns) {
      if (pattern.test(input)) {
        category = cat;
        break;
      }
    }

    // Clean up title by removing date/time references
    title = title
      .replace(/\b(tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
      .replace(/\b(?:at|by)\s*\d{1,2}:?\d{0,2}\s*(?:am|pm)?\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return { title, dueDate, category };
  };

  function getNextWeekday(targetDay: number): number {
    const today = new Date();
    const currentDay = today.getDay();
    let daysUntilTarget = targetDay - currentDay;
    
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7;
    }
    
    return daysUntilTarget;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || isProcessing) return;

    setIsProcessing(true);
    
    try {
      // Parse the natural language input
      const parsedTask = await parseTaskWithGPT(taskInput);
      
      // Create the task
      await onTaskCreated({
        title: parsedTask.title,
        due_date: parsedTask.dueDate,
        category: parsedTask.category,
        priority: 3, // Default priority
      });

      // Clear the input
      setTaskInput('');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const examplePrompts = [
    "Submit hackathon project tomorrow at 10 AM",
    "Buy groceries this weekend",
    "Call mom next Tuesday",
    "Gym workout at 6 PM today",
    "Read chapter 5 by Friday"
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
            <Sparkles size={18} />
          </div>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Describe your task in natural language..."
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            disabled={isProcessing || loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={!taskInput.trim() || isProcessing || loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Processing with AI...</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Create Task</span>
            </>
          )}
        </button>
      </form>

      {/* Example prompts */}
      <div className="bg-purple-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-purple-900 mb-2">Try these examples:</h4>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setTaskInput(prompt)}
              className="text-xs px-3 py-1 bg-white text-purple-700 rounded-full hover:bg-purple-100 transition-colors duration-200 border border-purple-200"
              disabled={isProcessing || loading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskInput;
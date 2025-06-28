import React, { useState } from 'react';
import { Plus, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface TaskInputProps {
  onTaskCreated: (task: any) => void;
  loading?: boolean;
}

interface ParsedTask {
  title: string;
  dueDate: string | null;
  category: string;
  priority: number;
}

const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreated, loading = false }) => {
  const [taskInput, setTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { isListening, isSupported, speak, startListening } = useVoiceAssistant();

  const parseTaskWithAI = async (input: string): Promise<ParsedTask> => {
    // Enhanced AI parsing with better date/time detection and priority assignment
    const today = new Date();
    let dueDate: string | null = null;
    let category = 'General';
    let title = input.trim();
    let priority = 3; // Default medium priority

    // Enhanced date patterns with more natural language
    const datePatterns = [
      { pattern: /\b(today|this evening|tonight)\b/i, days: 0 },
      { pattern: /\btomorrow\b/i, days: 1 },
      { pattern: /\bday after tomorrow\b/i, days: 2 },
      { pattern: /\bnext week\b/i, days: 7 },
      { pattern: /\bin (\d+) days?\b/i, days: (match: RegExpMatchArray) => parseInt(match[1]) },
      { pattern: /\bmonday\b/i, days: getNextWeekday(1) },
      { pattern: /\btuesday\b/i, days: getNextWeekday(2) },
      { pattern: /\bwednesday\b/i, days: getNextWeekday(3) },
      { pattern: /\bthursday\b/i, days: getNextWeekday(4) },
      { pattern: /\bfriday\b/i, days: getNextWeekday(5) },
      { pattern: /\bsaturday\b/i, days: getNextWeekday(6) },
      { pattern: /\bsunday\b/i, days: getNextWeekday(0) },
    ];

    for (const { pattern, days } of datePatterns) {
      const match = input.match(pattern);
      if (match) {
        const targetDate = new Date(today);
        const daysToAdd = typeof days === 'function' ? days(match) : days;
        targetDate.setDate(today.getDate() + daysToAdd);
        dueDate = targetDate.toISOString();
        break;
      }
    }

    // Enhanced time patterns
    const timeMatch = input.match(/(?:at|by|before)\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
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

    // Enhanced category patterns with more keywords
    const categoryPatterns = [
      { pattern: /\b(work|job|meeting|project|deadline|office|presentation|report|email|call|conference)\b/i, category: 'Work' },
      { pattern: /\b(gym|exercise|workout|health|doctor|medical|appointment|checkup|medicine|diet)\b/i, category: 'Health' },
      { pattern: /\b(learn|study|course|read|book|tutorial|homework|exam|research|practice)\b/i, category: 'Learning' },
      { pattern: /\b(buy|shop|grocery|store|purchase|market|mall|order|amazon)\b/i, category: 'Shopping' },
      { pattern: /\b(friend|family|call|visit|social|party|dinner|lunch|date|birthday)\b/i, category: 'Social' },
      { pattern: /\b(personal|home|clean|organize|laundry|dishes|repair|maintenance)\b/i, category: 'Personal' },
      { pattern: /\b(travel|trip|vacation|flight|hotel|booking|pack|passport)\b/i, category: 'Travel' },
      { pattern: /\b(finance|bank|pay|bill|tax|budget|investment|money)\b/i, category: 'Finance' },
    ];

    for (const { pattern, category: cat } of categoryPatterns) {
      if (pattern.test(input)) {
        category = cat;
        break;
      }
    }

    // Enhanced priority detection based on urgency keywords and context
    const urgencyPatterns = [
      { pattern: /\b(urgent|asap|immediately|critical|emergency|now|rush)\b/i, priority: 5 },
      { pattern: /\b(important|high priority|must do|deadline|due)\b/i, priority: 4 },
      { pattern: /\b(when I have time|someday|maybe|eventually|low priority)\b/i, priority: 1 },
      { pattern: /\b(quick|easy|simple|minor)\b/i, priority: 2 },
    ];

    for (const { pattern, priority: p } of urgencyPatterns) {
      if (pattern.test(input)) {
        priority = p;
        break;
      }
    }

    // Adjust priority based on due date proximity
    if (dueDate) {
      const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 1 && priority < 4) priority = 4; // Due today/tomorrow
      if (daysUntilDue <= 3 && priority < 3) priority = 3; // Due within 3 days
    }

    // Clean up title by removing date/time references and priority keywords
    title = title
      .replace(/\b(today|tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|day after tomorrow)\b/gi, '')
      .replace(/\b(?:at|by|before)\s*\d{1,2}:?\d{0,2}\s*(?:am|pm)?\b/gi, '')
      .replace(/\b(urgent|asap|immediately|critical|emergency|important|high priority|low priority)\b/gi, '')
      .replace(/\bin \d+ days?\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return { title, dueDate, category, priority };
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
      // Parse the natural language input with enhanced AI
      const parsedTask = await parseTaskWithAI(taskInput);
      
      // Create the task
      await onTaskCreated({
        title: parsedTask.title,
        due_date: parsedTask.dueDate,
        category: parsedTask.category,
        priority: parsedTask.priority,
      });

      // Voice confirmation
      const priorityText = parsedTask.priority >= 4 ? 'high priority' : 
                          parsedTask.priority <= 2 ? 'low priority' : 'medium priority';
      const confirmationMessage = `Task created successfully! ${parsedTask.title} has been added as a ${priorityText} ${parsedTask.category.toLowerCase()} task.`;
      speak(confirmationMessage, { rate: 1.1 });

      // Clear the input
      setTaskInput('');
    } catch (error) {
      console.error('Error creating task:', error);
      speak("Sorry, there was an error creating your task. Please try again.", { rate: 1.1 });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (!isSupported) {
      speak("Voice input is not supported in your browser.", { rate: 1.1 });
      return;
    }

    startListening(
      (transcript, isFinal) => {
        setTaskInput(transcript);
        if (isFinal && transcript.trim()) {
          // Auto-submit after voice input is complete
          setTimeout(() => {
            const event = new Event('submit') as any;
            handleSubmit(event);
          }, 1000);
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        speak("Voice recognition failed. Please try typing instead.", { rate: 1.1 });
      }
    );
  };

  const examplePrompts = [
    "Submit hackathon project tomorrow at 10 AM",
    "Buy groceries this weekend",
    "Call mom next Tuesday",
    "Urgent: Finish presentation by 5 PM today",
    "Schedule doctor appointment next week",
    "Read chapter 5 when I have time"
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 dark:text-purple-400">
            <Sparkles size={18} />
          </div>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Describe your task in natural language..."
            className="w-full pl-10 pr-16 py-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isProcessing || loading || isListening}
          />
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isProcessing || loading || isListening}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                isListening 
                  ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 animate-pulse' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!taskInput.trim() || isProcessing || loading || isListening}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Processing with AI...</span>
            </>
          ) : isListening ? (
            <>
              <Mic size={20} className="animate-pulse" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Create Task</span>
            </>
          )}
        </button>
      </form>

      {/* Voice status indicator */}
      {isListening && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-red-700 dark:text-red-300 font-medium">
              🎤 Listening... Speak your task clearly
            </p>
          </div>
        </div>
      )}

      {/* Example prompts */}
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
        <h4 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">
          ✨ Try these AI-powered examples:
        </h4>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setTaskInput(prompt)}
              className="text-xs px-3 py-1 bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-200 border border-purple-200 dark:border-purple-700"
              disabled={isProcessing || loading || isListening}
            >
              {prompt}
            </button>
          ))}
        </div>
        {isSupported && (
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
            💡 Click the microphone icon to use voice input!
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskInput;
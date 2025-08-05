import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
  onDisabledClick?: () => void;
}

export const SkillsInput = ({
  skills,
  onChange,
  disabled = false,
  onDisabledClick,
}: SkillsInputProps) => {
  const [newSkill, setNewSkill] = useState("");
  const isMobile = useIsMobile();

  const addSkill = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">Skills</Label>
      </div>

      <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
        <Input
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`${isMobile ? "h-12" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={disabled}
          onClick={disabled ? onDisabledClick : undefined}
        />
        <Button
          onClick={addSkill}
          className={`${isMobile ? "w-full h-12" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!newSkill.trim() || disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div
            key={index}
            className={`flex items-start justify-between p-3 border rounded-lg bg-gray-50 ${isMobile ? "flex-col gap-3" : ""} ${disabled ? "opacity-50" : ""}`}
            onClick={disabled ? onDisabledClick : undefined}
          >
            <span className={`flex-1 text-sm ${isMobile ? "text-base" : ""}`}>
              {skill}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeSkill(skill)}
              className={`${isMobile ? "w-full h-10" : "ml-2"} text-red-600 hover:text-red-700 ${disabled ? "cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {isMobile ? "Remove" : ""}
            </Button>
          </div>
        ))}
        {skills.length === 0 && (
          <div
            className={`text-center py-8 text-gray-500 ${disabled ? "opacity-50" : ""}`}
          >
            <div className="mb-2">⚡</div>
            <p className="text-sm">No skills added yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add your technical and professional skills
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

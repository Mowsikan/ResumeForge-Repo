import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LanguagesInputProps {
  languages: string[];
  onChange: (languages: string[]) => void;
  disabled?: boolean;
  onDisabledClick?: () => void;
}

export const LanguagesInput = ({
  languages,
  onChange,
  disabled = false,
  onDisabledClick,
}: LanguagesInputProps) => {
  const [newLanguage, setNewLanguage] = useState("");
  const isMobile = useIsMobile();

  const addLanguage = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      onChange([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    onChange(languages.filter((language) => language !== languageToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLanguage();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">Languages</Label>
      </div>

      <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
        <Input
          placeholder="Add a language (e.g., English, Spanish)"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`${isMobile ? "h-12" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={disabled}
          onClick={disabled ? onDisabledClick : undefined}
        />
        <Button
          onClick={addLanguage}
          className={`${isMobile ? "w-full h-12" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!newLanguage.trim() || disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      <div className="space-y-3">
        {languages.map((language, index) => (
          <div
            key={index}
            className={`flex items-start justify-between p-3 border rounded-lg bg-gray-50 ${isMobile ? "flex-col gap-3" : ""} ${disabled ? "opacity-50" : ""}`}
            onClick={disabled ? onDisabledClick : undefined}
          >
            <span className={`flex-1 text-sm ${isMobile ? "text-base" : ""}`}>
              {language}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeLanguage(language)}
              className={`${isMobile ? "w-full h-10" : "ml-2"} text-red-600 hover:text-red-700 ${disabled ? "cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {isMobile ? "Remove" : ""}
            </Button>
          </div>
        ))}
        {languages.length === 0 && (
          <div
            className={`text-center py-8 text-gray-500 ${disabled ? "opacity-50" : ""}`}
          >
            <div className="mb-2">🌐</div>
            <p className="text-sm">No languages added yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add languages you speak to showcase your communication skills
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

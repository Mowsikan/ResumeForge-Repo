import React, { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";

const demoName = "Jane Doe";
const demoTitle = "Frontend Developer";
const demoCompany = "Acme Corp";
const demoSkill = "React.js";
const demoSummary = "Creative developer with a passion for building beautiful, user-friendly web applications.";

const typingSpeed = 60; // ms per character

export const AnimatedResumeDemo: React.FC = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skill, setSkill] = useState("");
  const [summary, setSummary] = useState("");

  // Typing animation for each field
  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    setName(""); setTitle(""); setCompany(""); setSkill(""); setSummary("");
    // Name
    timers.push(setTimeout(() => {
      let i = 0;
      const type = () => {
        setName(demoName.slice(0, i));
        if (i <= demoName.length) {
          i++;
          timers.push(setTimeout(type, typingSpeed));
        }
      };
      type();
    }, 400));
    // Title
    timers.push(setTimeout(() => {
      let i = 0;
      const type = () => {
        setTitle(demoTitle.slice(0, i));
        if (i <= demoTitle.length) {
          i++;
          timers.push(setTimeout(type, typingSpeed));
        }
      };
      type();
    }, 1200));
    // Company
    timers.push(setTimeout(() => {
      let i = 0;
      const type = () => {
        setCompany(demoCompany.slice(0, i));
        if (i <= demoCompany.length) {
          i++;
          timers.push(setTimeout(type, typingSpeed));
        }
      };
      type();
    }, 2000));
    // Skill
    timers.push(setTimeout(() => {
      let i = 0;
      const type = () => {
        setSkill(demoSkill.slice(0, i));
        if (i <= demoSkill.length) {
          i++;
          timers.push(setTimeout(type, typingSpeed));
        }
      };
      type();
    }, 2700));
    // Summary
    timers.push(setTimeout(() => {
      let i = 0;
      const type = () => {
        setSummary(demoSummary.slice(0, i));
        if (i <= demoSummary.length) {
          i++;
          timers.push(setTimeout(type, typingSpeed));
        }
      };
      type();
    }, 3400));
    // Cleanup
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[420px]">
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-gradient-to-tr from-blue-200 via-purple-100 to-pink-200 opacity-60 blur-2xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-300 via-blue-100 to-transparent opacity-40 blur-2xl rounded-full" />
      </div>
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden w-[360px] max-w-full mx-auto transition-all duration-500 hover:scale-[1.025]">
        {/* Window Bar */}
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
            <span className="ml-4 text-sm text-gray-600 font-semibold tracking-wide">
              Resumify Resume Preview
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono">.pdf</span>
        </div>
        <div className="p-7 pb-6">
          <div className="space-y-2">
            {/* Name */}
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-2" />
              <div className="text-2xl font-extrabold text-gray-900 min-h-[32px] tracking-tight flex items-center">
                {name || <span className="opacity-30">Jane Doe</span>}
                {name.length < demoName.length && <span className="border-r-2 border-blue-400 animate-pulse ml-1" />}
                <span className="ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-blue-100 to-purple-100 text-xs font-semibold text-blue-700 shadow-sm">Open to Work</span>
              </div>
            </div>
            {/* Title & Company */}
            <div className="flex items-center gap-2 min-h-[24px]">
              <span className="text-blue-700 font-semibold">{title || <span className="opacity-30">Frontend Developer</span>}</span>
              {title.length < demoTitle.length && <span className="border-r-2 border-blue-400 animate-pulse ml-1" />}
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-600">{company || <span className="opacity-30">Acme Corp</span>}</span>
              {company.length < demoCompany.length && <span className="border-r-2 border-blue-400 animate-pulse ml-1" />}
            </div>
            {/* Summary */}
            <div className="mt-3">
              <span className="text-xs font-semibold text-gray-500">Summary</span>
              <div className="text-gray-700 text-sm min-h-[36px] italic">
                {summary || <span className="opacity-30">{demoSummary}</span>}
                {summary.length < demoSummary.length && <span className="border-r-2 border-blue-400 animate-pulse ml-1" />}
              </div>
            </div>
            {/* Skills */}
            <div className="mt-3">
              <span className="text-xs font-semibold text-gray-500">Skills</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold shadow-md border border-blue-200 transition-all duration-300 ${skill ? "" : "opacity-30"}`}>
                  {skill || demoSkill}
                  {skill.length < demoSkill.length && <span className="border-r-2 border-blue-400 animate-pulse ml-1" />}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-200 opacity-60">TypeScript</span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-200 opacity-60">UI/UX</span>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200 opacity-80">Teamwork</span>
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold border border-yellow-200 opacity-80">Problem Solving</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Elements */}
      <div className="absolute -top-6 -right-6 bg-gradient-to-br from-green-400 to-green-600 text-white p-3 rounded-2xl shadow-xl animate-bounce z-20 border-2 border-white">
        <Check className="w-6 h-6" />
      </div>
      <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-400 to-blue-600 text-white p-3 rounded-2xl shadow-xl animate-pulse z-20 border-2 border-white">
        <Download className="w-6 h-6" />
      </div>
      {/* Decorative Dots */}
      <div className="absolute top-8 left-2 w-2 h-2 bg-blue-300 rounded-full opacity-70 animate-ping" />
      <div className="absolute bottom-10 right-8 w-2 h-2 bg-purple-300 rounded-full opacity-70 animate-ping" />
    </div>
  );
};

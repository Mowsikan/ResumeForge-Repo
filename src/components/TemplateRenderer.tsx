import React from "react";
import { ResumeData } from "@/types/resume";
import { TemplateRendererProps } from "@/types/templates";

// Template 1: Classic Professional (Redesigned)
const ClassicProfessionalTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full min-h-full bg-gradient-to-br from-gray-50 to-white flex font-sans text-[13px]">
    {/* Sidebar */}
    <aside className="w-1/3 max-w-xs bg-white/90 border-r border-gray-200 p-6 flex flex-col items-center shadow-md">
      {visibleFields.fullName && (
        <div className="mb-6 w-full text-center">
          <h1 className="text-2xl font-extrabold text-blue-800 tracking-tight mb-1"><span>{data.fullName}</span></h1>
          <div className="text-blue-700 text-xs space-y-1 mt-2">
            {visibleFields.email && data.email && <div className="truncate"><span>📧</span> <span>{data.email}</span></div>}
            {visibleFields.phone && data.phone && <div><span>📞</span> <span>{data.phone}</span></div>}
            {visibleFields.location && data.location && <div><span>📍</span> <span>{data.location}</span></div>}
            {visibleFields.website && data.website && <div className="truncate"><span>🌐</span> <span>{data.website}</span></div>}
            {visibleFields.linkedin && data.linkedin && <div className="truncate"><span>🔗</span> <span>{data.linkedin}</span></div>}
            {visibleFields.github && data.github && <div className="truncate"><span>💻</span> <span>{data.github}</span></div>}
          </div>
        </div>
      )}

      {visibleFields.skills && data.skills?.length > 0 && (
        <div className="mb-5 w-full">
          <h3 className="font-bold text-blue-900 mb-2 text-sm border-b border-blue-200 pb-1 text-left"><span>Skills</span></h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.slice(0, 8).map((skill, i) => (
              <span key={i} className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-100"><span>{skill}</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.languages && data.languages?.length > 0 && (
        <div className="mb-5 w-full">
          <h3 className="font-bold text-blue-900 mb-2 text-sm border-b border-blue-200 pb-1 text-left"><span>Languages</span></h3>
          <div className="flex flex-wrap gap-2">
            {data.languages.slice(0, 4).map((lang, i) => (
              <span key={i} className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-100"><span>{lang}</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.certifications && data.certifications?.length > 0 && (
        <div className="mb-5 w-full">
          <h3 className="font-bold text-blue-900 mb-2 text-sm border-b border-blue-200 pb-1 text-left"><span>Certifications</span></h3>
          <ul className="space-y-1">
            {data.certifications.slice(0, 3).map((cert, i) => (
              <li key={i} className="text-blue-700 text-xs">
                <span className="font-semibold"><span>{cert.name}</span></span>
                {cert.issuer && <span className="ml-1 text-blue-600"><span>•</span> <span>{cert.issuer}</span></span>}
                {cert.year && <span className="ml-1 text-blue-500"><span>•</span> <span>{cert.year}</span></span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-8 flex flex-col gap-7 min-w-0">
      {visibleFields.summary && data.summary && (
        <section>
          <h3 className="font-bold text-blue-900 mb-2 text-base border-b border-blue-200 pb-1"><span>Professional Summary</span></h3>
          <p className="text-gray-700 text-sm leading-relaxed mt-1"><span>{data.summary}</span></p>
        </section>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <section>
          <h3 className="font-bold text-blue-900 mb-2 text-base border-b border-blue-200 pb-1"><span>Key Achievements</span></h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.slice(0, 5).map((achievement, i) => (
              <li key={i} className="text-gray-700 text-sm"><span>{achievement}</span></li>
            ))}
          </ul>
        </section>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <section>
          <h3 className="font-bold text-blue-900 mb-2 text-base border-b border-blue-200 pb-1"><span>Experience</span></h3>
          <div className="flex flex-col gap-5">
            {data.experience.slice(0, 3).map((exp, i) => (
              <div key={i} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-blue-900 text-sm"><span>{exp.position}</span></span>
                  <span className="text-blue-600 text-xs"><span>{exp.duration}</span></span>
                </div>
                <div className="text-blue-800 text-xs mb-1"><span>{exp.company}</span></div>
                <div className="text-gray-700 text-xs"><span>{exp.description}</span></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {visibleFields.education && data.education?.length > 0 && (
        <section>
          <h3 className="font-bold text-blue-900 mb-2 text-base border-b border-blue-200 pb-1"><span>Education</span></h3>
          <div className="flex flex-col gap-4">
            {data.education.slice(0, 3).map((edu, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-blue-100">
                <span className="font-semibold text-blue-900 text-sm"><span>{edu.degree}</span></span>
                <span className="block text-blue-800 text-xs mt-0.5"><span>{edu.school}</span></span>
                <span className="block text-gray-600 text-xs mt-0.5"><span>{edu.year}</span>{edu.grade && <span> • <span>{edu.grade}</span></span>}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {visibleFields.projects && data.projects?.length > 0 && (
        <section>
          <h3 className="font-bold text-blue-900 mb-2 text-base border-b border-blue-200 pb-1"><span>Projects</span></h3>
          <div className="flex flex-col gap-4">
            {data.projects.slice(0, 2).map((project, i) => (
              <div key={i} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <span className="font-semibold text-blue-900 text-sm"><span>{project.name}</span></span>
                <span className="block text-gray-700 text-xs mt-0.5"><span>{project.description}</span></span>
                {project.technologies && (
                  <span className="block text-blue-700 text-xs mt-0.5"><span>Technologies:</span> <span>{project.technologies}</span></span>
                )}
                {project.link && (
                  <span className="block text-blue-600 text-xs mt-0.5 truncate"><span>Link:</span> <span>{project.link}</span></span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  </div>
);

// Template 2: Modern Simple
const ModernSimpleTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-sans bg-white p-6">
    {visibleFields.fullName && (
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900"><span>{data.fullName}</span></h1>
        <div className="text-gray-600 text-xs mt-2 space-x-4">
          {visibleFields.email && data.email && <span><span>{data.email}</span></span>}
          {visibleFields.phone && data.phone && <span><span>•</span></span>}
          {visibleFields.phone && data.phone && <span><span>{data.phone}</span></span>}
          {visibleFields.location && data.location && <span><span>•</span></span>}
          {visibleFields.location && data.location && (
            <span><span>{data.location}</span></span>
          )}
        </div>
        <div className="text-blue-600 text-xs mt-1 space-x-4">
          {visibleFields.website && data.website && (
            <span><span>{data.website}</span></span>
          )}
          {visibleFields.linkedin && data.linkedin && <span><span>•</span></span>}
          {visibleFields.linkedin && data.linkedin && (
            <span><span>{data.linkedin}</span></span>
          )}
          {visibleFields.github && data.github && <span><span>•</span></span>}
          {visibleFields.github && data.github && <span><span>{data.github}</span></span>}
        </div>
      </div>
    )}

    <div className="space-y-5">
      {visibleFields.summary && data.summary && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Summary</span></h3>
          <p className="text-gray-700 text-xs leading-relaxed"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Experience</span></h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs"><span>{exp.position}</span></h4>
                    <div className="text-gray-600 text-xs"><span>{exp.company}</span></div>
                  </div>
                  <div className="text-gray-500 text-xs"><span>{exp.duration}</span></div>
                </div>
                <p className="text-gray-700 text-xs mt-1"><span>{exp.description}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.education && data.education?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Education</span></h3>
          <div className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs"><span>{edu.degree}</span></h4>
                  <div className="text-gray-600 text-xs"><span>{edu.school}</span></div>
                </div>
                <div className="text-gray-500 text-xs"><span>{edu.year} {edu.grade && `• ${edu.grade}`}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Key Achievements</span></h3>
          <ul className="space-y-1">
            {data.achievements.map((achievement, i) => (
              <li key={i} className="text-gray-700 text-xs"><span>• <span>{achievement}</span></span></li>
            ))}
          </ul>
        </div>
      )}

      {visibleFields.skills && data.skills?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Skills</span></h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
              >
               <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.languages && data.languages?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Languages</span></h3>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang, i) => (
              <span
                key={i}
                className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
              >
                 <span>{lang}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.certifications && data.certifications?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Certifications</span></h3>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 text-xs"><span>{cert.name}</span></h4>
                {cert.issuer && <div className="text-gray-600 text-xs"><span>{cert.issuer}</span></div>}
                {cert.year && <div className="text-gray-500 text-xs"><span>{cert.year}</span></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.projects && data.projects?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm border-b border-gray-300 pb-1"><span>Projects</span></h3>
          <div className="space-y-3">
            {data.projects.map((project, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 text-xs"><span>{project.name}</span></h4>
                <p className="text-gray-700 text-xs mt-1"><span>{project.description}</span></p>
                {project.technologies && (
                  <div className="text-gray-600 text-xs mt-1"><span>Technologies:</span> <span>{project.technologies}</span></div>
                )}
                {project.link && (
                  <div className="text-blue-600 text-xs mt-1"><span>Link:</span> <span>{project.link}</span></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Removed duplicate ModernSimpleTemplate - using the first declaration only

// UNIQUE IMPLEMENTATIONS FOR OLD TEMPLATES

// Strategic Blue Template (Business category)
const StrategicBlueTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="w-full h-full flex flex-col text-xs font-sans bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    {visibleFields.fullName && (
      <div className="text-center  mb-6 bg-blue-600 text-white p-4 rounded-lg">
        <h1 className="text-lg font-bold"><span>{data.fullName}</span></h1>
        <div className="text-blue-100 text-xs mt-2 space-x-3">
          {visibleFields.email && data.email && <span>📧 {data.email}</span>}
          {visibleFields.phone && data.phone && <span>📞 {data.phone}</span>}
          {visibleFields.location && data.location && <span>📍 {data.location}</span>}
        </div>
        <div className="text-blue-100 text-xs mt-1 space-x-3">
          {visibleFields.website && data.website && <span>🌐 {data.website}</span>}
          {visibleFields.linkedin && data.linkedin && <span>💼 {data.linkedin}</span>}
          {visibleFields.github && data.github && <span>⚡ {data.github}</span>}
        </div>
      </div>
    )}

    <div className="space-y-4">
      {visibleFields.summary && data.summary && (
        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-bold text-blue-900 mb-2"><span>Strategic Overview</span></h3>
          <p className="text-gray-700 text-xs leading-relaxed"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500">
          <h3 className="font-bold text-indigo-900 mb-2"><span>Key Achievements</span></h3>
          <div className="space-y-1">
          {data.achievements.map((achievement, i) => (
<span key={i} className="text-gray-700 text-xs flex items-start">
  <span className="text-blue-600 mr-2">▶</span>
  <span data-text>{achievement}</span>
</span>
          ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-3 border-b border-blue-200 pb-1"><span>Professional Experience</span></h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-blue-300 pl-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-blue-800 text-xs"><span>{exp.position}</span></h4>
                    <span className="text-blue-600 text-xs block" data-text>{exp.company}</span>
                  </div>
                  <span className="text-gray-500 text-xs" data-text>{exp.duration}</span>
                </div>
                <p className="text-gray-700 text-xs mt-1"><span data-text>{exp.description}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.skills && data.skills?.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">Core Competencies</h3>
            <div className="space-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs block "><span data-text>{skill}</span></div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">Strategic Projects</h3>
            <div className="space-y-2">
              {data.projects.map((proj, i) => (
                <div key={i} className="bg-blue-50 p-2 rounded border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-xs">{proj.name}</h4>
                  <p className="text-gray-700 text-xs mt-1">{proj.description}</p>
                  {proj.technologies && (
                    <div className="text-blue-600 text-xs mt-1">
                      Tech: {proj.technologies}
                    </div>
                  )}
                  {proj.link && (
                    <div className="text-blue-700 text-xs mt-1">
                      🔗 {proj.link}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.education && data.education?.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">Education</h3>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-blue-800 text-xs">{edu.degree}</h4>
                  <div className="text-blue-600 text-xs">{edu.school} • {edu.year} {edu.grade && `• ${edu.grade}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.languages && data.languages?.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">Languages</h3>
            <div className="flex flex-wrap gap-1">
              {data.languages.map((lang, i) => (
<div key={i} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
<span data-text>{lang}</span>
</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibleFields.certifications && data.certifications?.length > 0 && (
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">Certifications</h3>
          <div className="space-y-1">
            {data.certifications.map((cert, i) => (
              <div key={i} className="bg-blue-50 p-2 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 text-xs">{cert.name}</h4>
                <span className="text-blue-600 text-xs" data-text>{cert.issuer} • {cert.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Financial Professional Template (Finance category)
const FinancialProfessionalTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-serif bg-white p-6 border-2 border-green-200">
    {visibleFields.fullName && (
      <div className="text-center mb-6 border-b-2 border-green-600 pb-4">
        <h1 className="text-lg font-bold text-green-800">{data.fullName}</h1>
        <div className="text-green-600 text-xs mt-2 space-y-1">
          {visibleFields.email && data.email && <span data-text>📧 {data.email}</span>}
          {visibleFields.phone && data.phone && <span data-text>📞 {data.phone}</span>}
          {visibleFields.location && data.location && <span data-text>📍 {data.location}</span>}
          {visibleFields.website && data.website && <span data-text>🌐 {data.website}</span>}
          {visibleFields.linkedin && data.linkedin && <span data-text>🔗 {data.linkedin}</span>}
          {visibleFields.github && data.github && <span data-text>💻 {data.github}</span>}
        </div>
      </div>
    )}

    <div className="space-y-4">
      {visibleFields.summary && data.summary && (
        <div >
          <h3 className="font-bold text-green-800 mb-2 text-sm">Professional Summary</h3>
          <p className="text-gray-700 text-xs leading-relaxed bg-green-50 p-3 rounded"><span data-text>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div>
          <h3 className="font-bold text-green-800 mb-2 text-sm">Key Achievements</h3>
          <div className="bg-green-50 p-3 rounded">
            {data.achievements.map((achievement, i) => (
              <span key={i} className="text-gray-700 text-xs mb-1 block" data-text>
                • {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div>
          <h3 className="font-bold text-green-800 mb-3 text-sm">Professional Experience</h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded border-l-4 border-green-500">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold text-green-900 text-xs">{exp.position}</h4>
                    <span className="text-green-700 text-xs font-medium block" data-text>{exp.company}</span>
                  </div>
                  <span className="text-gray-600 text-xs" data-text>{exp.duration}</span>
                </div>
                <p className="text-gray-700 text-xs mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.skills && data.skills?.length > 0 && (
          <div>
            <h3 className="font-bold text-green-800 mb-2 text-sm">Key Skills</h3>
            <div className="space-y-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  <span data-text>• {skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.education && data.education?.length > 0 && (
          <div>
            <h3 className="font-bold text-green-800 mb-2 text-sm">Education</h3>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i} className="bg-gray-50 p-2 rounded">
                  <h4 className="font-semibold text-green-900 text-xs">{edu.degree}</h4>
                  <div className="text-green-700 text-xs">{edu.school}</div>
                  <div className="text-gray-600 text-xs">{edu.year} {edu.grade && `• ${edu.grade}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.languages && data.languages?.length > 0 && (
          <div>
            <h3 className="font-bold text-green-800 mb-2 text-sm">Languages</h3>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <div key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
           <span > • {lang}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.certifications && data.certifications?.length > 0 && (
          <div>
            <h3 className="font-bold text-green-800 mb-2 text-sm">Certifications</h3>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="bg-gray-50 p-2 rounded">
                  <h4 className="font-semibold text-green-900 text-xs">{cert.name}</h4>
                  <div className="text-green-700 text-xs">{cert.issuer}</div>
                  <div className="text-gray-600 text-xs">{cert.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibleFields.projects && data.projects?.length > 0 && (
        <div>
          <h3 className="font-bold text-green-800 mb-2 text-sm">Projects</h3>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <div key={i} className="bg-green-50 p-3 rounded border border-green-200">
                <h4 className="font-bold text-green-900 text-xs">{proj.name}</h4>
                <p className="text-gray-700 text-xs mt-1">{proj.description}</p>
                {proj.technologies && (
                  <div className="text-green-700 text-xs mt-1">
                    Technologies: {proj.technologies}
                  </div>
                )}
                {proj.link && (
                  <div className="text-green-600 text-xs mt-1">
                    Link: {proj.link}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Creative Profile Template (Creative category)
const CreativeProfileTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-sans bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
    {visibleFields.fullName && (
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-purple-600"><span>{data.fullName || "Full Name"}</span></h1>
        <div className="text-purple-600 text-xs mt-2 space-y-1">
          {visibleFields.email && data.email && <div><span>✉️</span> <span>{data.email}</span></div>}
          {visibleFields.phone && data.phone && <div><span>📱</span> <span>{data.phone}</span></div>}
          {visibleFields.location && data.location && <div><span>📍</span> <span>{data.location}</span></div>}
          {visibleFields.website && data.website && <div><span>🌐</span> <span>{data.website}</span></div>}
          {visibleFields.linkedin && data.linkedin && <div><span>🔗</span> <span>{data.linkedin}</span></div>}
          {visibleFields.github && data.github && <div><span>💻</span> <span>{data.github}</span></div>}
        </div>
      </div>
    )}

    <div className="space-y-4">
      {visibleFields.summary && data.summary && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-purple-200">
          <h3 className="font-bold text-purple-800 mb-2"><span>Creative Vision</span></h3>
          <p className="text-gray-700 text-xs leading-relaxed italic"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-pink-200">
          <h3 className="font-bold text-pink-800 mb-2"><span>Creative Achievements</span></h3>
          <div className="space-y-1">
            {data.achievements.map((achievement, i) => (
              <div key={i} className="text-gray-700 text-xs"><span>✨</span> <span>{achievement}</span></div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-pink-200">
          <h3 className="font-bold text-pink-800 mb-3"><span>Experience Portfolio</span></h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i} className="border-l-4 border-purple-400 pl-3">
                <h4 className="font-bold text-purple-700 text-xs"><span>{exp.position}</span></h4>
                <div className="text-pink-600 text-xs font-medium"><span>{exp.company}</span> <span>•</span> <span>{exp.duration}</span></div>
                <p className="text-gray-700 text-xs mt-1"><span>{exp.description}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.skills && data.skills?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2"><span>Creative Skills</span></h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs border border-purple-200"><span>{skill}</span></span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2"><span>Creative Projects</span></h3>
            <div className="space-y-2">
              {data.projects.map((proj, i) => (
                <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded border border-purple-200">
                  <h4 className="font-bold text-purple-700 text-xs"><span>{proj.name}</span></h4>
                  <p className="text-gray-700 text-xs mt-1"><span>{proj.description}</span></p>
                  {proj.technologies && (
                    <div className="text-purple-600 text-xs mt-1"><span>Tools:</span> <span>{proj.technologies}</span></div>
                  )}
                  {proj.link && (
                    <div className="text-pink-600 text-xs mt-1"><span>🔗</span> <span>{proj.link}</span></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.education && data.education?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-2"><span>Education</span></h3>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-bold text-purple-700 text-xs"><span>{edu.degree}</span></h4>
                  <div className="text-pink-600 text-xs"><span>{edu.school}</span></div>
                  <div className="text-gray-600 text-xs"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.languages && data.languages?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-pink-200">
            <h3 className="font-bold text-pink-800 mb-2"><span>Languages</span></h3>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((lang, i) => (
                <span key={i} className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 px-2 py-1 rounded-full text-xs border border-pink-200"><span>{lang}</span></span>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibleFields.certifications && data.certifications?.length > 0 && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-orange-200">
          <h3 className="font-bold text-orange-800 mb-2"><span>Certifications & Awards</span></h3>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="bg-gradient-to-r from-orange-50 to-pink-50 p-2 rounded border border-orange-200">
                <h4 className="font-bold text-orange-700 text-xs"><span>{cert.name}</span></h4>
                <div className="text-pink-600 text-xs"><span>{cert.issuer}</span></div>
                <div className="text-gray-600 text-xs"><span>{cert.year}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Skills Dashboard Template (Tech category)
const SkillsDashboardTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-mono bg-gray-900 text-green-400 p-6">
    {visibleFields.fullName && (
      <div className="border border-green-400 p-4 mb-4 rounded bg-black/30">
        <h1 className="text-lg font-bold text-green-300"><span>{data.fullName}</span></h1>
        <div className="text-green-500 text-xs mt-2 grid grid-cols-1 gap-1">
          {visibleFields.email && data.email && <div><span>📧</span> <span>{data.email}</span></div>}
          {visibleFields.phone && data.phone && <div><span>📞</span> <span>{data.phone}</span></div>}
          {visibleFields.location && data.location && <div><span>📍</span> <span>{data.location}</span></div>}
          {visibleFields.website && data.website && <div><span>🌐</span> <span>{data.website}</span></div>}
          {visibleFields.linkedin && data.linkedin && <div><span>🔗</span> <span>{data.linkedin}</span></div>}
          {visibleFields.github && data.github && <div><span>💻</span> <span>{data.github}</span></div>}
        </div>
      </div>
    )}

    <div className="space-y-4">
      {visibleFields.skills && data.skills?.length > 0 && (
        <div className="border border-green-400 p-4 rounded bg-black/30">
          <h3 className="font-bold text-green-300 mb-3"><span>TECH_STACK.skills</span></h3>
          <div className="grid grid-cols-3 gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-green-400/10 border border-green-500 text-green-300 px-2 py-1 rounded text-xs"><span>{skill}</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.summary && data.summary && (
        <div className="border border-green-400 p-4 rounded bg-black/30">
          <h3 className="font-bold text-green-300 mb-2"><span>console.log("summary")</span></h3>
          <p className="text-green-400 text-xs leading-relaxed font-mono"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div className="border border-green-400 p-4 rounded bg-black/30">
          <h3 className="font-bold text-green-300 mb-2"><span>ACHIEVEMENTS.list()</span></h3>
          <div className="space-y-1">
            {data.achievements.map((achievement, i) => (
              <div key={i} className="text-green-400 text-xs"><span>&gt;</span> <span>{achievement}</span></div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div className="border border-green-400 p-4 rounded bg-black/30">
          <h3 className="font-bold text-green-300 mb-3"><span>Experience.map()</span></h3>
          <div className="space-y-2">
            {data.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 text-xs"><span>{exp.position}</span> <span>@</span> <span>{exp.company}</span></div>
                <div className="text-green-500 text-xs"><span>{exp.duration}</span></div>
                <div className="text-green-400 text-xs mt-1"><span>{exp.description}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="border border-green-400 p-4 rounded bg-black/30">
            <h3 className="font-bold text-green-300 mb-2"><span>Projects.forEach()</span></h3>
            <div className="space-y-2">
              {data.projects.map((proj, i) => (
                <div key={i} className="bg-green-400/10 p-2 rounded">
                  <span className="text-green-300 text-xs font-bold"><span>{proj.name}</span></span>
                  <span className="text-green-400 text-xs block"><span>{proj.description}</span></span>
                  {proj.technologies && (
                    <span className="text-green-500 text-xs block"><span>Tech:</span> <span>{proj.technologies}</span></span>
                  )}
                  {proj.link && (
                    <span className="text-green-200 text-xs block"><span>URL:</span> <span>{proj.link}</span></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.education && data.education?.length > 0 && (
          <div className="border border-green-400 p-4 rounded bg-black/30">
            <h3 className="font-bold text-green-300 mb-2"><span>Education.filter()</span></h3>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <span className="text-green-300 text-xs block"><span>{edu.degree}</span></span>
                  <span className="text-green-500 text-xs block"><span>{edu.school}</span></span>
    <span className="text-green-400 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.languages && data.languages?.length > 0 && (
          <div className="border border-green-400 p-4 rounded bg-black/30">
            <h3 className="font-bold text-green-300 mb-2"><span>Languages.available</span></h3>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <span key={i} className="text-green-400 text-xs block"><span>-</span> <span>{lang}</span></span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.certifications && data.certifications?.length > 0 && (
          <div className="border border-green-400 p-4 rounded bg-black/30">
            <h3 className="font-bold text-green-300 mb-2"><span>Certifications.array</span></h3>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="bg-green-400/10 p-2 rounded">
                  <span className="text-green-300 text-xs font-bold"><span>{cert.name}</span></span>
                  <span className="text-green-500 text-xs block"><span>{cert.issuer}</span></span>
                  <span className="text-green-400 text-xs block"><span>{cert.year}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Executive Summary Template (Executive category)
const ExecutiveSummaryTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-serif bg-white p-6">
    {visibleFields.fullName && (
      <div className="text-center mb-6 border-b-4 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2"><span>{data.fullName}</span></h1>
        <div className="text-gray-600 text-xs space-x-4">
          {visibleFields.email && data.email && <span><span>{data.email}</span></span>}
          {visibleFields.phone && data.phone && <span><span>•</span></span>}
          {visibleFields.phone && data.phone && <span><span>{data.phone}</span></span>}
          {visibleFields.location && data.location && <span><span>•</span></span>}
          {visibleFields.location && data.location && <span><span>{data.location}</span></span>}
        </div>
        <div className="text-gray-600 text-xs mt-2 space-x-4">
          {visibleFields.website && data.website && <span><span>🌐</span> <span>{data.website}</span></span>}
          {visibleFields.linkedin && data.linkedin && <span><span>🔗</span> <span>{data.linkedin}</span></span>}
          {visibleFields.github && data.github && <span><span>💻</span> <span>{data.github}</span></span>}
        </div>
      </div>
    )}

    <div className="space-y-6">
      {visibleFields.summary && data.summary && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg"><span>Executive Summary</span></h3>
          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 border-l-4 border-gray-800"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg"><span>Key Achievements</span></h3>
          <div className="bg-gray-50 p-4 border border-gray-200">
            {data.achievements.map((achievement, i) => (
              <div key={i} className="text-gray-700 text-xs mb-2 leading-relaxed"><span>•</span> <span>{achievement}</span></div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-lg"><span>Leadership Experience</span></h3>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i} className="bg-gray-50 p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm"><span>{exp.position}</span></h4>
                    <div className="text-gray-700 text-sm font-medium"><span>{exp.company}</span></div>
                  </div>
                  <div className="text-gray-600 text-xs"><span>{exp.duration}</span></div>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed"><span>{exp.description}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {visibleFields.education && data.education?.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3"><span>Education</span></h3>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i} className="border-l-2 border-gray-400 pl-3">
                  <h4 className="font-semibold text-gray-900 text-xs"><span>{edu.degree}</span></h4>
                  <div className="text-gray-700 text-xs"><span>{edu.school}</span></div>
                  <div className="text-gray-600 text-xs"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.skills && data.skills?.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3"><span>Key Competencies</span></h3>
            <div className="space-y-1">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-gray-700 text-xs block"><span>•</span> <span>{skill}</span></span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {visibleFields.projects && data.projects?.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3"><span>Strategic Projects</span></h3>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={i} className="bg-gray-50 p-3 border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-xs"><span>{proj.name}</span></h4>
                  <span className="text-gray-700 text-xs mt-1 block"><span>{proj.description}</span></span>
                  {proj.technologies && (
                    <span className="text-gray-600 text-xs mt-1 block"><span>Technologies:</span> <span>{proj.technologies}</span></span>
                  )}
                  {proj.link && (
                    <span className="text-gray-600 text-xs mt-1 block"><span>Link:</span> <span>{proj.link}</span></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.certifications && data.certifications?.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3"><span>Certifications</span></h3>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="border-l-2 border-gray-400 pl-3">
                  <h4 className="font-semibold text-gray-900 text-xs"><span>{cert.name}</span></h4>
                  <span className="text-gray-700 text-xs block"><span>{cert.issuer}</span></span>
                  <span className="text-gray-600 text-xs block"><span>{cert.year}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibleFields.languages && data.languages?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3"><span>Languages</span></h3>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs"><span>{lang}</span></span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Minimal Professional Template (Minimal category)
const MinimalProfessionalTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-sans bg-white p-8 border border-gray-300">
    {visibleFields.fullName && (
      <div className="mb-8">
        <h1 className="text-lg font-light text-gray-900 mb-1"><span>{data.fullName}</span></h1>
        <div className="text-gray-600 text-xs">
          {visibleFields.email && data.email && <span><span>{data.email}</span></span>}
          {visibleFields.phone && data.phone && <span><span>|</span> <span>{data.phone}</span></span>}
          {visibleFields.location && data.location && <span><span>|</span> <span>{data.location}</span></span>}
        </div>
        <div className="text-gray-600 text-xs mt-1">
          {visibleFields.website && data.website && <span><span>{data.website}</span></span>}
          {visibleFields.linkedin && data.linkedin && <span><span>|</span> <span>{data.linkedin}</span></span>}
          {visibleFields.github && data.github && <span><span>|</span> <span>{data.github}</span></span>}
        </div>
        <div className="border-b border-gray-300 mt-3"></div>
      </div>
    )}

    <div className="space-y-6">
      {visibleFields.summary && data.summary && (
        <div>
          <p className="text-gray-700 text-xs leading-relaxed"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-sm"><span>Key Achievements</span></h3>
          <div className="space-y-1">
            {data.achievements.map((achievement, i) => (
              <span key={i} className="text-gray-700 text-xs leading-relaxed block"><span>•</span> <span>{achievement}</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-sm"><span>Experience</span></h3>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 text-xs"><span>{exp.position}</span></h4>
                    <span className="text-gray-600 text-xs block"><span>{exp.company}</span></span>
                  </div>
                  <span className="text-gray-500 text-xs"><span>{exp.duration}</span></span>
                </div>
                <span className="text-gray-700 text-xs mt-1 leading-relaxed block"><span>{exp.description}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.projects && data.projects?.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-sm"><span>Projects</span></h3>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <h4 className="font-medium text-gray-900 text-xs"><span>{proj.name}</span></h4>
                <span className="text-gray-700 text-xs mt-1 leading-relaxed block"><span>{proj.description}</span></span>
                {proj.technologies && (
                  <span className="text-gray-600 text-xs mt-1 block"><span>{proj.technologies}</span></span>
                )}
                {proj.link && (
                  <span className="text-gray-600 text-xs mt-1 block"><span>{proj.link}</span></span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.education && data.education?.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-sm"><span>Education</span></h3>
          <div className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i}>
                <h4 className="font-medium text-gray-900 text-xs"><span>{edu.degree}</span></h4>
                <span className="text-gray-600 text-xs block"><span>{edu.school}</span><span>,</span> <span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.skills && data.skills?.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-sm"><span>Skills</span></h3>
          <div className="text-gray-700 text-xs flex flex-wrap gap-1">
            {data.skills.map((skill, i) => (
              <span key={i}><span>{skill}</span>{i < data.skills.length - 1 && <span> • </span>}</span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.languages && data.languages?.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-sm"><span>Languages</span></h3>
          <div className="text-gray-700 text-xs flex flex-wrap gap-1">
            {data.languages.map((lang, i) => (
              <span key={i}><span>{lang}</span>{i < data.languages.length - 1 && <span> • </span>}</span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.certifications && data.certifications?.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-sm"><span>Certifications</span></h3>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <div key={i}>
                <h4 className="font-medium text-gray-900 text-xs"><span>{cert.name}</span></h4>
                <span className="text-gray-600 text-xs block"><span>{cert.issuer}</span><span>,</span> <span>{cert.year}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Developer Portfolio Template (Developer category)
const DeveloperPortfolioTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-mono bg-slate-900 text-lime-400 p-6">
    {visibleFields.fullName && (
      <div className="border-2 border-lime-400 p-4 mb-4 bg-slate-800">
        <h1 className="text-lg font-bold text-lime-300"><span>$ whoami</span></h1>
        <div className="text-lime-400 mt-1"><span>{data.fullName}</span></div>
        <div className="text-lime-500 text-xs mt-2 space-y-1">
          {visibleFields.email && data.email && <div><span>$ echo $EMAIL →</span> <span>{data.email}</span></div>}
          {visibleFields.phone && data.phone && <div><span>$ echo $PHONE →</span> <span>{data.phone}</span></div>}
          {visibleFields.location && data.location && <div><span>$ echo $LOCATION →</span> <span>{data.location}</span></div>}
          {visibleFields.website && data.website && <div><span>$ echo $WEBSITE →</span> <span>{data.website}</span></div>}
          {visibleFields.linkedin && data.linkedin && <div><span>$ echo $LINKEDIN →</span> <span>{data.linkedin}</span></div>}
          {visibleFields.github && data.github && <div><span>$ echo $GITHUB →</span> <span>{data.github}</span></div>}
        </div>
      </div>
    )}

    <div className="space-y-4">
      {visibleFields.summary && data.summary && (
        <div className="border border-lime-400 p-4 bg-slate-800">
          <h3 className="font-bold text-lime-300 mb-2"><span>$ cat ./README.md</span></h3>
          <p className="text-lime-400 text-xs leading-relaxed"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div className="border border-lime-400 p-4 bg-slate-800">
          <h3 className="font-bold text-lime-300 mb-2"><span>$ grep -r "achievements" ./portfolio</span></h3>
          <div className="space-y-1">
            {data.achievements.map((achievement, i) => (
              <span key={i} className="text-lime-400 text-xs block"><span>./achievements/{String(i + 1).padStart(2, '0')}.txt:</span> <span>{achievement}</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.skills && data.skills?.length > 0 && (
        <div className="border border-lime-400 p-4 bg-slate-800">
          <h3 className="font-bold text-lime-300 mb-2"><span>$ ls -la ./skills/</span></h3>
          <div className="grid grid-cols-2 gap-1">
            {data.skills.map((skill, i) => (
              <span key={i} className="text-lime-400 text-xs block"><span>drwxr-xr-x</span> <span>{skill}/</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div className="border border-lime-400 p-4 bg-slate-800">
          <h3 className="font-bold text-lime-300 mb-3"><span>$ git log --oneline</span></h3>
          <div className="space-y-2">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <span className="text-lime-300 text-xs block"><span>commit</span> <span>{(i + 1).toString(16).padStart(7, '0')}</span> <span>{exp.position}</span></span>
                <span className="text-lime-500 text-xs block"><span>Author:</span> <span>{exp.company}</span> <span>&lt;{exp.duration}&gt;</span></span>
                <span className="text-lime-400 text-xs ml-4 mt-1 block"><span>{exp.description}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="border border-lime-400 p-4 bg-slate-800">
            <h3 className="font-bold text-lime-300 mb-2"><span>$ find ./projects -name "*.js"</span></h3>
            <div className="space-y-2">
              {data.projects.map((proj, i) => (
                <span key={i} className="text-lime-400 text-xs block">
                  <span>./projects/{proj.name.toLowerCase().replace(/\s+/g, '_')}/</span>
                  <span className="text-lime-500 ml-2 block"># {proj.description}</span>
                  {proj.technologies && (
                    <span className="text-lime-300 ml-2 block"><span># Stack:</span> <span>{proj.technologies}</span></span>
                  )}
                  {proj.link && (
                    <span className="text-lime-200 ml-2 block"><span># URL:</span> <span>{proj.link}</span></span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.education && data.education?.length > 0 && (
          <div className="border border-lime-400 p-4 bg-slate-800">
            <h3 className="font-bold text-lime-300 mb-2"><span>$ cat ./education.json</span></h3>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <span key={i} className="text-lime-400 text-xs block">
                  <span>"{edu.degree}": &#123;</span>
                  <span className="ml-2 block">"school": "{edu.school}",</span>
                  <span className="ml-2 block">"year": "{edu.year}"{edu.grade && ','}</span>
                  {edu.grade && <span className="ml-2 block">"grade": "{edu.grade}"</span>}
                  <span>&#125;</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.languages && data.languages?.length > 0 && (
          <div className="border border-lime-400 p-4 bg-slate-800">
            <h3 className="font-bold text-lime-300 mb-2"><span>$ cat ./config/languages.yaml</span></h3>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <span key={i} className="text-lime-400 text-xs block"><span>-</span> <span>{lang}</span></span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.certifications && data.certifications?.length > 0 && (
          <div className="border border-lime-400 p-4 bg-slate-800">
            <h3 className="font-bold text-lime-300 mb-2"><span>$ ls ./certifications/</span></h3>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <span key={i} className="text-lime-400 text-xs block">
                  <span>{cert.name.toLowerCase().replace(/\s+/g, '_')}.pdf</span>
                  <span className="text-lime-500 ml-2 block"># Issued by: {cert.issuer}</span>
                  <span className="text-lime-300 ml-2 block"># Year: {cert.year}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Academic Research Template (Academic category)
const AcademicResearchTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-serif bg-white p-6 border-2 border-gray-300">
    {visibleFields.fullName && (
      <div className="text-center mb-6 border-b-2 border-gray-400 pb-4">
        <h1 className="text-lg font-bold text-gray-900"><span>{data.fullName}</span></h1>
        <div className="text-gray-600 text-xs mt-2 italic space-y-1">
          {visibleFields.email && data.email && <div><span>{data.email}</span></div>}
          {visibleFields.phone && data.phone && <div><span>{data.phone}</span></div>}
          {visibleFields.location && data.location && <div><span>{data.location}</span></div>}
          {visibleFields.website && data.website && <div><span>{data.website}</span></div>}
          {visibleFields.linkedin && data.linkedin && <div><span>{data.linkedin}</span></div>}
          {visibleFields.github && data.github && <div><span>{data.github}</span></div>}
        </div>
      </div>
    )}

    <div className="space-y-5">
      {visibleFields.summary && data.summary && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm"><span>Research Interests</span></h3>
          <p className="text-gray-700 text-xs leading-relaxed text-justify"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm"><span>Research Achievements</span></h3>
          <div className="bg-gray-50 p-3 border border-gray-200">
            {data.achievements.map((achievement, i) => (
              <span key={i} className="text-gray-700 text-xs mb-2 leading-relaxed text-justify block"><span>•</span> <span>{achievement}</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.education && data.education?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-sm"><span>Education</span></h3>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i} className="bg-gray-50 p-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs"><span>{edu.degree}</span></h4>
                <span className="text-gray-700 text-xs italic block"><span>{edu.school}</span></span>
                <span className="text-gray-600 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-sm"><span>Academic Experience</span></h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs"><span>{exp.position}</span></h4>
                    <span className="text-gray-700 text-xs italic block"><span>{exp.company}</span></span>
                  </div>
                  <span className="text-gray-600 text-xs"><span>{exp.duration}</span></span>
                </div>
                <span className="text-gray-700 text-xs mt-1 leading-relaxed text-justify block"><span>{exp.description}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        {visibleFields.skills && data.skills?.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-sm"><span>Research Methods & Skills</span></h3>
            <div className="text-gray-700 text-xs flex flex-wrap gap-1">
              {data.skills.map((skill, i) => (
                <span key={i}><span>{skill}</span>{i < data.skills.length - 1 && <span>; </span>}</span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.languages && data.languages?.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-sm"><span>Languages</span></h3>
            <div className="text-gray-700 text-xs flex flex-wrap gap-1">
              {data.languages.map((lang, i) => (
                <span key={i}><span>{lang}</span>{i < data.languages.length - 1 && <span>, </span>}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibleFields.projects && data.projects?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm"><span>Research Projects</span></h3>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <div key={i} className="bg-gray-50 p-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs"><span>{proj.name}</span></h4>
                <span className="text-gray-700 text-xs mt-1 leading-relaxed text-justify block"><span>{proj.description}</span></span>
                {proj.technologies && (
                  <span className="text-gray-600 text-xs mt-1 italic block"><span>Methodology:</span> <span>{proj.technologies}</span></span>
                )}
                {proj.link && (
                  <span className="text-gray-600 text-xs mt-1 block"><span>Publication/Link:</span> <span>{proj.link}</span></span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleFields.certifications && data.certifications?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm"><span>Publications & Awards</span></h3>
          <div className="space-y-3">
            {data.certifications.map((cert, i) => (
              <div key={i} className="bg-gray-50 p-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs"><span>{cert.name}</span></h4>
                <span className="text-gray-700 text-xs italic block"><span>{cert.issuer}</span></span>
                <span className="text-gray-600 text-xs block"><span>{cert.year}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Startup Vision Template (Startup category)
const StartupVisionTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full text-xs font-sans bg-gradient-to-br from-orange-50 to-red-100 p-6">
    {visibleFields.fullName && (
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-orange-600"><span>{data.fullName || "Full Name"}</span></h1>
        <div className="text-orange-600 text-xs mt-2 space-x-3">
          {visibleFields.email && data.email && <span><span>📧</span> <span>{data.email}</span></span>}
          {visibleFields.phone && data.phone && <span><span>📱</span> <span>{data.phone}</span></span>}
          {visibleFields.location && data.location && <span><span>🌍</span> <span>{data.location}</span></span>}
        </div>
        <div className="text-orange-600 text-xs mt-1 space-x-3">
          {visibleFields.website && data.website && <span><span>🌐</span> <span>{data.website}</span></span>}
          {visibleFields.linkedin && data.linkedin && <span><span>🔗</span> <span>{data.linkedin}</span></span>}
          {visibleFields.github && data.github && <span><span>💻</span> <span>{data.github}</span></span>}
        </div>
      </div>
    )}

    <div className="space-y-4">
      {visibleFields.summary && data.summary && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-orange-200">
          <h3 className="font-bold text-orange-800 mb-2 flex items-center"><span>🚀 Vision Statement</span></h3>
          <p className="text-gray-700 text-xs leading-relaxed"><span>{data.summary}</span></p>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-red-200">
          <h3 className="font-bold text-red-800 mb-2 flex items-center"><span>🏆 Entrepreneurial Achievements</span></h3>
          <div className="space-y-1">
            {data.achievements.map((achievement, i) => (
              <span key={i} className="text-gray-700 text-xs block"><span>🎯</span> <span>{achievement}</span></span>
            ))}
          </div>
        </div>
      )}

      {visibleFields.experience && data.experience?.length > 0 && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-red-200">
          <h3 className="font-bold text-red-800 mb-3 flex items-center"><span>💼 Entrepreneurial Journey</span></h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i} className="border-l-4 border-orange-400 pl-3 bg-orange-50/50 p-2 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-orange-700 text-xs"><span>{exp.position}</span></h4>
                    <span className="text-red-600 text-xs font-medium block"><span>{exp.company}</span></span>
                  </div>
                  <span className="text-gray-600 text-xs"><span>{exp.duration}</span></span>
                </div>
                <span className="text-gray-700 text-xs mt-1 block"><span>{exp.description}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.skills && data.skills?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2"><span>🔥 Core Skills</span></h3>
            <div className="space-y-1">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-2 py-1 rounded-full text-xs block"><span>{skill}</span></span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-red-200">
            <h3 className="font-bold text-red-800 mb-2"><span>💡 Innovation Portfolio</span></h3>
            <div className="space-y-2">
              {data.projects.map((proj, i) => (
                <span key={i} className="bg-red-50 p-2 rounded border border-red-200 block">
                  <h4 className="font-bold text-red-700 text-xs"><span>{proj.name}</span></h4>
                  <span className="text-gray-700 text-xs block"><span>{proj.description}</span></span>
                  {proj.technologies && (
                    <span className="text-red-600 text-xs mt-1 block"><span>Tech Stack:</span> <span>{proj.technologies}</span></span>
                  )}
                  {proj.link && (
                    <span className="text-orange-600 text-xs mt-1 block"><span>🔗</span> <span>{proj.link}</span></span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleFields.education && data.education?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2"><span>🎓 Education</span></h3>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <span key={i} className="block">
                  <h4 className="font-bold text-orange-700 text-xs"><span>{edu.degree}</span></h4>
                  <span className="text-red-600 text-xs block"><span>{edu.school}</span></span>
                  <span className="text-gray-600 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.languages && data.languages?.length > 0 && (
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-red-200">
            <h3 className="font-bold text-red-800 mb-2"><span>🌐 Languages</span></h3>
            <div className="flex flex-wrap gap-1">
              {data.languages.map((lang, i) => (
                <span key={i} className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-2 py-1 rounded-full text-xs"><span>{lang}</span></span>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibleFields.certifications && data.certifications?.length > 0 && (
        <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-2 border-orange-200">
          <h3 className="font-bold text-orange-800 mb-2"><span>🏅 Certifications & Awards</span></h3>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <span key={i} className="bg-gradient-to-r from-orange-50 to-red-50 p-2 rounded border border-orange-200 block">
                <h4 className="font-bold text-orange-700 text-xs"><span>{cert.name}</span></h4>
                <span className="text-red-600 text-xs block"><span>{cert.issuer}</span></span>
                <span className="text-gray-600 text-xs block"><span>{cert.year}</span></span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// NEW TEMPLATES - Second template for each industry

// Corporate Elite Template (Professional category)
const CorporateEliteTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white flex flex-col font-serif text-xs">
    {/* Header Section */}
    <div className="bg-indigo-900 text-white p-6 text-center">
      {visibleFields.fullName && (
        <h1 className="text-xl font-bold mb-2"><span>{data.fullName || "Full Name"}</span></h1>
      )}
      <div className="flex justify-center items-center gap-4 text-xs">
        {visibleFields.email && data.email && <span><span>📧</span> <span>{data.email}</span></span>}
        {visibleFields.phone && data.phone && <span><span>📞</span> <span>{data.phone}</span></span>}
        {visibleFields.location && data.location && <span><span>📍</span> <span>{data.location}</span></span>}
      </div>
      <div className="flex justify-center items-center gap-4 text-xs mt-1">
        {visibleFields.website && data.website && <span><span>🌐</span> <span>{data.website}</span></span>}
        {visibleFields.linkedin && data.linkedin && <span><span>💼</span> <span>{data.linkedin}</span></span>}
        {visibleFields.github && data.github && <span><span>⚡</span> <span>{data.github}</span></span>}
      </div>
    </div>

    <div className="flex-1 flex">
      {/* Main Content */}
      <div className="w-2/3 p-6">
        {visibleFields.summary && data.summary && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-sm border-b-2 border-indigo-200 pb-1"><span>Executive Summary</span></h3>
            <p className="text-gray-700 leading-relaxed text-xs"><span>{data.summary}</span></p>
          </div>
        )}

        {visibleFields.achievements && data.achievements?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-sm border-b-2 border-indigo-200 pb-1"><span>Executive Achievements</span></h3>
            <div className="space-y-1">
              {data.achievements.map((achievement, i) => (
                <span key={i} className="text-gray-700 text-xs flex items-start"><span className="text-indigo-600 mr-2">◆</span> <span>{achievement}</span></span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.experience && data.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-sm border-b-2 border-indigo-200 pb-1"><span>Professional Experience</span></h3>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs"><span>{exp.position}</span></h4>
                      <span className="text-indigo-700 font-medium text-xs block"><span>{exp.company}</span></span>
                    </div>
                    <span className="text-gray-600 font-medium text-xs"><span>{exp.duration}</span></span>
                  </div>
                  <span className="text-gray-700 leading-relaxed text-xs block"><span>{exp.description}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-sm border-b-2 border-indigo-200 pb-1"><span>Strategic Projects</span></h3>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <span key={i} className="bg-indigo-50 p-3 rounded border border-indigo-200 block">
                  <h4 className="font-bold text-indigo-800 text-xs"><span>{proj.name}</span></h4>
                  <span className="text-gray-700 text-xs mt-1 block"><span>{proj.description}</span></span>
                  {proj.technologies && (
                    <span className="text-indigo-600 text-xs mt-1 block"><span>Technologies:</span> <span>{proj.technologies}</span></span>
                  )}
                  {proj.link && (
                    <span className="text-indigo-700 text-xs mt-1 block"><span>🔗</span> <span>{proj.link}</span></span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-1/3 bg-indigo-50 p-6">
        {visibleFields.skills && data.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-xs"><span>Core Competencies</span></h3>
            <div className="space-y-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-indigo-100 px-3 py-1 rounded text-indigo-800 text-xs block"><span>{skill}</span></span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.education && data.education?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-xs"><span>Education</span></h3>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <span key={i} className="block">
                  <h4 className="font-bold text-gray-900 text-xs"><span>{edu.degree}</span></h4>
                  <span className="text-indigo-700 text-xs block"><span>{edu.school}</span></span>
                  <span className="text-gray-600 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.languages && data.languages?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-xs"><span>Languages</span></h3>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <span key={i} className="bg-white px-2 py-1 rounded text-indigo-800 text-xs border border-indigo-200 block"><span>{lang}</span></span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.certifications && data.certifications?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-indigo-900 font-bold mb-3 text-xs"><span>Certifications</span></h3>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <span key={i} className="bg-white p-2 rounded border border-indigo-200 block">
                  <h4 className="font-bold text-indigo-800 text-xs"><span>{cert.name}</span></h4>
                  <span className="text-indigo-600 text-xs block"><span>{cert.issuer}</span></span>
                  <span className="text-gray-600 text-xs block"><span>{cert.year}</span></span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Contemporary Flex Template (Modern category)
const ContemporaryFlexTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-sans text-xs">
    <div className="p-8">
      {/* Header */}
      {visibleFields.fullName && (
        <div className="text-center mb-8">
          <h1 className="text-xl font-light text-slate-800 mb-2"><span>{data.fullName || "Full Name"}</span></h1>
          <div className="flex justify-center gap-4 text-slate-600 text-xs">
            {visibleFields.email && data.email && <span><span>📧</span> <span>{data.email}</span></span>}
            {visibleFields.phone && data.phone && <span><span>📞</span> <span>{data.phone}</span></span>}
            {visibleFields.location && data.location && <span><span>📍</span> <span>{data.location}</span></span>}
          </div>
          <div className="flex justify-center gap-4 text-slate-600 text-xs mt-1">
            {visibleFields.website && data.website && <span><span>🌐</span> <span>{data.website}</span></span>}
            {visibleFields.linkedin && data.linkedin && <span><span>💼</span> <span>{data.linkedin}</span></span>}
            {visibleFields.github && data.github && <span><span>⚡</span> <span>{data.github}</span></span>}
          </div>
        </div>
      )}

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary */}
        {visibleFields.summary && data.summary && (
          <div className="md:col-span-2">
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-slate-800 font-semibold mb-3 text-sm"><span>Profile</span></h3>
              <p className="text-slate-700 leading-relaxed text-xs"><span>{data.summary}</span></p>
            </div>
          </div>
        )}

        {/* Skills */}
        {visibleFields.skills && data.skills?.length > 0 && (
          <div>
            <h3 className="text-slate-800 font-semibold mb-3 text-sm"><span>Skills</span></h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs"><span>{skill}</span></span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {visibleFields.achievements && data.achievements?.length > 0 && (
          <div className="md:col-span-3">
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-slate-800 font-semibold mb-3 text-sm"><span>Key Achievements</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.achievements.map((achievement, i) => (
                  <span key={i} className="text-slate-700 text-xs flex items-start"><span className="text-slate-500 mr-2">•</span> <span>{achievement}</span></span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {visibleFields.experience && data.experience?.length > 0 && (
          <div className="md:col-span-3">
            <h3 className="text-slate-800 font-semibold mb-4 text-sm"><span>Experience</span></h3>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <span key={i} className="border-l-4 border-slate-300 pl-6 block">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs"><span>{exp.position}</span></h4>
                      <span className="text-slate-600 text-xs block"><span>{exp.company}</span></span>
                    </div>
                    <span className="text-slate-500 text-xs"><span>{exp.duration}</span></span>
                  </div>
                  <span className="text-slate-700 text-xs block"><span>{exp.description}</span></span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="text-slate-800 font-semibold mb-3 text-sm"><span>Projects</span></h3>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <span key={i} className="bg-slate-50 p-4 rounded-lg block">
                  <h4 className="font-semibold text-slate-900 text-xs"><span>{proj.name}</span></h4>
                  <span className="text-slate-700 text-xs mt-1 block"><span>{proj.description}</span></span>
                  {proj.technologies && (
                    <span className="text-slate-600 text-xs mt-1 block"><span>Tech:</span> <span>{proj.technologies}</span></span>
                  )}
                  {proj.link && (
                    <span className="text-slate-700 text-xs mt-1 block"><span>🔗</span> <span>{proj.link}</span></span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education & Additional Info */}
        <div className="space-y-6">
          {visibleFields.education && data.education?.length > 0 && (
            <div>
              <h3 className="text-slate-800 font-semibold mb-3 text-sm"><span>Education</span></h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <span key={i} className="bg-slate-50 p-3 rounded block">
                    <h4 className="font-semibold text-slate-900 text-xs"><span>{edu.degree}</span></h4>
                    <span className="text-slate-600 text-xs block"><span>{edu.school}</span></span>
                    <span className="text-slate-500 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div>
              <h3 className="text-slate-800 font-semibold mb-3 text-sm"><span>Languages</span></h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"><span>{lang}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-slate-800 font-semibold mb-3 text-sm"><span>Certifications</span></h3>
              <div className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <span key={i} className="bg-slate-50 p-2 rounded block">
                    <h4 className="font-semibold text-slate-900 text-xs"><span>{cert.name}</span></h4>
                    <span className="text-slate-600 text-xs block"><span>{cert.issuer}</span></span>
                    <span className="text-slate-500 text-xs block"><span>{cert.year}</span></span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Enterprise Focus Template (Business category)
const EnterpriseFocusTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-sans text-xs">
    {/* Header */}
    <div className="bg-blue-800 text-white p-6">
      {visibleFields.fullName && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold"><span>{data.fullName || "Full Name"}</span></h1>
            <div className="mt-2 space-x-4 text-xs">
              {visibleFields.email && data.email && <span><span>📧</span> <span>{data.email}</span></span>}
              {visibleFields.phone && data.phone && <span><span>📞</span> <span>{data.phone}</span></span>}
            </div>
          </div>
          <div className="text-right text-xs">
            {visibleFields.location && data.location && <div><span>📍</span> <span>{data.location}</span></div>}
            {visibleFields.website && data.website && <div><span>🌐</span> <span>{data.website}</span></div>}
            {visibleFields.linkedin && data.linkedin && <div><span>🔗</span> <span>{data.linkedin}</span></div>}
            {visibleFields.github && data.github && <div><span>💻</span> <span>{data.github}</span></div>}
          </div>
        </div>
      )}
    </div>

    <div className="p-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="col-span-3">
          {visibleFields.summary && data.summary && (
            <div className="mb-6">
              <h3 className="text-blue-800 font-bold text-sm mb-3 border-b border-blue-200 pb-2"><span>BUSINESS OVERVIEW</span></h3>
              <p className="text-gray-700 leading-relaxed text-xs"><span>{data.summary}</span></p>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-blue-800 font-bold text-sm mb-3 border-b border-blue-200 pb-2"><span>KEY ACHIEVEMENTS</span></h3>
              <div className="grid grid-cols-1 gap-1">
                {data.achievements.map((achievement, i) => (
                  <span key={i} className="text-gray-700 text-xs flex items-start"><span className="text-blue-600 mr-2">▶</span> <span>{achievement}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.experience && data.experience?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-blue-800 font-bold text-sm mb-3 border-b border-blue-200 pb-2"><span>PROFESSIONAL EXPERIENCE</span></h3>
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <span key={i} className="bg-blue-50 p-4 rounded block">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold text-blue-900 text-xs"><span>{exp.position}</span></h4>
                      <span className="text-blue-700 font-medium text-xs"><span>{exp.duration}</span></span>
                    </div>
                    <span className="text-blue-800 font-medium mb-2 text-xs block"><span>{exp.company}</span></span>
                    <span className="text-gray-700 text-xs block"><span>{exp.description}</span></span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-blue-800 font-bold text-sm mb-3 border-b border-blue-200 pb-2"><span>ENTERPRISE PROJECTS</span></h3>
              <div className="space-y-3">
                {data.projects.map((proj, i) => (
                  <span key={i} className="bg-blue-50 p-3 rounded border border-blue-200 block">
                    <h4 className="font-bold text-blue-900 text-xs"><span>{proj.name}</span></h4>
                    <span className="text-gray-700 text-xs mt-1 block"><span>{proj.description}</span></span>
                    {proj.technologies && (
                      <span className="text-blue-600 text-xs mt-1 block"><span>Technologies:</span> <span>{proj.technologies}</span></span>
                    )}
                    {proj.link && (
                      <span className="text-blue-700 text-xs mt-1 block"><span>🔗</span> <span>{proj.link}</span></span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {visibleFields.skills && data.skills?.length > 0 && (
            <div>
              <h3 className="text-blue-800 font-bold mb-3 text-xs"><span>CORE SKILLS</span></h3>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs block"><span>{skill}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.education && data.education?.length > 0 && (
            <div>
              <h3 className="text-blue-800 font-bold mb-3 text-xs"><span>EDUCATION</span></h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <span key={i} className="block">
                    <h4 className="font-semibold text-gray-900 text-xs"><span>{edu.degree}</span></h4>
                    <span className="text-blue-700 text-xs block"><span>{edu.school}</span></span>
                    <span className="text-gray-600 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div>
              <h3 className="text-blue-800 font-bold mb-3 text-xs"><span>LANGUAGES</span></h3>
              <div className="space-y-1">
                {data.languages.map((lang, i) => (
                  <span key={i} className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs block"><span>{lang}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-blue-800 font-bold mb-3 text-xs"><span>CERTIFICATIONS</span></h3>
              <div className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <span key={i} className="bg-blue-50 p-2 rounded border border-blue-200 block">
                    <h4 className="font-semibold text-blue-900 text-xs"><span>{cert.name}</span></h4>
                    <span className="text-blue-700 text-xs block"><span>{cert.issuer}</span></span>
                    <span className="text-gray-600 text-xs block"><span>{cert.year}</span></span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Wealth Advisor Template (Finance category)
const WealthAdvisorTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-serif text-xs">
    {/* Header */}
    <div className="bg-emerald-800 text-white p-6 text-center">
      {visibleFields.fullName && (
        <>
          <h1 className="text-xl font-bold mb-2"><span>{data.fullName || "Full Name"}</span></h1>
          
          <div className="flex justify-center gap-4 mt-3 text-xs">
            {visibleFields.email && data.email && <span><span>📧</span> <span>{data.email}</span></span>}
            {visibleFields.phone && data.phone && <span><span>📞</span> <span>{data.phone}</span></span>}
            {visibleFields.location && data.location && <span><span>📍</span> <span>{data.location}</span></span>}
          </div>
          <div className="flex justify-center gap-4 mt-1 text-xs">
            {visibleFields.website && data.website && <span><span>🌐</span> <span>{data.website}</span></span>}
            {visibleFields.linkedin && data.linkedin && <span><span>💼</span> <span>{data.linkedin}</span></span>}
            {visibleFields.github && data.github && <span><span>⚡</span> <span>{data.github}</span></span>}
          </div>
        </>
      )}
    </div>

    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2">
          {visibleFields.summary && data.summary && (
            <div className="mb-6">
              <h3 className="text-emerald-800 font-bold text-sm mb-3"><span>Professional Summary</span></h3>
              <div className="bg-emerald-50 p-4 rounded border-l-4 border-emerald-600">
                <p className="text-gray-700 leading-relaxed text-xs"><span>{data.summary}</span></p>
              </div>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-emerald-800 font-bold text-sm mb-3"><span>Financial Achievements</span></h3>
              <div className="bg-emerald-50 p-4 rounded border-l-4 border-emerald-500">
                <div className="space-y-1">
                  {data.achievements.map((achievement, i) => (
                    <span key={i} className="text-gray-700 text-xs flex items-start"><span className="text-emerald-600 mr-2">💰</span> <span>{achievement}</span></span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {visibleFields.experience && data.experience?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-emerald-800 font-bold text-sm mb-3">
                Professional Experience
              </h3>
              <div className="space-y-5">
                {data.experience.map((exp, i) => (
                  <div key={i} className="border-b border-emerald-100 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-emerald-900 text-xs"><span>{exp.position}</span></h4>
                        <span className="text-emerald-700 font-medium text-xs block"><span>{exp.company}</span></span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-xs"><span>{exp.duration}</span></span>
                    </div>
                    <span className="text-gray-700 leading-relaxed text-xs block"><span>{exp.description}</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-emerald-800 font-bold text-sm mb-3">
                Financial Projects
              </h3>
              <div className="space-y-3">
                {data.projects.map((proj, i) => (
                  <div key={i} className="bg-emerald-50 p-3 rounded border border-emerald-200">
                    <h4 className="font-bold text-emerald-900 text-xs"><span>{proj.name}</span></h4>
                    <span className="text-gray-700 text-xs mt-1 block"><span>{proj.description}</span></span>
                    {proj.technologies && (
                      <span className="text-emerald-600 text-xs mt-1 block"><span>Technologies:</span> <span>{proj.technologies}</span></span>
                    )}
                    {proj.link && (
                      <span className="text-emerald-700 text-xs mt-1 block"><span>🔗</span> <span>{proj.link}</span></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {visibleFields.skills && data.skills?.length > 0 && (
            <div>
              <h3 className="text-emerald-800 font-bold mb-3 text-xs">Financial Expertise</h3>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded text-xs font-medium block"><span>💰</span> <span>{skill}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.education && data.education?.length > 0 && (
            <div>
              <h3 className="text-emerald-800 font-bold mb-3 text-xs">Education</h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <span key={i} className="bg-emerald-50 p-3 rounded border block">
                    <h4 className="font-semibold text-emerald-900 text-xs"><span>{edu.degree}</span></h4>
                    <span className="text-emerald-700 text-xs block"><span>{edu.school}</span></span>
                    <span className="text-gray-600 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div>
              <h3 className="text-emerald-800 font-bold mb-3 text-xs">Languages</h3>
              <div className="space-y-1">
                {data.languages.map((lang, i) => (
                  <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs block"><span>🌐</span> <span>{lang}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-emerald-800 font-bold mb-3 text-xs">Certifications</h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <span key={i} className="bg-emerald-50 p-3 rounded border block">
                    <h4 className="font-semibold text-emerald-900 text-xs"><span>{cert.name}</span></h4>
                    <span className="text-emerald-700 text-xs block"><span>{cert.issuer}</span></span>
                    <span className="text-gray-600 text-xs block"><span>{cert.year}</span></span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Artistic Portfolio Template (Creative category)
const ArtisticPortfolioTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-gradient-to-br from-pink-50 to-purple-50 font-sans text-xs">
    <div className="p-6">
      {/* Creative Header */}
      {visibleFields.fullName && (
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-pink-700 mb-3"><span>{data.fullName || "Full Name"}</span></h1>
         
          <div className="flex justify-center gap-4 text-gray-600 text-xs">
            {visibleFields.email && data.email && <span><span>📧</span> <span>{data.email}</span></span>}
            {visibleFields.phone && data.phone && <span><span>📞</span> <span>{data.phone}</span></span>}
            {visibleFields.location && data.location && <span><span>📍</span> <span>{data.location}</span></span>}
          </div>
          <div className="flex justify-center gap-4 text-gray-600 text-xs mt-1">
            {visibleFields.website && data.website && <span><span>🌐</span> <span>{data.website}</span></span>}
            {visibleFields.linkedin && data.linkedin && <span><span>💼</span> <span>{data.linkedin}</span></span>}
            {visibleFields.github && data.github && <span><span>⚡</span> <span>{data.github}</span></span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          {visibleFields.summary && data.summary && (
            <div className="mb-6">
              <h3 className="text-pink-700 font-bold text-sm mb-3 flex items-center"><span>🎨 Creative Vision</span></h3>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-pink-500">
                <p className="text-gray-700 leading-relaxed text-xs"><span>{data.summary}</span></p>
              </div>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-purple-700 font-bold text-sm mb-3 flex items-center"><span>🏆 Creative Achievements</span></h3>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="space-y-1">
                  {data.achievements.map((achievement, i) => (
                    <span key={i} className="text-gray-700 text-xs flex items-start"><span className="text-pink-600 mr-2">✨</span> <span>{achievement}</span></span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-pink-700 font-bold text-sm mb-3 flex items-center">
                🎯 Portfolio Projects
              </h3>
              <div className="space-y-3">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-md border border-purple-400">
                    <h4 className="font-bold text-purple-900 text-xs"><span>{project.name}</span></h4>
                    <span className="text-gray-700 mt-2 leading-relaxed text-xs block"><span>{project.description}</span></span>
                    {project.technologies && (
                      <span className="text-pink-600 text-xs mt-2 block"><span>Tech:</span> <span>{project.technologies}</span></span>
                    )}
                    {project.link && (
                      <span className="text-purple-600 text-xs mt-1 block"><span>🔗</span> <span>{project.link}</span></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {visibleFields.experience && data.experience?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-pink-700 font-bold text-sm mb-3 flex items-center">
                🚀 Creative Experience
              </h3>
              <div className="space-y-3">
                {data.experience.map((exp, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-purple-900 text-xs"><span>{exp.position}</span></h4>
                        <span className="text-pink-600 font-medium text-xs block"><span>{exp.company}</span></span>
                      </div>
                      <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs"><span>{exp.duration}</span></span>
                    </div>
                    <span className="text-gray-700 text-xs block"><span>{exp.description}</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.skills && data.skills?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-pink-700 font-bold mb-3 text-xs flex items-center">
                ✨ Creative Skills
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-2 py-1 rounded-lg text-xs text-center font-medium block"><span>{skill}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.education && data.education?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-purple-700 font-bold mb-3 text-xs">Education</h3>
              <div className="space-y-2">
                {data.education.map((edu, i) => (
                  <span key={i} className="bg-white p-3 rounded-lg shadow-md block">
                    <h4 className="font-bold text-purple-900 text-xs"><span>{edu.degree}</span></h4>
                    <span className="text-pink-600 text-xs block"><span>{edu.school}</span></span>
                    <span className="text-gray-600 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-pink-700 font-bold mb-3 text-xs">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <span key={i} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs"><span>{lang}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-purple-700 font-bold mb-3 text-xs">Certifications</h3>
              <div className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <span key={i} className="bg-white p-2 rounded-lg shadow-md block">
                    <h4 className="font-bold text-purple-900 text-xs"><span>{cert.name}</span></h4>
                    <span className="text-pink-600 text-xs block"><span>{cert.issuer}</span></span>
                    <span className="text-gray-600 text-xs block"><span>{cert.year}</span></span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Code Architect Template (Tech category)
const CodeArchitectTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-gray-900 text-cyan-400 font-mono text-xs">
    <div className="p-6">
      {/* Terminal Header */}
      {visibleFields.fullName && (
        <div className="bg-gray-800 p-4 rounded-t border border-cyan-500">
          <div className="flex items-center mb-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="ml-4 text-gray-400">developer@portfolio:~$</span>
          </div>
          <h1 className="text-lg font-bold text-cyan-300">
            <span>{data.fullName || "Full Name"}</span> 
          </h1>
          <div className="mt-2 text-xs">
            {visibleFields.email && data.email && <span className="text-green-400"><span>email:</span> <span>{data.email}</span></span>}
            {visibleFields.phone && data.phone && <span className="ml-4 text-green-400"><span>phone:</span> <span>{data.phone}</span></span>}
          </div>
          <div className="mt-1 text-xs">
            {visibleFields.location && data.location && <span className="text-green-400"><span>location:</span> <span>{data.location}</span></span>}
            {visibleFields.website && data.website && <span className="ml-4 text-green-400"><span>website:</span> <span>{data.website}</span></span>}
          </div>
          <div className="mt-1 text-xs">
            {visibleFields.linkedin && data.linkedin && <span className="text-green-400"><span>linkedin:</span> <span>{data.linkedin}</span></span>}
            {visibleFields.github && data.github && <span className="ml-4 text-green-400"><span>github:</span> <span>{data.github}</span></span>}
          </div>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-b border-x border-b border-cyan-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {visibleFields.summary && data.summary && (
              <div className="mb-6">
                <h3 className="text-cyan-300 font-bold mb-3">
                  <span className="text-gray-500">/*</span> SYSTEM_OVERVIEW <span className="text-gray-500">*/</span>
                </h3>
                <div className="bg-gray-900 p-3 rounded border border-gray-700">
                  <p className="text-gray-300 leading-relaxed text-xs"><span>{data.summary}</span></p>
                </div>
              </div>
            )}

            {visibleFields.achievements && data.achievements?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-cyan-300 font-bold mb-3">
                  <u className="text-gray-500 font-normal">const</u> achievements = [
                </h3>
                <div className="ml-4 space-y-1">
                  {data.achievements.map((achievement, i) => (
                    <span key={i} className="text-green-400 text-xs block">"💯 <span>{achievement}</span>",</span>
                  ))}
                </div>
                <div className="text-cyan-300">];</div>
              </div>
            )}

            {visibleFields.skills && data.skills?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-cyan-300 font-bold mb-3">
                  <u className="text-gray-500 font-normal">const</u> techStack = &#123;
                </h3>
                <div className="ml-4 space-y-1">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="text-green-400 text-xs block">"<span>{skill}</span>": <span className="text-yellow-400">true</span>,</span>
                  ))}
                </div>
                <div className="text-cyan-300">&#125;;</div>
              </div>
            )}

            {visibleFields.education && data.education?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-cyan-300 font-bold mb-3">
                  <u className="text-gray-500 font-normal">const</u> education = [
                </h3>
                <div className="ml-4 space-y-2">
                  {data.education.map((edu, i) => (
                    <span key={i} className="bg-gray-900 p-2 rounded border border-gray-700 block">
                      <span className="text-yellow-400 text-xs">"<span>{edu.degree}</span>"</span>
                      <span className="text-green-400 text-xs block"><span>{edu.school}</span></span>
                      <span className="text-gray-400 text-xs block"><span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}</span>
                    </span>
                  ))}
                </div>
                <div className="text-cyan-300">];</div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {visibleFields.experience && data.experience?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-cyan-300 font-bold mb-3">
                  <u className="text-gray-500 font-normal">class</u> Experience &#123;
                </h3>
                <div className="ml-4 space-y-3">
                  {data.experience.map((exp, i) => (
                    <span key={i} className="bg-gray-900 p-3 rounded border border-gray-700 block">
                      <span className="text-yellow-400 font-semibold text-xs block"><span>{exp.position}</span></span>
                      <span className="text-green-400 text-xs block"><span>{exp.company}</span></span>
                      <span className="text-gray-400 text-xs block"><span>{exp.duration}</span></span>
                      <span className="text-gray-300 text-xs mt-1 block"><span>{exp.description}</span></span>
                    </span>
                  ))}
                </div>
                <div className="text-cyan-300">&#125;</div>
              </div>
            )}

            {visibleFields.projects && data.projects?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-cyan-300 font-bold mb-3">
                 <u className="text-gray-500 font-normal">const</u> projects = [
                </h3>
                <div className="ml-4 space-y-2">
                  {data.projects.map((project, i) => (
                    <span key={i} className="bg-gray-900 p-2 rounded border border-gray-700 block">
                      <span className="text-yellow-400 text-xs block">"<span>{project.name}</span>"</span>
                      <span className="text-gray-300 text-xs block"><span>{project.description}</span></span>
                      {project.technologies && (
                        <span className="text-green-400 text-xs block"><span>Tech:</span> <span>{project.technologies}</span></span>
                      )}
                      {project.link && (
                        <span className="text-cyan-400 text-xs block"><span>Link:</span> <span>{project.link}</span></span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="text-cyan-300">];</div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {visibleFields.languages && data.languages?.length > 0 && (
                <div>
                  <h3 className="text-cyan-300 font-bold mb-3">
                    <u className="text-gray-500 font-normal">const</u> languages = [
                  </h3>  
                  <div className="ml-4 space-y-1">
                    {data.languages.map((lang, i) => (
                      <span key={i} className="text-green-400 text-xs block">"<span>{lang}</span>",</span>
                    ))}
                  </div>
                  <div className="text-cyan-300">];</div>
                </div>
              )}

              {visibleFields.certifications && data.certifications?.length > 0 && (
                <div>
                  <h3 className="text-cyan-300 font-bold mb-3">
                    <u className="text-gray-500 font-normal">const</u> certifications = [
                  </h3>
                  <div className="ml-4 space-y-1">
                    {data.certifications.map((cert, i) => (
                      <span key={i} className="bg-gray-900 p-2 rounded border border-gray-700 block">
                        <span className="text-yellow-400 text-xs block">"<span>{cert.name}</span>"</span>
                        <span className="text-green-400 text-xs block"><span>{cert.issuer}</span></span>
                        <span className="text-gray-400 text-xs block"><span>{cert.year}</span></span>
                      </span>
                    ))}
                  </div>
                  <div className="text-cyan-300">];</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Leadership Vision Template (Executive category)
const LeadershipVisionTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-serif text-xs">
    {/* Executive Header */}
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
      {visibleFields.fullName && (
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2"><span>{data.fullName}</span></h1>
         
          <div className="flex justify-center gap-4 text-amber-100 text-xs">
            {visibleFields.email && data.email && <span><span>📧</span> <span>{data.email}</span></span>}
            {visibleFields.phone && data.phone && <span><span>📞</span> <span>{data.phone}</span></span>}
            {visibleFields.location && data.location && <span><span>📍</span> <span>{data.location}</span></span>}
          </div>
          <div className="flex justify-center gap-4 text-amber-100 text-xs mt-1">
            {visibleFields.website && data.website && <span><span>🌐</span> <span>{data.website}</span></span>}
            {visibleFields.linkedin && data.linkedin && <span><span>💼</span> <span>{data.linkedin}</span></span>}
            {visibleFields.github && data.github && <span><span>⚡</span> <span>{data.github}</span></span>}
          </div>
        </div>
      )}
    </div>

    <div className="p-6">
      {/* Leadership Summary */}
      {visibleFields.summary && data.summary && (
        <div className="mb-6 text-center">
          <h3 className="text-amber-700 font-bold text-sm mb-3">
            <span>LEADERSHIP VISION</span>
          </h3>
          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
            <p className="text-gray-700 text-xs leading-relaxed italic"><span>{data.summary}</span></p>
          </div>
        </div>
      )}

      {visibleFields.achievements && data.achievements?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-amber-700 font-bold text-sm mb-3 text-center">
            <span>EXECUTIVE ACHIEVEMENTS</span>
          </h3>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.achievements.map((achievement, i) => (
                <span key={i} className="text-gray-700 text-xs flex items-start">
                  <span className="text-amber-600 mr-2">🏆</span>
                  <span>{achievement}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Experience */}
        {visibleFields.experience && data.experience?.length > 0 && (
          <div>
            <h3 className="text-amber-700 font-bold text-sm mb-3">
              <span>EXECUTIVE EXPERIENCE</span>
            </h3>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <span key={i} className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 block">
                  <div className="flex justify-between items-start mb-2 w-full">
                    <div className="flex flex-col">
                      <span className="font-bold text-amber-900 text-xs">{exp.position}</span>
                      <span className="text-amber-700 font-medium text-xs">{exp.company}</span>
                    </div>
                    <span className="bg-amber-600 text-white px-2 py-1 rounded text-xs"><span>{exp.duration}</span></span>
                  </div>
                  <span className="text-gray-700 text-xs leading-relaxed block">{exp.description}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Leadership Competencies */}
        <div>
          {visibleFields.skills && data.skills?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-amber-700 font-bold text-sm mb-3">
                <span>LEADERSHIP COMPETENCIES</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-2 rounded-lg text-xs font-medium text-center"> <span>🎯{skill}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.education && data.education?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-amber-700 font-bold text-sm mb-3"><span>EDUCATION</span></h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i} className="bg-amber-50 p-3 rounded-lg border border-amber-200 block">
                    <span className="font-bold text-amber-900 text-xs">{edu.degree}</span>
                    <span className="text-amber-700 text-xs block">{edu.school}</span>
                    <div className="text-gray-600 text-xs block">
                      <span>{edu.year}</span>{edu.grade && <span> • {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-amber-700 font-bold text-sm mb-3"><span>STRATEGIC INITIATIVES</span></h3>
              <div className="space-y-2">
                {data.projects.map((proj, i) => (
                  <span key={i} className="bg-orange-50 p-3 rounded border border-orange-200 block">
                    <span className="font-bold text-orange-800 text-xs">{proj.name}</span>
                    <span className="text-gray-700 text-xs mt-1 block">{proj.description}</span>
                    {proj.technologies && (
                      <span className="text-amber-600 text-xs mt-1 block">Technologies: {proj.technologies}</span>
                    )}
                    {proj.link && (
                      <span className="text-amber-700 text-xs mt-1 block">🔗{proj.link}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-amber-700 font-bold text-sm mb-3"><span>LANGUAGES</span></h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <span key={i} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs"><span>{lang}</span></span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-amber-700 font-bold text-sm mb-3"><span>CERTIFICATIONS</span></h3>
              <div className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <span key={i} className="bg-amber-50 p-2 rounded border border-amber-200 block">
                    <span className="font-bold text-amber-900 text-xs">{cert.name}</span>
                    <span className="text-amber-700 text-xs block">{cert.issuer}</span>
                    <span className="text-gray-600 text-xs block">{cert.year}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Clean Slate Template (Minimal category)
const CleanSlateTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-sans text-xs">
    <div className="p-8 max-w-4xl mx-auto">
      {/* Minimal Header */}
      {visibleFields.fullName && (
        <div className="text-center mb-12">
          <h1 className="text-xl font-extralight text-zinc-800 mb-4 tracking-wide">
            {data.fullName}
          </h1>
          <div className="flex justify-center gap-8 text-zinc-600 text-xs">
            {visibleFields.email && data.email && <span>{data.email}</span>}
            {visibleFields.phone && data.phone && <span>{data.phone}</span>}
            {visibleFields.location && data.location && <span>{data.location}</span>}
          </div>
          <div className="flex justify-center gap-8 text-zinc-600 text-xs mt-1">
            {visibleFields.website && data.website && <span>{data.website}</span>}
            {visibleFields.linkedin && data.linkedin && <span>{data.linkedin}</span>}
            {visibleFields.github && data.github && <span>{data.github}</span>}
          </div>
        </div>
      )}

      {/* Minimal Content */}
      <div className="space-y-12">
        {visibleFields.summary && data.summary && (
          <div className="text-center">
            <p className="text-zinc-700 text-xs leading-relaxed max-w-3xl mx-auto font-light">
              {data.summary}
            </p>
          </div>
        )}

        {visibleFields.achievements && data.achievements?.length > 0 && (
          <div className="text-center">
            <h3 className="text-zinc-800 font-light text-sm mb-6 tracking-wide">
              ACHIEVEMENTS
            </h3>
            <div className="space-y-2 max-w-2xl mx-auto">
              {data.achievements.map((achievement, i) => (
                <div key={i} className="text-zinc-700 text-xs">
                  • {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.experience && data.experience?.length > 0 && (
          <div>
            <h3 className="text-zinc-800 font-light text-sm mb-8 text-center tracking-wide">
              EXPERIENCE
            </h3>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="text-center">
                  <h4 className="text-zinc-900 font-medium text-xs mb-2">{exp.position}</h4>
                  <div className="text-zinc-600 text-xs mb-2">{exp.company}</div>
                  <div className="text-zinc-500 text-xs mb-4">{exp.duration}</div>
                  <p className="text-zinc-700 leading-relaxed max-w-2xl mx-auto text-xs">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.projects && data.projects?.length > 0 && (
          <div className="text-center">
            <h3 className="text-zinc-800 font-light text-sm mb-6 tracking-wide">
              PROJECTS
            </h3>
            <div className="space-y-6 max-w-2xl mx-auto">
              {data.projects.map((proj, i) => (
                <div key={i} className="text-center">
                  <h4 className="text-zinc-900 font-medium text-xs mb-2">{proj.name}</h4>
                  <p className="text-zinc-700 text-xs leading-relaxed mb-2">{proj.description}</p>
                  {proj.technologies && (
                    <div className="text-zinc-600 text-xs">
                      {proj.technologies}
                    </div>
                  )}
                  {proj.link && (
                    <div className="text-zinc-500 text-xs mt-1">
                      {proj.link}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.skills && data.skills?.length > 0 && (
          <div className="text-center">
            <h3 className="text-zinc-800 font-light text-sm mb-6 tracking-wide">
              SKILLS
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-zinc-600 font-light text-xs">
                  {skill}{i < data.skills.length - 1 && ' •'}
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.education && data.education?.length > 0 && (
          <div className="text-center">
            <h3 className="text-zinc-800 font-light text-sm mb-6 tracking-wide">
              EDUCATION
            </h3>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h4 className="text-zinc-900 font-medium text-xs"><span>{edu.degree}</span></h4>
                  <div className="text-zinc-600 text-xs"><span>{edu.school}</span></div>
                  <div className="text-zinc-500 text-xs">
                    <span>{edu.year}</span>
                    {edu.grade && <span> • {edu.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleFields.languages && data.languages?.length > 0 && (
          <div className="text-center">
            <h3 className="text-zinc-800 font-light text-sm mb-6 tracking-wide">
              LANGUAGES
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {data.languages.map((lang, i) => (
                <span key={i} className="text-zinc-600 font-light text-xs">
                  {lang}{i < data.languages.length - 1 && ' •'}
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleFields.certifications && data.certifications?.length > 0 && (
          <div className="text-center">
            <h3 className="text-zinc-800 font-light text-sm mb-6 tracking-wide">
              CERTIFICATIONS
            </h3>
            <div className="space-y-3">
              {data.certifications.map((cert, i) => (
                <div key={i}>
                  <h4 className="text-zinc-900 font-medium text-xs">{cert.name}</h4>
                  <div className="text-zinc-600 text-xs">{cert.issuer}</div>
                  <div className="text-zinc-500 text-xs">{cert.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// FullStack Pro Template (Developer category)
const FullStackProTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-mono text-xs">
    {/* Developer Header */}
    <div className="bg-lime-500 text-gray-900 p-6">
      {visibleFields.fullName && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{data.fullName}</h1>
            <div className="text-gray-800 font-medium text-sm">Full Stack Developer</div>
          </div>
          <div className="text-right text-xs">
            {visibleFields.email && data.email && <div>📧 {data.email}</div>}
            {visibleFields.phone && data.phone && <div>📞 {data.phone}</div>}
            {visibleFields.location && data.location && <div>📍 {data.location}</div>}
            {visibleFields.website && data.website && <div>🌐 {data.website}</div>}
            {visibleFields.linkedin && data.linkedin && <div>💼 {data.linkedin}</div>}
            {visibleFields.github && data.github && <div>💻 {data.github}</div>}
          </div>
        </div>
      )}
    </div>

    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2">
          {visibleFields.summary && data.summary && (
            <div className="mb-6">
              <h3 className="text-lime-600 font-bold text-sm mb-3 flex items-center">
                &lt;About /&gt;
              </h3>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-lime-500">
                <p className="text-gray-700 leading-relaxed text-xs">{data.summary}</p>
              </div>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lime-600 font-bold text-sm mb-3 flex items-center">
                &lt;Achievements /&gt;
              </h3>
              <div className="bg-lime-50 p-4 rounded border-l-4 border-lime-400">
                <div className="space-y-1">
                  {data.achievements.map((achievement, i) => (
                    <div key={i} className="text-gray-700 text-xs flex items-start">
                      <span className="text-lime-600 mr-2">🚀</span>
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {visibleFields.experience && data.experience?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lime-600 font-bold text-sm mb-3 flex items-center">
                &lt;Experience /&gt;
              </h3>
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold text-lime-700 text-xs">{exp.position}</h4>
                      <div className="text-gray-600 text-xs">{exp.duration}</div>
                    </div>
                    <div className="text-lime-600 text-xs font-medium mb-1">{exp.company}</div>
                    <div className="text-gray-700 text-xs">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div>
              <h3 className="text-lime-600 font-bold text-sm mb-3 flex items-center">
                &lt;Projects /&gt;
              </h3>
              <div className="grid gap-4">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-lime-50 p-4 rounded border border-lime-200">
                    <h4 className="font-bold text-lime-800 text-xs">{project.name}</h4>
                    <p className="text-gray-700 mt-1 text-xs">{project.description}</p>
                    {project.technologies && (
                      <div className="text-lime-700 text-xs mt-2">
                        Stack: {project.technologies}
                      </div>
                    )}
                    {project.link && (
                      <div className="text-lime-600 text-xs mt-1">
                        🔗 {project.link}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {visibleFields.skills && data.skills?.length > 0 && (
            <div>
              <h3 className="text-lime-600 font-bold mb-3 text-xs">&lt;TechStack /&gt;</h3>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="bg-lime-100 text-lime-800 px-3 py-2 rounded text-xs border border-lime-200">
                   <span>🔧 {skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.education && data.education?.length > 0 && (
            <div>
              <h3 className="text-lime-600 font-bold mb-3 text-xs">&lt;Education /&gt;</h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded border">
                    <h4 className="font-semibold text-gray-900 text-xs"><span>{edu.degree}</span></h4>
                    <div className="text-lime-700 text-xs"><span>{edu.school}</span></div>
                    <div className="text-gray-600 text-xs">
                      <span>{edu.year}</span>
                      {edu.grade && <span> • {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div>
              <h3 className="text-lime-600 font-bold mb-3 text-xs">&lt;Languages /&gt;</h3>
              <div className="space-y-1">
                {data.languages.map((lang, i) => (
                  <div key={i} className="text-gray-700 text-xs bg-lime-50 p-2 rounded">
                  <span>🌍 {lang}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-lime-600 font-bold mb-3 text-xs">&lt;Certifications /&gt;</h3>
              <div className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="bg-gray-50 p-2 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 text-xs">{cert.name}</h4>
                    <div className="text-lime-700 text-xs">{cert.issuer}</div>
                    <div className="text-gray-600 text-xs">{cert.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Research Scholar Template (Academic category)
const ResearchScholarTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-serif">
    {/* Academic Header */}
    <div className="border-b-4 border-violet-600 pb-6 mb-6 p-6">
      {visibleFields.fullName && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-violet-900 mb-2">{data.fullName}</h1>
          <div className="text-violet-700 text-lg mb-3">Research Scholar</div>
          <div className="flex justify-center gap-6 text-gray-600">
            {visibleFields.email && data.email && <span>📧 {data.email}</span>}
            {visibleFields.phone && data.phone && <span>📞 {data.phone}</span>}
            {visibleFields.location && data.location && <span>📍 {data.location}</span>}
          </div>
          <div className="flex justify-center gap-6 text-gray-600 mt-2">
            {visibleFields.website && data.website && <span>🌐 {data.website}</span>}
            {visibleFields.linkedin && data.linkedin && <span>💼 {data.linkedin}</span>}
            {visibleFields.github && data.github && <span>⚡ {data.github}</span>}
          </div>
        </div>
      )}
    </div>

    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {visibleFields.summary && data.summary && (
            <div className="mb-8">
              <h3 className="text-violet-800 font-bold text-lg mb-3 border-b border-violet-200 pb-2">
                Research Interests
              </h3>
              <div className="bg-violet-50 p-4 rounded border-l-4 border-violet-600">
                <p className="text-gray-700 leading-relaxed text-xs">{data.summary}</p>
              </div>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-violet-800 font-bold text-lg mb-3 border-b border-violet-200 pb-2">
                Academic Achievements
              </h3>
              <div className="bg-violet-50 p-4 rounded border-l-4 border-violet-500">
                <div className="space-y-1">
                  {data.achievements.map((achievement, i) => (
                    <div key={i} className="text-gray-700 text-xs flex items-start">
                      <span className="text-violet-600 mr-2">🎓</span>
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {visibleFields.experience && data.experience?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-violet-800 font-bold text-lg mb-3 border-b border-violet-200 pb-2">
                Academic Positions
              </h3>
              <div className="space-y-5">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-violet-900 text-lg">{exp.position}</h4>
                        <div className="text-violet-700 font-medium">{exp.company}</div>
                      </div>
                      <div className="text-gray-600 font-medium">{exp.duration}</div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    <hr className="mt-4 border-violet-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div>
              <h3 className="text-violet-800 font-bold text-lg mb-3 border-b border-violet-200 pb-2">
                Research Projects
              </h3>
              <div className="space-y-4">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-violet-50 p-4 rounded border border-violet-200">
                    <h4 className="font-bold text-violet-900">{project.name}</h4>
                    <p className="text-gray-700 mt-2 leading-relaxed">{project.description}</p>
                    {project.technologies && (
                      <div className="text-violet-700 text-sm mt-2">
                        Methodology: {project.technologies}
                      </div>
                    )}
                    {project.link && (
                      <div className="text-violet-600 text-sm mt-2">
                        🔗 {project.link}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {visibleFields.education && data.education?.length > 0 && (
            <div>
              <h3 className="text-violet-800 font-bold mb-3">Education</h3>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i} className="bg-violet-50 p-4 rounded border border-violet-200">
                    <h4 className="font-bold text-violet-900"><span>{edu.degree}</span></h4>
                    <div className="text-violet-700 font-medium"><span>{edu.school}</span></div>
                    <div className="text-gray-600">
                      <span>{edu.year}</span>
                      {edu.grade && <span> • {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.skills && data.skills?.length > 0 && (
            <div>
              <h3 className="text-violet-800 font-bold mb-3">Research Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-violet-100 text-violet-800 px-3 py-2 rounded text-sm">
                   <span> 📚 {skill}{i < data.skills.length - 1 && ' •'}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-violet-800 font-bold mb-3">Publications & Awards</h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="bg-white p-3 rounded border border-violet-200 shadow-sm">
                    <h4 className="font-semibold text-violet-900 text-sm"><span>{cert.name}</span></h4>
                    <div className="text-violet-700 text-sm"><span>{cert.issuer}</span></div>
                    <div className="text-gray-600 text-sm"><span>{cert.year}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div>
              <h3 className="text-violet-800 font-bold mb-3 flex items-center">
                🌍 Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <span key={i} className="text-gray-700 text-sm bg-violet-50 p-2 rounded">
                    <span>{lang}{i < data.languages.length - 1 && ' •'}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Innovation Hub Template (Startup category)
const InnovationHubTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-red-100 font-sans">
    <div className="p-8 md:p-12">
      {/* Startup Header */}
      {visibleFields.fullName && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-3">
            <span>{data.fullName || "Full Name"}</span>
          </h1>
        
          <div className="flex justify-center gap-6 text-gray-600">
            {visibleFields.email && data.email && <span>📧 {data.email}</span>}
            {visibleFields.phone && data.phone && <span>📞 {data.phone}</span>}
            {visibleFields.location && data.location && <span>📍 {data.location}</span>}
          </div>
          <div className="flex justify-center gap-6 text-gray-600 mt-2">
            {visibleFields.website && data.website && <span>🌐 {data.website}</span>}
            {visibleFields.linkedin && data.linkedin && <span>💼 {data.linkedin}</span>}
            {visibleFields.github && data.github && <span>⚡ {data.github}</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column */}
        <div>
          {visibleFields.summary && data.summary && (
            <div className="mb-6">
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                🎯 Vision Statement
              </h3>
              <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-red-500">
                <p className="text-gray-700 leading-relaxed font-medium">{data.summary}</p>
              </div>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                🏆 Game Changers
              </h3>
              <div className="space-y-3">
                {data.achievements.map((achievement, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-lg border border-red-200">
                    <span className="text-gray-700 font-medium">🚀 {achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                💡 Innovation Projects
              </h3>
              <div className="space-y-4">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-lg border border-orange-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-red-900 text-lg">{project.name}</h4>
                      
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                    {project.technologies && (
                      <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm">
                      <span>  Tech Stack: {project.technologies}</span> 
                      </div>
                    )}
                    {project.link && (
                      <div className="text-red-600 text-sm mt-2">
                        🔗 {project.link}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {visibleFields.experience && data.experience?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                🏢 Startup Journey
              </h3>
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-orange-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-orange-900">{exp.position}</h4>
                        <div className="text-red-600 font-medium">{exp.company}</div>
                      </div>
                      <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.skills && data.skills?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                ⚡ Innovation Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-gradient-to-r from-red-400 to-orange-500 text-white px-3 py-2 rounded-2xl text-sm text-center font-medium shadow-md">
                   <span>{skill}{i < data.skills.length - 1 && ' •'}</span> 
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.education && data.education?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                🎓 Education
              </h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-lg border border-orange-200">
                    <h4 className="font-bold text-red-900"><span>{edu.degree}</span></h4>
                    <div className="text-orange-700 font-medium"><span>{edu.school}</span></div>
                    <div className="text-gray-600">
                      <span>{edu.year}</span>
                      {edu.grade && <span> • {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                🌍 Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, i) => (
                  <span key={i} className="bg-orange-100 text-orange-800 px-3 py-2 rounded-2xl text-sm text-center shadow-sm">
                    <span>{lang}{i < data.languages.length - 1 && ' •'}</span> 
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-red-700 font-bold text-xl mb-3 flex items-center">
                🏅 Certifications
              </h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="bg-white p-3 rounded-2xl shadow-lg border border-red-200">
                    <h4 className="font-semibold text-red-900"><span>{cert.name}</span></h4>
                    <div className="text-orange-700"><span>{cert.issuer}</span></div>
                    <div className="text-gray-600 text-sm"><span>{cert.year}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Medical Professional Template (Healthcare category)
const MedicalProfessionalTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-gradient-to-br from-white via-rose-50 to-blue-50 font-sans">
    {/* Medical Header */}
    <div className="bg-gradient-to-r from-rose-600 to-blue-600 text-white p-8 rounded-b-3xl shadow-lg">
      {visibleFields.fullName && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              <span>{data.fullName || "Full Name"}</span>
            </h1>
           
          </div>
          <div className="text-right space-y-1">
            {visibleFields.email && data.email && (
              <div><span>📧</span> <span>{data.email}</span></div>
            )}
            {visibleFields.phone && data.phone && (
              <div><span>📞</span> <span>{data.phone}</span></div>
            )}
            {visibleFields.location && data.location && (
              <div><span>📍</span> <span>{data.location}</span></div>
            )}
            {visibleFields.website && data.website && (
              <div><span>🌐</span> <span>{data.website}</span></div>
            )}
            {visibleFields.linkedin && data.linkedin && (
              <div><span>💼</span> <span>{data.linkedin}</span></div>
            )}
            {visibleFields.github && data.github && (
              <div><span>⚡</span> <span>{data.github}</span></div>
            )}
          </div>
        </div>
      )}
    </div>

    <div className="p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="md:col-span-2">
          {visibleFields.summary && data.summary && (
            <div className="mb-6">
              <h3 className="text-rose-700 font-bold text-lg mb-3 flex items-center">
                <span>🩺 Professional Summary</span>
              </h3>
              <div className="bg-rose-50 p-5 rounded-2xl border-l-4 border-rose-600 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  <span>{data.summary}</span>
                </p>
              </div>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-rose-700 font-bold text-lg mb-3 flex items-center">
                <span>🏆 Medical Achievements</span>
              </h3>
              <div className="bg-pink-50 p-5 rounded-2xl border-l-4 border-pink-600 shadow-sm">
                <div className="space-y-2">
                  {data.achievements.map((achievement, i) => (
                    <div key={i} className="text-gray-700 flex items-start">
                      <span className="text-rose-600 mr-2">⭐</span>
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {visibleFields.experience && data.experience?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-rose-700 font-bold text-lg mb-3 flex items-center">
                <span>🏥 Clinical Experience</span>
              </h3>
              <div className="space-y-5">
                {data.experience.map((exp, i) => (
                  <div key={i} className="bg-gradient-to-r from-rose-50 to-blue-50 p-6 rounded-2xl border border-rose-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-rose-900 text-lg">
                          <span>{exp.position}</span>
                        </h4>
                        <div className="text-rose-700 font-medium">
                          <span>{exp.company}</span>
                        </div>
                      </div>
                      <div className="bg-rose-100 text-rose-800 px-3 py-1 rounded-xl shadow-sm">
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      <span>{exp.description}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div>
              <h3 className="text-rose-700 font-bold text-lg mb-3 flex items-center">
                <span>🔬 Medical Research & Projects</span>
              </h3>
              <div className="space-y-4">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-rose-50 p-4 rounded-2xl border border-rose-200 shadow-sm">
                    <h4 className="font-bold text-rose-900">
                      <span>{project.name}</span>
                    </h4>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      <span>{project.description}</span>
                    </p>
                    {project.technologies && (
                      <div className="text-rose-700 text-sm mt-2">
                        <span>Methods: </span>
                        <span>{project.technologies}</span>
                      </div>
                    )}
                    {project.link && (
                      <div className="text-rose-600 text-sm mt-2">
                        <span>🔗</span> <span>{project.link}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {visibleFields.skills && data.skills?.length > 0 && (
            <div>
              <h3 className="text-rose-700 font-bold mb-3 flex items-center">
                <span>⚕️ Medical Skills</span>
              </h3>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="bg-rose-100 text-rose-800 px-3 py-2 rounded-xl text-sm border border-rose-200 shadow-sm">
                    <span>🔬 {skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.education && data.education?.length > 0 && (
            <div>
              <h3 className="text-rose-700 font-bold mb-3 flex items-center">
                <span>🎓 Medical Education</span>
              </h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i} className="bg-rose-50 p-4 rounded-2xl border border-rose-200 shadow-sm">
                    <h4 className="font-bold text-rose-900">
                      <span>{edu.degree}</span>
                    </h4>
                    <div className="text-rose-700 font-medium">
                      <span>{edu.school}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>{edu.year}</span>
                      {edu.grade && <span> • {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div>
              <h3 className="text-rose-700 font-bold mb-3 flex items-center">
                <span>📋 Certifications & Licenses</span>
              </h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="bg-white p-3 rounded-2xl border border-rose-200 shadow-md">
                    <h4 className="font-semibold text-rose-900 text-sm">
                      <span>{cert.name}</span>
                    </h4>
                    <div className="text-rose-700 text-sm">
                      <span>{cert.issuer}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      <span>{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div>
              <h3 className="text-rose-700 font-bold mb-3 flex items-center">
                <span>🌍 Languages</span>
              </h3>
              <div className="space-y-1">
                {data.languages.map((lang, i) => (
                  <div key={i} className="text-gray-700 text-sm bg-rose-50 p-2 rounded-xl shadow-sm">
                    <span>{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Clinical Excellence Template (Healthcare category)
const ClinicalExcellenceTemplate: React.FC<{
  data: ResumeData;
  visibleFields: Record<string, boolean>;
}> = ({ data, visibleFields }) => (
  <div className="h-full w-full bg-white font-sans">
    {/* Modern Medical Header */}
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-10 rounded-b-3xl shadow-lg">
      {visibleFields.fullName && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span>{data.fullName || "Full Name"}</span>
          </h1>
          
          <div className="flex justify-center gap-8 text-teal-100">
            {visibleFields.email && data.email && (
              <span>📧 <span>{data.email}</span></span>
            )}
            {visibleFields.phone && data.phone && (
              <span>📞 <span>{data.phone}</span></span>
            )}
            {visibleFields.location && data.location && (
              <span>📍 <span>{data.location}</span></span>
            )}
          </div>
          <div className="flex justify-center gap-8 text-teal-100 mt-2">
            {visibleFields.website && data.website && (
              <span>🌐 <span>{data.website}</span></span>
            )}
            {visibleFields.linkedin && data.linkedin && (
              <span>💼 <span>{data.linkedin}</span></span>
            )}
            {visibleFields.github && data.github && (
              <span>⚡ <span>{data.github}</span></span>
            )}
          </div>
        </div>
      )}
    </div>

    <div className="p-8 md:p-12">
      {/* Patient Care Focus */}
      {visibleFields.summary && data.summary && (
        <div className="mb-8 text-center">
          <h3 className="text-teal-700 font-bold text-2xl mb-4">
            <span>PATIENT CARE PHILOSOPHY</span>
          </h3>
          <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-600 max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed italic">
              <span>{data.summary}</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Clinical Experience */}
        {visibleFields.experience && data.experience?.length > 0 && (
          <div>
            <h3 className="text-teal-700 font-bold text-xl mb-4 text-center">
              <span>CLINICAL EXPERIENCE</span>
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="text-center mb-3">
                    <h4 className="font-bold text-teal-900 text-lg">
                      <span>{exp.position}</span>
                    </h4>
                    <div className="text-teal-700 font-medium">
                      <span>{exp.company}</span>
                    </div>
                    <div className="text-teal-600">
                      <span>{exp.duration}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-center text-sm">
                    <span>{exp.description}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Excellence */}
        <div>
          {visibleFields.skills && data.skills?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-teal-700 font-bold text-xl mb-4 text-center">
                <span>CLINICAL COMPETENCIES</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {data.skills.map((skill, i) => (
                  <div key={i} className="bg-teal-100 text-teal-800 p-3 rounded-xl text-center font-medium border border-teal-200 shadow-sm">
                    <span>⚕️ {skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.achievements && data.achievements?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-teal-700 font-bold text-xl mb-4 text-center">
                <span>MEDICAL ACHIEVEMENTS</span>
              </h3>
              <div className="space-y-3">
                {data.achievements.map((achievement, i) => (
                  <div key={i} className="bg-blue-50 p-4 rounded-2xl shadow-md border border-blue-400 flex items-center gap-2">
                    <div className="text-gray-700 font-medium">
                      <span>🏆 {achievement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.certifications && data.certifications?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-teal-700 font-bold text-xl mb-4 text-center">
                <span>BOARD CERTIFICATIONS</span>
              </h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-md border border-teal-200">
                    <h4 className="font-bold text-teal-900">
                      <span>{cert.name}</span>
                    </h4>
                    <div className="text-teal-700 font-medium">
                      <span>{cert.issuer}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.projects && data.projects?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-teal-700 font-bold text-xl mb-4 text-center">
                <span>MEDICAL RESEARCH</span>
              </h3>
              <div className="space-y-3">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
                    <h4 className="font-bold text-teal-900">
                      <span>{project.name}</span>
                    </h4>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      <span>{project.description}</span>
                    </p>
                    {project.technologies && (
                      <div className="text-teal-700 text-sm mt-2">
                        <span>Methods: </span>
                        <span>{project.technologies}</span>
                      </div>
                    )}
                    {project.link && (
                      <div className="text-teal-600 text-sm mt-2">
                        <span>🔗</span> <span>{project.link}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleFields.languages && data.languages?.length > 0 && (
            <div>
              <h3 className="text-teal-700 font-bold text-xl mb-4 text-center">
                <span>LANGUAGES</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {data.languages.map((lang, i) => (
                  <div key={i} className="bg-teal-100 text-teal-800 p-2 rounded-xl text-center text-sm shadow-sm">
                    <span>🌍 {lang}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Education Section */}
      {visibleFields.education && data.education?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-teal-700 font-bold text-xl mb-4 text-center">
            <span>MEDICAL EDUCATION</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.education.map((edu, i) => (
              <div key={i} className="bg-teal-50 p-4 rounded-2xl border border-teal-200 text-center shadow-sm">
                <h4 className="font-bold text-teal-900">
                  <span>{edu.degree}</span>
                </h4>
                <div className="text-teal-700 font-medium">
                  <span>{edu.school}</span>
                </div>
                <div className="text-gray-600">
                  <span>{edu.year}</span>
                  {edu.grade && <span> • {edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Main Template Renderer
export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  resumeData,
  visibleFields = {},
}) => {
  const templates = {
    "classic-professional": ClassicProfessionalTemplate,
    "modern-simple": ModernSimpleTemplate,
    "strategic-blue": StrategicBlueTemplate,
    "financial-professional": FinancialProfessionalTemplate,
    "creative-profile": CreativeProfileTemplate,
    "skills-dashboard": SkillsDashboardTemplate,
    "executive-summary": ExecutiveSummaryTemplate,
    "minimal-professional": MinimalProfessionalTemplate,
    "developer-portfolio": DeveloperPortfolioTemplate,
    "academic-research": AcademicResearchTemplate,
    "startup-vision": StartupVisionTemplate,
    "corporate-elite": CorporateEliteTemplate,
    "contemporary-flex": ContemporaryFlexTemplate,
    "enterprise-focus": EnterpriseFocusTemplate,
    "wealth-advisor": WealthAdvisorTemplate,
    "artistic-portfolio": ArtisticPortfolioTemplate,
    "code-architect": CodeArchitectTemplate,
    "leadership-vision": LeadershipVisionTemplate,
    "clean-slate": CleanSlateTemplate,
    "fullstack-pro": FullStackProTemplate,
    "medical-professional": MedicalProfessionalTemplate,
    "research-scholar": ResearchScholarTemplate,
    "innovation-hub": InnovationHubTemplate,
    "clinical-excellence": ClinicalExcellenceTemplate,
  };

  const TemplateComponent =
    templates[templateId as keyof typeof templates];

  if (!TemplateComponent) {
    // Fallback to a basic template if the specific template is not found
    console.warn(`Template "${templateId}" not found, using ModernSimpleTemplate as fallback`);
    return (
      <div className="h-full w-full">
        <ModernSimpleTemplate data={resumeData} visibleFields={visibleFields} />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto my-0 bg-white shadow-xl rounded-xl "
      style={{
        maxWidth: '210mm',
        maxHeight: '297mm',
        width: '100%',
        height: '297mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        padding: '0px',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <TemplateComponent data={resumeData} visibleFields={visibleFields} />
    </div>
  );
};

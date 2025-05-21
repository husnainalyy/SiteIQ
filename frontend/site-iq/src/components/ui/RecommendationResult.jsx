export default function RecommendationResult({ result }) {
  const sections = [
    { title: 'Frontend', data: result.frontend },
    { title: 'Backend', data: result.backend },
    { title: 'Database', data: result.database },
    { title: 'Hosting', data: result.hosting },
    { title: 'Other Tools', data: result.other },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-8">
          Tech Stack Recommendations
        </h3>
        
        <div className="grid gap-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10"
            >
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {section.title}
              </h4>
              
              <p className="text-white/80 mb-4 leading-relaxed">
                {section.data.reason}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {section.data.stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/90 hover:bg-white/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

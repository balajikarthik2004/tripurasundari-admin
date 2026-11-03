import React from 'react';
import { Sparkles, Construction, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export default function PagePlaceholder({ title, description, category, icon: IconComponent }) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-temple-text-secondary uppercase tracking-wider">
            <span>Matabari Admin</span>
            <span>/</span>
            {category && (
              <>
                <span className="text-temple-gold">{category}</span>
                <span>/</span>
              </>
            )}
            <span className="text-temple-burgundy font-semibold">{title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-temple-burgundy mt-1 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#E2BC6B]/20 text-[#681B37] border border-[#B68A36]/30">
          <Construction className="w-3.5 h-3.5 text-[#B68A36]" />
          <span>Module Under Development</span>
        </div>
      </div>

      {/* Main Feature Card */}
      <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-subtle p-8 sm:p-10 relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E2BC6B]/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none text-temple-burgundy font-serif text-9xl">
          ॐ
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="w-14 h-14 rounded-xl bg-temple-burgundy/5 border border-temple-burgundy/15 flex items-center justify-center text-temple-burgundy mb-6 shadow-sm">
            {IconComponent ? (
              <IconComponent className="w-7 h-7 text-temple-burgundy" />
            ) : (
              <Sparkles className="w-7 h-7 text-temple-gold" />
            )}
          </div>

          <h2 className="text-xl font-serif font-semibold text-temple-text-primary mb-2">
            {title} Control Center
          </h2>
          <p className="text-temple-text-secondary leading-relaxed text-sm sm:text-base mb-6">
            {description || 'This administrative module is configured in the temple navigation architecture and is scheduled for comprehensive data binding and interactive management in the upcoming development phase.'}
          </p>

          {/* Planned Features List */}
          <div className="bg-[#FAF7F2] rounded-lg p-5 border border-[#EDE7DC] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-temple-burgundy flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-temple-gold" />
              <span>Phase 2 System Roadmap For This Module</span>
            </h3>
            <ul className="text-xs sm:text-sm text-temple-text-secondary space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-temple-gold flex-shrink-0" />
                <span>Real-time database integration with Matabari Temple server feeds.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-temple-gold flex-shrink-0" />
                <span>Audited administrative actions with role-based cryptographic signing.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-temple-gold flex-shrink-0" />
                <span>Automated alert dispatch to on-duty priests and temple trust administrators.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-temple-text-muted">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-temple-gold" />
              <span>System Release: Phase 2</span>
            </div>
            <span>•</span>
            <span>Security: 256-bit TLS Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}


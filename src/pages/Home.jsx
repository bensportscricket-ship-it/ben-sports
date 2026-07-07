import React, { useState } from 'react';
import Hero from '../components/home/Hero';
import AnnouncementBanner from '../components/home/AnnouncementBanner';
import FeaturedTournament from '../components/home/FeaturedTournament';
import PlatformStats from '../components/home/PlatformStats';
import QuickNav from '../components/home/QuickNav';
import SeamDivider from '../components/ui/SeamDivider';
import Card from '../components/ui/Card';
import FileUpload from '../components/ui/FileUpload';

export default function Home() {
  const [uploadedLogo, setUploadedLogo] = useState(null);

  return (
    <div className="pt-16">
      <Hero />
      <AnnouncementBanner />
      
      {/* Local Simulation Sandbox Workspace */}
      <section className="max-w-md mx-auto px-6 py-6">
        <Card className="border border-brand-green/30 bg-gradient-to-b from-brand-surface to-brand-bg">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
            <h4 className="text-sm font-bold tracking-tight text-brand-gold uppercase">V1.0 Admin Media Tester</h4>
          </div>
          
          <FileUpload 
            label="Simulate Team Logo Upload" 
            onUploadSuccess={(data) => setUploadedLogo(data.previewUrl)}
          />

          {uploadedLogo && (
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-center flex items-center justify-between gap-4">
              <span className="text-xs text-brand-muted font-medium">Render State Image:</span>
              <img src={uploadedLogo} alt="Live Asset" className="w-10 h-10 object-cover rounded-full border-2 border-brand-green" />
            </div>
          )}
        </Card>
      </section>

      <SeamDivider />
      <FeaturedTournament />
      <PlatformStats />
      <SeamDivider />
      <QuickNav />
    </div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Camera, Sparkles, Check, ChevronRight,
  Loader2, Tag, DollarSign, FileText, Eye, Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockCategories } from '@/lib/mock-data';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI Processing Steps
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AIStep {
  id: string;
  label: string;
  icon: React.ElementType;
  duration: number; // ms
}

const aiSteps: AIStep[] = [
  { id: 'analyze', label: 'Analyzing image...', icon: Eye, duration: 800 },
  { id: 'title', label: 'Generating title...', icon: FileText, duration: 700 },
  { id: 'price', label: 'Suggesting price...', icon: DollarSign, duration: 800 },
  { id: 'category', label: 'Categorizing...', icon: Tag, duration: 700 },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CreateView — AI Product Creator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type CreateStage = 'upload' | 'processing' | 'results';

export default function CreateView() {
  const navigate = useNavigationStore((s) => s.navigate);
  const goBack = useNavigationStore((s) => s.goBack);

  const [stage, setStage] = useState<CreateStage>('upload');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // AI generated results (editable)
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generatedCategory, setGeneratedCategory] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState<number[]>([3499]);
  const [isAuction, setIsAuction] = useState(false);

  const startProcessing = useCallback(() => {
    setStage('processing');
    setCurrentStepIndex(0);

    // Simulate sequential AI processing
    let cumulativeDelay = 0;
    aiSteps.forEach((step, index) => {
      cumulativeDelay += step.duration;
      setTimeout(() => {
        setCurrentStepIndex(index + 1);
      }, cumulativeDelay);
    });

    // After all steps complete, show results
    setTimeout(() => {
      setGeneratedTitle('MacBook Pro 16" M4 Max — 96GB RAM (Sealed)');
      setGeneratedDescription(
        'Brand new, sealed in box. Space Black configuration with M4 Max chip and 96GB unified memory. AppleCare+ included until 2027. The ultimate creator machine for video editing, 3D rendering, and AI development.'
      );
      setGeneratedCategory('Electronics');
      setSuggestedPrice([3499]);
      setStage('results');
    }, cumulativeDelay + 500);
  }, []);

  const handleUploadClick = () => {
    // Simulate image upload
    setUploadedImage('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80');
    startProcessing();
  };

  const handlePublish = () => {
    navigate('home');
  };

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.22 }}
      className="min-h-screen"
    >
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 glass border-b border-border/30">
        <div className="flex items-center gap-3 px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <h1 className="text-lg font-bold text-foreground">Create Listing</h1>
          <div className="ml-auto">
            <Badge className="bg-primary/10 text-primary border-0 font-semibold">
              <Sparkles size={12} className="mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════════════
              STAGE 1: Upload Area
              ═══════════════════════════════════════════════════════════════════ */}
          {stage === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              {/* Upload Dropzone */}
              <motion.div
                whileHover={{ scale: 1.01, borderColor: 'oklch(0.6 0.2 20 / 0.4)' }}
                whileTap={{ scale: 0.99 }}
                onClick={handleUploadClick}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-4',
                  'w-full aspect-[4/3] rounded-2xl border-2 border-dashed',
                  'border-border/50 bg-muted/30 cursor-pointer',
                  'transition-colors hover:bg-primary/5 hover:border-primary/30'
                )}
              >
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

                <motion.div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                >
                  <Camera size={28} className="text-primary" />
                </motion.div>

                <div className="text-center">
                  <p className="text-base font-semibold text-foreground">
                    Tap to upload
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI will analyze and generate your listing
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Upload size={14} />
                  <span>JPG, PNG up to 10MB</span>
                </div>
              </motion.div>

              {/* Tips */}
              <Card className="mt-4 p-4 border-0 bg-primary/5">
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Pro tips for best results
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                      <li>• Use good lighting and clean background</li>
                      <li>• Include all product accessories in frame</li>
                      <li>• AI works best with single-item photos</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STAGE 2: AI Processing
              ═══════════════════════════════════════════════════════════════════ */}
          {stage === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="space-y-6"
            >
              {/* Uploaded Image Preview */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={uploadedImage || ''}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Processing overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Loader2 size={20} className="text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-white">
                    AI is processing your image...
                  </span>
                </div>
              </div>

              {/* Processing Steps */}
              <Card className="p-5 border-0 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  AI Processing Steps
                </h3>
                <div className="space-y-3">
                  {aiSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const StepIcon = step.icon;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                          isCompleted && 'bg-emerald-500/5',
                          isActive && 'bg-primary/5',
                          !isCompleted && !isActive && 'opacity-40'
                        )}
                      >
                        {/* Icon / Status */}
                        <div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-full shrink-0',
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isActive
                                ? 'bg-primary/15 text-primary'
                                : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            >
                              <Check size={14} strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <StepIcon size={14} />
                          )}
                        </div>

                        {/* Label */}
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isCompleted && 'text-emerald-600',
                            isActive && 'text-primary',
                            !isCompleted && !isActive && 'text-muted-foreground'
                          )}
                        >
                          {step.label}
                        </span>

                        {/* Active spinner */}
                        {isActive && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            className="ml-auto"
                          >
                            <Loader2 size={14} className="text-primary" />
                          </motion.div>
                        )}

                        {/* Completed checkmark text */}
                        {isCompleted && (
                          <span className="ml-auto text-xs font-medium text-emerald-600">Done</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Shimmer Skeleton States */}
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
                <div className="h-20 w-full rounded-lg animate-shimmer" />
                <div className="flex gap-3">
                  <div className="h-10 w-32 rounded-lg animate-shimmer" />
                  <div className="h-10 w-24 rounded-lg animate-shimmer" />
                </div>
                <div className="h-12 w-full rounded-xl animate-shimmer" />
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STAGE 3: AI Results
              ═══════════════════════════════════════════════════════════════════ */}
          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="space-y-5"
            >
              {/* AI Success Banner */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500">
                  <Check size={20} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    AI Analysis Complete
                  </p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">
                    All fields auto-generated — review and edit below
                  </p>
                </div>
              </motion.div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" />
                  Title
                  <Sparkles size={12} className="text-amber-500" />
                </Label>
                <Input
                  value={generatedTitle}
                  onChange={(e) => setGeneratedTitle(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" />
                  Description
                  <Sparkles size={12} className="text-amber-500" />
                </Label>
                <Textarea
                  value={generatedDescription}
                  onChange={(e) => setGeneratedDescription(e.target.value)}
                  rows={4}
                  className="text-sm resize-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Tag size={14} className="text-primary" />
                  Category
                  <Sparkles size={12} className="text-amber-500" />
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-2.5">
                    <span className="text-sm font-medium">{generatedCategory}</span>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-xl shrink-0">
                    <ChevronRight size={16} />
                  </Button>
                </div>
                {/* Category chips */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {mockCategories.slice(0, 6).map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGeneratedCategory(cat.name)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-all',
                        generatedCategory === cat.name
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {cat.icon} {cat.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <DollarSign size={14} className="text-primary" />
                  Price
                  <Sparkles size={12} className="text-amber-500" />
                </Label>
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-sm text-muted-foreground">$</span>
                    <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
                      {suggestedPrice[0].toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">USD</span>
                  </div>
                  <Slider
                    value={suggestedPrice}
                    onValueChange={setSuggestedPrice}
                    min={100}
                    max={10000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>$100</span>
                    <span>$10,000</span>
                  </div>
                </div>
              </div>

              {/* Auction Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                <div>
                  <Label className="text-sm font-semibold text-foreground">Create as Auction</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Let buyers bid on your item</p>
                </div>
                <Switch
                  checked={isAuction}
                  onCheckedChange={setIsAuction}
                />
              </div>

              {/* Preview Card */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Preview</Label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm"
                >
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={uploadedImage || ''}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {isAuction && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-rose-500 text-white border-0 text-[10px] font-black uppercase">
                          🔴 Auction
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-foreground line-clamp-2">
                      {generatedTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-rose-600 tabular-nums">
                        ${suggestedPrice[0].toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {generatedCategory}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {generatedDescription}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Publish Button */}
              <Button
                size="lg"
                onClick={handlePublish}
                className="w-full rounded-xl text-base font-bold h-12 shadow-lg shadow-primary/20"
              >
                <Sparkles size={18} className="mr-2" />
                Publish Listing
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

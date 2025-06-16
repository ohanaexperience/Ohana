import { create } from 'zustand';

type GroupDiscounts = {
  discountPercentageFor3Plus?: number;
  discountPercentageFor5Plus?: number;
};

type EarlyBirdRate = {
  daysInAdvance?: number;
  discountPercentage?: number;
};

type Step2Data = {
  startingLocation: { latitude: number; longitude: number } | null;
  startingAddress: string;
  endingLocation: { latitude: number; longitude: number } | null;
  endingAddress: string;
  sameLocation: boolean;
  meetingInstructions: string;
  imageUri: string | null;
};

type Step3Data = {
  basePrice: string;
  cancellationPolicy: string | null;
  minGuests: number;
  maxGuests: number;
  autoCancelIfMinNotMet: boolean;
  groupDiscounts?: GroupDiscounts;
  earlyBirdRate?: EarlyBirdRate;
};

// Type for Step 4 (media)
type ExperienceImages = {
  coverPhotoUri: string | null;
  galleryUris: string[];
};

// Type for Step 5 (inclusions and preparation)
type Step5Data = {
  includedItems: string[];
  thingsToBring: string;
  activityLevel: 'low' | 'medium' | 'high' | null;
  recommendedAge: string | null;
  accessibilityNotes: string;
};

// Type for Step 6 (availability and scheduling)
type Step6Data = {
  duration: number;
  availability: {
    startDate: string;
    daysOfWeek: number[]; // 0 (Sunday) to 6 (Saturday)
    timeSlots: string[];  // Format: "HH:MM"
  };
};

type ExperienceStore = {
  step2: Step2Data;
  setStep2: (data: Partial<Step2Data>) => void;

  step3: Step3Data;
  setStep3: (data: Partial<Step3Data>) => void;

  experienceImages: ExperienceImages;
  setCoverPhotoUri: (uri: string) => void;
  addGalleryUri: (uri: string) => void;
  setGalleryUris: (uris: string[]) => void;

  step5: Step5Data;
  setStep5: (data: Partial<Step5Data>) => void;

  step6: Step6Data;
  setStep6: (data: Partial<Step6Data>) => void;
  updateAvailability: (data: Partial<Step6Data['availability']>) => void;
  resetStep6: (preserve?: Partial<Pick<Step6Data, 'duration'>>) => void;
};

export const useExperienceStore = create<ExperienceStore>((set) => ({
  step2: {
    startingLocation: null,
    startingAddress: '',
    endingLocation: null,
    endingAddress: '',
    sameLocation: true,
    meetingInstructions: '',
    imageUri: null,
  },
  setStep2: (data) =>
    set((state) => ({
      step2: { ...state.step2, ...data },
    })),

  step3: {
    basePrice: '',
    cancellationPolicy: null,
    minGuests: 1,
    maxGuests: 10,
    autoCancelIfMinNotMet: false,
  },
  setStep3: (data) =>
    set((state) => ({
      step3: { ...state.step3, ...data },
    })),

  experienceImages: {
    coverPhotoUri: null,
    galleryUris: [],
  },
  setCoverPhotoUri: (uri) =>
    set((state) => ({
      experienceImages: { ...state.experienceImages, coverPhotoUri: uri },
    })),
  addGalleryUri: (uri) =>
    set((state) => ({
      experienceImages: {
        ...state.experienceImages,
        galleryUris: [...state.experienceImages.galleryUris, uri],
      },
    })),
  setGalleryUris: (uris) =>
    set((state) => ({
      experienceImages: {
        ...state.experienceImages,
        galleryUris: uris,
      },
    })),

  step5: {
    includedItems: [],
    thingsToBring: '',
    activityLevel: null,
    recommendedAge: null,
    accessibilityNotes: '',
  },
  setStep5: (data) =>
    set((state) => ({
      step5: { ...state.step5, ...data },
    })),

  step6: {
    duration: 1,
    availability: {
      startDate: new Date().toISOString().split('T')[0],
      daysOfWeek: [],
      timeSlots: [],
    },
  },
  setStep6: (data) =>
    set((state) => ({
      step6: { ...state.step6, ...data },
    })),
  updateAvailability: (data) =>
    set((state) => ({
      step6: {
        ...state.step6,
        availability: {
          ...state.step6.availability,
          ...data,
        },
      },
    })),
  resetStep6: (preserve = {}) =>
    set(() => ({
      step6: {
        duration: preserve.duration ?? 1,
        availability: {
          startDate: new Date().toISOString().split('T')[0],
          daysOfWeek: [],
          timeSlots: [],
        },
      },
    })),
}));
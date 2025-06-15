import { create } from 'zustand';

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
  // Step 4 state
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

  // Step 5 state
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

  // Step 6 state
  step6: {
    duration: 1,
    availability: {
      startDate: new Date().toISOString().split('T')[0], // Default to today
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
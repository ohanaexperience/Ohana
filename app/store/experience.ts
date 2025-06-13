import { create } from 'zustand';

type ExperienceImages = {
  coverPhotoUri: string | null;
  galleryUris: string[];
};

type ExperienceStore = {
  experienceImages: ExperienceImages;
  setCoverPhotoUri: (uri: string) => void;
  addGalleryUri: (uri: string) => void;
  setGalleryUris: (uris: string[]) => void; // <- Add this
};

export const useExperienceStore = create<ExperienceStore>((set) => ({
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
  setGalleryUris: (uris) => // <- This is the missing piece
    set((state) => ({
      experienceImages: {
        ...state.experienceImages,
        galleryUris: uris,
      },
    })),
}));
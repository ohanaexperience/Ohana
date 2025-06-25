// constants/theme.ts

export const COLORS = {
  background: '#fff',
  primary: '#000',
  muted: '#666',
  border: '#ccc',
  lightGray: '#eee',
  darkGray: '#333',
  accent: '#0F172A',
  error: '#ff4d4f',
  placeholder: '#6B7280',
};

export const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 24,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const COMMON_STYLES = {
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: FONT_SIZES.medium,
    backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.medium,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.muted,
    marginBottom: 24,
  },
  stepText: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 8,
    paddingTop:12,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
};
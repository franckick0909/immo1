export type ProfileFormState = {
  error?: string;
  success?: string;
} | null;

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export type UpdateProfileAction = (
  formData: FormData
) => Promise<ProfileFormState>;

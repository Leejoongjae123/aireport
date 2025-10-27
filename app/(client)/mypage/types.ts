export interface Profile {
  name: string | null;
  email: string | null;
  provider: 'local' | 'google' | 'kakao';
  organization: string | null;
  business_field: string | null;
}
